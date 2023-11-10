import React from 'react'
import ModalAddSeller from '../components/Modals/ModalAddSeller'
import { Link } from 'react-router-dom'

const ManageSellers = ({ postSellerToApi, capitalizeWords, sellers }) => {
  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Gestionar vendedores</h2>
        <div className='mt-4'>
          <ModalAddSeller title='Crear nuevo vendedor' postSellerToApi={postSellerToApi} capitalizeWords={capitalizeWords} />
        </div>
        <section className='mt-4'>
          {
            sellers
              .filter(el => el.estado !== false)
              .map(el => (
                <div className='card mt-3' key={el.id}>
                  <Link to={`/manage-sellers/${el.id}`}>
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

export default ManageSellers
