import { useState } from "react";
import "./ActionChoiceModal.css";

const ActionChoiceModal = ({ isOpen, onClose, onConfirm, transactions = [], title = "Choose Transactions", actionLabel = "Proceed" }) => {
  const [mode, setMode] = useState("full");
  const [selected, setSelected] = useState([]);

  const toggleTransaction = (txnId) => {
    setSelected(prev =>
      prev.includes(txnId)
        ? prev.filter(id => id !== txnId)
        : [...prev, txnId]
    );
  };

  const handleConfirm = () => {
    const txns = mode === "full" ? transactions : transactions.filter(txn => selected.includes(txn._id));
    onConfirm(txns);
    onClose();
    setTimeout(() => { setMode("full"); setSelected([]); }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="action-choice-modal-overlay" onClick={onClose}>
      <div className="action-choice-modal" onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        <div className="choice-section">
          <label>
            <input type="radio" checked={mode === "full"} onChange={() => setMode("full")} />
            <span>Full History</span>
          </label>
          <label>
            <input type="radio" checked={mode === "selective"} onChange={() => setMode("selective")} />
            <span>Selective Transactions</span>
          </label>
        </div>
        {mode === "selective" && (
          <div className="txn-select-list">
            {transactions.map((txn, idx) => (
              <label className="txn-row" key={txn._id || idx}>
                <input type="checkbox" checked={selected.includes(txn._id)} onChange={() => toggleTransaction(txn._id)} />
                <span>
                  {new Date(txn.date).toLocaleDateString("en-GB")} | ₹{txn.amount} | {txn.note}
                </span>
              </label>
            ))}
            {!transactions.length && <div className="txn-empty">No transactions.</div>}
          </div>
        )}
        <div className="action-choice-modal-actions">
          <button onClick={onClose} className="choice-cancel-btn">Cancel</button>
          <button className="choice-confirm-btn" disabled={mode === "selective" && selected.length === 0} onClick={handleConfirm}>
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionChoiceModal;
