import React, { useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ThirdPartiesContext } from '../context/thirdParties'

const CustomerProfile = () => {
  const { id } = useParams()
  const { customers } = useContext(ThirdPartiesContext)
  const customer = customers.find(customer => customer.id === id)
  return (
    <div className='flex'>
      <div className='container-fluid'>
        <header>
          <Link to='/manage-customers'>
            <i className='fa-solid fa-arrow-left' /> Atras
          </Link>
        </header>
        <section className='mt-4'>
          <h2>{customer.nombre}</h2>
          <span>{customer.id}</span>
        </section>
      </div>
    </div>
  )
}

export default CustomerProfile
