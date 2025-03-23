import { useState } from "react";
import axios from "axios";
import "./FriendAccount.css";

function FriendAccount({ friend, refresh }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const handleTransaction = (value) => {
    if (!amount) return alert("Enter amount");
    axios
      .post(
        `${import.meta.env.VITE_API_BASE}/friends/transaction/${friend._id}`,
        {
          amount: parseFloat(value),
          note,
        }
      )
      .then(() => {
        setAmount("");
        setNote("");
        refresh();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="friend-account">
      <h2 className="friend-name">
        {friend.name}
        <span className="white">&nbsp;'s Account</span>
      </h2>
      <p className="white font-20px mb-30px">
        Current Balance:{" "}
        <span className="friend-balance">₹{friend.balance}</span>
      </p>

      <div className="transaction-section">
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
          >
            Add
          </button>
          <button
            className="btn subtract-btn"
            onClick={() => handleTransaction(-amount)}
          >
            Subtract
          </button>
        </div>
      </div>

      <div className="transaction-history">
        <h4>Transaction History:</h4>
        {/* <ul>
          {friend.transactions.map((txn, index) => (
            <li key={index}>
              <span className="date">{new Date(txn.date).toLocaleDateString()}</span>  <span className="amount">₹{txn.amount}</span> ({txn.note})
            </li>
          ))}
        </ul> */}
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount (₹)</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {friend.transactions.map((txn, index) => (
              <tr key={index}>
                <td>{new Date(txn.date).toLocaleDateString()}</td>
                <td>₹&nbsp;{txn.amount}</td>
                <td>{txn.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FriendAccount;
