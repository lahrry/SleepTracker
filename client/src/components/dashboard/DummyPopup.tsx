import React from "react";
import "./DummyPopup.css";

interface PopupProps {
  children: React.ReactNode; // The content to render inside the popup
  closePopup: () => void; // Function to close the popup
}

const Popup: React.FC<PopupProps> = ({ children, closePopup }) => {
  const buttonStyle = {
    backgroundColor: "rgba(0, 0, 128, 0.75)", // Default navy blue with transparency
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "8px 16px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease", // Smooth transition on hover
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button
          style={buttonStyle}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#9333ea") // Vibrant purple on hover
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(0, 0, 128, 0.75)") // Revert to navy blue
          }
          onClick={closePopup}
        >
          Done
        </button>
        {children} {/* Render dynamic content here */}
      </div>
    </div>
  );
};


export default Popup;
