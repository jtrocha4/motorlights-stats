import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../context/data'
import { UserContext } from '../../context/user'

import Swal from 'sweetalert2'

const ButtonUploadInventoryTurnover = ({ background = 'primary', title, postInventoryTurnoverToApi, removeExtraSpaces }) => {
  const { newInventoryTurnover } = useContext(DataContext)
  const { user, setUser } = useContext(UserContext)
  const { token } = user

  const [isLoading, setIsLoading] = useState(false)
  const [fileIsLoaded, setFileIsLoaded] = useState(false)

  const handleUpload = () => {
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
        if (newInventoryTurnover.length > 0) {
          try {
            setIsLoading(true)
            for (const element of newInventoryTurnover) {
              await postInventoryTurnoverToApi({
                nombre: removeExtraSpaces(element.nombre),
                codigo: Number(element.codigo)
              }, token)
            }
            Swal.fire({
              title: 'Los datos se han guardado con éxito.',
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
                title: 'Lo sentimos, ha ocurrido un error al guardar los datos.',
                text: 'Por favor, asegúrese de haber cargado todos los informes necesarios.',
                icon: 'error'
              })
              setIsLoading(false)
            }
          }
        } else {
          Swal.fire({
            title: 'Lo sentimos, ha ocurrido un error al guardar los datos.',
            text: 'Por favor, asegúrese de haber cargado todos los informes necesarios.',
            icon: 'error'
          })
          setIsLoading(false)
        }
      }
    })
  }

  useEffect(() => {
    if (newInventoryTurnover.length > 0) {
      setFileIsLoaded(true)
    }
  }, [newInventoryTurnover])

  return (
    <>
      <button type='button' className={`btn btn-outline-${background}`} disabled={!fileIsLoaded} onClick={handleUpload}>
        {
          (isLoading === false)
            ? (
              <div>
                <i className='fa-solid fa-cloud-arrow-up me-1' />
                {title}
              </div>
              )
            : (
              <div>
                <span className='spinner-border spinner-border-sm me-1' aria-hidden='true' />
                <span role='status'> Subiendo informacion...</span>
              </div>
              )
        }
      </button>
    </>
  )
}

export default ButtonUploadInventoryTurnover
