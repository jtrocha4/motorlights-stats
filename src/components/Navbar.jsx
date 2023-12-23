/* eslint-disable no-undef */
import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
      <nav className='navbar navbar-expand-lg bg-body-tertiary' data-bs-theme='dark' id='navbar'>
        <div className='container-fluid'>
          <Link className='navbar-brand' to='/'>
            <img className='logo' src='\logo-motorlights.png' alt='' />
            <span>Motorlights-Stats</span>
          </Link>
          <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
            <span className='navbar-toggler-icon' />
          </button>
          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
              <li className='nav-item'>
                <Link className='nav-link' to='/'>Cargar Informes</Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link' to='/sales'>Informe de Ventas</Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link' to='/detailed-sales'>Informe Detallado Ventas</Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link' to='/manage-products'>Productos</Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link' to='/manage-sellers'>Vendedores</Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link' to='/manage-customers'>Cliente</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
