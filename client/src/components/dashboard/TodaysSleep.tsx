import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TodaysSleep.css";
import Slider from "@mui/material/Slider";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";
import ExpandIcon from "./ExpandIcon";
import { SleepSlider } from "./SleepSlider";

const marks = [
  { value: 4, label: "≤4h" },
  { value: 5, label: "5h" },
  { value: 6, label: "6h" },
  { value: 7, label: "7h" },
  { value: 8, label: "8h" },
  { value: 9, label: "≥9h" },
];

const TodaysSleep = ({
  todaySleep = null,
  setSleep = () => {},
}: {
  todaySleep?: { date: string; sleep_time: number } | null;
  setSleep?: (sleepData: { date: string; sleep_time: number }) => void;
}) => {
  const [sleepHours, setSleepHours] = useState<number>(6);

  useEffect(() => {
    if (todaySleep) {
      setSleepHours(todaySleep.sleep_time || 6);
    }
  }, [todaySleep]);

  const handleSleepChange = (event: Event, newValue: number | number[]) => {
    const newSleepHours = newValue as number;
    setSleepHours(newSleepHours);
    const today = new Date().toISOString().split("T")[0];
    setSleep({ date: today, sleep_time: newSleepHours });
  };

  const moonColor = `rgba(0, 0, 128, ${(sleepHours - 4) / 4})`;

  return (
    <div className="sleep">
      <h3 className="sleep-header">
        How did you sleep last night?
        <ExpandIcon
          content={
            <div className="popupContent">
              <h6 className="popup-question">
                About how many hours of sleep did you get last night?
              </h6>
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "16px",
                }}
              >
                <NightsStayIcon
                  data-testid="left-moon-icon"
                  style={{
                    fontSize: "20px",
                  }}
                />
                <BedtimeOutlinedIcon
                  data-testid="right-moon-icon"
                  style={{
                    fontSize: "20px",
                  }}
                />
              </div>
              <small style={{ textAlign: "center", display: "block" }}>
                {sleepHours === 4
                  ? "You slept less than 4 hours last night!"
                  : sleepHours === 9
                  ? "You slept more than 9 hours last night!"
                  : `You slept ${sleepHours} hours last night!`}
              </small>
            </div>
          }
        />
      </h3>
      <h6 className="popup-question">Track your hours of sleep here!</h6>
      <div className="sleep-slider-container">
        <NightsStayIcon
          style={{
            color: moonColor,
            fontSize: "250px",
            display: "block",
            margin: "0 auto",
          }}
        />
      </div>
    
      <small style={{ textAlign: "center", display: "block" }}>
        {sleepHours === 4
          ? "You slept less than 4 hours last night!"
          : sleepHours === 9
          ? "You slept more than 9 hours last night!"
          : `You slept ${sleepHours} hours last night!`}
      </small>
    </div>
  );
};

export default TodaysSleep;
