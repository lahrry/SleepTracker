import React from "react";
import "./DummyPopup.css";

interface PopupProps {
  children: React.ReactNode; // The content to render inside the popup
  closePopup: () => void; // Function to close the popup
}

const Popup: React.FC<PopupProps> = ({ children, closePopup }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={closePopup}>
          Done
        </button>
        {children} {/* Render dynamic content here */}
      </div>
    </div>
  );
};

export default Popup;
