// TodaysTasks.tsx
<<<<<<< Updated upstream
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
=======
import React, { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import './TodaysTasks.css';

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

const TodaysTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  // Fetch tasks from the server when the component loads
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/v1/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  // Add a new task
  const addTask = async () => {
    if (!newTask.trim()) return; // Avoid adding empty tasks

    try {
      const response = await axios.post('http://localhost:5001/api/v1/tasks', { title: newTask });
      setTasks([...tasks, response.data]);
      setNewTask(''); // Clear the input after adding
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = async (taskId: number, currentStatus: boolean) => {
    try {
      await axios.put(`http://localhost:5001/api/v1/tasks/${taskId}`, {
        completed: !currentStatus,
      });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, completed: !currentStatus } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Delete a task
  const deleteTask = async (taskId: number) => {
    try {
      await axios.delete(`http://localhost:5001/api/v1/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div>
      <h3>Today's Tasks</h3>
      
      {/* Task List */}
      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} style={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id, task.completed)}
                />
              }
              label={task.title}
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? '#777' : 'inherit',
              }}
            />
            <IconButton
              onClick={() => deleteTask(task.id)}
              aria-label="delete"
              color="secondary"
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
      </div>

      {/* Input for Adding New Task */}
      <div className="add-task-form" style={{ marginTop: '20px' }}>
        <TextField
          label="New Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          variant="outlined"
          size="small"
        />
        <Button onClick={addTask} variant="contained" color="primary" style={{ marginLeft: '10px' }}>
          Add Task
        </Button>
      </div>
>>>>>>> Stashed changes
    </div>
  );
};

export default TodaysTasks;
