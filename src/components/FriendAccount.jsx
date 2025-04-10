import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Triangle } from "react-loader-spinner";
import "./FriendAccount.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import qr from "../assets/qr.jpg";

function FriendAccount({ friend, refresh }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [toggleQr, setQr] = useState(false);
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
    const htmlContent = `
      <div style="font-family: 'Segoe UI', sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #7e5bef;">Hello ${friend.name},</h2>
        <p style="font-size: 16px;">You owe me some money, so here's your account details:</p>
  
        <div style="margin: 20px 0;">
          <strong style="font-size: 18px;">Current Balance:</strong>
          <p style="font-size: 24px; color: ${friend.balance >= 0 ? '#28a745' : '#dc3545'};">
            ₹${friend.balance}
          </p>
        </div>
  
        <h3 style="margin-bottom: 10px;">Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="padding: 10px; border: 1px solid #ddd;">Date</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Amount</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Note</th>
            </tr>
          </thead>
          <tbody>
            ${friend.transactions
              .map(
                (txn) => `
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">${new Date(
                  txn.date
                ).toLocaleDateString("en-GB")}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">₹${txn.amount}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${txn.note}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
  
        <p style="margin-top: 30px; font-size: 16px;">
          You can make payment on the following QR code:
        </p>
        <img src="https://ymoneymanager.netlify.app/assets/qr-DzhZyERJ.jpg" alt="QR Code" style="width: 100%; max-width: 300px; margin: 20px 0;" />
        <p style="margin-top: 20px; font-size: 14px; color: #777;">
        </p>
  
        <p style="font-size: 16px; margin-top: 20px;">Regards,<br/><strong>Yashwant</strong></p>
      </div>
    `;
  
    axios
      .post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            name: "YMoney",
            email: "yashwantnagarkar04@gmail.com",
          },
          to: [
            {
              email: "202202180@vupune.ac.in",
            },
          ],
          subject: `Hey ${friend.name}, you owe me some money!`,
          htmlContent,
        },
        {
          headers: {
            accept: "application/json",
            "api-key": import.meta.env.VITE_BREVO_API_KEY,
            "content-type": "application/json",
          },
        }
      )
      .then(() => {
        alert("Email sent successfully!");
      })
      .catch((err) => {
        console.error("Email Error:", err.response?.data || err.message);
        alert("Failed to send email. Check console for details.");
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
          <button onClick={ShowQr}>Show QR</button>
          {/* <button className="btn email-btn" onClick={handleSendEmail} style={{ width: '12em' }}>
            Send Balance via Email
          </button> */}
        </div>
        {toggleQr && (
          <div className="qr-details pt-20">
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
