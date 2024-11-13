import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MyBarChart: React.FC = () => {
  const [completedTasksData, setCompletedTasksData] = useState<number[]>([]);
  const [weekLabels, setWeekLabels] = useState<string[]>([]);

  useEffect(() => {
    // Function to get the last 7 days including today
    const getLastWeekDates = () => {
      const labels = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        labels.push(date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }));
      }
      setWeekLabels(labels);
    };

    const fetchCompletedTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/v1/tasks/completed-last-week");
        const taskCounts = response.data.map((day: { count: number }) => day.count);
        setCompletedTasksData(taskCounts);
      } catch (error) {
        console.error("Error fetching completed tasks data:", error);
      }
    };

    getLastWeekDates();
    fetchCompletedTasks();
  }, []);

  const data = {
    labels: weekLabels,
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

