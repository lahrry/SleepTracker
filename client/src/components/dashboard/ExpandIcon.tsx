import React, { useState } from "react";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import Popup from "./DummyPopup"; // Import the Popup component
import "./ExpandIcon.css"; // Add styles for the ExpandIcon

interface ExpandIconProps {
  content: string; // This is the content to pass to the popup
}

const ExpandIcon: React.FC<ExpandIconProps> = ({ content }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  // Toggle popup visibility
  const togglePopup = () => setPopupVisible(!isPopupVisible);

  return (
    <div>
      <OpenInFullRoundedIcon className="expand-icon" onClick={togglePopup} />
      {isPopupVisible && <Popup content={content} closePopup={togglePopup} />}
    </div>
  );
};

export default ExpandIcon;
