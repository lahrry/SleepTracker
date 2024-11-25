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

  return (
    <div className="sleep">
      <h3 className="sleep-header">
        {weekday} <ExpandIcon 
          content={
            <div className="popup-box">
              <h6 className="popup-question">About how many hours of sleep did you get last night?</h6>
              <SleepSlider
                value={sleepHours}
                onChange={handleSleepChange}
                step={0.5}
                marks={marks}
                min={4}
                max={8}
                valueLabelDisplay="off"
              />
            </div>
          }
        />
      </h3>
      <h6>About how many hours of sleep did you get last night?</h6>
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
        
        <SleepSlider
          value={sleepHours}
          onChange={handleSleepChange}
          step={0.5}
          marks={marks}
          min={4}
          max={8}
          valueLabelDisplay="off"
        />
        <small style={{ display: "block", textAlign: "center" }}>
          You slept {sleepHours} hours last night!
        </small>      
        </div>
    </div>
  );
};

export default TodaysSleep;