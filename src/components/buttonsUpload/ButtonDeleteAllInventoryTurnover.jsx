import React, { useContext, useState } from 'react'
import Swal from 'sweetalert2'
import { DataContext } from '../../context/data'
import { UserContext } from '../../context/user'

const ButtonDeleteAllInventoryTurnover = ({ background = 'btn btn-outline-danger', title, deleteInventoryTurnoverToApi }) => {
  const { inventoryTurnover } = useContext(DataContext)
  const { user, setUser } = useContext(UserContext)
  const { token } = user

  const [isLoading, setIsLoading] = useState(false)

  const handleDeleteAll = () => {
    Swal.fire({
      title: '¿Seguro que deseas eliminar esta información?',
      text: 'Por favor revise la informacion antes de subirla al servidor',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonColor: '#3085d6',
      denyButtonColor: '#6e7881',
      denyButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (inventoryTurnover.length > 0) {
          try {
            setIsLoading(true)
            for (const element of inventoryTurnover) {
              await deleteInventoryTurnoverToApi(element.id, token)
            }
            Swal.fire({
              title: 'Los datos se han eliminado con éxito.',
              icon: 'success'
            })
            setIsLoading(false)
          } catch (error) {
            console.log(error)
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
              setIsLoading(false)
            } else {
              Swal.fire({
                title: 'Lo sentimos, ha ocurrido un error al eliminar los datos.',
                text: 'Por favor, asegúrese de haber cargado todos los informes necesarios.',
                icon: 'error'
              })
              setIsLoading(false)
            }
          }
        } else {
          Swal.fire({
            title: 'Lo sentimos, ha ocurrido un error al eliminar los datos.',
            text: 'Por favor, asegúrese de haber cargado todos los informes necesarios.',
            icon: 'error'
          })
          setIsLoading(false)
        }
      }
    })
  }

  return (
    <button type='button' className={`btn btn-outline-${background}`} onClick={handleDeleteAll}>
      {
          (isLoading === false)
            ? (
              <div>
                <i className='fa-solid fa-trash me-1' />
                {title}
              </div>
              )
            : (
              <div>
                <span className='spinner-border spinner-border-sm me-1' aria-hidden='true' />
                <span role='status'> Eliminando informacion...</span>
              </div>
              )
        }
    </button>
  )
}

export default ButtonDeleteAllInventoryTurnover
