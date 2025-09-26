import React from "react";
import "./Banner.css";

function Banner({ message, onClose, className }) {
  if (!message) return null;

  return (
    <div className={`banner ${className || ""}`}>
      <p className="banner-message">{message}</p>
      {onClose && (
        <button
          aria-label="Close banner"
          className="close-btn"
          onClick={onClose}
          title="Dismiss"
        >
          &#10005;
        </button>
      )}
    </div>
  );
}

export default Banner;
