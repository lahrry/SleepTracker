// MyBarChart.tsx
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MyBarChart: React.FC = () => {
  const [completedTasksData, setCompletedTasksData] = useState<number[]>([]);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/v1/tasks/completed-last-week");
        // Extract the count of tasks for each day from the response
        const taskCounts = response.data.map((day: { count: number }) => day.count);
        setCompletedTasksData(taskCounts);
      } catch (error) {
        console.error("Error fetching completed tasks data:", error);
      }
    };

    fetchCompletedTasks();
  }, []);

  const data = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [
      {
        label: "Tasks Completed",
        data: completedTasksData,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return <Bar data={data} />;
};

export default MyBarChart;

