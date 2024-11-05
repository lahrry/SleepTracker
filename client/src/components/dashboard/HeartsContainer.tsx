// HeartsContainer.tsx
import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "./HeartsContainer.css";

const HeartsContainer: React.FC = () => {
  return (
    <div className="hearts-container">
      <FavoriteIcon style={{ color: "red", fontSize: 40 }} />
      <FavoriteIcon style={{ color: "red", fontSize: 40 }} />
      <FavoriteIcon style={{ color: "red", fontSize: 40 }} />
    </div>
  );
};

export default HeartsContainer;
