import { useState } from "react";
import "./SettleModal.css";

const SettleModal = ({ isOpen, onClose, onConfirm, friend }) => {
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const handleConfirm = () => {
    onConfirm(paymentMethod);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="settle-modal-overlay" onClick={onClose}>
      <div className="settle-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Settle Payment</h2>
        <p className="settle-info">
          Settling balance with <strong className="light-purple">{friend.name}</strong>
        </p>
        <p className="settle-amount">
          Amount: <span>₹{Math.abs(friend.balance)}</span>
        </p>
        
        <div className="payment-method-section">
          <h3>Payment Method:</h3>
          <div className="payment-options">
            <label className={`payment-option ${paymentMethod === "Cash" ? "selected" : ""}`}>
              <input
                type="radio"
                value="Cash"
                checked={paymentMethod === "Cash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="payment-icon">💰</span>
              <span>Cash</span>
            </label>
            <label className={`payment-option ${paymentMethod === "Online" ? "selected" : ""}`}>
              <input
                type="radio"
                value="Online"
                checked={paymentMethod === "Online"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="payment-icon">📱</span>
              <span>Online</span>
            </label>
          </div>
        </div>

        <div className="settle-modal-actions">
          <button onClick={onClose} className="settle-cancel-btn">
            Cancel
          </button>
          <button onClick={handleConfirm} className="settle-confirm-btn">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettleModal;
