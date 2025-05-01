import { useState, useEffect } from 'react';

const NewProject = () => {
  const [title, setTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString());
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          taskDescription,
          status,
          startDate,
          endDate,
        }),
      });

      const data = await result.json();

      if (result.ok) {
        console.log('✅ Task created successfully:', data);
        setTitle('');
        setTaskDescription('');
      } else {
        console.error('❌ Error creating task:', data);
      }
    } catch (error) {
      console.error('🚨 Network or server error:', error);
    }
  };

  const ProjectDropdown = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>('');

    useEffect(() => {
      const fetchProjects = async () => {
        try {
          const response = await fetch('/api/projects');
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

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedProject(event.target.value);
    };

    return (
      <form onSubmit={handleSubmit}>
        <h1>New Task Component</h1>

        <label htmlFor="taskName">Task Name:</label>
        <input
          type="text"
          id="taskName"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="taskDescription">Task Description:</label>
        <input
          type="text"
          id="taskDescription"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />

        <label htmlFor="status">Status:</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>

        <label htmlFor="projectDropdown">Project:</label>
        <select id="projectDropdown" value={selectedProject} onChange={handleChange}>
          <option value="">-- Select a Project --</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.projectName}
            </option>
          ))}
        </select>

        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label htmlFor="endDate">End Date:</label>
        <input
          type="date"
          id="endDate"
          value={endDate || ''}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button type="submit">
          Create Task
        </button>
      </form>
    );
  };

  return <ProjectDropdown />;
};

export default NewProject;
