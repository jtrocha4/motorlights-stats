import React, { useState } from 'react'

const ModalGoals = ({ title, buttonBackground = 'dark', data = [], sendForm }) => {
  const [saleGoalsForm, setSaleGoalsForm] = useState({
    // Mes Julio
    'CARLOS ALONSO VESGA ORTIZ': 85000000,
    'HERNANDO JAVIER NOVA NARVAEZ': 70000000,
    'JOSE ANDRES MONTENEGRO GUEVARA': 35000000,
    'JULIAN ANDRES POSADA SALAZAR': 30000000,
    'MARIA VICTORIA MOLINA': 50000000,
    'MELANY JOHANNA RAMIREZ QUINTERO': 30000000,
    'SERGIO ANDRES BARCELO TRESPALACIOS': 65000000,
    'MOTORLIGHTS S.A.S': 0
  })

  const handleChange = (event) => {
    setSaleGoalsForm({
      ...saleGoalsForm,
      [event.target.name]: parseFloat(event.target.value)
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    sendForm(saleGoalsForm)
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
                              <input name={`${vendedor}`} type='number' className='form-control ' placeholder='Meta de venta' onChange={handleChange} value={saleGoalsForm[`${vendedor}`]} />
                            </div>
                          ))
                        )
                }
                <div className='modal-footer'>
                  <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cancelar</button>
                  <button className='btn btn-primary' type='submit' data-bs-dismiss='modal'>Guardar cambios</button>
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
