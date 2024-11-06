import React from "react";
import TodaysTasks from "./TodaysTasks";
import TodaysSleep from "./TodaysSleep";
import WeeklyProgress from "./WeeklyProgress";
import "./Dashboard.css";

const Dashboard = () => {

  // Get today's date and format it
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="dashboard-container">
      <h1>{today}</h1> 
      <div className="dashboard-content">
        <div className="side-components">
          <TodaysTasks />
          <TodaysSleep />
        </div>
      </div>
      <WeeklyProgress />
    </div>
  );
};

export default Dashboard;
