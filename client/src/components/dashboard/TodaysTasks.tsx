import React, { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import axios from 'axios';
import './TodaysTasks.css';

type Task = {
  id: number;
  title: string;
  completed: boolean;
  time_work_on: number; // Represent time worked in seconds
};


const TodaysTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [timers, setTimers] = useState<Record<number, number | null>>({});
  const [liveTimes, setLiveTimes] = useState<Record<number, number>>({});

  // Fetch tasks from the server when the component loads
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/v1/tasks');
        const fetchedTasks = response.data;
  
        // Sort tasks so completed ones are at the bottom
        const sortedTasks = [...fetchedTasks].sort((a, b) => {
          if (a.completed === b.completed) return 0;
          return a.completed ? 1 : -1;
        });
  
        setTasks(sortedTasks);
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

  // Centralized task update function
  const updateTask = async (taskId: number, updatedFields: Partial<Task>) => {
    const task = tasks.find(task => task.id === taskId);
    if (!task) return;

    const updatedTask = { ...task, ...updatedFields }; // Merge existing data with updates
    try {
      await axios.put(`http://localhost:5001/api/v1/tasks/${taskId}`, updatedTask);
      setTasks(tasks.map(task =>
        task.id === taskId ? updatedTask : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Start/Stop timer for a task
  const handleStartStopTimer = (taskId: number) => {
    setTimers((prevTimers) => {
      const isRunning = prevTimers[taskId] !== null && prevTimers[taskId] !== undefined;
      const currentTime = Date.now();
  
      if (isRunning) {
        // Stop the timer and calculate elapsed time
        const startTime = prevTimers[taskId] || currentTime;
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
  
        const task = tasks.find(task => task.id === taskId);
        if (task) {
          const updatedTime = task.time_work_on + elapsedSeconds;
          updateTask(taskId, { time_work_on: updatedTime });
        }
  
        // Clear the live time
        setLiveTimes((prevLiveTimes) => ({ ...prevLiveTimes, [taskId]: 0 }));
  
        return { ...prevTimers, [taskId]: null };
      } else {
        // Start the timer
        return { ...prevTimers, [taskId]: currentTime };
      }
    });
  };
  

  // Update live display for timers
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTimes((prevLiveTimes) => {
        const updatedLiveTimes = { ...prevLiveTimes };
        Object.keys(timers).forEach((taskId) => {
          const id = parseInt(taskId);
          if (timers[id]) {
            const elapsedSeconds = Math.floor((Date.now() - (timers[id] || 0)) / 1000);
            updatedLiveTimes[id] = elapsedSeconds;
          }
        });
        return updatedLiveTimes;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timers]);

  // Delete a task
  const deleteTask = async (taskId: number) => {
    try {
      await axios.delete(`http://localhost:5001/api/v1/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

// Format time in seconds to a hh:mm:ss format
const formatTime = (seconds: number) => {
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${secs}`;
};


// Toggle task completion status and stop timer if completed
const toggleTaskCompletion = (taskId: number, currentStatus: boolean) => {
  if (!currentStatus) {
    // Task is being marked as completed; stop the timer
    setTimers((prevTimers) => ({ ...prevTimers, [taskId]: null }));
  }
  updateTask(taskId, { completed: !currentStatus });
};



return (
  <div>
    <h3>Today's Tasks</h3>

    {/* Task List */}
    <div className="task-list">
      {tasks.map((task) => {
        const liveTime = liveTimes[task.id] || 0;
        const totalTime = task.time_work_on + liveTime;

        return (
          <div key={task.id} className="task-item">
            <div className="task-details">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id, task.completed)}
                  />
                }
                label={task.title}
                className={`task-title ${task.completed ? 'completed' : ''}`}
              />
              <p className={`task-time ${task.completed ? 'completed' : ''}`}>
                {formatTime(totalTime)}
              </p>
            </div>
            <div className="task-actions">
              <IconButton
                onClick={() => handleStartStopTimer(task.id)}
                aria-label={timers[task.id] ? 'Stop Timer' : 'Start Timer'}
                disabled={task.completed}
              >
                {timers[task.id] ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <IconButton
                onClick={() => deleteTask(task.id)}
                aria-label="Delete Task"
                color="secondary"
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        );
      })}
    </div>

    {/* Input for Adding New Task */}
    <div className="add-task-form">
      <TextField
        label="New Task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        variant="outlined"
        size="small"
      />
      <Button onClick={addTask} variant="contained" color="primary">
        Add Task
      </Button>
    </div>
  </div>
);
};

export default TodaysTasks;