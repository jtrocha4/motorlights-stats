import React, { useState } from 'react'
import Swal from 'sweetalert2'

const ModalAddSeller = ({ title, postSellerToApi, capitalizeWords }) => {
  const [form, setForm] = useState({
    nombre: '',
    identificacion: ''
  })
  const [buttonDisable, setButtonDisable] = useState(true)

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
    if (form.nombre !== undefined && form.identificacion !== undefined) {
      if (form.nombre.trim() && form.identificacion.trim()) {
        setButtonDisable(false)
      } else {
        setButtonDisable(true)
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const { nombre, ...restOfData } = form
    try {
      await postSellerToApi({
        ...restOfData,
        nombre: capitalizeWords(nombre)
      })
      Swal.fire({
        title: 'El vendedor se ha creado con éxito.',
        icon: 'success'
      })
      setForm({
        nombre: '',
        identificacion: ''
      })
    } catch (error) {
      Swal.fire({
        title: 'Lo sentimos, ha ocurrido un error al crear el vendedor.',
        icon: 'error'
      })
    }
  }

  const handleCancel = () => {
    setForm({
      nombre: '',
      identificacion: ''
    })
  }

  return (
    <>
      <button type='button' className='btn btn-outline-primary' data-bs-toggle='modal' data-bs-target='#exampleModal'>{title}</button>

      <div className='modal fade' id='exampleModal'>
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
