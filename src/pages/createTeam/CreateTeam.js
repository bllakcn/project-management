import { useState, useEffect } from 'react'
import { useCollection } from '../../hooks/useCollection'
import { useFirestore } from '../../hooks/useFirestore'
import { useNavigate } from 'react-router-dom'
import { arrayUnion } from 'firebase/firestore'
import Select from 'react-select'

import './createTeam.css'

export default function CreateTeam() {
  const [teamName, setTeamName] = useState('')
  const { documents } = useCollection('users')
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])

  const { addDocument, response:responseAddDocument } = useFirestore('teams')
  const { updateDocument, response:responseUpdateDocument } = useFirestore('users')
  const navigate = useNavigate()
  
  useEffect(() => {
    if(documents){
      const options = documents.map(user => {
        return { value: user, label: user.displayName }
      })
      setUsers(options)
    }
  }, [documents])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const members = selectedUsers.map(u => {
      return{
        displayName: u.value.displayName,
        id: u.value.id
      }
    })
    const team = {
      displayName: teamName,
      members,
      type:'team'
    }
    console.log(members)
    await addDocument(team)
    for(const member of members) {
      await updateDocument(member.id, {teams:arrayUnion(teamName)})
    }
    if(!responseAddDocument.error && !responseUpdateDocument.error){
    navigate('/')
    }
  }


  return (
    <div className='create-form'>
      <h2 className='page-title'>Create a new team</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Team name:</span>
          <input
            required
            type="text"
            onChange={(e) => setTeamName(e.target.value)}
            value={teamName}
          />
        </label>
        <label>
          <span>Select members:</span>
          <Select
            onChange={(option) => setSelectedUsers(option)}
            options={users}
            isMulti
          />
        </label>
        <button className='btn'>Create team</button>
      </form>
    </div>
  )
}
