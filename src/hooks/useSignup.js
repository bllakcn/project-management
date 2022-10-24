import { useState, useEffect } from "react"
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth"
import { projectAuth, projectFirestore} from "../firebase/config"
import { doc, setDoc } from 'firebase/firestore'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [isCancalled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const {dispatch} = useAuthContext()


  const signup = async (email, password, displayName) => {
    setError(null)
    setIsPending(true)

    try{
      
      //signup
      const userCredential = await createUserWithEmailAndPassword(projectAuth, email, password)
      if(!userCredential){
        throw new Error('Could not complete sign up')
      }

      //add display name to user
      await updateProfile(userCredential.user, {displayName})

      //create a user doc
      await setDoc(doc(projectFirestore, 'users', userCredential.user.uid),{
        online: true,
        displayName,
        bio: '',
        contact:{
          instagram:'',
          linkedIn:''
        }
      })

      //send the user a verification email
      await sendEmailVerification(userCredential.user)

      //dispatch login action
      dispatch({type:'LOGIN', payload: userCredential.user})
      
      //adjust pending and error states
      // if(!isCancalled){
      //   setIsPending(false)
      //   setError(null)
      // }
      setIsPending(false)
      setError(null)
  
    }
    catch(err) {
      if(!isCancalled){
        console.log(err.message)
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return {error, isPending, signup}
}

