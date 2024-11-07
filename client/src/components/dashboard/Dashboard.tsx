import React from "react";
import TodaysTasks from "./TodaysTasks";
import TodaysSleep from "./TodaysSleep";
import WeeklyProgress from "./WeeklyProgress";
import "./Dashboard.css";

const Dashboard = () => {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="dashboard-container">
      <h1>{today}</h1>
      <div className="dashboard-content">
        <div className="top-section">
          <TodaysTasks />
          <TodaysSleep />
        </div>
        <WeeklyProgress />
      </div>
    </div>
  );
};

export default Dashboard;
