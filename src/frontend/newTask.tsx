import { useState, useEffect } from 'react';

const userid = localStorage.getItem('userid');

const NewProject = () => {
  // Task state variables
  const [title, setTitle] = useState('');
  const [taskdescription, setTaskDescription] = useState('');
  const [status, setStatus] = useState(''); // Added state for status
  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState<string | null>(''); // Handle the end date properly

  // Project state variables
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          title,
          description: taskdescription,
          status,
          startdate,
          enddate,
          projectid: selectedProject,
          userid: userid,
        }),
      });

      const data = await result.json();

      if (result.ok) {
        console.log('✅ Task created successfully:', data);
        setTitle('');
        setTaskDescription('');
        setStatus('');
        setStartDate('');
        setEndDate('');
        setSelectedProject('');
      } else {
        console.error('❌ Error creating task:', data);
      }
    } catch (error) {
      console.error('🚨 Network or server error:', error);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/projects', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  // Handle project selection
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(event.target.value);
  };

  return (
    <div className="form">
      <h1>New Task</h1>
      <form className="inner-form" onSubmit={handleSubmit}>
        <label htmlFor="taskName">Task Name:</label>
        <input
          type="text"
          className="form-control"
          id="taskName"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="taskdescription">Task Description:</label>
        <input
          type="text"
          className="form-control"
          id="taskdescription"
          value={taskdescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />

        <label htmlFor="status">Status:</label>
        <select
          id="status"
          className="form-control"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>

        <label htmlFor="projectDropdown">Project:</label>
        <select
          id="projectDropdown"
          className="form-control"
          value={selectedProject}
          onChange={handleChange}
        >
          <option value="">-- Select a Project --</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.projectname ?? 'Untitled Project'}
            </option>
          ))}
        </select>

        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          className="form-control"
          id="startDate"
          value={startdate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label htmlFor="endDate">End Date:</label>
        <input
          type="date"
          className="form-control"
          id="endDate"
          value={enddate || ''}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button className="btn btn-primary" type="submit">
          Create Task
        </button>
      </form>
    </div>
  );
};

export default NewProject;
