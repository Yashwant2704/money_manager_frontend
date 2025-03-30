import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Triangle } from "react-loader-spinner";
import "./TransactionPage.css";
import axios from "axios";

function TransactionPage() {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  let [transaction, setTransaction] = useState([]);
  const navigate = useNavigate();


  const getTransaction = async () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE}/friends/transaction/${id}`)
      .then((res) => {
        setTransaction(res.data);
        setLoading(false);
    });
  };

  const deleteTransaction = () => {
    if (confirm("Are you sure?")) {
      axios
        .delete(`https://money-manager-api-krhz.onrender.com/api/friends/transaction/${id}`)
        .then((res) => {
          navigate(-1);
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
        {loading && (
        <div className="center">
          <Triangle
            visible={true}
            height="150"
            width="150"
            color="#984bf7"
            ariaLabel="triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}
    {!loading && ( <div className="details">
        <div>
          Transaction Date:{" "}
          <p className="light-purple">
            {new Date(transaction.date).toLocaleDateString("en-GB")}
          </p>
          <p className="light-purple">
            {new Date(transaction.date).toLocaleTimeString("en-US", {hour: '2-digit', minute:'2-digit'})}
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
      )}
     {!loading && ( <div className="center"><button onClick={deleteTransaction}>Delete</button></div>)}
    </div>
    
  );
}

export default TransactionPage;
