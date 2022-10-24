import { useCollection } from '../../hooks/useCollection'
import { useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import ProjectList from '../../components/ProjectList'
import ProjectFilter from './ProjectFilter'

import './Dashboard.css'

export default function Dashboard() {
  const { documents, error } = useCollection('projects')
  const [currentFilter, setCurrentFilter] = useState('all')
  const { user } = useAuthContext()

  const changeFilter = (newFilter) => {
    setCurrentFilter(newFilter)
  }

  const filteredProjects = documents ? documents.filter((document) => {
    switch(currentFilter){
      case 'all':
        return !document.isCompleted
      case 'mine':
        let assignedToMe = false
        document.assignedUsersList.forEach((u) => {
          if(user.uid === u.id && !document.isCompleted){
            assignedToMe = true
          }
        })
        return assignedToMe
      case 'development':
      case 'design':
      case 'sales':
      case 'marketing':
        return document.category === currentFilter && !document.isCompleted
      case 'completed':
        return document.isCompleted
      default:
        return true
    }
  }) : null

  return (
    <div>
      {user && (
        <>
          {user.emailVerified ? (
            <>
            <h2 className='page-title'>Dashboard</h2>
            {error && <p className='error'>{error}</p>}
            {documents && (
              <ProjectFilter currentFilter={currentFilter} changeFilter={changeFilter}/>
            )}
            {filteredProjects && <ProjectList projects={filteredProjects}/>}
            </>
          ) : (
            <div className='unverified-user'>
              <h4 className='page-title'>You need to verify your account to see the content in the Dashboard.</h4>
              <p>Make sure you check your spam as well 😊</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
