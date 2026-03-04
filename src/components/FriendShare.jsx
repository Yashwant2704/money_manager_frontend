import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import ActionChoiceModal from "./ActionChoiceModal";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./FriendShare.css";

function FriendShare() {
  const { friend } = useOutletContext();

  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return { Authorization: `Bearer ${token}` };
  };

  const printSelectedTransactions = (transactions) => {
  const printWindow = window.open("", "_blank", "width=900,height=700");

  if (!printWindow) {
    toast.error("Pop-up blocked. Please allow pop-ups.");
    return;
  }

  const html = `
  <html>
  <head>
    <title>${friend.name}'s Account - Y-MoneyManager</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Poppins', sans-serif;
        padding: 30px;
        background-color: #1F1B24;
        color: #ffffff;
        margin: 0;
      }

      .container {
        max-width: 900px;
        margin: auto;
      }

      .header {
        border: 2px solid #BB86FC;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 30px;
        text-align: center;
        box-shadow: 0 8px 25px rgba(0,0,0,0.4);
      }

      .header h1 {
        margin: 0;
        color: #BB86FC;
        font-size: 28px;
      }

      .balance {
        margin-top: 10px;
        font-size: 20px;
        font-weight: 600;
      }

      .balance span {
        color: #BB86FC;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        background-color: #272727;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 6px 18px rgba(0,0,0,0.5);
      }

      th {
        background: linear-gradient(90deg,#BB86FC,#984bf7);
        color: #1F1B24;
        padding: 14px;
        text-align: left;
        font-weight: 600;
      }

      td {
        padding: 12px;
        border-bottom: 1px solid #333;
      }

      tr:last-child td {
        border-bottom: none;
      }

      .qr-section {
        margin-top: 40px;
        text-align: center;
      }

      .qr-section p {
        color: #BB86FC;
        margin-bottom: 10px;
      }

      .footer {
        margin-top: 50px;
        text-align: center;
        font-size: 12px;
        color: #aaa;
        border-top: 1px solid #444;
        padding-top: 15px;
      }

      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">

      <div class="header">
        <h1>${friend.name}</h1>
        <div class="balance">
          Current Balance: <span>₹${Number(friend.balance).toFixed(2)}</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          ${transactions
            .map(
              (txn) => `
            <tr>
              <td>${new Date(txn.date).toLocaleDateString("en-GB")}</td>
              <td>₹${txn.amount}</td>
              <td>${txn.note}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      ${
        friend.balance > 0
          ? `
        <div class="qr-section">
          <p>Scan to settle via UPI</p>
          <img 
            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
              `upi://pay?pa=7350998157@upi&pn=Yashwant Nagarkar&am=${Number(
                friend.balance
              ).toFixed(2)}`
            )}" 
            width="200"
            style="
    border: 2px solid #831dff90;
    border-radius: 12px;
    padding: 8px;
    background: #ffffff;
  "
          />
          <p style="font-size:12px;color:#aaa;margin-top:8px;">
            Google Pay • PhonePe • Paytm • BHIM
          </p>
        </div>
      `
          : ""
      }

      <div class="footer">
        Generated via <a href="https://ymoneymanager.netlify.app" style="text-decoration: none; color: #BB86FC">Y-MoneyManager</a> • ${new Date().toLocaleDateString()}
      </div>

    </div>

    <script>
      window.onload = function() {
        window.print();
        setTimeout(() => window.close(), 150);
      };
    </script>
  </body>
  </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

  const handleActionConfirm = async (selectedTransactions) => {
    setActionModalOpen(false);

    if (!selectedTransactions || selectedTransactions.length === 0) {
      toast.error("No transactions selected");
      return;
    }

    if (actionType === "print") {
      printSelectedTransactions(selectedTransactions);
    }

    if (actionType === "mail") {
      const headers = getAuthHeaders();
      if (!headers) return;

      const user = JSON.parse(localStorage.getItem("user"));

      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE}/email/selected`,
          { friend, selectedTransactions, user },
          { headers },
        );
        toast.success("Mail sent!");
      } catch (err) {
        toast.error("Mail failed");
      }
    }
  };

  return (
    <div className="share-page">
      <h2>Share Account</h2>

      <button
        onClick={() => {
          setActionType("print");
          setActionModalOpen(true);
        }}
      >
        Print Selected
      </button>

      <button
        onClick={() => {
          setActionType("mail");
          setActionModalOpen(true);
        }}
      >
        Email Selected
      </button>

      <ActionChoiceModal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        onConfirm={handleActionConfirm}
        transactions={friend.transactions || []}
        title={`Select Transactions to ${
          actionType === "mail" ? "Email" : "Print"
        }`}
        actionLabel={actionType === "mail" ? "Send Mail" : "Print"}
      />
    </div>
  );
}

export default FriendShare;
