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
          <Link className='nav-link' to='/how-are-we-doing'><i className='fa-solid fa-table' /> Como Vamos</Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/graphics'><i className='fa-solid fa-chart-line' /> Graficos</Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/analytics'><i className='fa-solid fa-magnifying-glass-chart' /> Analitica</Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/manage-sellers'><i className='fa-solid fa-users' /> Vendedores</Link>
        </li>
      </ul>
    </>
  )
}

export default Sidebar
