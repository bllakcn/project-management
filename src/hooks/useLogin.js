import { useState, useEffect } from "react"
import { projectAuth, projectFirestore } from "../firebase/config"
import { useAuthContext } from "./useAuthContext"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, updateDoc } from 'firebase/firestore'


export const useLogin = () => {
  const [isCancalled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const {dispatch} = useAuthContext()

  
  const login = async (email, password) => {
    setError(null)
    setIsPending(true)

    try{
      //sign in
      const userCredential = await signInWithEmailAndPassword(projectAuth, email, password)
      if(!userCredential){
        throw new Error('Could not complete login')
      }
      
      //update online status
      const user = projectAuth.currentUser
      if(user){
        const docRef = doc(projectFirestore, 'users', user.uid)
        await updateDoc(docRef, {
          online: true
        })
      }

      //dispatch login action
      dispatch({type:'LOGIN', payload: userCredential.user})
      
      //adjust pending and error states
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

  return {login, error, isPending}
}
