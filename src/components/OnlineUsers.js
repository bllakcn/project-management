import { useCollection } from '../hooks/useCollection'
import { Link } from 'react-router-dom'
import DisplayAvatar from './DisplayAvatar'

import './OnlineUsers.css'

export default function OnlineUsers() {
  const { error, documents } = useCollection('users')

  return (
    <div className='user-list'>
      <h2>All Users</h2>
      {error && <div className='error'>{error}</div>}
      {documents && documents.map(user => (
        <div key={user.id} className='user-list-item'>
          <Link to={`/profile/${user.id}`}>
            {user.online ? <span className='online-user'></span> : <span className='offline-user'></span>}
            <span>{user.displayName}</span>
            <DisplayAvatar name={ user.displayName } size='40'/>
          </Link>
        </div>
      ))}
    </div>
  )
}
