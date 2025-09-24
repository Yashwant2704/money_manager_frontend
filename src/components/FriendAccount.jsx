import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Triangle } from "react-loader-spinner";
import "./FriendAccount.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
// import qr from "../assets/qr.jpg";
// import qr_mbk from "../assets/qr_mbk.jpg";
import qr_mbk from "../assets/qr_mbk.png";
// import qr_mbk from "../assets/qr_mbk.svg";

function FriendAccount({ friend, refresh }) {
  const [amount, setAmount] = useState("");
  const [mailLoading, setMailLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [toggleQr, setQr] = useState(false);
  const navigate = useNavigate();

  const printRef = useRef(null);

  useEffect(() => {
    document.title = `${friend.name}'s Account - Y-MoneyManager`;
  }, [friend.name]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to perform this action.");
      navigate("/login");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  const handleTransaction = async (value) => {
    if (!amount) return alert("Enter amount");
    const headers = getAuthHeaders();
    if (!headers) return;

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE}/friends/transaction/${friend._id}`,
        {
          amount: parseFloat(value),
          note,
        },
        { headers }
      );
      setAmount("");
      setNote("");
      refresh();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error(err);
        alert("Transaction failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    // const element = printRef.current;
    // if (!element) return;
    // const canvas = await html2canvas(element, {
    //   scale: 2,
    // });
    // const data = canvas.toDataURL("image/png");

    // const pdf = new jsPDF({
    //   orientation: "portrait",
    //   unit: "px",
    //   format: "a4",
    // });

    // const imgProperties = pdf.getImageProperties(data);
    // const pdfWidth = pdf.internal.pageSize.getWidth();
    // const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    // pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    // pdf.save("Balance.pdf");
    window.print();
  };

  const ShowQr = () => {
    if (!friend.balance || friend.balance <= 0) return alert("No balance");
    setQr(!toggleQr);
  };

  const confirmSendMail = () => {
    if (window.confirm("Are you sure you want to send email?")) {
      handleSendEmail();
    }
  };

  const handleSendEmail = async () => {
    if (!friend.balance || friend.balance <= 0) return alert("No balance");
    const headers = getAuthHeaders();
    if (!headers) return;

    setMailLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE}/email`,
        { friend }, // entire friend object includes transactions
        { headers }
      );
      toast.success('Mail sent!', {
        style: {
          border: '3px solid #bb86fc',
          padding: '16px',
          color: '#bb86fc',
          background: '#272727'
        },
        iconTheme: {
          primary: '#bb86fc',
          secondary: '#272727',
        },
      });
    } catch (err) {
      console.error("Email Error:", err.response?.data || err.message);
      toast.error(err.response?.data || err.message, {
        style: {
          border: '3px solid #bb86fc',
          padding: '16px',
          color: '#bb86fc',
          background: '#272727'
        },
        iconTheme: {
          primary: '#bb86fc',
          secondary: '#272727',
        },
      });
    } finally {
      setMailLoading(false);
    }
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

        <div className="transaction-history">
          <h4>Transaction History:</h4>
          {loading && (
            <div className="center">
              <Triangle
                visible={true}
                height="120"
                width="120"
                color="#984bf7"
                ariaLabel="triangle-loading"
              />
            </div>
          )}
          {!loading && (
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
                    style={{ cursor: "pointer" }}
                  >
                    <td>{new Date(txn.date).toLocaleDateString("en-GB")}</td>
                    <td>₹&nbsp;{txn.amount}</td>
                    <td>{txn.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="center flex-col pt-20">
        <div className="btn-con center">
          <button onClick={ShowQr} className="noprint">
            {toggleQr ? "Hide QR" : "Show QR"}
          </button>
          <button onClick={handlePrint} className="noprint">
            Print
          </button>
          {!mailLoading && (
            <button
              className="btn email-btn noprint"
              onClick={confirmSendMail}
              style={{ width: "10em" }}
            >
              Send Mail
            </button>
          )}
          {mailLoading && (
            <div className="center">
              <Triangle
                visible={true}
                height="50"
                width="50"
                color="#984bf7"
                ariaLabel="triangle-loading"
              />
            </div>
          )}
        </div>
        {toggleQr && (
          <div className="qr-details pt-20 noprint">
            <img src={qr_mbk} alt="qr" height={300} width={300} />
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
