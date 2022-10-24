import { useEffect, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFirestore } from "../../hooks/useFirestore"
import { useAuthContext } from "../../hooks/useAuthContext"

export default function ProfileContact({ document, isUser }) {
  const { user } = useAuthContext()
  const [isEditContact, setIsEditContact] = useState(false)
  const [instagram, setInstagram] = useState('')
  const [linkedIn, setLinkedIn] = useState('')
  const { updateDocument } = useFirestore('users')
 
  const handleInstagramUrl = (e) => {
    e.preventDefault()
    setInstagram(e.target.value)
  }
  const handleLinkedInUrl= (e) => {
    e.preventDefault()
    setLinkedIn(e.target.value)
  }
  const handleSave = async () => {
    await updateDocument(user.uid, {
      contact: {
        instagram,
        linkedIn
      }
    })
    setIsEditContact(false)
  }

  useEffect(() => {
    if(document){
      setInstagram(document.contact.instagram)
      setLinkedIn(document.contact.linkedIn)
    }
    return () => {
      setIsEditContact(false)
      setInstagram('')
      setLinkedIn('')
    }
  },[document])
  
  return (
    <div className='profile-contact'>
      <div className="contact-header">
        {isUser && (<>
          {!isEditContact ? 
            <FontAwesomeIcon className='icon' onClick={() => setIsEditContact(curr => !curr)} size='sm' icon="fa-regular fa-pen-to-square" />
          :
            <FontAwesomeIcon className='icon' onClick={handleSave} icon="fa-regular fa-floppy-disk" />
          }
        </>)}
        <h4 className='page-subtitle'>Contact</h4>
      </div>
      {document &&
        <ul className="icon-items">
          <li className={`icon-item ${!document.contact.instagram ? 'inactive-icon' : ''}`}>
            {isEditContact &&
              <form className='icon-edit'>
                <label>
                  <input 
                    type="url"
                    placeholder="username"
                    onChange={handleInstagramUrl}
                    value={instagram}
                  />
                </label>
              </form>
            }
            {instagram ? 
              <a className="icon" href={`https://www.instagram.com/${instagram}`} target='_blank'  rel="noreferrer">
                <FontAwesomeIcon  size="xl" icon="fa-brands fa-instagram"/>
              </a>
            :
              <FontAwesomeIcon  size="xl" icon="fa-brands fa-instagram"/>
            }
          </li>
          <li className={`icon-item ${!document.contact.linkedIn ? 'inactive-icon' : ''}`}>
            {isEditContact &&
              <form className='icon-edit'>
                <label>
                  <input
                    type="url"
                    placeholder="fullname-12345"
                    onChange={handleLinkedInUrl}
                    value={linkedIn}
                  />
                </label>
              </form>
            }
            {linkedIn ? 
              <a className="icon" href={`https://www.linkedin.com/in/${linkedIn}`} target='_blank' rel='noreferrer'>
                <FontAwesomeIcon size="xl" icon="fa-brands fa-linkedin-in" />
              </a>
            :
              <FontAwesomeIcon size="xl" icon="fa-brands fa-linkedin-in" />
            }
          </li>
        </ul>
      }
    </div>
  )
}
