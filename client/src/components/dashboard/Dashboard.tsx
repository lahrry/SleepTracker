import React from "react";
import TodaysTasks from "./Tasks";
import Weekday from "./WeekdayDisplay";
import HeartContainer from "./HeartsContainer";
import WeeklyProgress from "./WeeklyProgress";
import "./Dashboard.css"

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>November 4, 2024</h1>
      <div className="dashboard-content">
        <HeartContainer />
        <div className="side-components">
          <TodaysTasks />
          <Weekday />
        </div>
      </div>
      <WeeklyProgress />
    </div>
  );
};

export default Dashboard;
