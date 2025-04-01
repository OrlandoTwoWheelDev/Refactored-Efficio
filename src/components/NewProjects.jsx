import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import "./NewProjects.css"; // Ensure CSS file exists
import ChatBox from "./ChatBox";

const NewProjects = () => {
  const [projects, setProjects] = useState([]);
  const [project_name, setProjectName] = useState("");
  const [status, setStatus] = useState("");
  const [chat, setChat] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();


  const token = localStorage.getItem("token");

  const handleCreate = async () => {
    const newProject = { project_name, description, status, start_date, end_date };

    try {
      const response = await fetch('/api/projects/create-new-project', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        const createdProject = await response.json();
        console.log("Project Created:", createdProject);
        setProjects((prevProjects) => [...prevProjects, createdProject]);
        navigate('/Dashboard');
      } else {
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleDelete = async (projectId) => {
    if (!projectId) return;

    try {
      const response = await fetch(`/api/projects/delete-project/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== projectId)
        );
      } else {
        console.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:" + error);
    }
  };

  return (
    <div className="projects-container">
      {/* Project Form */}
      <div className="project-form">
        <input type="text" placeholder="Project Name" value={project_name} onChange={(e) => setProjectName(e.target.value)} />
        <label>Status</label>
        <select
          onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">Select Status</option>
            <option value="in-progress">In Progress</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        <label>Start Date</label>
        <input type="date" placeholder="StartDate" value={start_date} onChange={(e) => setStartDate(e.target.value)} />
        <lable>End Date</lable>
        <input type="date" placeholder="endDate" value={end_date} onChange={(e) => setEndDate(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        <ChatBox chat={chat} setChat={setChat} />

        <div className="button-group">
          <button onClick={handleCreate}>Create</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default NewProjects;
