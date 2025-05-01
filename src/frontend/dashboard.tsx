import { useEffect, useState } from 'react';
import DashboardChart from './dashchart';

const Dashboard = () => {
  interface DashboardData {
    projectStatusCounts: any;
    taskStatusCounts: any;
  }

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard', {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
    <h1>Dashboard</h1>
    {dashboardData ? (
      <DashboardChart 
        projectData={dashboardData.projectStatusCounts}
        taskData={dashboardData.taskStatusCounts}
      />
    ) : (
      <p>Loading dashboard data...</p>
    )}
  </div>
  );
};

export default Dashboard;
