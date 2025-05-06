import { use, useState } from 'react';

export default function NewProject() {
  const [projectname, setProjectName] = useState('');
  const [projectdescription, setProjectDescription] = useState('');
  const [status, setStatus] = useState('');
  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          projectname,
          projectdescription,
          status,
          startdate,
          enddate
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
    <div className='form'>
      <h1>New Project</h1>
      <form className='inner-form' onSubmit={handleSubmit}>
        <label htmlFor="projectName">Project Name:</label>
        <input
          type="text"
          className="form-control"
          id="projectName"
          value={projectname}
          onChange={(e) => setProjectName(e.target.value)}
        />

        <label htmlFor="projectDescription">Project Description:</label>
        <input
          type="text"
          className="form-control"
          id="projectDescription"
          value={projectdescription}
          onChange={(e) => setProjectDescription(e.target.value)}
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
          Create Project
        </button>
      </form>
    </div>
  );
}
