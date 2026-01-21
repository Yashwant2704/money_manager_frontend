import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Triangle } from "react-loader-spinner";
import { Toaster, toast } from 'react-hot-toast';
import qr_mbk from "../assets/qr_mbk.png";
import qr from "../assets/qr.jpeg";
import qr_bhim from "../assets/qr_bhim.jpeg";
import SettleModal from "./SettleModal";
import ActionChoiceModal from "./ActionChoiceModal";
import QRCode from "react-qr-code";
import "./FriendAccount.css";

function FriendAccount({ friend, refresh }) {
  const [amount, setAmount] = useState("");
  const [mailLoading, setMailLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [toggleQr, setQr] = useState(false);
  const [qrNumber, setQrNumber] = useState(1);
  const [settleModalOpen, setSettleModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [transactionsToAction, setTransactionsToAction] = useState([]);
  const [actionType, setActionType] = useState(null); // "print" or "mail"
  const navigate = useNavigate();
  var userName = JSON.parse(localStorage.getItem("user")).name;
  const QrUrl = "upi://pay?pa=7350998157@upi&pn=Yashwant%20Nagarkar";
  var qrData = QrUrl+"&am="+friend.balance+"&tn="+userName+" Settle";
  const printRef = useRef(null);

  useEffect(() => {
    document.title = `${friend.name}'s Account - Y-MoneyManager`;
  }, [friend.name]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error('You must be logged in to perform this action.', {
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
      navigate("/login");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  const handleTransaction = async (value) => {
    if (!amount) return toast.error('Enter amount', {
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
        toast.error('Session expired. Please login again.', {
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
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error(err);
        toast.error('Transaction failed. Please try again.', {
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

  const handleSettleClick = () => {
    if (friend.balance === 0 || friend.balance === null || friend.balance === undefined) {
      return toast.error('No balance to settle', {
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
    }
    setSettleModalOpen(true);
  };

  const handleSettleConfirm = async (paymentMethod) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    setLoading(true);
    try {
      const settlementAmount = -friend.balance;
      const settlementNote = `Settled (${paymentMethod})`;

      await axios.post(
        `${import.meta.env.VITE_API_BASE}/friends/transaction/${friend._id}`,
        {
          amount: settlementAmount,
          note: settlementNote,
        },
        { headers }
      );

      toast.success(`Balance settled successfully via ${paymentMethod}!`, {
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

      refresh();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error('Session expired. Please login again.', {
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
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error(err);
        toast.error('Settlement failed. Please try again.', {
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

  // Helper to print selected transactions in a new window
  const printSelectedTransactions = (transactions) => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) {
      toast.error("Pop-up blocked. Please allow pop-ups for this site to print.");
      return;
    }
  
    const html = `
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" />
      <title>${friend.name}'s Account - Y-MoneyManager</title>
      <style>
        body {
          font-family: 'Poppins', sans-serif;
          padding: 20px;
          background-color: #1F1B24;
          color: #ffffff;
          margin: 0;
          display: flex;
          flex-direction: column;
        }
        h1 {
          margin-bottom: 0.2em;
        }
        h3 {
          margin-top: 0;
          color: #BB86FC;
        }
        table.transactions-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          margin-top: 1rem;
          background-color: #1F1B24;
          border-radius: 0.5em;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        table.transactions-table th,
        table.transactions-table td {
          padding: 10px 10px;        /* Reduced padding */
          text-align: left;
          border-bottom: 1px solid #984bf7;
          font-size: 15px;          /* Adjust size if needed */
          max-width: 180px;
          word-break: break-word;
        }
        table.transactions-table th {
          background: linear-gradient(90deg, #831dff90, #984bf7);
          color: #fff;
          font-weight: bold;
          letter-spacing: 1px;
        }
        
        table.transactions-table tr {
          cursor: pointer;
        }
        table.transactions-table td:first-child,
        table.transactions-table th:first-child {
          border-left: none;
        }
        table.transactions-table td:last-child,
        table.transactions-table th:last-child {
          border-right: none;
        }
        .light-purple {
          color: #BB86FC;
        }
        .footer {
          margin-top: 2rem;
          text-align: center;
          padding-top: 12px;
          border-top: 1px solid #984bf7cc;
          font-size: 0.9rem;
          color: #bbb;
          user-select: none;
        }
        .footer p {
          margin: 4px 0;
          border-bottom: 3px solid #984bf7cc;
          display: inline;
          padding-bottom: 10px;
      }
      </style>
    </head>
    <body>
      <h1>${friend.name}</h1>
      <h3>Current balance: <span class="light-purple">₹${friend.balance}</span></h3>
      <table class="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          ${transactions.map(txn => `
            <tr>
              <td>${new Date(txn.date).toLocaleDateString('en-GB')}</td>
              <td>₹${txn.amount}</td>
              <td>${txn.note}</td>
            </tr>`).join('')}
        </tbody>
      </table>
      <div class="footer">
        <p>Y-MoneyManager</p>
      </div>
      <script>
        window.onload = function () {
          window.print();
          setTimeout(() => window.close(), 100);
        };
      </script>
    </body>
  </html>
  
    `;
  
    printWindow.document.write(html);
    printWindow.document.close();
  };
  
  // ActionChoiceModal invocation handlers

  const actionTypePrint = () => {
    setActionType("print");
    setTransactionsToAction(friend.transactions || []);
    setActionModalOpen(true);
  };

  const actionTypeMail = () => {
    setActionType("mail");
    setTransactionsToAction(friend.transactions || []);
    setActionModalOpen(true);
  };

  const handleActionConfirm = async (selectedTransactions) => {
    setActionModalOpen(false);
    if (!selectedTransactions || selectedTransactions.length === 0) {
      toast.error(`No transactions selected to ${actionType}`, {
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

    if (actionType === "print") {
      printSelectedTransactions(selectedTransactions);
    } else if (actionType === "mail") {
      await sendMailWithSelected(selectedTransactions);
    }
  };

  const sendMailWithSelected = async (selectedTransactions) => {
    const headers = getAuthHeaders();
    if (!headers) return;
    const user = JSON.parse(localStorage.getItem("user"));
  
    setMailLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE}/email/selected`, // Updated endpoint
        { friend, selectedTransactions, user }, // Send selected transactions
        { headers }
      );
      toast.success('Mail sent!', {
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
    } catch (err) {
      console.error("Email Error:", err.response?.data || err.message);
      toast.error(err.response?.data || err.message, {
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
    } finally {
      setMailLoading(false);
    }
  };  

  const ShowQr = () => {
    if (!friend.balance || friend.balance <= 0) return toast.error('No balance', {
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
    setQr(!toggleQr);
  };

  const handleQrNumber = () => {
    if (qrNumber === 0) setQrNumber(1);
    else if (qrNumber === 1) setQrNumber(2);
    else if (qrNumber === 2) setQrNumber(3);
    else if (qrNumber === 3) setQrNumber(4);
    else setQrNumber(0);
  };

  const confirmSendMail = () => {
    if (window.confirm("Are you sure you want to send email?")) {
      actionTypeMail();
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
            <button
              className="btn settle-btn"
              onClick={handleSettleClick}
              disabled={loading || friend.balance === 0 || friend.balance === null || friend.balance === undefined}
            >
              Settle
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
          <button onClick={actionTypePrint} className="noprint">
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
          <div className="qr-details pt-20 noprint" onClick={handleQrNumber}>
            {/* <h2 className="center">Click on qr to change</h2> */}
            {qrNumber === 0 && (
              <img src={qr} alt="qr" height={300} width={320} style={{ border: "3px solid #984bf7", borderRadius: "10px" }} />
            )}
            {qrNumber === 1 && (
              <div>
              <QRCode value={qrData} className="qr" level="L"/>
              </div>
            )}
            {qrNumber === 2 && (
              <div>
              <QRCode value={qrData} className="qr" level="M"/>
              </div>
            )}
            {qrNumber === 3 && (
              <div>
              <QRCode value={qrData} className="qr" level="H"/>
              </div>
            )}
            {qrNumber === 4 && (
              <img src={qr_bhim} alt="qr" height={300} width={300} style={{ border: "3px solid #984bf7", borderRadius: "10px", padding: "10px" }}/>
            )}
            <p className="white font-20px center">
              Pay&nbsp;
              <span className="friend-balance">₹{friend.balance}</span>
            </p>
          </div>
        )}
      </div>

      {/* Settle Modal */}
      <SettleModal
        isOpen={settleModalOpen}
        onClose={() => setSettleModalOpen(false)}
        onConfirm={handleSettleConfirm}
        friend={friend}
      />

      {/* ActionChoiceModal for Print or Mail */}
      <ActionChoiceModal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        onConfirm={handleActionConfirm}
        transactions={transactionsToAction}
        title={`Select Transactions to ${actionType === "mail" ? "Email" : "Print"}`}
        actionLabel={actionType === "mail" ? "Send Mail" : "Print"}
      />
    </div>
  );
}

export default FriendAccount;
