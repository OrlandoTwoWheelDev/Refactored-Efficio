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
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels,
  Tooltip,
  Legend,
);

interface DashboardChartProps {
  projectData: { name: string; completionPercentage: number }[];
  taskData: { name: string; completionPercentage: number }[];
}

const DashboardChart = ({ projectData, taskData }: DashboardChartProps) => {
  if (projectData.length === 0 && taskData.length === 0) {
    return <p>No data to display in charts.</p>;
  }

  const pieData = {
    labels: projectData.map((project) => project.name),
    datasets: [
      {
        data: projectData.map((project) => project.completionPercentage),
        backgroundColor: ['#4FC3F7', '#A1887F', '#AED581'],
      },
    ],
    options: {
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#white',
            font: {
              size: 14,
              family: 'Segoe UI',
            },
          },
        },
        tooltip: {
          backgroundColor: '#1f2937',
          titleColor: '#facc15',
          bodyColor: '#white',
          cornerRadius: 8,
          padding: 12,
          callbacks: {
            label: function (context: { label: any; raw: any; }) {
              return `${context.label}: ${context.raw}% completed`;
            },
          },
        },
        datalabels: {
          color: '#white',
          font: {
            size: 14,
            weight: 'bold',
          },
          formatter: (value: any) => `${value}%`,
        },
      },
    },
  };
  

  const barData = {
    labels: taskData.map((task) => task.name),
    datasets: [
      {
        label: 'Task Completion',
        data: taskData.map((task) => task.completionPercentage),
        backgroundColor: ['#FF7043', '#D7CCC8', '#66BB6A'],
      },
    ],
  };

  return (
    <div>
      {projectData.length > 0 && (
        <>
          <h2 style={{ color: '#4FC3F7' }}>Project Distribution</h2>
          <Pie data={pieData} />
        </>
      )}
      {taskData.length > 0 && (
        <>
          <h2 style={{ color: '#FF7043' }}>Task Progress</h2>
          <Bar data={barData} />
        </>
      )}
    </div>
  );
};

export default DashboardChart;
