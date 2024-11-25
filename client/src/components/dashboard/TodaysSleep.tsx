import React, { useState } from "react";
import "./TodaysSleep.css";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import ExpandIcon from "./ExpandIcon";
import { styled } from "@mui/material/styles";
import NightsStayIcon from '@mui/icons-material/NightsStay';
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined';
import { SleepSlider } from "./SleepSlider";

const marks = [
  { value: 4, label: '≤4h' },
  { value: 5, label: '5h' },
  { value: 6, label: '6h' },
  { value: 7, label: '7h' },
  { value: 8, label: '≥8h' },
];

type SleepData = {
  date: string; 
  sleep_time: number;
};

type TodaysSleepsProps = {
  sleeps: SleepData;
  addSleep: (sleepData: { date: string; sleep_time: number }) => void;
};

const TodaysSleep: React.FC = () => {
  const [sleepHours, setSleepHours] = useState<number>(6);
  const today = new Date();
  const weekday = today.toLocaleDateString("en-US", { weekday: "long" });

  const handleSleepChange = (event: Event, newValue: number | number[]) => {
    setSleepHours(newValue as number);
  };

  const moonColor = `rgba(0, 0, 128, ${(sleepHours - 4) / 4})`;

  return (
    <div className="sleep">
      <h3 className="sleep-header">
        {weekday} <ExpandIcon 
          content={
            <div className="popupContent">
              <h6 className="popup-question">About how many hours of sleep did you get last night?</h6>
              {/* Moon icon with dynamic color */}
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
            {/* Container for moon icons */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
                {/* Left moon icon */}
                <NightsStayIcon
                  style={{
                    fontSize: "20px",
                  }}
                />
                {/* Right moon icon */}
                <BedtimeOutlinedIcon
                  style={{
                    fontSize: "20px",
                  }}
                />
              </div>
            </div>
          }
        />
      </h3>
      <h6 className="popup-question">About how many hours of sleep did you get last night? Track your hours here!</h6>
      <div className="sleep-slider-container">
        {/* Moon icons */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          width: '100%',
          px: 1,
          mb: -1
        }}>
          <BedtimeOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <NightsStayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        </Box>
  
        {/* <SleepSlider
          value={sleepHours}
          onChange={handleSleepChange}
          step={0.5}
          marks={marks}
          min={4}
          max={8}
          valueLabelDisplay="off"
        /> */}
        {/* <small style={{ display: "block", textAlign: "center" }}>
          You slept {sleepHours} hours last night!
        </small>       */}
        {/* Moon icon */}
        <NightsStayIcon
          style={{
            color: moonColor, // Dynamic navy blue color based on sleep hours
            fontSize: "100px", // Adjust the size of the moon icon
            display: "block",
            margin: "0 auto", // Center the icon horizontally
          }}
        />
        </div>
    </div>
  );
};

export default TodaysSleep;