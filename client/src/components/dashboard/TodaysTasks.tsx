import React, { useState } from "react";
import "./TodaysTasks.css";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

type TodaysTasksProps = {
  addTaskToSleepBox: (task: Task) => void;
};

const TodaysTasks: React.FC<TodaysTasksProps> = ({ addTaskToSleepBox }) => {
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now(),
      title: newTask,
      completed: false,
    };

    addTaskToSleepBox(task);
    setNewTask("");
  };

  return (
    <div>
      <h3>Today's Tasks</h3>
      <div className="add-task-form">
        <input
          type="text"
          placeholder="New Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
    </div>
  );
};

export default TodaysTasks;
