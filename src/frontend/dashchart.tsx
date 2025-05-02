import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';


interface DashboardChartProps {
  projectData: { name: string; percentage: number }[];
  taskData: { name: string; completionPercentage: number }[];
}

const DashboardChart = ({ projectData = [], taskData = [] }: DashboardChartProps) => {
  const pieData = {
    labels: projectData.map((project) => project.name),
    datasets: [
      {
        data: projectData.map((project) => project.percentage),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const barData = {
    labels: taskData.map((task) => task.name),
    datasets: [
      {
        label: 'Task Completion',
        data: taskData.map((task) => task.completionPercentage),
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
