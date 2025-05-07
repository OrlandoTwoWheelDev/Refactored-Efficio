import { ReactNode, useEffect, useState } from 'react';
import DashboardChart from './dashchart';

const Dashboard = () => {
  interface DashboardData {
    userProjects: {
      id: number;
      projectname: string;
      projectdescription: string;
      status: string;
      name: string;
      completionPercentage: number;
    }[];
    userTasks: {
      id: number;
      title: string;
      description: string;
      status: string;
      name: string;
      completionPercentage: number;
    }[];
    projectStatusCounts: { name: string; completionPercentage: number }[];
    taskStatusCounts: { name: string; completionPercentage: number }[];
  }

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Only accept valid arrays
        if (
          !Array.isArray(data.projectStatusCounts) ||
          !Array.isArray(data.taskStatusCounts)
        ) {
          throw new Error('Invalid data format');
        }

        setTimeout(() => setDashboardData(data), 1000);
        console.log('Dashboard data:', data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred',
        );
      }
    };

    fetchDashboardData();
  }, []);

  if (error) return <p>Error loading dashboard: {error}</p>;
  if (!dashboardData) return <p>Loading dashboard data...</p>;

  const noProjectData = dashboardData.projectStatusCounts.length === 0;
  const noTaskData = dashboardData.taskStatusCounts.length === 0;

  if (noProjectData && noTaskData) {
    return <p>No dashboard data available.</p>;
  }

  return (
    <div className="dashboard-container">
      {/* Top Left - Pie Chart */}
      <div className="chart-container">
        <DashboardChart
          projectData={dashboardData.projectStatusCounts} taskData={[]} />
      </div>

      {/* Top Right - My Projects */}
      <div className="project-section task-list-container">
        <h2 style={{ color: 'white' }}>My Projects</h2>
        <ul>
          {dashboardData.userProjects.map((project) => (
            <li key={project.id}>
              <strong>{project.projectname}</strong> - <em>{project.status}</em>{' '}
              - {project.projectdescription}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Left - Bar Chart */}
      <div className="bar-chart-container">
        <DashboardChart taskData={dashboardData.taskStatusCounts} projectData={[]} />
      </div>

      {/* Bottom Right - My Tasks */}
      <div className="task-section task-list-container">
        <h2 style={{ color: 'white' }}>My Tasks</h2>
        <ul>
          {dashboardData.userTasks.map((task) => (
            <li key={task.title}>
              <strong>{task.title}</strong> - <em>{task.status}</em> -{' '}
              {task.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
