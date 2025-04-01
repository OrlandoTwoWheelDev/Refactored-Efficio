import React, { useEffect, useState, useMemo } from "react";
import { PieChart, Pie, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { useParams } from "react-router-dom";
import ChatBox from "./ChatBox";
import "./Dashboard.css";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskStats, setTaskStats] = useState([]);
  const [chat, setChat] = useState("");
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  const token = localStorage.getItem("token");
  const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
  const user_id = decodedToken.user_id; // Make sure it's correctly extracted


  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("Decoded token payload:", payload);

        if (payload.username) {
          setUser(payload.username);
        } else {
          console.error("Username not found in token.");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error("No token found in localStorage.");
    }
  }, [token]);

  console.log("Token:", token);
  console.log("Authorization Header:", `Bearer ${token}`);

  useEffect(() => {
    if (!user_id) {
      console.error("User is undefined. Cannot fetch data.");

      return;
    }
    console.log("User:", user_id);

    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        console.log("Using headers:", headers);

        const [projectsRes, tasksRes, statsRes] = await Promise.all([
          fetch(`/api/projects/byusers/${user_id}`, { headers }),
          fetch(`/api/tasks/byowner/${user_id}`, { headers }),
          fetch(`/api/tasks/percentagebyowner/${user_id}`, { headers }),
        ]);

        if (!projectsRes.ok) {
          throw new Error(`Failed to fetch projects: ${projectsRes.statusText}`);
        }
        if (!tasksRes.ok) {
          throw new Error(`Failed to fetch tasks: ${tasksRes.statusText}`);
        }
        if (!statsRes.ok) {
          throw new Error(`Failed to fetch task stats: ${statsRes.statusText}`);
        }
        const projects = await projectsRes.json();
        console.log("Fetched projects:", projects); // ✅ Debugging Log
    
        if (!projects.length) {
          console.warn("No projects found for this user.");
        }

        const stats = await statsRes.json();

        setProjects(projects);
        setTasks(tasks);
        setTaskStats([
          { name: "Completed Tasks", value: stats.completed || 0, fill: "#FFBB28" },
          { name: "In-Progress Tasks", value: stats.inProgress || 0, fill: "#FF8042" },
          { name: "Paused Tasks", value: stats.paused || 0, fill: "#00C49F" },
        ]);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    console.log('fetching data for user', user_id);
    fetchData();
  }, [user_id]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/delete-project/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/projects/update/${currentProject.id}`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(currentProject),
      });
      if (res.ok) {
        setProjects(projects.map(p => (p.id === currentProject.id ? currentProject : p)));
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h3>My Projects</h3>
      <table>
        <thead>
          <tr><th>Name</th><th>Description</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {projects.length ? projects.map((p, i) => (
            <tr key={i}>
              <td>{p.project_name}</td>
              <td>{p.description}</td>
              <td>{p.status}</td>
              <td>
                <button onClick={() => { setCurrentProject(p); setShowEditModal(true); }}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          )) : <tr><td colSpan="4">No projects</td></tr>}
        </tbody>
      </table>

      <h3>Project Chat</h3>
      <ChatBox chat={chat} setChat={setChat} />

      {showEditModal && currentProject && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Project</h3>
            <input type="text" value={currentProject.project_name} onChange={e => setCurrentProject({ ...currentProject, project_name: e.target.value })} />
            <textarea value={currentProject.description} onChange={e => setCurrentProject({ ...currentProject, description: e.target.value })} />
            <select value={currentProject.status} onChange={e => setCurrentProject({ ...currentProject, status: e.target.value })}>
              <option value="paused">Paused</option>
              <option value="in-progress">In-Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setShowEditModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <h3>Task Completion Breakdown</h3>
      {taskStats.length ? (
        <>
          <PieChart width={300} height={300}>
            <Pie data={taskStats} cx="50%" cy="50%" outerRadius={100} dataKey="value" label />
            <Tooltip />
          </PieChart>
          <BarChart width={400} height={300} data={taskStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </>
      ) : <p>Loading task data...</p>}
    </div>
  );
};

export default Dashboard;
