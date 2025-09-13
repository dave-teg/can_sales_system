import React from 'react'
import useAuth from '../../hooks/useAuth'
import { Outlet, Navigate, useLocation} from 'react-router-dom'
import Unauthorized from '../../components/Unauthorized'

const RequireAuth = ({allowedRoles}) => {
  const location = useLocation();
  const { username, role} = useAuth()

  const content = allowedRoles?.includes(role) ? <Outlet/> : username ?  <Unauthorized/> : <Navigate to="/" state={{ from: location }} replace />

  return content;
}

export default RequireAuth