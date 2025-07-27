import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Triangle } from "react-loader-spinner";
import "./TransactionPage.css";
import axios from "axios";

function TransactionPage() {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState("");
  const [editNote, setEditNote] = useState("");

  // For native inputs, keep date and time as separate strings in ISO format
  const [editDate, setEditDate] = useState("");  // yyyy-mm-dd
  const [editTime, setEditTime] = useState("");  // HH:mm

  // Fetch transaction and initialize form fields
  const getTransaction = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/friends/transaction/${id}`);
      setTransaction(res.data);

      setEditAmount(res.data.amount);
      setEditNote(res.data.note || "");

      // Parse date and time separately from the ISO date string
      const txnDate = new Date(res.data.date);

      // Date input expects yyyy-mm-dd
      const yyyy = txnDate.getFullYear();
      const mm = String(txnDate.getMonth() + 1).padStart(2, "0");
      const dd = String(txnDate.getDate()).padStart(2, "0");
      setEditDate(`${yyyy}-${mm}-${dd}`);

      // Time input expects HH:mm (24h)
      const hh = String(txnDate.getHours()).padStart(2, "0");
      const mi = String(txnDate.getMinutes()).padStart(2, "0");
      setEditTime(`${hh}:${mi}`);
    } catch (error) {
      alert("Error fetching transaction");
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = () => {
    if (window.confirm("Are you sure?")) {
      axios
        .delete(`${import.meta.env.VITE_API_BASE}/friends/transaction/${id}`)
        .then(() => navigate(-1))
        .catch((err) => alert(err));
    }
  };

  const goBack = () =>{
    navigate(-1);
  }
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editDate || !editTime) {
      alert("Please select both date and time.");
      return;
    }

    setLoading(true);
    try {
      // Combine date and time into one ISO string
      const updatedDate = new Date(`${editDate}T${editTime}:00`).toISOString();

      const updatedData = {
        amount: Number(editAmount),
        note: editNote,
        date: updatedDate,
      };

      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE}/friends/transaction/${id}`,
        updatedData
      );
      setTransaction(res.data);
      setIsEditing(false);
    } catch (error) {
      alert("Failed to update transaction");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="center transaction-loader">
        <Triangle
          visible={true}
          height="150"
          width="150"
          color="#984bf7"
          ariaLabel="triangle-loading"
        />
      </div>
    );
  }

  if (!transaction) return <div>No transaction found</div>;

  return (
    <div className="TransactionPage">
      {!isEditing ? (
        <>
          <div className="details">
            <div>
              Transaction Date:{" "}
              <p className="light-purple">
                {new Date(transaction.date).toLocaleDateString("en-GB")}
              </p>
              <p className="light-purple">
                {new Date(transaction.date).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              Transaction Amount: <p className="light-purple">₹{transaction.amount}</p>
            </div>
            <div>
              Transaction Note: <p className="light-purple">{transaction.note}</p>
            </div>
          </div>
          <div className="center" style={{ marginTop: "1rem" }}>
            <button className="back" onClick={goBack}><i className="icon fa-solid fa-arrow-right-from-bracket fa-rotate-180"></i></button>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={deleteTransaction}>Delete</button>
          </div>
        </>
      ) : (
        <form className="edit-form" onSubmit={handleEditSubmit}>
          <div className="field">
            <label htmlFor="date">Date:</label>
            <input
              className="formInput"
              type="date"
              id="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="time">Time:</label>
            <input
              className="formInput"
              type="time"
              id="time"
              value={editTime}
              onChange={(e) => setEditTime(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="amount">Amount:</label>
            <input
              className="formInput"
              type="number"
              id="amount"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              min="0"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="note">Note:</label>
            <input
              className="formInput"
              type="text"
              id="note"
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <button type="submit">Save</button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                // Reset fields
                setEditAmount(transaction.amount);
                setEditNote(transaction.note || "");
                const txnDate = new Date(transaction.date);
                setEditDate(
                  txnDate.toISOString().substring(0, 10) // yyyy-mm-dd
                );
                setEditTime(
                  txnDate.toTimeString().substring(0, 5) // HH:mm
                );
              }}
              style={{ marginLeft: "1rem" }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default TransactionPage;
