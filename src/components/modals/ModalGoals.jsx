/* eslint-disable no-undef */
import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../context/data'
import Swal from 'sweetalert2'
import { UserContext } from '../../context/user'

const ModalGoals = ({ title, buttonBackground = 'dark', sendForm, putSellerToApi }) => {
  const { sellers } = useContext(DataContext)
  const { user } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false)

  const salesGoals = []
  const collectionGoals = []

  sellers.forEach(seller => {
    const { id, metaVentas, metaRecaudo } = seller
    salesGoals[id] = metaVentas
    collectionGoals[id] = metaRecaudo
  })

  const [saleGoalsForm, setSaleGoalsForm] = useState([])
  const [collectionGoalForm, setCollectionGoalForm] = useState([])
  const [portfolioClientsGoal, setPortfolioClientsGoal] = useState([])

  const setGoals = () => {
    setSaleGoalsForm(salesGoals)
    setCollectionGoalForm(collectionGoals)
    setPortfolioClientsGoal(portfolioClientsGoal)
  }

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

  const handleChangePortfolioClientsGoals = (event) => {
    setPortfolioClientsGoal({
      ...portfolioClientsGoal,
      [event.target.name]: parseFloat(event.target.value)
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const token = user.token
    try {
      setIsLoading(true)
      for (const key in saleGoalsForm) {
        const saleGoal = saleGoalsForm[key]
        await putSellerToApi(key, {
          metaVentas: saleGoal
        }, token)
      }
      for (const key in collectionGoalForm) {
        const collectionGoal = collectionGoalForm[key]
        await putSellerToApi(key, {
          metaRecaudo: collectionGoal
        }, token)
      }
      for (const key in portfolioClientsGoal) {
        const portfolioGoal = portfolioClientsGoal[key]
        await putSellerToApi(key, {
          metaClientesDePortafolio: portfolioGoal
        }, token)
      }
      setIsLoading(false)
      Swal.fire({
        title: 'Las metas de los vendedores se han actualizado con éxito.',
        icon: 'success'
      })
    } catch (error) {
      console.log(error)
      Swal.fire({
        title: 'Lo sentimos, ha ocurrido un error al actualizar las metas de los vendedores. Por favor vuelva a intentarlo',
        icon: 'error'
      })
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setGoals()
  }, [sellers])

  return (
    <>
      {
        (isLoading === false)
          ? (
            <button type='button' className={`btn btn-outline-${buttonBackground}`} data-bs-toggle='modal' data-bs-target='#exampleModal'>{title}</button>
            )
          : (
            <button type='button' className={`btn btn-outline-${buttonBackground}`}>
              <div>
                <span className='spinner-border spinner-border-sm me-1' aria-hidden='true' />
                <span role='status'> Modificando metas...</span>
              </div>
            </button>
            )
      }
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
                              <label htmlFor={id} className='form-label'><b>{identificacion}</b></label>
                              <div>
                                <label className='form-label'>Meta de ventas:</label>
                                <input name={`${id}`} type='number' className='form-control mb-2' onChange={handleChange} value={saleGoalsForm[`${id}`] || 0} id={id} title='Meta de ventas' />
                              </div>
                              <div>
                                <label className='form-label'>Meta de recaudo:</label>
                                <input name={`${id}`} type='number' className='form-control' placeholder='Meta de recaudo' onChange={handleChangeCollectionGoal} value={collectionGoalForm[`${id}`] || 0} title='Meta de recaudo' />
                              </div>
                              <div>
                                <label className='form-label'>Meta de clientes de portafolio:</label>
                                <input name={`${id}`} type='number' className='form-control' placeholder='Meta de clientes de portafolio' onChange={handleChangePortfolioClientsGoals} value={portfolioClientsGoal[`${id}`] || 0} title='Meta de clientes de portafolio' />
                              </div>
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
