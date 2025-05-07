import './index.css';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Homepage from './frontend/home';
import Dashboard from './frontend/dashboard';
import NewProject from './frontend/newProject';
import NewTask from './frontend/newTask';
import Chat from './frontend/chat';
import MyAccount from './frontend/myAccount';
import Team from './frontend/team';
import Login from './frontend/login';
import Register from './frontend/register';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const App = () => {
  const isLoggedIn = !!localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <>
      <nav className="main-nav">
        <div className="stars" />
        <div className="twinkling" />
        {isLoggedIn ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/newproject">New Project</Link>
            <Link to="/newtask">New Task</Link>
            <Link to="/chat">Chat</Link>
            <Link to="/myaccount">My Account</Link>
            <Link to="/team">Team</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/newproject" element={<NewProject />} />
        <Route path="/newtask" element={<NewTask />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route path="/team" element={<Team />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
};

export default App;
