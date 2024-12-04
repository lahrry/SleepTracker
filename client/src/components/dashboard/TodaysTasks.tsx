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
  import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
  import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
  import { subDays, addDays } from "date-fns";
  import { format } from "date-fns";
  import { TASKS_API_BASE_URL } from "../../constants/constants";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import "./TodaysTasks.css";
import axios from "axios";

  const getFormattedDate = (): string => {
    return format(new Date(), 'yyyy-MM-dd');
  };
  type Task = {
    id: number;
    title: string;
    completed: boolean; 
    time_work_on: number | null;
    assigned_date: string;
    
  };

  type TodaysTasksProps = {
    addTask: (title: string, assigned_date: string) => void;
    updateTask: (task: Task, assigned_date: string ) => void;
    deleteTask: (id: number, assigned_date: string) => void;
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  };


  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, '0'); // Ensure day is 2 digits

    return `${year}-${month}-${day}`;
  }

  const TodaysTasks: React.FC<TodaysTasksProps> = ({addTask, updateTask, deleteTask }) => {
    const [newTask, setNewTask] = useState("");
    const [tasks, setTasks] = useState<Task[]>([]); 
    const [error, setError] = useState("");
    const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
    const [duplicateTaskTitle, setDuplicateTaskTitle] = useState("");
    const [timers, setTimers] = useState<Record<number, number | null>>({});
    const [liveTimes, setLiveTimes] = useState<Record<number, number>>({});
    const [selectedDate, setSelectedDate] = useState(new Date());


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

    useEffect(() => {
      const formattedDate = format(selectedDate, "yyyy-MM-dd"); // Format date as "yyyy-MM-dd"
      // Fetch tasks for the selected date from the backend API
      axios.get(`${TASKS_API_BASE_URL}/date-tasks?date=${formattedDate}`)
        .then(response => {
          console.log("Fetched tasks:", response.data);
          console.log("selected date", selectedDate);
          console.log("formatted date", formattedDate);
          setTasks(response.data); // Set the tasks state using the API response
        })
        .catch((error) => {
          console.error("Error fetching tasks:", error);
        });
    }, [selectedDate, setTasks]); 


    const startStopTimer = (task: Task) => {
      if (task.completed) return; // Prevent starting timer for completed tasks

      const currentTime = Date.now();
      setTimers((prevTimers) => {
        if (prevTimers[task.id]) {
          // Timer is running, stop it and update the task's time_work_on
          const elapsedTime = Math.floor((currentTime - (prevTimers[task.id] || 0)) / 1000);
          const newTimeWorkOn = (task.time_work_on || 0) + elapsedTime;
          updateTask({ ...task, time_work_on: newTimeWorkOn }, task.assigned_date); // Update task
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

      addTask(newTask, formatDate(selectedDate));
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
      addTask(duplicateTaskTitle, formatDate(selectedDate)); // Add the duplicate task
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
        }, task.assigned_date);

        setLiveTimes((prevLiveTimes) => ({ ...prevLiveTimes, [task.id]: 0 })); // Clear live time
      } else {
        // Mark as incomplete
        updateTask({ ...task, completed: false }, task.assigned_date);
      }
    };

    //function to delete all completed tasks 
    const deleteCompletedTasks = () => {
      tasks.forEach((task)=> {
        if(task.completed){
          deleteTask(task.id, task.assigned_date);
        }
      });
    };

    const handleDateChange = (direction: "prev" | "next") => {
      setSelectedDate((prevDate) =>
        direction === "prev" ? subDays(prevDate, 1) : addDays(prevDate, 1)
      );
    };
    

    //check if theres at least one completed task 
    const hasCompletedTasks = tasks.some(task=>task.completed);

    return (
      <div>
        <div className="header-navigation">
          <h3 className="header-title"> 
          <IconButton onClick={() => handleDateChange("prev")} aria-label="Previous Day">
            <KeyboardArrowLeftIcon />
          </IconButton>
            Your Tasks For: 
          <IconButton onClick={() => handleDateChange("next")} aria-label="Next Day">
            <KeyboardArrowRightIcon />
          </IconButton>
          {format(selectedDate, "MMMM d, yyyy")}
          </h3>
        </div>
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
    backgroundColor: "#4caf50",
    color: "white",
    borderRadius: "5px",
    padding: "10px 20px",
    fontWeight: "bold",
    fontSize: "15.5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease"
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "green")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4caf50")}
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
              control={<Checkbox checked={!!task.completed} onChange={() => toggleTaskCompletion(task)} />}
              label={task.title}
            />
            <p className={`task-time ${task.completed ? "completed-time" : ""}`}>
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
              onClick={() => deleteTask(task.id, task.assigned_date)}
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