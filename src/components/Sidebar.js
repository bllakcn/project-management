import './Sidebar.css'
import { NavLink } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DisplayAvatar from './DisplayAvatar'


export default function Sidebar() {
  const { user } = useAuthContext()

  return (
    <div className='sidebar'>
      <div className="sidebar-content">
        <div className="user">
          <DisplayAvatar name={user.displayName} size='50'/>
          <p>Hey {user.displayName}</p>
        </div>
        <nav className="links">
          <ul>
            <li>
              <NavLink to='/' end>
                <FontAwesomeIcon inverse size='sm' icon="fa-solid fa-table-columns" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to='/create'>
                <FontAwesomeIcon inverse size='sm' icon="fa-solid fa-plus" />
                <span>New Project</span>
              </NavLink>
            </li>
            <li>
              <NavLink to='/createateam'>
                <FontAwesomeIcon inverse size='sm' icon="fa-solid fa-plus" />
                <span>New Team</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
