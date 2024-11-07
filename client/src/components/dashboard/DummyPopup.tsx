import React from "react";
import "./DummyPopup.css";

interface PopupProps {
  content: string;
  closePopup: () => void; // Function to close the popup
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
