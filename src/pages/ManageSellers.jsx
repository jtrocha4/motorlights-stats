import React, { useContext, useState } from 'react'
import ModalAddSeller from '../components/modals/ModalAddSeller'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import ModalEditSeller from '../components/modals/ModalEditSeller'
import Pagination from '../components/Pagination'
import { UserContext } from '../context/user'
import { DataContext } from '../context/data'

const ManageSellers = ({ postSellerToApi, deleteSellerToApi, putSellerToApi, capitalizeWords, removeExtraSpaces }) => {
  const { sellers } = useContext(DataContext)
  const { user, setUser } = useContext(UserContext)

  const [page, setPage] = useState(1)
  const [elementsPerPage, setElementsPerPage] = useState(25)

  const maximum = Math.ceil(sellers.length / elementsPerPage)

  const handleDelete = (event, id) => {
    event.preventDefault()
    const { token } = user
    Swal.fire({
      title: '¿Seguro que deseas eliminar este vendedor?',
      text: 'Esta acción no se puede deshacer. Si eliminas al vendedor, se perderán todos los datos asociados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      denyButtonColor: '#6e7881',
      denyButtonText: 'Cancelar',
      confirmButtonText: 'Guardar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSellerToApi(id, token)
          Swal.fire('El vendedor  ha sido eliminado con éxito.', '', 'success')
        } catch (error) {
          if (error.response.data.error === 'authorization required, token has expired') {
            Swal.fire({
              title: 'Tu sesión ha expirado.',
              text: 'Por favor, vuelve a iniciar sesión.',
              icon: 'warning'
            }).then((result) => {
              if (result.isConfirmed) {
                setUser(null)
                window.localStorage.removeItem('loggedApp')
              }
            })
          } else {
            Swal.fire({
              title: 'Lo sentimos, ha ocurrido un error al eliminar el vendedor.',
              text: 'Por favor, asegúrese de completar todos los campos e  inténtelo nuevamente.',
              icon: 'error'
            })
          }
        }
      }
    })
  }

  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Gestionar Vendedores</h2>
        <div className='mt-4'>
          <ModalAddSeller title='Crear nuevo vendedor' postSellerToApi={postSellerToApi} capitalizeWords={capitalizeWords} removeExtraSpaces={removeExtraSpaces} />
        </div>
        <section className='mt-4'>
          <Pagination page={page} setPage={setPage} maximum={maximum} />
          {
            sellers
              .filter(el => el.estado !== false)
              .slice((page - 1) * elementsPerPage, (page - 1) * elementsPerPage + elementsPerPage)
              .map(el => (
                <div className='card mt-3' key={el.id}>
                  <div className='button-group-card'>
                    <button type='button' title='Eliminar' className='btn btn-outline-danger' onClick={(event) => handleDelete(event, el.id)}><i className='fa-solid fa-trash' /></button>
                    <ModalEditSeller title='Editar Vendedor' icon={<i className='fa-solid fa-pen-to-square' />} dataSeller={el} idSeller={el.id} putSellerToApi={putSellerToApi} capitalizeWords={capitalizeWords} removeExtraSpaces={removeExtraSpaces} />
                  </div>
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
