import { useEffect, useState } from "react"
import { projectFirestore } from "../firebase/config"
import { doc, onSnapshot } from "firebase/firestore"

export const useDocument = (collection, id) => {
  const [document, setDocument] = useState(null)
  const [error, setError] = useState(null)

  //realtime data for document
  useEffect(()=> {
    const unsub = onSnapshot(doc(projectFirestore, collection, id), snapshot => {
      if(snapshot.data()){
        setDocument({...snapshot.data(), id:snapshot.id})
        setError(null)
      } 
      else {
        setError('No such document exists')
      }
    }, (err) => {
      console.log(err.message)
      setError('Failed to get the document')
    })
    return () => unsub()

  }, [collection, id])

  return { document, error }
}