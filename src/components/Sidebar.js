import './Sidebar.css'
import { NavLink } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
import DisplayAvatar from './DisplayAvatar'

import DashboardIcon from '../assets/dashboard_icon.svg'
import AddIcon from '../assets/add_icon.svg'


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
                <img src={DashboardIcon} alt="dashboard icon" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to='/create'>
                <img src={AddIcon} alt="add project icon" />
                <span>New Project</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
