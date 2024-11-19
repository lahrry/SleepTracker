import { useRef } from "react";
import "./Dashboard.css";
import TodaysSleep from "./TodaysSleep";
import TodaysTasks from "./TodaysTasks";
import WeeklyProgress from "./WeeklyProgress";

// Define Task type
type Task = {
  id: number;
  title: string;
  completed: boolean;
};

const Dashboard = () => {
  const sleepRef = useRef<{ addTask: (task: Task) => void }>(null);

  const addTaskToSleepBox = (task: Task) => {
    if (sleepRef.current) {
      sleepRef.current.addTask(task);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Today's Date</h1>
      <div className="dashboard-content">
        <div className="top-section">
          <TodaysTasks addTaskToSleepBox={addTaskToSleepBox} />
          <TodaysSleep ref={sleepRef} />
        </div>
        <WeeklyProgress />
      </div>
    </div>
  );
};

export default Dashboard;
