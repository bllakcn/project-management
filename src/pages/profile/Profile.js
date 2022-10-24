import DisplayAvatar from '../../components/DisplayAvatar'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useRef, useState } from 'react'
import { useDocument } from '../../hooks/useDocument'
import { useEffect } from 'react'
import { useFirestore } from '../../hooks/useFirestore'
import { useCollection } from '../../hooks/useCollection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useParams } from 'react-router-dom'
import ProfileContact from './ProfileContact'


import './Profile.css'

export default function Profile() {
  const profileUser = useRef()
  const { id } = useParams() // user id of the profile
  const { user } = useAuthContext()
  const { document } = useDocument('users', id) // auth user
  const { documents } = useCollection('users') // users list
  const { updateDocument } = useFirestore('users')
  const [isProfileOwner, setIsProfileOwner] = useState(false) //for edit check later
  const [bio, setBio] = useState('')
  const [editBio, setEditBio] = useState(false)
  
  // finds the user of the profile
  useEffect(() => {
    if(documents){
      profileUser.current = documents.filter((u) => { //find method could be better
        return u.id === id
      }).pop()
    }
  }, [documents, id])

  //check whether user owns the bio
  useEffect(() => {
    if(user && user.uid === id){
      setIsProfileOwner(true)
    }
    else {
      setIsProfileOwner(false)
    }
    return () => {
      setEditBio(false)
    }
  }, [user, id, isProfileOwner])

  //prepare the bio
  useEffect(() => {
    if(document){
      setBio(document.bio)
    }
  }, [document])
  
  //save the bio
  const handleSaveBio = async () => {
    try{
      await updateDocument(user.uid, {bio})
      setEditBio(false)
    }
    catch (error) {
      console.log(error)
    }
  }

  //update the bio
  const handleBio = (e) => {
    setBio(e.target.value)
  }

  return (
    <div className='profile'>
      {profileUser.current && (
        <>
          {document && (<>
            <div className='profile-header'>
              <DisplayAvatar name={ profileUser.current.displayName } size={80}/>
              <h2 className='page-title'>{ profileUser.current.displayName }</h2>
            </div>
            <div className='profile-content'>
              <div className='profile-content-bio'>
                <div className='bio-header'>
                  <h4 className='page-subtitle'>Bio</h4>
                  {isProfileOwner && (<>
                    {!editBio &&
                      <FontAwesomeIcon className='icon' size='sm' onClick={() => setEditBio(true)} icon="fa-regular fa-pen-to-square" />
                    }
                  </>)}
                </div>
                {!isProfileOwner && <p className='profile-bio-text'>{bio}</p>}
                {isProfileOwner && (<>
                  {!editBio ?
                    <p onClick={() => setEditBio(true)} className='profile-bio-text'>{bio}</p>
                  : 
                    <form className='bio-form'>
                      <label>
                        <textarea
                          autoFocus
                          type='text'
                          placeholder='Tell us about yourself.'
                          className='bio-edit'
                          onChange={handleBio}
                          onBlur={handleSaveBio}
                          value={bio}
                        ></textarea>
                      </label>
                      <FontAwesomeIcon className='icon save' onClick={handleSaveBio} icon="fa-regular fa-floppy-disk" />
                    </form> 
                  }
                </>)}
              </div>
            <ProfileContact document={document} isUser={isProfileOwner}/>
            </div>
          </>)}
        </>
      )}
    </div>
  )
}
