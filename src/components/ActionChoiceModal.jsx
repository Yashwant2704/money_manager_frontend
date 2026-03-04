import { useState, useMemo } from "react";
import "./ActionChoiceModal.css";

const ActionChoiceModal = ({
  isOpen,
  onClose,
  onConfirm,
  transactions = [],
  title = "Choose Transactions",
  actionLabel = "Proceed"
}) => {
  const [mode, setMode] = useState("full");
  const [selected, setSelected] = useState([]);

  const getTransactionsSinceLastSettlement = () => {
    if (!transactions.length) return [];

    const lastSettlementIndex = [...transactions]
      .map((txn, index) =>
        txn.note?.toLowerCase().includes("settled") ? index : -1
      )
      .filter(index => index !== -1)
      .pop();

    if (lastSettlementIndex === undefined) return transactions;

    return transactions.slice(lastSettlementIndex + 1);
  };

  const sinceSettlement = useMemo(
    () => getTransactionsSinceLastSettlement(),
    [transactions]
  );

  const toggleTransaction = (txnId) => {
    setSelected(prev =>
      prev.includes(txnId)
        ? prev.filter(id => id !== txnId)
        : [...prev, txnId]
    );
  };

  const handleConfirm = () => {
    let txns;

    if (mode === "full") {
      txns = transactions;
    } else if (mode === "selective") {
      txns = transactions.filter(txn => selected.includes(txn._id));
    } else {
      txns = sinceSettlement;
    }

    onConfirm(txns);
    onClose();

    setTimeout(() => {
      setMode("full");
      setSelected([]);
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div className="ac-overlay" onClick={onClose}>
      <div className="ac-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="ac-title">{title}</h2>

        <div className="ac-options">

          <label className={`ac-option ${mode === "full" ? "active" : ""}`}>
            <input
              type="radio"
              checked={mode === "full"}
              onChange={() => setMode("full")}
            />
            <span className="ac-radio"></span>
            <span className="ac-text">
              Full History ({transactions.length} transactions)
            </span>
          </label>

          <label className={`ac-option ${mode === "since-settlement" ? "active" : ""}`}>
            <input
              type="radio"
              checked={mode === "since-settlement"}
              onChange={() => setMode("since-settlement")}
            />
            <span className="ac-radio"></span>
            <span className="ac-text">
              Since Last Settlement ({sinceSettlement.length} transactions)
            </span>
          </label>

          <label className={`ac-option ${mode === "selective" ? "active" : ""}`}>
            <input
              type="radio"
              checked={mode === "selective"}
              onChange={() => setMode("selective")}
            />
            <span className="ac-radio"></span>
            <span className="ac-text">
              Selective Transactions
            </span>
          </label>

        </div>

        {mode === "selective" && (
          <div className="ac-txn-list">
            {transactions.map((txn, idx) => (
              <label className="ac-txn-row" key={txn._id || idx}>
                <input
                  type="checkbox"
                  checked={selected.includes(txn._id)}
                  onChange={() => toggleTransaction(txn._id)}
                />
                <span className="ac-checkbox"></span>
                <span className="ac-txn-text">
                  {new Date(txn.date).toLocaleDateString("en-GB")} • ₹{txn.amount} • {txn.note}
                </span>
              </label>
            ))}
            {!transactions.length && (
              <div className="ac-empty">No transactions.</div>
            )}
          </div>
        )}

        <div className="ac-actions">
          <button onClick={onClose} className="ac-cancel">
            Cancel
          </button>
          <button
            className="ac-confirm"
            disabled={mode === "selective" && selected.length === 0}
            onClick={handleConfirm}
          >
            {actionLabel}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ActionChoiceModal;