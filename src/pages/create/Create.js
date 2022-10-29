import { useEffect, useState } from 'react'
import { useCollection } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'
import { timestamp } from '../../firebase/config'
import { useFirestore } from '../../hooks/useFirestore'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'

import './Create.css'

const categories = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' }
]

export default function Create() {
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category , setCategory] = useState('')
  const [assignedUsers, setAssignedUsers] = useState([])
  const [formError, setFormError] = useState(null)

  const { documents:usersDocument } = useCollection('users')
  const { documents:teamsDocument } = useCollection('teams')
  const [users, setUsers] = useState([])
  const { user } = useAuthContext()

  const { addDocument, response } = useFirestore('projects')
  const navigate = useNavigate()

  useEffect(() => {
    if(usersDocument && teamsDocument){
      const optionsList = [...usersDocument,...teamsDocument]
      const options = optionsList.map(option => {
        return { value: option, label: option.displayName }
      })
      setUsers(options)
    }
  }, [usersDocument, teamsDocument])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    if(!category){
      setFormError('Please select a project category')
      return
    }
    if(assignedUsers.length < 1){
      setFormError('Please assign the project to at least 1 user')
      return
    }

    const createdBy = {
      displayName: user.displayName,
      id: user.uid
    }

    const assignedUsersList = assignedUsers.map((u) => {
      return{
        displayName: u.value.displayName,
        id: u.value.id,
        type: u.value.type
      }
    })

    const project = {
      name,
      details,
      category: category.value,
      isCompleted: false,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      comments: [],
      createdBy,
      assignedUsersList
    }
    //save the project document to the collection
    await addDocument(project)
    if(!response.error){
      navigate('/')
    }
  }

  return (
    <div className='create-form'>
      <h2 className='page-title'>Create a new project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Project name:</span>
          <input
            required
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>
        <label>
          <span>Project details:</span>
          <textarea
            required
            type='text'
            onChange={(e) => setDetails(e.target.value)}
            value={details}
          ></textarea>
        </label>
        <label>
          <span>Set due date:</span>
          <input
            required
            type="date"
            onChange={(e) => setDueDate(e.target.value)}
            value={dueDate}
          />
        </label>
        <label>
          <span>Project category:</span>
          <Select
            onChange={(option) => setCategory(option)}
            options={categories}
          />
        </label>
        <label>
          <span>Assign to:</span>
          <Select
            onChange={(option) => setAssignedUsers(option)}
            options={users}
            isMulti
          />
        </label>
        <button className='btn'>Add Project</button>
        {formError && <p className='error'>{formError}</p>}
      </form>
    </div>
  )
}
