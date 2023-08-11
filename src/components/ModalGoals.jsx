import React, { useState } from 'react'

const ModalGoals = ({ title, buttonBackground = 'dark', data = [], sendForm }) => {
  const [form, setForm] = useState({})

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    sendForm(form)
  }

  return (
    <>
      <button type='button' className={`btn btn-outline-${buttonBackground}`} data-bs-toggle='modal' data-bs-target='#exampleModal'>{title}</button>

      <div className='modal fade' id='exampleModal'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h1 className='modal-title fs-5' id='staticBackdropLabel'>{title}</h1>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close' />
            </div>
            <div className='modal-body'>
              <form action='' onSubmit={handleSubmit}>
                {
                    (data.length === 0)
                      ? (<p>No hay vendedores al cual modificar sus metas</p>)
                      : (
                          data.map(({ vendedor }) => (
                            <div className='mb-3' key={vendedor}>
                              <label htmlFor={vendedor} className='form-label'>{vendedor}</label>
                              <input name={`${vendedor}`} type='number' className='form-control ' placeholder='Meta de venta' onChange={handleChange} />
                            </div>
                          ))
                        )
                }
                <div className='modal-footer'>
                  <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cancelar</button>
                  <button className='btn btn-primary' type='submit'>Guardar cambios</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalGoals
