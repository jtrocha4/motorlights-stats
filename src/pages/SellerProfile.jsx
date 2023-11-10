import React, { useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DataContext } from '../context/data'

const SellerProfile = () => {
  const { id } = useParams()
  const { sellers } = useContext(DataContext)
  const seller = sellers.find(seller => seller.id === id)
  return (
    <div className='flex'>
      <div className='container-fluid'>
        <header>
          <Link to='/manage-sellers'>
            <i className='fa-solid fa-arrow-left' /> Atras
          </Link>
        </header>
        <section className='mt-4'>
          <h2>{seller.nombre}</h2>
          <span>{seller.id}</span>
        </section>
      </div>
    </div>
  )
}

export default SellerProfile
