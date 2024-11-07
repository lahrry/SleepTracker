// TodaysTasks.tsx
import React, { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import "./TodaysTasks.css";

// Define an array of dummy tasks
const dummyTasks = [
  { id: 1, label: "Walk the dog" },
  { id: 2, label: "Complete homework" },
  { id: 3, label: "Grocery shopping" },
  { id: 4, label: "Prepare dinner" },
];

const TodaysTasks: React.FC = () => {
  // State to track the checked status of each task
  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({});

  // Handle checkbox change and update state
  const handleCheckboxChange = (id: number) => {
    setCheckedTasks((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Toggle the checked state
    }));
  };

  // Render a task with checkbox and label styling
  const renderTask = (task: { id: number; label: string }) => (
    <FormControlLabel
      key={task.id}
      control={
        <Checkbox
          checked={!!checkedTasks[task.id]}
          onChange={() => handleCheckboxChange(task.id)}
          sx={{
            color: "#a7cfe7", // unchecked color
            "&.Mui-checked": {
              color: "#4CAF50", // checked color
            },
          }}
        />
      }
      label={task.label}
      sx={{
        textDecoration: checkedTasks[task.id] ? "line-through" : "none",
        fontFamily: "Arial, sans-serif",
        fontSize: "1rem",
        color: checkedTasks[task.id] ? "#777" : "#000", // text color if checked
      }}
    />
  );

  return (
    <div className="tasks">
      <h3>Today's Tasks</h3>
      {dummyTasks.map(renderTask)}
    </div>
  );
};

export default TodaysTasks;
