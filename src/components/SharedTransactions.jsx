import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./SharedTransactions.css";

function SharedTransactions() {
  const { friend } = useOutletContext();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchShared = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE}/friends/shared/${friend._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load shared transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShared();
  }, [friend._id]);

  return (
    <div className="shared-transactions-page">
      <h4 style={{ marginBottom: "12px" }}>
        Transactions {friend.name} added on their side
      </h4>

      {loading && <p className="muted">Loading…</p>}

      {!loading && transactions.length === 0 && (
        <p className="muted">
          No transactions from {friend.name} yet. They'll appear here once{" "}
          {friend.name} adds them from their account.
        </p>
      )}

      {!loading && transactions.length > 0 && (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn._id}>
                <td>{new Date(txn.date).toLocaleDateString("en-GB")}</td>
                <td className={txn.amount >= 0 ? "amount-positive" : "amount-negative"}>
                ₹{txn.amount}
                </td>
                <td>{txn.note || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SharedTransactions;