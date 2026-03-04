import { useState } from "react";
import "./LogoutButton.css";
import walkerSprite from "../assets/walker-sprite.svg";

function LogoutButton({ logout }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    // Timing matches the CSS walk-left animation
    setTimeout(() => {
      logout();
    }, 1200);
  };

  return (
    <button 
      className={`advanced-door-btn ${isLoggingOut ? "logging-out" : ""}`} 
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      <span className="btn-text">
        {isLoggingOut ? "Logging out..." : "Logout"}
      </span>
      
      <div className="portal-container">
        {/* Figure starts at right: 0 */}
        <div className="walker-sprite"></div>

        {/* Door hinge is now on the right */}
        <div className="door-panel">
          <span className="door-handle"></span>
        </div>
      </div>
    </button>
  );
}

export default LogoutButton;