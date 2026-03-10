import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Triangle } from "react-loader-spinner";
import "./TransactionPage.css";
import axios from "axios";
import { Toaster, toast } from 'react-hot-toast';

function TransactionPage() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editDate, setEditDate] = useState(""); // yyyy-mm-dd
  const [editTime, setEditTime] = useState(""); // HH:mm

  // Helper to get token and create auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  // Fetch transaction and initialize form fields
  const getTransaction = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      if (!headers) return; // token missing, redirected to login

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE}/friends/transaction/${id}`,
        { headers }
      );
      setTransaction(res.data);
      setEditAmount(res.data.amount);
      setEditNote(res.data.note || "");

      const txnDate = new Date(res.data.date);

      // Format yyyy-mm-dd
      const yyyy = txnDate.getFullYear();
      const mm = String(txnDate.getMonth() + 1).padStart(2, "0");
      const dd = String(txnDate.getDate()).padStart(2, "0");
      setEditDate(`${yyyy}-${mm}-${dd}`);

      // Format HH:mm (24 hour)
      const hh = String(txnDate.getHours()).padStart(2, "0");
      const mi = String(txnDate.getMinutes()).padStart(2, "0");
      setEditTime(`${hh}:${mi}`);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error('Error fetching transaction!', {
          style: {
            border: '3px solid #bb86fc',
            padding: '16px',
            color: '#ffffff',
            background: '#272727'
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#272727',
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;
  
      await axios.delete(
        `${import.meta.env.VITE_API_BASE}/friends/transaction/${id}`,
        { headers }
      );
  
      toast.success("Deleted Transaction!", {
        style: {
          border: "3px solid #bb86fc",
          padding: "16px",
          color: "#ffffff",
          background: "#272727",
        },
        iconTheme: {
          primary: "#ffffff",
          secondary: "#272727",
        },
      });
  
      navigate(-1);
    } catch (err) {
      toast.error("Delete Failed!", {
        style: {
          border: "3px solid #bb86fc",
          padding: "16px",
          color: "#ffffff",
          background: "#272727",
        },
      });
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editDate || !editTime) {
      toast.error('Please select both date and time.', {
        style: {
          border: '3px solid #bb86fc',
          padding: '16px',
          color: '#ffffff',
          background: '#272727'
        },
        iconTheme: {
          primary: '#bb86fc',
          secondary: '#272727',
        },
      });
      return;
    }

    setLoading(true);
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const updatedDate = new Date(`${editDate}T${editTime}:00`).toISOString();

      const updatedData = {
        amount: Number(editAmount),
        note: editNote,
        date: updatedDate,
      };

      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE}/friends/transaction/${id}`,
        updatedData,
        { headers }
      );
      setTransaction(res.data);
      setIsEditing(false);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error('Failed to update transaction!', {
          style: {
            border: '3px solid #bb86fc',
            padding: '16px',
            color: '#ffffff',
            background: '#272727'
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#272727',
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      <div className="transaction-card">

        <div className="transaction-header">
          <h2>Transaction Details</h2>
          <span className={`amount-badge ${transaction.amount >= 0 ? "positive" : "negative"}`}>
            ₹{transaction.amount}
          </span>
        </div>

        <div className="transaction-grid">

          <div className="info-block">
            <span className="label">Date</span>
            <span className="value">
              {new Date(transaction.date).toLocaleDateString("en-GB")}
            </span>
          </div>

          <div className="info-block">
            <span className="label">Time</span>
            <span className="value">
              {new Date(transaction.date).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="info-block full-width">
            <span className="label">Note</span>
            <span className="value">
              {transaction.note || "—"}
            </span>
          </div>

        </div>

        <div className="transaction-actions">
          <button className="btn-secondary" onClick={goBack}>Back</button>
          <button className="btn-primary" onClick={() => setIsEditing(true)}>Edit</button>
          <button className="btn-danger" onClick={() => setDeleteModalOpen(true)}>Delete</button>
        </div>

      </div>
    </>
  ) : (
    <form className="edit-form premium-form" onSubmit={handleEditSubmit}>

  <div className="edit-header">
    <h2>Edit Transaction</h2>
  </div>

  <div className="form-grid">

    <div className="field">
      <label>Date</label>
      <input
        type="date"
        value={editDate}
        onChange={(e) => setEditDate(e.target.value)}
        required
      />
    </div>

    <div className="field">
      <label>Time</label>
      <input
        type="time"
        value={editTime}
        onChange={(e) => setEditTime(e.target.value)}
        required
      />
    </div>

    <div className="field full-width">
      <label>Amount</label>
      <input
        type="number"
        value={editAmount}
        onChange={(e) => setEditAmount(e.target.value)}
        required
      />
    </div>

    <div className="field full-width">
      <label>Note</label>
      <input
        type="text"
        value={editNote}
        onChange={(e) => setEditNote(e.target.value)}
        placeholder="Optional note..."
      />
    </div>

  </div>

  <div className="edit-actions">
    <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>
      Cancel
    </button>
    <button type="submit" className="btn-primary">
      Save Changes
    </button>
  </div>

</form>
  )}
{deleteModalOpen && (
  <div className="modal-overlay">
    <div className="confirm-modal">

      <h3>Delete Transaction</h3>

      <p>
        Are you sure you want to delete this transaction?
      </p>

      <div className="modal-actions">

        <button
          className="btn-secondary"
          onClick={() => setDeleteModalOpen(false)}
        >
          Cancel
        </button>

        <button
          className="btn-danger"
          onClick={() => {
            setDeleteModalOpen(false);
            deleteTransaction();
          }}
        >
          Delete
        </button>

      </div>

    </div>
  </div>
)}
</div>
  );
}

export default TransactionPage;
