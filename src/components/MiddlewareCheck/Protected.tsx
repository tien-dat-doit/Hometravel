import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../../hook/useAuth'

type Props = {
    children: JSX.Element
}

const Protected: React.FC<Props> = ({children}) => {

  const {auth}: any = useAuth()
  const location = useLocation().pathname

  return auth?.access_token ? children : <Navigate to={"/login"} state={{from: location}} replace/>
}

export default Protected