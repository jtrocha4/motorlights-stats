import React from 'react'
import Swal from 'sweetalert2'

const ButtonUploadDb = ({ title, background = 'primary', data, dateData, postDataToApi }) => {
  const { fechaFinal } = dateData

  const dateOfData = (fechaFinal) => {
    const splitDate = fechaFinal.split('/')
    const day = splitDate[0]
    const month = splitDate[1]
    const year = splitDate[2]

    return new Date(year, month - 1, day)
  }

  const leakedData = data.map(el => {
    const { venta, ...restOfData } = el
    return {
      ...restOfData,
      fecha: dateOfData(fechaFinal)
    }
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
              await postDataToApi(leakedData[key])
            }
            Swal.fire({
              title: 'Los datos se han guardado con éxito.',
              icon: 'success'
            })
          } catch (error) {
            Swal.fire({
              title: 'Lo sentimos, ha ocurrido un error al guardar los datos.',
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
