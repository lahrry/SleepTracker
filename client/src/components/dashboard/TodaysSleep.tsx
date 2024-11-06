// TodaysSleep.tsx
import React from "react";
import "./TodaysSleep.css";

const TodaysSleep: React.FC = () => {
  const today = new Date();
  const weekday = today.toLocaleDateString("en-US", { weekday: "long" });

  return <div className="weekday-display">{weekday}</div>;
};

export default TodaysSleep;
