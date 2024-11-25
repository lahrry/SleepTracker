import React, { useState } from "react";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import Popup from "./DummyPopup";
import "./ExpandIcon.css";

interface ExpandIconProps {
  content: React.ReactNode; 
  className?: string;       
  onClick?: () => void;     
}

const ExpandIcon: React.FC<ExpandIconProps> = ({ content, className, onClick }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
    if (onClick){
      onClick(); // Trigger any additional onClick logic
    } 
  };


  return (
    <div>
      {/* Expand icon to toggle the popup */}
      <OpenInFullRoundedIcon className="expand-icon" onClick={togglePopup} data-testid='expand-icon' />

      {/* Popup containing the passed content */}
      {isPopupVisible && (
        <Popup closePopup={togglePopup}>
          {content} {/* Render the passed content dynamically */}
        </Popup>
      )}
    </div>
  );
};

export default ExpandIcon;
