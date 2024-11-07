import React from "react";
import "./TodaysSleep.css";
import ExpandIcon from "./ExpandIcon";  


const TodaysSleep: React.FC = () => {
  const today = new Date();
  const weekday = today.toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="sleep">
      <h3 className="sleep-header">
        {weekday} <ExpandIcon content="Sleep Popup Here" />
      </h3>
    </div>
  );
};

export default TodaysSleep;
