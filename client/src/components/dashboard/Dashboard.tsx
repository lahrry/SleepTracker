import React, { useEffect, useState } from "react";
import axios from "axios";
import TodaysTasks from "./TodaysTasks";
import TodaysSleep from "./TodaysSleep";
import WeeklyProgress from "./WeeklyProgress";
import "./Dashboard.css";
import { SLEEP_API_BASE_URL, TASKS_API_BASE_URL } from "../../constants/constants";
import { format } from 'date-fns';

const getTodayDate = () => {
  const today = new Date();
  return format(today, 'yyyy-MM-dd'); // This formats the date to YYYY-MM-DD
};

type Task = {
  id: number;
  title: string;
  completed: boolean;
  time_work_on: number | null;
  assigned_date: string;
};

type SleepData = {
  date: string; 
  sleep_time: number;
};

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasksData, setCompletedTasksData] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());  // Add selectedDate state
  const [todaySleep, setTodaySleep] = useState<SleepData>();
  const [weeklySleep, setWeeklySleep] = useState<number[]>([]);
  const [weekLabels, setWeekLabels] = useState<string[]>([]);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    weekday: "long",
    day: "numeric",
  });

  

  useEffect(() => {
    const fetchData = async () => {
      try {

        // Fetch today's task data
        const todayDate = getTodayDate();
        const todayTasksResponse = await axios.get(`${TASKS_API_BASE_URL}/date-tasks?date=${todayDate}`);
        console.log("fetched entries ", todayTasksResponse.data);
        setTasks(todayTasksResponse.data);

        // Fetch completed task counts
        const weeklyCompletedResponse = await axios.get(`${TASKS_API_BASE_URL}/completed-last-week`);
        const taskCounts = weeklyCompletedResponse.data.map((day: { count: number }) => day.count);
        setCompletedTasksData(taskCounts);

        // Fetch today's sleep data
        const todaySleepResponse = await axios.get(`${SLEEP_API_BASE_URL}/today`);
        console.log("They said they slept " , todaySleepResponse.data);
        setTodaySleep(todaySleepResponse.data);

        // Fetch weekly sleep data
        const weeklySleepResponse = await axios.get(`${SLEEP_API_BASE_URL}/slept-past-week`);
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

  const addTask = async (title: string, assigned_date:string) => {
    try {
      console.log("putting in for the date ", assigned_date)
      const response = await axios.post(`${TASKS_API_BASE_URL}/${assigned_date}`, { title });
      setTasks([...tasks, response.data]);
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const updatedTasksResponse = await axios.get(`${TASKS_API_BASE_URL}/date-tasks?date=${formattedDate}`);
      setTasks(updatedTasksResponse.data)
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async (updatedTask: Task, assigned_date: string) => {
    try {
      await axios.put(`${TASKS_API_BASE_URL}/${updatedTask.id}/${assigned_date}`, updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? { ...updatedTask } : task
        )
      );

      // Re-fetch completed tasks data for the graph
      const completedResponse = await axios.get(
        `${TASKS_API_BASE_URL}/completed-last-week`
      );
      const taskCounts = completedResponse.data.map((day: { count: number }) => day.count);
      setCompletedTasksData(taskCounts);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id: number, assigned_date : string) => {
    try {
      await axios.delete(`${TASKS_API_BASE_URL}/${id}/${assigned_date}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

      // Re-fetch completed tasks data for the graph
      const completedResponse = await axios.get(
        `${TASKS_API_BASE_URL}/completed-last-week`
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

      // Update today's sleep data
      await axios.put(`${SLEEP_API_BASE_URL}`, sleepData);
      setTodaySleep(sleepData);

      // Re-fetch weekly sleep data to ensure it is live updated
      const weeklySleepResponse = await axios.get(`${SLEEP_API_BASE_URL}/slept-past-week`);
      const sleepCounts = weeklySleepResponse.data.map((day: { count: number }) => day.count);
      setWeeklySleep(sleepCounts);
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
            addTask={addTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
            setTasks={setTasks}  
          />
          <TodaysSleep 
            todaySleep={todaySleep || null} 
            setSleep={setSleep} 
          />
        </div>
     
        <WeeklyProgress 
         tasks={completedTasksData}
         sleeps={weeklySleep}
         weekLabels={weekLabels} 
          />
      </div>
    </div>
  );
};

export default Dashboard;
