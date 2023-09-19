import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <>
      <ul className='nav sidebar'>
        <li className='nav-item'>
          <Link className='nav-link' to='/'><i className='fa-solid fa-house' /> Inicio</Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/graphics'><i className='fa-solid fa-chart-line' /> Graficos</Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/database'><i className='fa-solid fa-database' /> Base de datos</Link>
        </li>
      </ul>
    </>
  )
}

export default Sidebar
