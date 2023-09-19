import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
      <nav className='navbar bg-dark border-bottom border-body' data-bs-theme='dark' id='navbar'>
        <div className='container-fluid'>
          <Link className='navbar-brand' to='/'>
            <img className='logo' src='\logo-motorlights.png' alt='' />
            <span>Motorlights-Stats</span>
          </Link>
        </div>
      </nav>
    </>
  )
}

export default Navbar
