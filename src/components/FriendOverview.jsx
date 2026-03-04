import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

function FriendOverview() {
  const { friend, refresh } = useOutletContext();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTransaction = async (value) => {
    if (!amount) return toast.error("Enter amount");

    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_BASE}/friends/transaction/${friend._id}`,
        {
          amount: parseFloat(value),
          note,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAmount("");
      setNote("");
      refresh();
    } catch (err) {
      console.error(err);
      toast.error("Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      {/* Add/Subtract Form */}
      <div className="transaction-section noprint">
        <h4 className="mb-10px">Add/Subtract Money</h4>

        <input
          type="number"
          className="input-field"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />

        <input
          type="text"
          className="input-field"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note"
        />

        <div className="transaction-buttons">
          <button
            className="btn add-btn"
            onClick={() => handleTransaction(amount)}
            disabled={loading}
          >
            I paid
          </button>

          <button
            className="btn subtract-btn"
            onClick={() => handleTransaction(-amount)}
            disabled={loading}
          >
            They paid
          </button>
        </div>
      </div>

    </div>
  );
}

export default FriendOverview;