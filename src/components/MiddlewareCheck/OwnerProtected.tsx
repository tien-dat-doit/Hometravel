import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../../hook/useAuth'
import Protected from './Protected'

type Props = {
    children: JSX.Element
}

const OwnerProtected: React.FC<Props> = ({children}) => {

  const {auth}: any = useAuth()

  return (
      <Protected>
          {auth?.user?.role === 'Owner' ? (
              children
          ) : (
              <Navigate to={'/pages/error403'} replace />
          )}
      </Protected>
  );
  
}

export default OwnerProtected