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
          <Link className='nav-link' to='/credit-portfolio'><i className='fa-solid fa-wallet' /> Informe de Cartera</Link>
        </li>
        {/* <li className='nav-item'>
          <Link className='nav-link' to='/manage-products'><i className='fa-solid fa-tag' /> Productos</Link>
        </li> */}
        <li className='nav-item'>
          <Link className='nav-link' to='/manage-sellers'><i className='fa-solid fa-users' /> Vendedores</Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/manage-inventory-turnover'><i class='fa-solid fa-boxes-stacked' />Rotación de Inventario</Link>
        </li>
        {/* <li className='nav-item'>
          <Link className='nav-link' to='/manage-customers'><i className='fa-solid fa-users' /> Clientes</Link>
        </li> */}
      </ul>
    </>
  )
}

export default Sidebar
