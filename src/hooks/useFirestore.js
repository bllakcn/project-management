import { useReducer, useEffect, useState } from "react";
import { projectFirestore, timestamp } from '../firebase/config'
import { collection, addDoc, updateDoc, deleteDoc, doc} from 'firebase/firestore'

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null
}

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      return { isPending: true, document: null, success: false, error: null }
    case 'ADDED_DOCUMENT':
      return { isPending: false, document: action.payload, success: true,  error: false }
    case 'ERROR':
      return { isPending: false, document: null, success:false, error: action.payload}
    case 'DELETED_DOCUMENT':
      return {isPending: false, document: null, success: true, error: null}
    case 'UPDATED_DOCUMENT':
      return {isPending: false, document: action.payload, success: true, error: null} 
    default:
      return state
  }
}

export const useFirestore = (col) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState)
  const [isCancelled, setIsCancelled] = useState(false)

  // collection reference
  const colRef = collection(projectFirestore, col)

  // dispatch only if not cancalled
  const dispatchIfNotCancelled = (action) => {
    if(isCancelled){
      dispatch(action)
    }
  }

  // add document
  const addDocument = async (doc) => {
    try{
      const createdAt = timestamp.fromDate(new Date())
      const addedDocument = await addDoc(colRef, { ...doc, createdAt})
      dispatchIfNotCancelled({ type:'ADDED_DOCUMENT', payload:addedDocument})
    }
    catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
    }
  }

  //update a document
  const updateDocument = async (id, updates) => {
    dispatch({ type: 'IS_PENDING' })
    try{
      const updatedDocument = await updateDoc(doc(projectFirestore, col, id), updates)
      dispatchIfNotCancelled({ type: 'UPDATED_DOCUMENT', payload: updatedDocument })
      return updatedDocument
    }
    catch (err) {
      dispatchIfNotCancelled({ type:'ERROR', payload:err.message })
      return null
    }
  }

  // delete document
  const deleteDocument = async (id) => {
    dispatch({type: 'IS_PENDING'})

    try{
      await deleteDoc(doc(projectFirestore, col, id))
      dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT'})
    }
    catch(err){
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'Could not delete'})
    }
  }

  useEffect(() => {
    return () => {
      setIsCancelled(true)
    }
  }, [])

  return { addDocument, updateDocument, deleteDocument, response }
}