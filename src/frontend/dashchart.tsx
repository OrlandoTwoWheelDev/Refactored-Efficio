import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,       // For Pie/Doughnut charts
  BarElement,       // For Bar charts
  CategoryScale,    // X axis
  LinearScale,      // Y axis
  Tooltip,
  Legend
);

interface DashboardChartProps {
  projectData: { name: string; percentage: number }[];
  taskData: { name: string; completionPercentage: number }[];
}

const DashboardChart = ({ projectData = [], taskData = [] }: DashboardChartProps) => {
  console.log('Project Data:', projectData);
  console.log('Task Data:', taskData);
  const pieData = {
    labels: projectData.map((project) => project.name),
    datasets: [
      {
        data: projectData.map((project) => project.percentage),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const safeTaskData = Array.isArray(taskData) ? taskData : [];
  const barData = {
    labels: safeTaskData.map((task) => task.name),
    datasets: [
      {
        label: 'Task Completion',
        data: safeTaskData.map((task) => task.completionPercentage),
        backgroundColor: '#98c5e1',
      },
    ],
  };

  return (
    <div>
      <h2>Project Distribution</h2>
      <Pie data={pieData} />
      
      <h2>Task Progress</h2>
      <Bar data={barData} />
    </div>
  );
};

export default DashboardChart;
