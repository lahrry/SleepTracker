import React from "react";
import TodaysTasks from "./TodaysTasks";
import TodaysSleep from "./TodaysSleep";
import HeartContainer from "./HeartsContainer";
import WeeklyProgress from "./WeeklyProgress";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>November 4, 2024</h1>
      <div className="dashboard-content">
        <div className="side-components">
          <TodaysTasks />
          <TodaysSleep />
        </div>
      </div>
      <WeeklyProgress />{" "}
    </div>
  );
};

export default Dashboard;
