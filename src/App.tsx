import { Routes, Route, Link } from 'react-router-dom'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './App.css'
import Homepage from './frontend/home'
import Dashboard from './frontend/dashboard'
import NewProject from './frontend/newProject'
import NewTask from './frontend/newTask'
import Chat from './frontend/chat'
import MyAccount from './frontend/myAccount'
import Team from './frontend/team'
import Login from './frontend/login'
import Register from './frontend/register'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App = () => {
  const isLoggedIn = !!localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <>
      <nav className="container my-4">
  <div className="row g-2 justify-content-center">
    <div className="col-auto">
      <Link to="/" className="btn btn-primary">Home</Link>
    </div>
    <div className="col-auto">
      <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
    </div>
    <div className="col-auto">
      <Link to="/newproject" className="btn btn-primary">New Project</Link>
    </div>
    <div className="col-auto">
      <Link to="/newtask" className="btn btn-primary">New Task</Link>
    </div>
    <div className="col-auto">
      <Link to="/chat" className="btn btn-primary">Chat</Link>
    </div>
    <div className="col-auto">
      <Link to="/myaccount" className="btn btn-primary">My Account</Link>
    </div>
    <div className="col-auto">
      <Link to="/team" className="btn btn-primary">Team</Link>
    </div>
    {isLoggedIn ? (
      <div className="col-auto">
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>
        ) : (
      <>
        <div className="col-auto">
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
        <div className="col-auto">
          <Link to="/register" className="btn btn-primary">Register</Link>
        </div>
      </>
    )}
  </div>
</nav>



      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/newproject' element={<NewProject />} />
        <Route path='/newtask' element={<NewTask />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/myaccount' element={<MyAccount />} />
        <Route path='/team' element={<Team />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </>
  )
}

export default App