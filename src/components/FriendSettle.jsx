import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import SettleModal from "./SettleModal";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Triangle } from "react-loader-spinner";
import "./FriendSettle.css";
import { useEffect } from "react";

function FriendSettle() {
 
  const { friend, refresh } = useOutletContext();

  const [settleModalOpen, setSettleModalOpen] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [isClosingQr, setIsClosingQr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
  
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
  
      // console.log("Parsed:", parsed.upiId);
  
      setUpiId(parsed.upiId);
  
      // console.log("UPI ID:", parsed.upiId);
    }
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return { Authorization: `Bearer ${token}` };
  };

  const handleSettleConfirm = async (paymentMethod) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    setLoading(true);
    try {
      const settlementAmount = -friend.balance;
      const settlementNote = `Settled (${paymentMethod})`;

      await axios.post(
        `${import.meta.env.VITE_API_BASE}/friends/transaction/${friend._id}`,
        {
          amount: settlementAmount,
          note: settlementNote,
        },
        { headers }
      );

      toast.success(`Balance settled via ${paymentMethod}`);
      refresh();
      setShowQr(false);
    } catch (err) {
      toast.error("Settlement failed");
    } finally {
      setLoading(false);
    }
  };

  /* ========================= */
  /* QR LOGIC */
  /* ========================= */

  const upiBase = `upi://pay?pa=${upiId}`;

  const qrData = useMemo(() => {
    if (!friend.balance || friend.balance <= 0 || !upiId) return "";
  
    return `upi://pay?pa=${upiId}&am=${friend.balance}&tn=${encodeURIComponent(
      friend.name + " Settle"
    )}`;
  }, [friend.balance, friend.name, upiId]);

  const qrImageUrl = useMemo(() => {
    if (!qrData) return "";
    return (
      "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
      encodeURIComponent(qrData)
    );
  }, [qrData]);

  // const handleToggleQr = () => {
  //   if (!friend.balance || friend.balance <= 0) {
  //     toast.error("No balance to settle");
  //     return;
  //   }
  //   setShowQr((prev) => !prev);
  // };

  const openQr = () => {
    if (!friend.balance || friend.balance <= 0) {
      toast.error("No balance to settle");
      return;
    }
    setShowQr(true);
  };
  
  const closeQr = () => {
    setIsClosingQr(true);
  
    setTimeout(() => {
      setShowQr(false);
      setIsClosingQr(false);
    }, 250);
  };

  return (
    <div className="settle-page">
      <h2>Settle Balance</h2>

      <div className="settle-amount">₹{Number(friend.balance).toFixed(2)}</div>

      <div className="settle-buttons">
        <button
          onClick={() => {
            if (!friend.balance || friend.balance === 0) {
              toast.error("No balance to settle");
              return;
            }
            setSettleModalOpen(true);
          }}
          className="settle-primary"
        >
          Choose Payment Method
        </button>

        <button onClick={openQr} className="settle-secondary">
          Show QR
        </button>
      </div>

      {loading && (
        <div className="center mt-20">
          <Triangle
            visible={true}
            height="100"
            width="100"
            color="#984bf7"
            ariaLabel="triangle-loading"
          />
        </div>
      )}

      {/* {showQr && friend.balance > 0 && (
        <div className="qr-section">
          <p className="qr-title">Scan to settle via UPI</p>

          <img src={qrImageUrl} alt="UPI QR" className="qr-image" />

          <p className="qr-hint">Google Pay • PhonePe • Paytm • BHIM</p>
        </div>
      )} */}

{showQr && (
  <div
    className={`qr-popup-overlay ${isClosingQr ? "fade-out" : ""}`}
    onClick={closeQr}
  >
    <div
      className={`qr-popup-content ${isClosingQr ? "scale-out" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      <button id="qr-close-btn" onClick={closeQr}>
        ×
      </button>

      <h2 className="qr-title">Scan to Pay</h2>

      <img src={qrImageUrl} alt="UPI QR" className="qr-image-popup" />

      <p className="qr-amount">
        ₹{Number(friend.balance).toFixed(2)}
      </p>

      <p className="qr-hint">Google Pay • PhonePe • Paytm • BHIM</p>
    </div>
  </div>
)}

      <SettleModal
        isOpen={settleModalOpen}
        onClose={() => setSettleModalOpen(false)}
        onConfirm={handleSettleConfirm}
        friend={friend}
      />
    </div>
  );
}

export default FriendSettle;
