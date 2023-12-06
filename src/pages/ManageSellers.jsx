import React from 'react'
import ModalAddSeller from '../components/modals/ModalAddSeller'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

const ManageSellers = ({ postSellerToApi, deleteSellerToApi, capitalizeWords, sellers }) => {
  const handleDelete = (event) => {
    event.preventDefault()
    const id = event.currentTarget.getAttribute('data-id')
    Swal.fire({
      title: '¿Seguro que deseas eliminar este vendedor?',
      text: 'Esta acción no se puede deshacer. Si eliminas al vendedor, se perderán todos los datos asociados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      denyButtonColor: '#6e7881',
      denyButtonText: 'Cancelar',
      confirmButtonText: 'Guardar'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          deleteSellerToApi(id)
          Swal.fire(`El vendedor ${id} ha sido eliminado con éxito.`, '', 'success')
        } catch (error) {
          Swal.fire('Ha ocurrido un error al momento de eliminar al vendedor. Por favor intentelo de nuevo', '', 'error')
        }
      }
    })
  }

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
                      <div className='button-group-card'>
                        <button type='button' title='Eliminar' data-id={el.id} className='btn btn-danger' onClick={handleDelete}><i className='fa-solid fa-trash' /></button>
                      </div>
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
