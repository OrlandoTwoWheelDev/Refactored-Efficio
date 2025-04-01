import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import NewTask from "./components/NewTask";
import Calendar from "./components/CalendarPage";
import Account from "./components/MyAccount";
import Login from "./components/Login";  
import Register from "./components/Register";  
import NewProjects from "./components/NewProjects";
import Homepage from "./components/Homepage";

function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const checkAuth = () => setAuth(!!localStorage.getItem("token"));
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (

    <Router>
      <Navbar onLogout={() => setAuth(false)} /> {/* ✅ Added onLogout */}
      <Routes>
        {/* Public Routes */}
        {!auth && (
          <>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login onLogin={() => setAuth(true)} />} />
            <Route path="/register" element={<Register onRegister={() => setAuth(true)} />} />
          </>
        )}

        {/* Protected Routes */}
        {auth && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-task" element={<NewTask />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/projects" element={<NewProjects />} />
            <Route path="/account" element={<Account />} />
          </>
        )}

        {/* Redirects for wrong access */}
        {auth && (
          <>
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="/register" element={<Navigate to="/dashboard" replace />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </>
        )}

        {!auth && (
          <>
            <Route path="/dashboard" element={<Navigate to="/login" replace />} />
            <Route path="/new-task" element={<Navigate to="/login" replace />} />
            <Route path="/calendar" element={<Navigate to="/login" replace />} />
            <Route path="/projects" element={<Navigate to="/login" replace />} />
            <Route path="/account" element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={auth ? "/dashboard" : "/"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
