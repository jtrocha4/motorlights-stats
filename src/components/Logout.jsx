import React, { useContext } from 'react'
import { UserContext } from '../context/user'

const Logout = ({ background = 'btn btn-outline-light', title }) => {
  const { setUser } = useContext(UserContext)

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedApp')
  }

  return (
    <>
      <button type='button' className={`${background}`} onClick={handleLogout}>{title} <i className='fa-solid fa-right-from-bracket' title='Cerrar sesión' /></button>
    </>
  )
}

export default Logout
