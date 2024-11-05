// SleepInput.tsx
import React from "react";

const SleepInput: React.FC = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return <h2>{formattedDate}</h2>;
};

export default SleepInput;
