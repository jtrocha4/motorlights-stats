import React, { useContext, useState } from 'react'
import Pagination from '../components/Pagination'
import { DataContext } from '../context/data'
import Swal from 'sweetalert2'
import { UserContext } from '../context/user'
import ModalEditInventoryTurnover from '../components/modals/ModalEditInventoryTurnover'
import InputInventoryTurnover from '../components/inputs/InputInventoryTurnover'
import ButtonUploadInventoryTurnover from '../components/buttonsUpload/ButtonUploadInventoryTurnover'
import ButtonDeleteAllInventoryTurnover from '../components/buttonsUpload/ButtonDeleteAllInventoryTurnover'

const ManageInventoryTurnover = ({ postInventoryTurnoverToApi, deleteInventoryTurnoverToApi, putInventoryTurnoverToApi, removeExtraSpaces, extractIdNumber, extractText }) => {
  const { inventoryTurnover } = useContext(DataContext)
  const { user, setUser } = useContext(UserContext)

  const [page, setPage] = useState(1)
  const [elementsPerPage, setElementsPerPage] = useState(25)

  const maximum = Math.ceil(inventoryTurnover.length / elementsPerPage)

  const handleDelete = (event, id) => {
    event.preventDefault()
    const { token } = user

    Swal.fire({
      title: '¿Seguro que deseas eliminar este artículo?',
      text: 'Esta acción no se puede deshacer. Si eliminas el artículo de la rotación de inventario, se perderán todos los datos asociados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      denyButtonColor: '#6e7881',
      denyButtonText: 'Cancelar',
      confirmButtonText: 'Guardar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteInventoryTurnoverToApi(id, token)
          Swal.fire('El artículo ha sido eliminado con éxito de la rotación de inventario.', '', 'success')
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
              title: 'Lo sentimos, ha ocurrido un error al eliminar el artículo.',
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
        <h2>Gestionar Rotación de Inventario</h2>
        <div className='mt-4'>
          <InputInventoryTurnover label='Rotación de productos' extractIdNumber={extractIdNumber} extractText={extractText} />
        </div>
        <div className='button-group mt-4'>
          <ButtonUploadInventoryTurnover title='Subir rotación de inventario' postInventoryTurnoverToApi={postInventoryTurnoverToApi} removeExtraSpaces={removeExtraSpaces} />
          {/* <ModalAddInventoryTurnover title='Agregar nuevo artículo de rotación' postInventoryTurnoverToApi={postInventoryTurnoverToApi} removeExtraSpaces={removeExtraSpaces} /> */}
          <ButtonDeleteAllInventoryTurnover title='Vaciar rotación de inventario' deleteInventoryTurnoverToApi={deleteInventoryTurnoverToApi} />
        </div>
        <section className='mt-4'>
          <Pagination page={page} setPage={setPage} maximum={maximum} />
          <p>
            Cantidad de registros: {inventoryTurnover.length || 0}
          </p>
          {
                inventoryTurnover
                  .slice((page - 1) * elementsPerPage, (page - 1) * elementsPerPage + elementsPerPage)
                  .map(el => (
                    <div className='card mt-3' key={el.id}>
                      <div className='button-group-card'>
                        <button type='button' title='Eliminar' className='btn btn-outline-danger' onClick={(event) => handleDelete(event, el.id)}><i className='fa-solid fa-trash' /></button>
                        <ModalEditInventoryTurnover title='Editar artículo de rotación' icon={<i className='fa-solid fa-pen-to-square' />} dataInventoryTurnover={el} idInventoryTurnover={el.id} putInventoryTurnoverToApi={putInventoryTurnoverToApi} removeExtraSpaces={removeExtraSpaces} />
                      </div>
                      <div className='card-body'>
                        <h5 className='card-title'>{el.nombre}</h5>
                        <h6 className='card-subtitle mb-2 text-body-secondary'>{el.codigo}</h6>
                        <h6 className='card-subtitle mb-2 text-body-secondary'>Categoria moto: {el.categoriaMotos ? 'Sí' : 'No'}</h6>
                        <h6 className='card-subtitle mb-2 text-body-secondary'>Categoria carro: {el.categoriaCarros ? 'Sí' : 'No'}</h6>
                      </div>
                    </div>
                  ))
            }
        </section>
      </div>
    </div>
  )
}

export default ManageInventoryTurnover
