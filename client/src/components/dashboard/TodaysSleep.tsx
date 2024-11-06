// TodaysSleep.tsx
import React from "react";
import "./TodaysSleep.css";

const TodaysSleep: React.FC = () => {
  const today = new Date();
  const weekday = today.toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="sleep">
      <h3>{ weekday}</h3>
    </div>
  )
};

export default TodaysSleep;
