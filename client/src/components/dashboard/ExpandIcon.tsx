import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import React, { useState } from "react";
import Popup from "./DummyPopup";
import "./ExpandIcon.css";

interface ExpandIconProps {
  content: string; // Content of the pop up
}

const ExpandIcon: React.FC<ExpandIconProps> = ({ content }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  // To see the pop up
  const togglePopup = () => setPopupVisible(!isPopupVisible);

  return (
    <div>
      <OpenInFullRoundedIcon className="expand-icon" onClick={togglePopup} />
      {isPopupVisible && <Popup content={content} closePopup={togglePopup} />}
    </div>
  );
};

export default ExpandIcon;
