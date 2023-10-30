import React from 'react'
import ModalAddSeller from '../components/ModalAddSeller'

const ManageSellers = ({ postSellerToApi, capitalizeWords, seller }) => {
  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Gestionar vendedores</h2>
        <div className='mt-4'>
          <ModalAddSeller title='Crear nuevo vendedor' postSellerToApi={postSellerToApi} capitalizeWords={capitalizeWords} />
        </div>
        <section className='mt-4'>
          {
          seller.map(el => (
            <div className='card mt-2' key={el.id}>
              <div className='card-body'>
                <h5 className='card-title'>{el.nombre}</h5>
                <h6 className='card-subtitle mb-2 text-body-secondary'>{el.id}</h6>
              </div>
            </div>
          ))
         }
        </section>
      </div>
    </div>
  )
}

export default ManageSellers
