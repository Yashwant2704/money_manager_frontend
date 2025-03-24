import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Triangle } from "react-loader-spinner";
import "./FriendAccount.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function FriendAccount({ friend, refresh }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const navigate = useNavigate();

  const handleTransaction = (value) => {
    setLoading(true);
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
        setLoading(false);
        refresh();
      })
      .catch((err) => console.error(err));
  };

  const printRef = useRef(null);

  const handlePrint = async () => {
    // console.log(printRef.current);
    const element = printRef.current;
    if (!element) return;
    const canvas = await html2canvas(element,{
      scale: 2
    });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const imgProperties = pdf.getImageProperties(data);
    // console.log(imgProperties);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Balance.pdf");
  };

  return (
    <div className="friend-account">

    <div className="account" ref={printRef}>
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
        {loading && (
          <div className="center">
            <Triangle
              visible={true}
              height="80"
              width="80"
              color="#984bf7"
              ariaLabel="triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        )}
        {!loading && (
          <div>
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {friend.transactions.map((txn, index) => (
                  <tr key={index} onClick={() => navigate(`/transaction/${txn._id}`)}>
                    <td>{new Date(txn.date).toLocaleDateString('en-GB')}</td>
                    <td>₹&nbsp;{txn.amount}</td>
                    <td>{txn.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
        {/* <button onClick={handlePrint}>Print</button> */}
    </div>
  );
}

export default FriendAccount;
