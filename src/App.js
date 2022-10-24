import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

import Dashboard from './pages/dashboard/Dashboard'
import Create from './pages/create/Create'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import Project from './pages/project/Project'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar';
import OnlineUsers from './components/OnlineUsers';
import Profile from './pages/profile/Profile';
import Verification from './pages/verification/Verification';

import './App.css';

function App() {
  const {user, authIsReady } = useAuthContext()
  
  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
        {user && <Sidebar/>}
        <div className="container">
          <Navbar></Navbar>
            <Routes>
              <Route element={user ? <Dashboard/> : <Login/>} path='/'/>
              <Route element={!user ? <Login/> : <Dashboard/>} path='/login'/>
              <Route element={!user ? <Signup/> : <Dashboard/>} path='/signup'/>
              <Route element={user ? <Profile/> : <Login/>} path='/profile/:id'/>
              <Route element={user ? <Create/> : <Login/>} path='/create'/>
              <Route element={user ? <Project/> : <Login/>} path='/projects/:id'/>
              <Route element={user ? <Verification/> : <Login/>} path='/emailverification'/>
            </Routes>
        </div>
        {user && <OnlineUsers/>}
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
