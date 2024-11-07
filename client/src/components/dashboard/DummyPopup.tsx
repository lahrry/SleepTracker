import React from "react";
import "./DummyPopup.css";

// To close the pop up
interface PopupProps {
  content: string;
  closePopup: () => void; 
}

const Popup: React.FC<PopupProps> = ({ content, closePopup }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close-btn" onClick={closePopup}>
          X
        </button>
        <div>{content}</div>
      </div>
    </div>
  );
};

export default Popup;
