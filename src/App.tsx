import './index.css';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import Starfield from './frontend/starfield';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('authToken'),
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('authToken'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <>
      <Starfield />
      <div className="universe" />
      <nav className="main-nav">
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
