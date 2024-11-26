import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TodaysSleep.css";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import ExpandIcon from "./ExpandIcon";
import NightsStayIcon from '@mui/icons-material/NightsStay';
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined';
import { SleepSlider } from "./SleepSlider";

const marks = [
  { value: 4, label: '≤4h' },
  { value: 5, label: '5h' },
  { value: 6, label: '6h' },
  { value: 7, label: '7h' },
  { value: 8, label: '8h' },
  { value: 9, label: '≥9h' }
];

const TodaysSleep: React.FC = () => {
  const [sleepHours, setSleepHours] = useState<number>(6);
  const [todaySleep, setTodaySleep] = useState<{ date: string; sleep_time: number } | null>(null);
  const today = new Date();
  const weekday = today.toLocaleDateString("en-US", { weekday: "long" });

  // Fetch today's sleep data on component mount
  useEffect(() => {
    const fetchTodaySleep = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/v1/sleep/today");
        setTodaySleep(response.data);
        setSleepHours(response.data.sleep_time || 6);
      } catch (error) {
        console.error('Error fetching todays sleep data', error);
      }
    };

    fetchTodaySleep();
  }, []);

  const handleSleepChange = async (event: Event, newValue: number | number[]) => {
    const newSleepHours = newValue as number;
    setSleepHours(newSleepHours);

    try {
      // Convert hours to minutes for backend
      const sleepMinutes = newSleepHours * 60;
      
      // If there's an existing record, update it
      if (todaySleep) {
        const response = await axios.put("http://localhost:5001/api/v1/sleep", { 
          sleep_time: sleepMinutes 
        });
        setTodaySleep(response.data);
      } else {
        // If no record exists, create a new one
        const response = await axios.post("http://localhost:5001/api/v1/sleep", { 
          sleep_time: sleepMinutes 
        });
        setTodaySleep(response.data);
      }
    } catch (error) {
      console.error('Error updating sleep data', error);
    }
  };

  const moonColor = `rgba(0, 0, 128, ${(sleepHours - 4) / 4})`;

  return (
    <div className="sleep">
      <h3 className="sleep-header">
        {weekday} 
        <ExpandIcon 
          content={
            <div className="popupContent">
              <h6 className="popup-question">About how many hours of sleep did you get last night?</h6>
              <NightsStayIcon
                style={{
                  color: moonColor,
                  fontSize: "70px",
                  display: "block",
                  margin: "0 auto 16px",
                }}
              />
              <SleepSlider
                value={sleepHours}
                onChange={handleSleepChange}
                step={0.5}
                marks={marks}
                min={4}
                max={8}
                valueLabelDisplay="off"
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
                <NightsStayIcon
                  data-testid='left-moon-icon'
                  style={{
                    fontSize: "20px",
                  }}
                />
                <BedtimeOutlinedIcon
                  data-testid='right-moon-icon'
                  style={{
                    fontSize: "20px",
                  }}
                />
              </div>
              <small style={{ display: "block", textAlign: "center"}}>
                You slept {sleepHours} hours last night!
              </small>  
            </div>
          }
        />
      </h3>
      <h6 className="popup-question">About how many hours of sleep did you get last night? Track your hours here!</h6>
      <div className="sleep-slider-container">
        <NightsStayIcon
          style={{
            color: moonColor,
            fontSize: "100px",
            display: "block",
            margin: "0 auto",
          }}
        />
      </div>
    </div>
  );
};

export default TodaysSleep;