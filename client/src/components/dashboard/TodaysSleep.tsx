import { forwardRef, useImperativeHandle, useState } from "react";
import ExpandIcon from "./ExpandIcon";
import "./TodaysSleep.css";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

const TodaysSleep = forwardRef((_, ref) => {
  const today = new Date();
  const weekday = today.toLocaleDateString("en-US", { weekday: "long" });
  const [tasks, setTasks] = useState<Task[]>([]);

  const toggleTaskCompletion = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Expose `addTask` method to parent via ref
  useImperativeHandle(ref, () => ({
    addTask: (task: Task) => {
      setTasks((prevTasks) => [...prevTasks, task]);
    },
  }));

  return (
    <div className="sleep">
      <h3 className="sleep-header">
        {weekday} <ExpandIcon content="Sleep Popup Here" />
      </h3>
      <div className="task-container">
        {tasks.length === 0 && <p>No tasks for today.</p>}
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default TodaysSleep;
