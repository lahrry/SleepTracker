  import DeleteIcon from "@mui/icons-material/Delete";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import "./TodaysTasks.css";

  type Task = {
    id: number;
    title: string;
    completed: boolean; 
    time_work_on: number | null;
  };

  type TodaysTasksProps = {
    tasks: Task[];
    addTask: (title: string) => void;
    updateTask: (task: Task) => void;
    deleteTask: (id: number) => void;
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  };


  const TodaysTasks: React.FC<TodaysTasksProps> = ({ tasks, addTask, updateTask, deleteTask }) => {
    const [newTask, setNewTask] = useState("");
    const [error, setError] = useState("");
    const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
    const [duplicateTaskTitle, setDuplicateTaskTitle] = useState("");
    const [timers, setTimers] = useState<Record<number, number | null>>({});
    const [liveTimes, setLiveTimes] = useState<Record<number, number>>({});

    useEffect(() => {
      // Update the timer every second
      const interval = setInterval(() => {
        setLiveTimes((prevLiveTimes) => {
          const updatedLiveTimes = { ...prevLiveTimes };
          Object.keys(timers).forEach((taskId) => {
            if (timers[Number(taskId)]) {
              const elapsedTime = Math.floor((Date.now() - (timers[Number(taskId)] || 0)) / 1000);
              updatedLiveTimes[Number(taskId)] = elapsedTime;
            }
          });
          return updatedLiveTimes;
        });
      }, 1000);

      return () => clearInterval(interval); // Cleanup the interval on unmount
    }, [timers]);

    const startStopTimer = (task: Task) => {
      if (task.completed) return; // Prevent starting timer for completed tasks

      const currentTime = Date.now();
      setTimers((prevTimers) => {
        if (prevTimers[task.id]) {
          // Timer is running, stop it and update the task's time_work_on
          const elapsedTime = Math.floor((currentTime - (prevTimers[task.id] || 0)) / 1000);
          const newTimeWorkOn = (task.time_work_on || 0) + elapsedTime;
          updateTask({ ...task, time_work_on: newTimeWorkOn }); // Update task
          setLiveTimes((prevLiveTimes) => ({ ...prevLiveTimes, [task.id]: 0 })); // Reset live time
          return { ...prevTimers, [task.id]: null }; // Stop the timer
        } else {
          // Timer is not running, start it
          return { ...prevTimers, [task.id]: currentTime };
        }
      });
    };

    const formatTime = (seconds: number | null) => {
      const secs = seconds || 0;
      const hours = String(Math.floor(secs / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
      const secsFormatted = String(secs % 60).padStart(2, "0");
      return `${hours}:${minutes}:${secsFormatted}`;
    };

    const handleAddTask = () => {
      if (!newTask.trim()) {
        setError("Task cannot be empty");
        return;
      }

      const duplicateTask = tasks.find(
        (task) => task.title.toLowerCase() === newTask.toLowerCase()
      );

      if (duplicateTask) {
        setDuplicateTaskTitle(newTask);
        setIsDuplicateDialogOpen(true); // Open the duplicate confirmation dialog
        return;
      }

      addTask(newTask);
      setNewTask("");
      setError("");
    };

    //handle enter
    const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key=="Enter"){
        handleAddTask();
      }
    };

    // Confirm adding duplicate task
    const handleConfirmAddDuplicate = async () => {
      setIsDuplicateDialogOpen(false); // Close the duplicate dialog
      addTask(duplicateTaskTitle); // Add the duplicate task
      setNewTask(""); // Clear the input
      setDuplicateTaskTitle(""); // Reset duplicate task title
    };

    // Cancel adding duplicate task
    const handleCancelAddDuplicate = () => {
      setIsDuplicateDialogOpen(false); // Close the duplicate dialog without adding
      setDuplicateTaskTitle(""); // Reset duplicate task title
    };

    const toggleTaskCompletion = (task: Task) => {
      const liveTime = liveTimes[task.id] || 0; // Get the live time
      if (!task.completed) {
        // Mark as completed, stop the timer
        if (timers[task.id]) {
          startStopTimer(task); // Stop the timer
        }

        const updatedTimeWorkOn = (task.time_work_on || 0) + liveTime;

        updateTask({
          ...task,
          completed: true, // Mark as completed
          time_work_on: updatedTimeWorkOn, // Add liveTime to time_work_on
        });

        setLiveTimes((prevLiveTimes) => ({ ...prevLiveTimes, [task.id]: 0 })); // Clear live time
      } else {
        // Mark as incomplete
        updateTask({ ...task, completed: false });
      }
    };

    //function to delete all completed tasks 
    const deleteCompletedTasks = () => {
      tasks.forEach((task)=> {
        if(task.completed){
          deleteTask(task.id);
        }
      });
    };

    //check if theres at least one completed task 
    const hasCompletedTasks = tasks.some(task=>task.completed);

    return (
      <div>
        <h3>Today's Tasks</h3>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="New Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{marginBottom: "20px"}}
        />
        <Button 
  onClick={handleAddTask}
  style={{
    marginTop: "5px",
    marginLeft: "10px",
    backgroundColor: "#7578A4",
    color: "white",
    borderRadius: "5px",
    padding: "10px 20px",
    fontWeight: "bold",
    fontSize: "15.5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease"
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "purple")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#7578A4")}
>
  Add Task
</Button>

        {tasks.length>0 &&(
          <div className="task-list">
          {tasks.map((task) => {
            const liveTime = liveTimes[task.id] || 0;
            const totalTime = (task.time_work_on || 0) + liveTime;

            return (
              <div key={task.id} className="task-item">
                <div className="task-details">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!task.completed}
                        onChange={() => toggleTaskCompletion(task)}
                      />
                    }
                    label={task.title}
                  />
                  <p
                    className={`task-time ${task.completed ? "completed-time" : ""}`}
                  >
                    {formatTime(totalTime)}
                  </p>
                </div>
                <div className="task-actions">
                  <IconButton
                    onClick={() => startStopTimer(task)}
                    aria-label="Timer"
                    disabled={!!task.completed} // Disable timer controls for completed tasks
                  >
                    {timers[task.id] ? <PauseIcon /> : <PlayArrowIcon />}
                  </IconButton>
                  <IconButton
                    onClick={() => deleteTask(task.id)}
                    aria-label="Delete"
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
            );
          })}
        </div>
        )}

        
        {/* delete completed tasks button*/}
        {hasCompletedTasks && (
        <Button
          onClick={deleteCompletedTasks}
          style={{ marginTop: "20px", backgroundColor: "white", color: "light blue" }}
        >
          Delete All Completed Tasks
        </Button>
      )}

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