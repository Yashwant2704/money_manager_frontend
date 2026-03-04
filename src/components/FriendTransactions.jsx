import { useOutletContext, useNavigate } from "react-router-dom";
import "./FriendTransactions.css";

function FriendTransactions() {
  const { friend } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div className="transactions-page">
      <h2>All Transactions</h2>

      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {friend.transactions.map((txn) => (
            <tr
              key={txn._id}
              onClick={() => navigate(`/transaction/${txn._id}`)}
              style={{ cursor: "pointer" }}
            >
              <td>{new Date(txn.date).toLocaleDateString("en-GB")}</td>
              <td>₹{txn.amount}</td>
              <td>{txn.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FriendTransactions;