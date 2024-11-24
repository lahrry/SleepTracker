import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "./WeeklyProgress.css";

type WeeklyProgressProps = {
  tasks: number[];
  weekLabels: string[];
};

const DayBox: React.FC<{ day: string; tasks: number }> = ({ day, tasks }) => (
  <div className="day-box">
    <div className="task-count">
      {Array.from({ length: tasks || 0 }).map((_, index) => (
        <FavoriteIcon key={index} className="heart-icon" />
      ))}
    </div>
    <div className="day-header">{day}</div>
  </div>
);

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({
  tasks,
  weekLabels,
}) => {
  return (
    <div className="weekly-progress">
      <h3>Weekly Progress</h3>
      <div className="weekly-grid">
        {weekLabels.map((day, index) => (
          <DayBox key={index} day={day} tasks={tasks[index]} />
        ))}
      </div>
    </div>
  );
};

export default WeeklyProgress;
