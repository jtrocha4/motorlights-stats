import React from 'react'

const Navbar = () => {
  return (
    <>
      <nav className='navbar bg-dark border-bottom border-body' data-bs-theme='dark' id='navbar'>
        <div className='container-fluid'>
          <a className='navbar-brand' href='#'>
            <img className='logo' src='..\public\logo-motorlights.png' alt='' />
            <span>Motorlights-Stats</span>
          </a>
        </div>
      </nav>
    </>
  )
}

export default Navbar
