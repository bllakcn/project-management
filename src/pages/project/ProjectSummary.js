import { useState, useEffect } from 'react'
import { useFirestore } from '../../hooks/useFirestore'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'
import { useCollection } from '../../hooks/useCollection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DisplayAvatar from '../../components/DisplayAvatar'

export default function ProjectSummary({ project }) {
  const { updateDocument } = useFirestore('projects')
  // const { documents:teamsDocument } = useCollection('teams')
  const { documents:usersDocument } = useCollection('users')
  const { user } = useAuthContext()
  const navigate = useNavigate()
  const [isOwner, setIsOwner] = useState(false)
  const [isEditDetails, setIsEditDetails] = useState(false)
  const [editedDetails, setEditedDetails] = useState(project.details)
  const [assignees, setAssignees] = useState([])

  useEffect(() => {
    setIsOwner(user.uid === project.createdBy.id ? true : false)
  }, [user, project])

  useEffect(() => {
    if(usersDocument && project && project.assignedUsersList[0].type === 'team'){
      const assignees = usersDocument.filter((u) => {
        return u.teams.includes(project.assignedUsersList[0].displayName)
      }) 
      setAssignees([...assignees])
    } else {
      setAssignees([...project.assignedUsersList])
    }
  },[usersDocument, project])

  //change the isCompleted prop to true
  const handleClick = async () => {
    await updateDocument(project.id, {isCompleted: true})
    navigate('/')
  }
  // edit the details
  const handleEdit = async () => {
    if(isOwner){
      if(!isEditDetails){
        setIsEditDetails(true)
      }
      else {
        try{
          await updateDocument(project.id, {details:editedDetails})
          setIsEditDetails(false)
        }
        catch (error){
          console.log(error)
        }
      }
    }
  }
  
  return (
    <div>
      <div className="project-summary">
        <div className='project-header'>
          <h2 className="page-title">{project.name}</h2>
          <p>By {project.createdBy.displayName}</p>
        </div>
        <div className='project-info'>
          <p className="due-date"><span>Project is due by</span> {project.dueDate.toDate().toDateString()}</p>
          {isOwner && <FontAwesomeIcon className='icon' size='sm' onClick={handleEdit} icon="fa-regular fa-pen-to-square" />}
        </div>
        <form className='edit-details' onClick={() => setIsEditDetails(isOwner ? true : false)}>
          <textarea
            autoFocus={isEditDetails}
            disabled={!isEditDetails}
            type='text'
            onChange={(e) => setEditedDetails(e.target.value)}
            onBlur={handleEdit}
            value={!isEditDetails ? project.details : editedDetails}
            size='fixed'
          ></textarea>
        </form>
        <h4>Project is assigned to:</h4>
        <div className='project-footer'>
          <div className='assigned-users'>
            {assignees.map(user => (
              <div className='assigned-user' key={user.id}>
                <DisplayAvatar name={user.displayName} size='50'/>
                <h4 className='username' >{user.displayName}</h4>
              </div>
          ))}
          
          </div>
          {!project.isCompleted && (<>
            {user.uid === project.createdBy.id && (
              <button onClick={handleClick} className="btn">Mark as complete</button>
            )}
          </>)}
        </div>
      </div>
    </div>
  )
}
