import { useState, useEffect } from "react";
import { toast } from 'react-hot-toast';
import "./SplitModal.css";

const SplitModal = ({ isOpen, onClose, onSubmit, friends }) => {
  const [totalAmount, setTotalAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTotalAmount('');
      setNote('');
      setSelectedFriends([]);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleFriendToggle = (friend) => {
    setSelectedFriends(prev => {
      const isSelected = prev.some(f => f.friendId === friend._id);
      if (isSelected) {
        return prev.filter(f => f.friendId !== friend._id);
      } else {
        return [...prev, { friendId: friend._id, name: friend.name }];
      }
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
      toast.error('Please enter a valid amount');
      return;
    }

    if (selectedFriends.length === 0) {
      toast.error('Please select at least one friend to split with');
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        totalAmount: parseFloat(totalAmount),
        note: note || 'Split expense',
        selectedFriends
      });
    } catch (err) {
      console.error('Split transaction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const splitAmount = calculateSplit();
  const numberOfPeople = selectedFriends.length + 1;

  if (!isOpen) return null;

  return (
    <div className="split-modal-overlay" onClick={onClose}>
      <div className="split-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="split-modal-header">
          <h2>Split Expense</h2>
          <button className="split-close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="split-form">
          <div className="split-input-group">
            <label htmlFor="totalAmount">Total Amount</label>
            <div className="split-amount-wrapper">
              <span className="split-currency">₹</span>
              <input
                id="totalAmount"
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                className="split-input"
              />
            </div>
          </div>

          <div className="split-input-group">
            <label htmlFor="note">Note (optional)</label>
            <input
              id="note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What was this expense for?"
              className="split-input"
            />
          </div>

          <div className="split-friends-section">
            <h3>Select Friends to Split With</h3>
            
            {friends.length === 0 ? (
              <div className="split-no-friends">
                No friends available. Please add friends first to split expenses.
              </div>
            ) : (
              <div className="split-friends-list">
                {friends.map((friend) => {
                  const isSelected = selectedFriends.some(f => f.friendId === friend._id);
                  return (
                    <div 
                      key={friend._id} 
                      className={`split-friend-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleFriendToggle(friend)}
                    >
                      <input 
                        type="checkbox" 
                        checked={isSelected} 
                        onChange={() => handleFriendToggle(friend)}
                        className="split-checkbox"
                      />
                      <div className="split-friend-info">
                        <div className="split-friend-name">{friend.name}</div>
                        <div className="split-friend-details">
                          {friend.mail} • Balance: ₹{friend.balance}
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
              <div className="split-calc-details">
                <div className="split-calc-row">
                  <span>Total Amount:</span>
                  <span className="split-amount">₹{totalAmount}</span>
                </div>
                <div className="split-calc-row">
                  <span>Number of People:</span>
                  <span>{numberOfPeople}</span>
                </div>
                <div className="split-calc-row split-highlight">
                  <span>Amount per Person:</span>
                  <span className="split-amount">₹{splitAmount}</span>
                </div>
                
                <div className="split-selected-friends">
                  <strong>Selected Friends:</strong>
                  <div className="split-friend-chips">
                    {selectedFriends.map((friend) => (
                      <span key={friend.friendId} className="split-friend-chip">
                        {friend.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="split-modal-actions">
            <button type="button" onClick={onClose} className="split-cancel-btn" disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              className="split-submit-btn"
              disabled={loading || !totalAmount || selectedFriends.length === 0}
            >
              {loading ? 'Creating Split...' : `Split ₹${splitAmount} Each`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SplitModal;
