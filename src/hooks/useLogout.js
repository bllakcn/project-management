import { useState, useEffect } from "react"
import { projectAuth, projectFirestore } from "../firebase/config"
import { useAuthContext } from "./useAuthContext"
import { signOut } from "firebase/auth"
import { doc, updateDoc } from 'firebase/firestore'

export const useLogout = () => {
  const [isCancalled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const {dispatch, user} = useAuthContext()
  
  const logout = async () => {
    setError(null)
    setIsPending(true)
    
    try{
      //update online status
      const docRef = doc(projectFirestore, 'users', user.uid)
      await updateDoc(docRef, {
        online: false
      })

      //sign out
      await signOut((projectAuth))

      dispatch({type:'LOGOUT'})

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

  return {logout, error, isPending}
}
