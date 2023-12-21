import React, { useContext, useState } from 'react'
import InputThirdParties from '../components/inputs/InputThirdParties'
import { ThirdPartiesContext } from '../context/thirdParties'
import Swal from 'sweetalert2'
import ButtonUploadDb from '../components/buttonsUpload/ButtonUploadDb'

const ManageCustomers = ({ department, extractDate, capitalizeWords, removeExtraSpaces, extractIdNumber, postCustomerToApi }) => {
  const { customer, setCustomer } = useContext(ThirdPartiesContext)
  const [isLoading, setIsLoading] = useState(false)

  const leakedData = []

  customer.forEach(element => {
    const { ciudad, id, telefonos, ...restOfData } = element
    leakedData.push({
      ...restOfData,
      identificacion: id,
      telefono: telefonos,
      municipio: ciudad
    })
  })

  const handleUploadDb = () => {
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
        if (customer.length) {
          try {
            for (const key in leakedData) {
              await postCustomerToApi(leakedData[key])
              setIsLoading(true)
            }
            Swal.fire({
              title: 'Los datos se han guardado con éxito.',
              icon: 'success'
            })
            setIsLoading(false)
          } catch (error) {
            console.log(error)
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
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Gestionar clientes</h2>
        <InputThirdParties label='Informe de Terceros' department={department} extractDate={extractDate} capitalizeWords={capitalizeWords} removeExtraSpaces={removeExtraSpaces} extractIdNumber={extractIdNumber} />

        {/* <section className='mt-4 d-grid gap-2 d-md-flex justify-content-md-end'>
          <button className='btn btn-primary' onClick={handleUploadDb} disabled={isLoading}>
            {
            (isLoading === false)
              ? ('Subir en la base de datos')
              : (
                <div>
                  <span className='spinner-border spinner-border-sm' aria-hidden='true' />
                  <span role='status'> Subiendo informacion...</span>
                </div>
                )
          }
          </button>
        </section> */}

        <section className='mt-4 d-grid gap-2 d-md-flex justify-content-md-end'>
          <ButtonUploadDb title='Subir informacion a la base de datos' data={customer} postFunction={postCustomerToApi} />
        </section>

      </div>
    </div>
  )
}

export default ManageCustomers