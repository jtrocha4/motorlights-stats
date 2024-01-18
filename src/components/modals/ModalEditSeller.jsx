import React, { useContext, useState } from 'react'
import Swal from 'sweetalert2'
import { UserContext } from '../../context/user'

const ModalEditSeller = ({ title, icon, background = 'btn btn-outline-primary', dataSeller, idSeller, putSellerToApi, capitalizeWords, removeExtraSpaces }) => {
  const [form, setForm] = useState({
    nombre: '',
    identificacion: '',
    metaVentas: 0,
    metaRecaudo: 0
  })

  const { user } = useContext(UserContext)

  const handleOnClick = () => {
    if (dataSeller) {
      const { nombre, identificacion, ...restOfData } = dataSeller
      setForm({
        ...form,
        nombre,
        identificacion,
        ...restOfData
      })
    }
  }

  const handleChange = (event) => {
    event.preventDefault()
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const { token } = user
    const { nombre, id, ...restOfData } = form
    try {
      await putSellerToApi(id, {
        ...restOfData,
        nombre: removeExtraSpaces(capitalizeWords(nombre))
      }, token)
      Swal.fire({
        title: 'El vendedor ha sido editado con éxito.',
        icon: 'success'
      })
    } catch (error) {
      Swal.fire({
        title: 'Lo sentimos, ha ocurrido un error al editar el vendedor. Por favor vuelva a intentarlo',
        icon: 'error'
      })
    }
  }

  const handleCancel = () => {

  }

  return (
    <>
      <button type='button' onClick={handleOnClick} className={`${background}`} data-bs-toggle='modal' data-bs-target={`#modalEditSeller${idSeller}`}>{(icon) || (title)}</button>
      <div className='modal fade' id={`modalEditSeller${idSeller}`}>
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

export default ModalEditSeller
