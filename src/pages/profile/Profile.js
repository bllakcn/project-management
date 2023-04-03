import DisplayAvatar from '../../components/DisplayAvatar'
import { useRef, useState } from 'react'
import { useDocument } from '../../hooks/useDocument'
import { useEffect } from 'react'
import { useCollection } from '../../hooks/useCollection'
import { useParams } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import ProfileContact from './ProfileContact'
import ProfileTeamMember from './ProfileTeamMember'
import ProfileBio from './ProfileBio'

import './Profile.css'

export default function Profile() {
  const profileUser = useRef() // change to state
  const { id } = useParams() // user id of the profile
  const { user } = useAuthContext()
  const { document } = useDocument('users', id) // auth user
  const { documents } = useCollection('users') // users list
  const [isProfileOwner, setIsProfileOwner] = useState(false) //for edit check later
  const [editBio, setEditBio] = useState(false)


  // finds the user of the profile
  useEffect(() => {
    if(documents){
      profileUser.current = documents.filter((u) => { //find method could be better
        return u.id === id
      }).pop()
    }
    return 
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

  return (
    <div className='profile'>
      {profileUser.current && (
        <>
          {document && (<>
            <div className='profile-header'>
              <DisplayAvatar name={ profileUser.current.displayName } size={80}/>
              <h2 className='page-title'>{ profileUser.current.displayName }</h2>
            </div>
            <main className='profile-content'>
              <div className='content-left'>
                <ProfileBio document={document} user={user} id={id} editBio={editBio} setEditBio={setEditBio} isProfileOwner={isProfileOwner}/>
                <ProfileTeamMember document={document}/>
              </div>
              <div className='content-right'>
                <ProfileContact document={document} isUser={isProfileOwner}/>
              </div>
            </main>
          </>)}
        </>
      )}
    </div>
  )
}
