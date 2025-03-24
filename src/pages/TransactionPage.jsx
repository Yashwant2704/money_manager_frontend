import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./TransactionPage.css";
import axios from "axios";

function TransactionPage() {
  const { id } = useParams();
  let [transaction, setTransaction] = useState([]);
  const navigate = useNavigate();
  const getTransaction = async () => {
    axios
      .get(`http://localhost:5000/api/friends/transaction/${id}`)
      .then((res) => {
        setTransaction(res.data);
      });
  };

  const deleteTransaction = () => {
    if (confirm("Are you sure?")) {
      axios
        .delete(`http://localhost:5000/api/friends/transaction/${id}`)
        .then((res) => {
          window.history.back();
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  useEffect(() => {
    getTransaction();
  }, []);
  return (
    <div className="TransactionPage">
      <div className="details">
        <div>
          Transaction Date:{" "}
          <p className="light-purple">
            {new Date(transaction.date).toLocaleDateString("en-GB")}
          </p>
        </div>
        <div>
          Transaction Amount:{" "}
          <p className="light-purple">₹{transaction.amount}</p>
        </div>
        <div>
          Transaction Note: <p className="light-purple">{transaction.note}</p>
        </div>
      </div>
      <button onClick={deleteTransaction}>Delete</button>
    </div>
  );
}

export default TransactionPage;
