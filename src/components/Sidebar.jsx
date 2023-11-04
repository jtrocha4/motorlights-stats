import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <>
      <ul className='nav sidebar'>
        <li className='nav-item'>
          <Link className='nav-link' to='/'><i className='fa-solid fa-file-arrow-up' /> Cargar Informes</Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/sales'><i className='fa-solid fa-file-invoice-dollar' /> Informe de Ventas</Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/detailed-sales'><i className='fa-solid fa-file-invoice' /> Informe Detallado Ventas</Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/manage-sellers'><i className='fa-solid fa-users' /> Vendedores</Link>
        </li>
      </ul>
    </>
  )
}

export default Sidebar
