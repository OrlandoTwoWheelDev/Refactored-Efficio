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
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Fallback if project data is empty or invalid
        if (!Array.isArray(data.projectStatusCounts) || data.projectStatusCounts.length === 0) {
          data.projectStatusCounts = [{ name: 'No Data', percentage: 0 }];
        }
  
        // Fallback if task data is not an array
        if (!Array.isArray(data.taskStatusCounts)) {
          data.taskStatusCounts = [{ name: 'No Tasks', completionPercentage: 0 }];
        }
        
        console.log('Dashboard data:', data); // <-- Log the data
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
