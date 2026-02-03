import React, { useContext, useState } from 'react'
import Swal from 'sweetalert2'
import { UserContext } from '../../context/user'

const ModalAddInventoryTurnover = ({ title, icon, background = 'btn btn-outline-primary', postInventoryTurnoverToApi, capitalizeWords, removeExtraSpaces }) => {
  const [form, setForm] = useState({
    nombre: '',
    codigo: '',
    meta: 0
  })

  const { user, setUser } = useContext(UserContext)

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const { nombre, codigo, meta } = form
    const { token } = user

    try {
      await postInventoryTurnoverToApi({
        nombre: removeExtraSpaces(nombre),
        codigo: Number(codigo),
        meta: Number(meta)
      }, token)
      Swal.fire({
        title: 'El artículo ha sido agregado con éxito.',
        icon: 'success'
      })
      setForm({
        nombre: '',
        codigo: '',
        meta: 0
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
          title: 'Lo sentimos, ha ocurrido un error al crear el producto.',
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
      <button type='button' className={`${background}`} data-bs-toggle='modal' data-bs-target='#modalAddInventoryTurnover'>{(icon) || (title)}</button>
      <div className='modal fade' id='modalAddInventoryTurnover'>
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
                  <button className='btn btn-primary' type='submit' data-bs-dismiss='modal'>Crear</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalAddInventoryTurnover
