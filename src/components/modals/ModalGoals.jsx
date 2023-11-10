/* eslint-disable no-undef */
import React, { useContext, useState } from 'react'
import { DataContext } from '../../context/data'

const ModalGoals = ({ title, buttonBackground = 'dark', data = [], sendForm }) => {
  const { sellers } = useContext(DataContext)

  const salesGoals = JSON.parse(localStorage.getItem('metaVentas')) || {}
  const collectionGoals = JSON.parse(localStorage.getItem('metaRecaudo')) || {}

  const [saleGoalsForm, setSaleGoalsForm] = useState(salesGoals)
  const [collectionGoalForm, setCollectionGoalForm] = useState(collectionGoals)

  const handleChange = (event) => {
    setSaleGoalsForm({
      ...saleGoalsForm,
      [event.target.name]: parseFloat(event.target.value)
    })
  }

  const handleChangeCollectionGoal = (event) => {
    setCollectionGoalForm({
      ...collectionGoalForm,
      [event.target.name]: parseFloat(event.target.value)
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    localStorage.setItem('metaVentas', JSON.stringify(saleGoalsForm))
    localStorage.setItem('metaRecaudo', JSON.stringify(collectionGoalForm))
    sendForm(saleGoalsForm, collectionGoalForm)
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
                    (sellers.length === 0)
                      ? (<p>No hay vendedores al cual modificar sus metas</p>)
                      : (
                          sellers.map(({ identificacion, id }) => (
                            <div className='mb-3' key={id}>
                              <label htmlFor={identificacion} className='form-label'><b>{identificacion}</b></label>
                              <input name={`${identificacion}`} type='number' className='form-control mb-2' placeholder='Meta de venta' onChange={handleChange} value={saleGoalsForm[`${identificacion}`] || 0} id={identificacion} />
                              <input name={`${identificacion}`} type='number' className='form-control' placeholder='Meta de recaudo' onChange={handleChangeCollectionGoal} value={collectionGoalForm[`${identificacion}`] || 0} />
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
