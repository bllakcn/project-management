import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { applyActionCode, onIdTokenChanged } from 'firebase/auth'
import { projectAuth } from '../../firebase/config'
import { useAuthContext } from '../../hooks/useAuthContext'

import './Verification.css'

export default function  Verification() {
  const queryString = useLocation().search
  const queryParams = new URLSearchParams(queryString)
  const oobCode = queryParams.get('oobCode')
  const { user } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    const verifyUser = async () => {
      try{
        await applyActionCode(projectAuth, oobCode)
        user.reload()
        console.log('verified')
      }
      catch (error){
        console.log(error)
      }
    }

    onIdTokenChanged(projectAuth, (user) => {
      if(user && !user.emailVerified){
        verifyUser()
      }
      if(user && user.emailVerified){
        setTimeout(() =>{
          navigate('/')
        },2000)
      }
    })
  }, [user.emailVerified, navigate, oobCode, user])

  return (
    <div className='verification-page'>
      {user && (
        <div className='verification-header'>
          <h2 className='page-title'>Your account has been verified!</h2>
          <p>You are being redirected to Dashboard...</p>
        </div>
      )}
    </div>
  )
}
