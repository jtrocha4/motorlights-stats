import React, { useContext, useState } from 'react'
import InputThirdParties from '../components/inputs/InputThirdParties'
import { ThirdPartiesContext } from '../context/thirdParties'
import ButtonUploadDb from '../components/buttonsUpload/ButtonUploadDb'
import { Link } from 'react-router-dom'
import Pagination from '../components/Pagination'

const ManageCustomers = ({ department, extractDate, capitalizeWords, removeExtraSpaces, extractIdNumber, postCustomerToApi }) => {
  const { customers } = useContext(ThirdPartiesContext)

  const [page, setPage] = useState(1)
  const [elementsPerPage, setElementsPerPage] = useState(25)
  const maximum = Math.ceil(customers.length / elementsPerPage)

  const leakedData = []

  customers.forEach(element => {
    const { ciudad, id, telefonos, ...restOfData } = element
    leakedData.push({
      ...restOfData,
      identificacion: id,
      telefono: telefonos,
      municipio: ciudad
    })
  })

  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Gestionar clientes</h2>
        {/* <InputThirdParties label='Informe de Terceros' department={department} extractDate={extractDate} capitalizeWords={capitalizeWords} removeExtraSpaces={removeExtraSpaces} extractIdNumber={extractIdNumber} />
        <section className='mt-4 d-grid gap-2 d-md-flex justify-content-md-end'>
          <ButtonUploadDb title='Subir informacion a la base de datos' data={customers} postFunction={postCustomerToApi} />
        </section> */}
        <section className='mt-4'>
          <Pagination page={page} setPage={setPage} maximum={maximum} />
          {
            customers
              .filter(el => el.estado !== false)
              .slice((page - 1) * elementsPerPage, (page - 1) * elementsPerPage + elementsPerPage)
              .map(el => (
                <div className='card mt-3' key={el.id}>
                  <Link to={`/manage-customers/${el.id}`}>
                    <div className='card-body'>
                      <h5 className='card-title'>{el.nombre}</h5>
                      <h6 className='card-subtitle mb-2 text-body-secondary'>{el.id}</h6>
                    </div>
                  </Link>
                </div>
              ))
          }
        </section>
      </div>
    </div>
  )
}

export default ManageCustomers
