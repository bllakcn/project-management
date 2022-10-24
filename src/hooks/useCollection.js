import { useEffect, useState, useRef } from 'react'
import { projectFirestore } from '../firebase/config'
import { onSnapshot, collection, query, where, orderBy } from 'firebase/firestore'

export const useCollection = (col, q, o) => {
  const [documents, setDocuments] = useState(null)
  const [error, setError] = useState(null)
  //to prevent infinte loop in useEffect
  const queryRef = useRef(q).current
  const orderByRef = useRef(o).current

  useEffect(() => {
    //collection reference
    let colRef = collection(projectFirestore, col)
    if(queryRef){
      colRef = query(colRef, where(...queryRef), orderBy(...orderByRef))
    }
    // if(orderByRef){
    //   colRef = query
    // }
    
    //subscribe
    const unsub = onSnapshot(colRef, (snapshot) => {
      let results = []
      snapshot.forEach(doc => {
        results.push({...doc.data(), id: doc.id})
      })

      //adjust states
      setDocuments(results)
      setError(null)
    
    }, (error) => {
      console.log(error)
      setError('Could not fetch the data')
    })

    return () => unsub()

  }, [col, queryRef, orderByRef])

  return { documents, error }
}