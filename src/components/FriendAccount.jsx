import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Triangle } from "react-loader-spinner";
import "./FriendAccount.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import qr from "../assets/qr.jpg";

function FriendAccount({ friend, refresh }) {
  const [amount, setAmount] = useState("");
  const [mailLoading, setMailLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [toggleQr, setQr] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `${friend.name}'s Account - Y-MoneyManager`;
  }, [document.title]);

  const confirmSendMail = () => {
    window.confirm("Are you sure you want to send email?") && handleSendEmail();
  }

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
    const canvas = await html2canvas(element, {
      scale: 2,
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

  const ShowQr = () => {
    if (!friend.balance || friend.balance <= 0) return alert("No balance");
    !toggleQr && setQr(true);
    toggleQr && setQr(false);
  };

  const handleSendEmail = () => {
    if (!friend.balance || friend.balance <= 0) return alert("No balance");
    setMailLoading(true);
  
    axios
      .post("https://money-manager-api-krhz.onrender.com/api/email", {
        friend, // Pass entire friend object with transactions
      })
      .then(() => {
        alert("Email sent successfully!");
        setMailLoading(false);
      })
      .catch((err) => {
        console.error("Email Error:", err.response?.data || err.message);
        alert("Failed to send email. Check console for details.");
        setMailLoading(false);
      });
  };
  
  
  

  return (
    <div className="friend-account" ref={printRef}>
      <div className="account">
        <h2 className="friend-name">
          {friend.name}
          <span className="white">&nbsp;'s Account</span>
        </h2>
        <p className="white font-20px mb-30px">
          Current Balance:{" "}
          <span className="friend-balance">₹{friend.balance}</span>
        </p>

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
            >
              I paid
            </button>
            <button
              className="btn subtract-btn"
              onClick={() => handleTransaction(-amount)}
            >
              They paid
            </button>
          </div>
        </div>

        <div className="transaction-history" ref={printRef}>
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
                height="120"
                width="120"
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
                    <tr
                      key={index}
                      onClick={() => navigate(`/transaction/${txn._id}`)}
                    >
                      <td>{new Date(txn.date).toLocaleDateString("en-GB")}</td>
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
      <div className="center flex-col pt-20">
        <div className="btn-con center">
          <button onClick={ShowQr} className="noprint">Show QR</button>
          <button onClick={window.print} className="noprint">Print</button>
          {!mailLoading && (
            <button className="btn email-btn noprint" onClick={confirmSendMail} style={{ width: '10em' }}>Send Mail</button>
          )}
          {mailLoading && (
            <div className="center">
              <Triangle
                visible={true}
                height="50"
                width="50"
                color="#984bf7"
                ariaLabel="triangle-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          )}
          
        </div>
        {toggleQr && (
          <div className="qr-details pt-20 noprint">
            <img src={qr} alt="qr" height={300} width={380} />
            <p className="white font-20px mb-30px center">
              Pay&nbsp;
              <span className="friend-balance">₹{friend.balance}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendAccount;
