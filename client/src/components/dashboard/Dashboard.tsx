import React, { useEffect, useState } from "react";
import axios from "axios";
import TodaysTasks from "./TodaysTasks";
import TodaysSleep from "./TodaysSleep";
import WeeklyProgress from "./WeeklyProgress";
import "./Dashboard.css";

type Task = {
  id: number;
  title: string;
  completed: boolean;
  time_work_on: number | null;
};

type SleepData = {
  date: string; 
  sleep_time: number;
};

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasksData, setCompletedTasksData] = useState<number[]>([]);

  const [todaySleep, setTodaySleep] = useState<SleepData>();
  const [weeklySleep, setWeeklySleep] = useState<number[]>([]);

  const [weekLabels, setWeekLabels] = useState<string[]>([]);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {

        // Fetch today's taks data
        const todayTasksResponse = await axios.get("http://localhost:5001/api/v1/tasks");
        setTasks(todayTasksResponse.data);

        // Fetch completed task counts
        const weeklyCompletedResponse = await axios.get("http://localhost:5001/api/v1/tasks/completed-last-week");
        const taskCounts = weeklyCompletedResponse.data.map((day: { count: number }) => day.count);
        setCompletedTasksData(taskCounts);

        // Fetch today's sleep data
        const todaySleepResponse = await axios.get("http://localhost:5001/api/v1/sleep/today");
        console.log("They said they slept " , todaySleepResponse.data);
        setTodaySleep(todaySleepResponse.data);

        // Fetch weekly sleep data
        const weeklySleepResponse = await axios.get("http://localhost:5001/api/v1/sleep/slept-past-week");
        const sleepCounts = weeklySleepResponse.data.map((day: { count: number }) => day.count);
        setWeeklySleep(sleepCounts);

        // Generate week labels
        const labels: string[] = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          labels.push(
            date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })
          );
        }
        setWeekLabels(labels);


        console.log(taskCounts)
        console.log(sleepCounts)
     
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const addTask = async (title: string) => {
    try {
      const response = await axios.post("http://localhost:5001/api/v1/tasks", { title });
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async (updatedTask: Task) => {
    try {
      await axios.put(`http://localhost:5001/api/v1/tasks/${updatedTask.id}`, updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? { ...updatedTask } : task
        )
      );

      // Re-fetch completed tasks data for the graph
      const completedResponse = await axios.get(
        "http://localhost:5001/api/v1/tasks/completed-last-week"
      );
      const taskCounts = completedResponse.data.map((day: { count: number }) => day.count);
      setCompletedTasksData(taskCounts);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5001/api/v1/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

      // Re-fetch completed tasks data for the graph
      const completedResponse = await axios.get(
        "http://localhost:5001/api/v1/tasks/completed-last-week"
      );
      const taskCounts = completedResponse.data.map((day: { count: number }) => day.count);
      setCompletedTasksData(taskCounts);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };


  const setSleep = async (sleepData: { date: string; sleep_time: number }) => {
    try {
      console.log("Sending sleep data:", sleepData);

      // Send a PUT request to update or insert today's sleep data
      await axios.put("http://localhost:5001/api/v1/sleep", sleepData);

      // Update the client-side state with the updated sleep data
      setTodaySleep(sleepData);

      // Re-fetch weekly sleep data
      const weeklySleepResponse = await axios.get("http://localhost:5001/api/v1/sleep/slept-past-week");
      setWeeklySleep(
        weeklySleepResponse.data.map((day: { day: string; sleepRecord: SleepData }) => day.sleepRecord)
      );
    } catch (error) {
      console.error("Error updating sleep data:", error);
    }
  };

  //delete these later
  const [sleepHours, setSleepHours] = useState<number>(0);
  const handleSetSleep = () => {
    const today = new Date().toISOString().split("T")[0];
    setSleep({ date: today, sleep_time: sleepHours });
  };


  return (
    <div className="dashboard-container">
      <h1>{today}</h1>
      <div className="dashboard-content">
        <div className="top-section">
          <TodaysTasks
            tasks={tasks}
            addTask={addTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
            setTasks={setTasks}
          />
          <TodaysSleep 
            // todaySleep={todaySleep}    
            // setSleep={setSleep} 
          />
        </div>
        <div>

        {/* delete this later, temp
          <input
            type="number"
            value={sleepHours}
            onChange={(e) => setSleepHours(Number(e.target.value))}
            placeholder="Hours slept"
          />
          <button onClick={handleSetSleep}>Set Sleep</button> */}
        </div>
        <WeeklyProgress 
         tasks={completedTasksData}
         weekLabels={weekLabels} 
          />
      </div>
    </div>
  );
};

export default Dashboard;
