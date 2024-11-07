// TodaysTasks.tsx
import React, { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import "./TodaysTasks.css";
import ExpandIcon from "./ExpandIcon";  

const dummyTasks = [
  { id: 1, label: "CSE 110" },
  { id: 2, label: "NANO 111" },
  { id: 3, label: "SYN 100" },
  { id: 4, label: "Lab Work" },
];

const TodaysTasks: React.FC = () => {
  // To show checked status of each task
  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({});

  // To handle checkbox change and update state
  const handleCheckboxChange = (id: number) => {
    setCheckedTasks((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Toggles between checked and unchecked
    }));
  };

  // To render the checkbox and the styling of the checkbox
  const renderTask = (task: { id: number; label: string }) => (
    <FormControlLabel
      key={task.id}
      control={
        <Checkbox
          checked={!!checkedTasks[task.id]}
          onChange={() => handleCheckboxChange(task.id)}
          sx={{
            color: "#a7cfe7", // Unchecked color
            "&.Mui-checked": {
              color: "#4CAF50", // Checked color
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
      <h3 className="tasks-header">
        Today's Tasks
        <ExpandIcon content="Today Task Popup here" />
      </h3>
      {dummyTasks.map(renderTask)}
    </div>
  );
};

export default TodaysTasks;
