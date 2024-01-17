import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({ user, redirectTo = '/login' }) => {
  if (user === null) {
    return <Navigate to={redirectTo} />
  }
  return <Outlet />
}

export default ProtectedRoute
