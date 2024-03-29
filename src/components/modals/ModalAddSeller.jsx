import React, { useContext, useState } from 'react'
import Swal from 'sweetalert2'
import { UserContext } from '../../context/user'

const ModalAddSeller = ({ title, icon, background = 'btn btn-outline-primary', postSellerToApi, capitalizeWords, removeExtraSpaces }) => {
  const [form, setForm] = useState({
    nombre: '',
    identificacion: '',
    metaVentas: 0,
    metaRecaudo: 0
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
    const { nombre, metaVentas, metaRecaudo, ...restOfData } = form
    const { token } = user
    try {
      await postSellerToApi({
        ...restOfData,
        nombre: removeExtraSpaces(capitalizeWords(nombre)),
        metaRecaudo: metaRecaudo || 0,
        metaVentas: metaVentas || 0
      }, token)
      Swal.fire({
        title: 'El vendedor se ha creado con éxito.',
        icon: 'success'
      })
      setForm({
        nombre: '',
        identificacion: ''
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
          title: 'Lo sentimos, ha ocurrido un error al crear el vendedor.',
          text: 'Por favor, asegúrese de completar todos los campos e  inténtelo nuevamente.',
          icon: 'error'
        })
      }
    }
  }

  const handleCancel = () => {
    setForm({
      nombre: '',
      identificacion: '',
      metaVentas: 0,
      metaRecaudo: 0
    })
  }

  return (
    <>
      <button type='button' className={`${background}`} data-bs-toggle='modal' data-bs-target='#modalAddSeller'>{(icon) || (title)}</button>
      <div className='modal fade' id='modalAddSeller'>
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
                  <label className='form-label'>Identificacion</label>
                  <input name='identificacion' className='form-control' type='text' onChange={handleChange} value={form.identificacion} />
                </div>
                <div className='mb-3'>
                  <label className='form-label'>Meta de ventas</label>
                  <input name='metaVentas' className='form-control' type='text' onChange={handleChange} value={form.metaVentas || 0} />
                </div>
                <div className='mb-3'>
                  <label className='form-label'>Meta de recaudo</label>
                  <input name='metaRecaudo' className='form-control' type='text' onChange={handleChange} value={form.metaRecaudo || 0} />
                </div>
                <div className='mb-3'>
                  <span><b>Importante:</b> La identificación del vendedor debe coincidir con la identificación utilizada en los informes.</span>
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

export default ModalAddSeller
