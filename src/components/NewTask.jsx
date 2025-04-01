import { useState, useEffect } from "react";
import "./NewTask.css"; // Import the CSS file

const NewTask = () => {
  const [subjectInput, setSubjectInput] = useState("");
  const [projectInput, setProjectInput] = useState("");
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");
  const [priorityInput, setPriorityInput] = useState("");
  const [ownerInput, setOwnerInput] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [username, setUsername] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [projects, setProjects] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsername(payload.username);
        console.log("Extracted username:", payload.username);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  const getMyProjects = async () => {
    const response = await fetch(`/api/projects/byusername/${username}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    const responseObject = await response.json();
    setProjects(responseObject);
  }

  const getMyTeamMembers = async () => {
    const response = await fetch(`/api/users/myaccountinfo/${username}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    const responseObject = await response.json();
    setTeamMembers(responseObject);

  }

  useEffect(() => {
    if (username) {
      const fetchTasks = async () => {
        const response = await fetch(`/api/tasks?username=${username}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        const tasks = await response.json();
        console.log('Tasks:', tasks);
      };
      fetchTasks();
    }
  }, [username]);
  

  useEffect(() => {
    if (username) {
      const wait = async () => {
        await getMyTeamMembers()
        await getMyProjects()
      }
      wait()
    }
  }, [username]);


  const submitTask = async (event) => {
    event.preventDefault();


    const response = await fetch("/api/tasks/create-new-tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        owner: ownerInput,
        subject: subjectInput,
        description: descriptionInput,
        project_id: projectInput,
        priority: priorityInput,
        start_date: startDateInput,
        end_date: endDateInput,
        status: statusInput,
      }),
    });

    if (response.ok) {
      alert("Task submitted successfully!");
      setSubjectInput("");
      setProjectInput("");
      setStartDateInput("");
      setEndDateInput("");
      setPriorityInput("");
      setOwnerInput("");
      setStatusInput("");
    } else {
      alert("Failed to submit task.");
    }
  };

  return (
    <>
      <form className="task-form" onSubmit={submitTask}>
        <label>Subject: </label>
        <input
          className="task-input"
          placeholder="Subject"
          value={subjectInput}
          onChange={(event) => setSubjectInput(event.target.value)}
        />

        <label>Project: </label>
        <select
          className="task-input"
          value={projectInput}
          onChange={(event) => setProjectInput(event.target.value)}
        >
          <option value="">Select Project</option>
          {projects.map((project) => {
            return <option key={project.project_id} value={project.project_id}>{project.project_name}</option>
          })}
        </select>


        {/* <input
          className="task-input"
          placeholder="Project"
          value={projectInput}
          onChange={(event) => setProjectInput(event.target.value)}
        /> */}

        <label>Start Date: </label>
        <input
          className="task-input"
          type="date"
          value={startDateInput}
          onChange={(event) => setStartDateInput(event.target.value)}
        />

        <label>End Date: </label>
        <input
          className="task-input"
          type="date"
          value={endDateInput}
          onChange={(event) => setEndDateInput(event.target.value)}
        />

        <label>Description: </label>
        <input
          className="task-input"
          type="text"
          value={descriptionInput}
          onChange={(event) => setDescriptionInput(event.target.value)}
        />

        <label>Priority:</label>
        <select
          className="task-select"
          value={priorityInput}
          onChange={(event) => setPriorityInput(event.target.value)}
        >
          <option value="">Select Priority</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>

        <label>Owner: </label>
        <select
          className="task-input"
          value={ownerInput}
          onChange={(event) => setOwnerInput(event.target.value)}
        >
          <option value="">Select Owner</option>
          {teamMembers.map((member) => {
            return <option key={member.id} value={member.id}>{member.teammate_username}</option>
          })}
        </select>


        <label>Status:</label>
        <select
          className="task-select"
          value={statusInput}
          onChange={(event) => setStatusInput(event.target.value)}
        >
          <option value="">Select Status</option>
          <option value="In Progress">In Progress</option>
          <option value="Paused">Paused</option>
          <option value="Completed">Completed</option>
        </select>

        <button className="task-submit">Submit</button>
        <button className="task-cancel">Cancel</button>
      </form>
    </>
  );
};

export default NewTask;
