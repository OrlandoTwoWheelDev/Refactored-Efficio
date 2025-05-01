import { useState } from 'react';

export default function NewProject() {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString());
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          projectDescription,
          status,
          startDate,
          endDate,
        }),
      });

      const data = await result.json();

      if (result.ok) {
        console.log('✅ Project created successfully:', data);
        setProjectName('');
        setProjectDescription('');
      } else {
        console.error('❌ Error creating project:', data);
      }
    } catch (error) {
      console.error('🚨 Network or server error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>New Project Component</h1>

      <label htmlFor="projectName">Project Name:</label>
      <input
        type="text"
        id="projectName"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />

      <label htmlFor="projectDescription">Project Description:</label>
      <input
        type="text"
        id="projectDescription"
        value={projectDescription}
        onChange={(e) => setProjectDescription(e.target.value)}
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
        Create Project
      </button>
    </form>
  );
}
