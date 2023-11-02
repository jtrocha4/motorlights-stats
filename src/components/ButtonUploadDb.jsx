import React, { useContext } from 'react'
import Swal from 'sweetalert2'
import { DataContext } from './context/data'

const ButtonUploadDb = ({ title, background = 'primary', data, postSellerPerformanceToApi, sellers }) => {
  const { dateExcel } = useContext(DataContext)
  const { fechaFinal } = dateExcel

  const dateOfData = (fechaFinal) => {
    if (fechaFinal !== undefined) {
      const splitDate = fechaFinal.split('/')
      const day = splitDate[0]
      const month = splitDate[1]
      const year = splitDate[2]

      return new Date(year, month - 1, day)
    }
  }

  const leakedData = []

  data.forEach(el => {
    sellers.forEach(sell => {
      if (el.vendedor === sell.identificacion && sell.estado === true) {
        const { venta, vendedor, ...restOfData } = el
        leakedData.push({
          ...restOfData,
          idVendedor: sell.id,
          fecha: dateOfData(fechaFinal)
        })
      }
    })
  })

  const handleUploadDb = async () => {
    Swal.fire({
      title: '¿Seguro que deseas guardar esta información?',
      text: 'Por favor revise la informacion antes de subirla al servidor',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonColor: '#3085d6',
      denyButtonColor: '#6e7881',
      denyButtonText: 'Cancelar',
      confirmButtonText: 'Guardar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (data.length > 0) {
          try {
            for (const key in leakedData) {
              await postSellerPerformanceToApi(leakedData[key])
            }
            Swal.fire({
              title: 'Los datos se han guardado con éxito.',
              icon: 'success'
            })
          } catch (error) {
            Swal.fire({
              title: 'Lo sentimos, ha ocurrido un error al guardar los datos.',
              text: 'Por favor, asegúrese de haber cargado todos los informes necesarios.',
              icon: 'error'
            })
          }
        } else {
          Swal.fire({
            title: 'Lo sentimos, ha ocurrido un error al guardar los datos.',
            text: 'Por favor, asegúrese de haber cargado todos los informes necesarios.',
            icon: 'error'
          })
        }
      }
    })
  }

  return (
    <div>
      <button type='button' className={`btn btn-outline-${background}`} onClick={handleUploadDb}><i className='fa-solid fa-cloud-arrow-up' /> {title}</button>
    </div>
  )
}

export default ButtonUploadDb
