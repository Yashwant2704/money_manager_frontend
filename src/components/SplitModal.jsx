import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import "./SplitModal.css";

const SplitModal = ({ isOpen, onClose, onSubmit, friends, upiId }) => {

  const [totalAmount, setTotalAmount] = useState("");
  const [note, setNote] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("split");

  const [qrAmount, setQrAmount] = useState("");
  const [qrNote, setQrNote] = useState("");
  const [qrPeople, setQrPeople] = useState("");
  const [generatedQr, setGeneratedQr] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setTotalAmount("");
      setNote("");
      setSelectedFriends([]);
      setActiveTab("split");

      setQrAmount("");
      setQrNote("");
      setQrPeople("");
      setGeneratedQr(null);

      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleFriendToggle = (friend) => {
    setSelectedFriends((prev) => {
      const exists = prev.some((f) => f.friendId === friend._id);

      if (exists) {
        return prev.filter((f) => f.friendId !== friend._id);
      }

      return [...prev, { friendId: friend._id, name: friend.name }];
    });
  };

  const calculateSplit = () => {
    if (!totalAmount || selectedFriends.length === 0) return 0;

    const numberOfPeople = selectedFriends.length + 1;
    return (parseFloat(totalAmount) / numberOfPeople).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!totalAmount || parseFloat(totalAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (selectedFriends.length === 0) {
      toast.error("Please select at least one friend");
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        totalAmount: parseFloat(totalAmount),
        note: note || "Split expense",
        selectedFriends,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQr = () => {
    if (!upiId) {
      toast.error("UPI ID not configured");
      return;
    }

    if (!qrAmount || !qrPeople || parseInt(qrPeople) <= 0) {
      toast.error("Enter valid amount and number of people");
      return;
    }

    const perPerson = (parseFloat(qrAmount) / parseInt(qrPeople)).toFixed(2);

    const tnNote = qrNote
      ? encodeURIComponent(qrNote)
      : "Split Payment";

    const upiUrl =
      `upi://pay?pa=${upiId}` +
      `&am=${perPerson}` +
      `&cu=INR` +
      `&tn=${tnNote}`;

    const qrImageUrl =
      "https://api.qrserver.com/v1/create-qr-code/" +
      "?size=220x220&data=" +
      encodeURIComponent(upiUrl);

    setGeneratedQr(qrImageUrl);
  };

  const splitAmount = calculateSplit();
  const numberOfPeople = selectedFriends.length + 1;

  if (!isOpen) return null;

  return (
    <div className="split-modal-overlay" onClick={onClose}>
      <div
        className="split-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}

        <div className="split-modal-header">
          <h2>Split Expense</h2>

          <button
            className="split-close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* TABS */}

        <div className="split-tabs">
          <button
            className={activeTab === "split" ? "active" : ""}
            onClick={() => setActiveTab("split")}
          >
            Split Expense
          </button>

          <button
            className={activeTab === "qr" ? "active" : ""}
            onClick={() => setActiveTab("qr")}
          >
            Generate QR
          </button>
        </div>

        {/* SPLIT TAB */}

        {activeTab === "split" && (
          <form onSubmit={handleSubmit} className="split-form">

            <div className="split-input-group">
              <label>Total Amount</label>

              <div className="split-amount-wrapper">
                <span className="split-currency">₹</span>

                <input
                  type="number"
                  value={totalAmount}
                  onChange={(e) =>
                    setTotalAmount(e.target.value)
                  }
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  className="split-input"
                />
              </div>
            </div>

            <div className="split-input-group">
              <label>Note</label>

              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What was this expense for?"
                className="split-input"
              />
            </div>

            <div className="split-friends-section">

              <h3>Select Friends</h3>

              {friends.length === 0 ? (
                <div className="split-no-friends">
                  No friends available
                </div>
              ) : (
                <div className="split-friends-list">

                  {friends.map((friend) => {
                    const selected = selectedFriends.some(
                      (f) => f.friendId === friend._id
                    );

                    return (
                      <div
                        key={friend._id}
                        className={`split-friend-item ${
                          selected ? "selected" : ""
                        }`}
                        onClick={() =>
                          handleFriendToggle(friend)
                        }
                      >
                        <input
                          type="checkbox"
                          className="split-checkbox"
                          checked={selected}
                          onChange={() =>
                            handleFriendToggle(friend)
                          }
                        />

                        <div className="split-friend-info">

                          <div className="split-friend-name">
                            {friend.name}
                          </div>

                          <div className="split-friend-details">
                            {friend.mail} • Balance ₹{friend.balance}
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedFriends.length > 0 && totalAmount && (

              <div className="split-calculation">

                <h3>Split Calculation</h3>

                <div className="split-calc-row">
                  <span>Total:</span>
                  <span>₹{totalAmount}</span>
                </div>

                <div className="split-calc-row">
                  <span>People:</span>
                  <span>{numberOfPeople}</span>
                </div>

                <div className="split-calc-row split-highlight">
                  <span>Per Person:</span>
                  <span>₹{splitAmount}</span>
                </div>

              </div>
            )}

            <div className="split-modal-actions">

              <button
                type="button"
                onClick={onClose}
                className="split-cancel-btn"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="split-submit-btn"
                disabled={
                  loading ||
                  !totalAmount ||
                  selectedFriends.length === 0
                }
              >
                {loading
                  ? "Creating Split..."
                  : `Split ₹${splitAmount} Each`}
              </button>

            </div>
          </form>
        )}

        {/* QR TAB */}

        {activeTab === "qr" && (
          <div className="split-form">

            <div className="split-input-group">
              <label>Total Amount</label>

              <div className="split-amount-wrapper">
                <span className="split-currency">₹</span>

                <input
                  type="number"
                  value={qrAmount}
                  onChange={(e) =>
                    setQrAmount(e.target.value)
                  }
                  placeholder="0.00"
                  className="split-input"
                />
              </div>
            </div>

            <div className="split-input-group">
              <label>Note</label>

              <input
                type="text"
                value={qrNote}
                onChange={(e) => setQrNote(e.target.value)}
                placeholder="Expense note"
                className="split-input"
              />
            </div>

            <div className="split-input-group">
              <label>Number of People</label>

              <input
                type="number"
                value={qrPeople}
                onChange={(e) =>
                  setQrPeople(e.target.value)
                }
                placeholder="2"
                min="1"
                className="split-input"
              />
            </div>

            <button
              className="split-submit-btn"
              onClick={handleGenerateQr}
            >
              Generate QR
            </button>

            {generatedQr && (
              <div className="qr-preview">

                <img
                  src={generatedQr}
                  alt="UPI QR Code"
                  width={220}
                  height={220}
                  style={{
                    background: "#fff",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "2px solid #bb86fc",
                  }}
                />

                <p className="light-purple">
                  ₹{(qrAmount / qrPeople).toFixed(2)} per person
                </p>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SplitModal;