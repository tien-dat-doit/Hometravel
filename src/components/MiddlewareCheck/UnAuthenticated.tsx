import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../../hook/useAuth'


type Props = {
    children: JSX.Element
}

const  UnAuthenticated: React.FC<Props> = ({children}) => {

  const {auth}: any = useAuth()

  return (!auth?.access_token ? children : <Navigate to={"/"} replace/>)
}

export default UnAuthenticated