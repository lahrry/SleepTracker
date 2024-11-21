import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type WeeklyProgressProps = {
  tasks: number[];
  sleeps: number[];
  weekLabels: string[];
};

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ tasks, sleeps, weekLabels }) => {
  const data = {
    labels: weekLabels,
    datasets: [
      {
        label: "Tasks Completed",
        data: tasks,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return <Bar data={data} />;
};

export default WeeklyProgress;
