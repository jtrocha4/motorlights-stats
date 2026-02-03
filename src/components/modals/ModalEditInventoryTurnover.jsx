import React, { useContext, useState } from 'react'
import { UserContext } from '../../context/user'
import Swal from 'sweetalert2'

const ModalEditInventoryTurnover = ({ title, icon, background = 'btn btn-outline-primary', dataInventoryTurnover, idInventoryTurnover, putInventoryTurnoverToApi, capitalizeWords, removeExtraSpaces }) => {
  const [form, setForm] = useState({
    nombre: '',
    codigo: '',
    meta: 0
  })

  const { user, setUser } = useContext(UserContext)

  const handleOnClick = () => {
    if (dataInventoryTurnover) {
      const { nombre, identificacion, ...restOfData } = dataInventoryTurnover
      setForm({
        ...form,
        nombre,
        identificacion,
        ...restOfData
      })
    }
  }

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const { token } = user
    const { id, nombre, ...restOfData } = form

    try {
      await putInventoryTurnoverToApi(id, {
        nombre: removeExtraSpaces(nombre),
        ...restOfData
      }, token)
      Swal.fire({
        title: 'El artículo de la rotación de inventario ha sido editado con éxito.',
        icon: 'success'
      })
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
          title: 'Lo sentimos, ha ocurrido un error al editar el artículo de la rotación de inventario.',
          text: 'Por favor, asegúrese de completar todos los campos e  inténtelo nuevamente.',
          icon: 'error'
        })
      }
    }
  }

  const handleCancel = () => {
    setForm({
      nombre: '',
      codigo: '',
      meta: 0
    })
  }

  return (
    <>
      <button type='button' onClick={handleOnClick} className={`${background}`} data-bs-toggle='modal' data-bs-target={`#modalEditSeller${idInventoryTurnover}`}>{(icon) || (title)}</button>
      <div className='modal fade' id={`modalEditSeller${idInventoryTurnover}`}>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h1 className='modal-title fs-5' id='staticBackdropLabel'>{title}</h1>
              <button type='reset' className='btn-close' data-bs-dismiss='modal' aria-label='Close' onClick={handleCancel} />
            </div>
            <div className='modal-body'>
              <form action='' onSubmit={handleSubmit}>
                <div className='mb-3'>
                  <label className='form-label'>Nombre</label>
                  <input className='form-control' type='text' name='nombre' onChange={handleChange} value={form.nombre} />
                </div>
                <div className='mb-3'>
                  <label className='form-label'>Código</label>
                  <input name='codigo' className='form-control' type='text' onChange={handleChange} value={form.codigo} />
                </div>
                {/* <div className='mb-3'>
                  <label className='form-label'>Meta de ventas</label>
                  <input name='metaVentas' className='form-control' type='number' onChange={handleChange} value={form.meta || 0} />
                </div> */}
                <div className='mb-3'>
                  <span><b>Importante:</b> El código del artículo de rotación debe ser el mismo que el utilizado en los informes.</span>
                </div>
                <div className='modal-footer'>
                  <button type='button' className='btn btn-secondary' data-bs-dismiss='modal' onClick={handleCancel}>Cancelar</button>
                  <button className='btn btn-primary' type='submit' data-bs-dismiss='modal'>Editar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalEditInventoryTurnover
