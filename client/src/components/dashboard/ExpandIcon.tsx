import React, { useState } from "react";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import Popup from "./DummyPopup";
import "./ExpandIcon.css";

interface ExpandIconProps {
  content: React.ReactNode; // Allow dynamic content to be passed
}

const ExpandIcon: React.FC<ExpandIconProps> = ({ content }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const togglePopup = () => setPopupVisible(!isPopupVisible);

  return (
    <div>
      {/* Expand icon to toggle the popup */}
      <OpenInFullRoundedIcon className="expand-icon" onClick={togglePopup} />

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
