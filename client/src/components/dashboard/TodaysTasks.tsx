import React, { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
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
  //state for error message:
  const [error, setError] = useState('');
  //state for duplicte confirmation dialog 
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen]=useState(false);
  //stopped here

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
    if (!newTask.trim()) {
      setError('Task cannot be empty');
      return;
    }

    // Check for duplicate
    const duplicateTask = tasks.find(task => task.title.toLowerCase() === newTask.toLowerCase());
    if (duplicateTask) {
      setIsDuplicateDialogOpen(true); // Show confirmation dialog if duplicate is found
      return;
    }

    // No duplicate, proceed to add task
    await addTaskToServer();
  };
  const addTaskToServer = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/v1/tasks', { title: newTask });
      setTasks([...tasks, response.data]);
      setNewTask(''); // Clear the input after adding
      setError(''); // Clear any previous error message
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Confirm adding duplicate task
  const handleConfirmAddDuplicate = async () => {
    setIsDuplicateDialogOpen(false); // Close the duplicate dialog
    await addTaskToServer(); // Proceed to add the duplicate task
  };

  // Cancel adding duplicate task
  const handleCancelAddDuplicate = () => {
    setIsDuplicateDialogOpen(false); // Just close the dialog without adding the task
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
      
      {/* Display Error Message */}
      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}
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
      {/* Duplicate Confirmation Dialog */}
      <Dialog
        open={isDuplicateDialogOpen}
        onClose={handleCancelAddDuplicate}
      >
        <DialogTitle>Duplicate Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This task already exists. Are you sure you want to add it?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAddDuplicate} color="secondary">
            No
          </Button>
          <Button onClick={handleConfirmAddDuplicate} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TodaysTasks;
