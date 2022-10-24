import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './Navbar.css'
import Logo from '../assets/temple.svg'

export default function Navbar() {
  const { logout, isPending } = useLogout()
  const { user } = useAuthContext()

  return (
    <div className='navbar'>
      <ul>
        <li className='logo'>
          <img src={Logo} alt="app logo" />
          <span>The Dojo</span>
        </li>
        {!user ? (
          <>
            <li><Link to='/login'>Login</Link></li>
            <li><Link to='/signup'>Signup</Link></li>
          </>
        ) : 
          <>
          
            <li>
              <Link to={`/profile/${user.uid}`}><FontAwesomeIcon icon="fa-regular fa-user" /></Link>
            </li>
            <li>
              {isPending ? (<button className='btn' disabled>Logging out...</button>) : (<button className='btn' onClick={logout}>Logout</button>)}
            </li>
          </>
        }
      </ul>
    </div>
  )
}
