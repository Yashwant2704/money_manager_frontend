import { useState } from "react";
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

  // NEW: Get transactions since last settlement
  const getTransactionsSinceLastSettlement = () => {
    if (!transactions || transactions.length === 0) return [];
  
    // Find LAST settlement index
    const lastSettlementIndex = [...transactions]
      .map((txn, index) =>
        txn.note?.toLowerCase().includes("settled") ? index : -1
      )
      .filter(index => index !== -1)
      .pop();
  
    // If no settlement found, return all (fallback)
    if (lastSettlementIndex === undefined) return transactions;
  
    // Return ONLY transactions AFTER last settlement
    return transactions.slice(lastSettlementIndex + 1);
  };
  

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
    } else if (mode === "since-settlement") {
      txns = getTransactionsSinceLastSettlement();
    }
    
    onConfirm(txns);
    onClose();
    setTimeout(() => { 
      setMode("full"); 
      setSelected([]); 
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="action-choice-modal-overlay" onClick={onClose}>
      <div className="action-choice-modal" onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        
        <div className="choice-section">
          <label>
            <input 
              type="radio" 
              checked={mode === "full"} 
              onChange={() => setMode("full")} 
            />
            <span>Full History ({transactions.length} transactions)</span>
          </label>
          
          <label>
            <input 
              type="radio" 
              checked={mode === "since-settlement"} 
              onChange={() => setMode("since-settlement")} 
            />
            <span>Since Last Settlement ({getTransactionsSinceLastSettlement().length} transactions)</span>
          </label>
          
          <label>
            <input 
              type="radio" 
              checked={mode === "selective"} 
              onChange={() => setMode("selective")} 
            />
            <span>Selective Transactions</span>
          </label>
        </div>

        {mode === "selective" && (
          <div className="txn-select-list">
            {transactions.map((txn, idx) => (
              <label className="txn-row" key={txn._id || idx}>
                <input 
                  type="checkbox" 
                  checked={selected.includes(txn._id)} 
                  onChange={() => toggleTransaction(txn._id)} 
                />
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
          <button 
            className="choice-confirm-btn" 
            disabled={
              mode === "selective" && selected.length === 0
            } 
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
