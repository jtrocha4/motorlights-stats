import React from 'react'

const Sidebar = () => {
  return (
    <>
      <ul className='nav sidebar'>
        <li className='nav-item'>
          <a className='nav-link' href='#'><i className='fa-solid fa-house' /> Inicio</a>
        </li>
        <li className='nav-item'>
          <a className='nav-link' href='#'><i className='fa-solid fa-chart-line' /> Graficos</a>
        </li>
      </ul>
    </>
  )
}

export default Sidebar
