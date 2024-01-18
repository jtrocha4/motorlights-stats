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
        </section>
        <section className='mt-4'>
          <h5>Identificiación</h5>
          <p>{customer.identificacion}</p>
          <h5>Telefono</h5>
          <p>{customer.telefono}</p>
          <h5>Departamento</h5>
          <p>{customer.departamento}</p>
          <h5>Municipio</h5>
          <p>{customer.municipio}</p>
          <h5>Direccion</h5>
          <p>{customer.direccion}</p>
        </section>
      </div>
    </div>
  )
}

export default CustomerProfile
