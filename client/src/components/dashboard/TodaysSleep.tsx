import React, { useState } from "react";
import "./TodaysSleep.css";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import ExpandIcon from "./ExpandIcon";
import { styled } from "@mui/material/styles";
import NightsStayIcon from '@mui/icons-material/NightsStay';
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined';

// Custom styled slider
const SleepSlider = styled(Slider)(({ theme }) => ({
  color: '#9333EA',
  height: 8,
  padding: '15px 0',
  '& .MuiSlider-track': {
    border: 'none',
    backgroundColor: '#9333EA',
  },
  '& .MuiSlider-rail': {
    backgroundColor: '#E9D5FF',
  },
  '& .MuiSlider-thumb': {
    height: 16,
    width: 16,
    backgroundColor: '#7E22CE',
    border: '2px solid white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
  },
  '& .MuiSlider-markLabel': {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    marginTop: '8px',
  },
  '& .MuiSlider-mark': {
    display: 'none',
  },
}));

const marks = [
  { value: 4, label: '≤4h' },
  { value: 5, label: '5h' },
  { value: 6, label: '6h' },
  { value: 7, label: '7h' },
  { value: 8, label: '≥8h' },
];

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
        {weekday} <ExpandIcon content="Sleep Popup Here" />
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
      </div>
    </div>
  );
};

export default TodaysSleep;