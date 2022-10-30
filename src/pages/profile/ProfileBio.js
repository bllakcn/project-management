import { useState, useEffect } from "react"
import { useFirestore } from "../../hooks/useFirestore"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function ProfileBio({ document, user, editBio, setEditBio, isProfileOwner, id }) {
  const [bio, setBio] = useState('')
  const { updateDocument } = useFirestore('users')
  
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
    <div className='profile-content-bio'>
      <div className='bio-header'>
        <h4 className='page-subtitle'>Bio</h4>
        {isProfileOwner && (<>
          {!editBio &&
            <FontAwesomeIcon className='icon' size='sm' onClick={() => setEditBio(true)} icon="fa-regular fa-pen-to-square" />
          }
        </>)}
      </div>
      <div>
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
    </div>
  )
}
