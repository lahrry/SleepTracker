import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "./WeeklyProgress.css";
import NightsStayIcon from "@mui/icons-material/NightsStay";

type WeeklyProgressProps = {
  tasks: number[];
  sleeps: number[];
  weekLabels: string[];
};

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({
  tasks,
  sleeps,
  weekLabels,
}) => {
  return (
    <div className="weekly-progress">
      <h3>Weekly Progress</h3>

      {/* Row 1 - Dates */}
      <div className="date-grid">
        {weekLabels.map((day, index) => (
          <div key={index} className="date-box">
            {day}
          </div>
        ))}
      </div>

      {/* Row 2 - Tasks */}
      <div className="weekly-grid">
        {tasks.map((taskCount, index) => (
          <div key={index} className="task-box">
            <div className="task-count">
              {taskCount > 12 ? (
                // Display "heart x (number)" if taskCount exceeds 12
                <span className="heart-summary">
                   <FavoriteIcon key={1} className="heart-icon" /> x {taskCount}
                </span>
              ) : (
                // Otherwise, render the hearts as icons
                Array.from({ length: taskCount || 0 }).map((_, i) => (
                  <FavoriteIcon key={i} className="heart-icon" />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Row 3 - Sleeps */}
      <div className="weekly-grid">
        {sleeps.map((sleepCount, index) => (
          <div key={index} className="sleep-box">
            <div className="sleep-count">
              <NightsStayIcon
                style={{
                  color: `rgba(0, 0, 128, ${Math.min(1, (sleepCount - 4) / 4)})`, // Darker color for higher counts
                  fontSize: "70px", // Adjust size for visibility
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyProgress;
