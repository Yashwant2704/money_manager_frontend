import { useOutletContext, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./FriendTransactions.css";

function FriendTransactions() {
  const { friend } = useOutletContext();
  const navigate = useNavigate();

  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight;

      setShowTop(scrollTop > 200);
      setShowBottom(scrollTop + windowHeight < fullHeight - 200);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  };

  return (
    <div className="transactions-page">
      <h2>All Transactions</h2>

      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {friend.transactions
            .filter(txn => !txn.mirrored)
            .map((txn) => (
              <tr
                key={txn._id}
                onClick={() => navigate(`/transaction/${txn._id}`)}
                style={{ cursor: "pointer" }}
              >
                <td>{new Date(txn.date).toLocaleDateString("en-GB")}</td>
                <td>₹{txn.amount}</td>
                <td>{txn.note}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* 🔥 Minimal Scroll Buttons */}
      <div className="scroll-buttons">
        {showTop && (
          <button className="scroll-btn" onClick={scrollToTop}>
            ↑
          </button>
        )}
        {showBottom && (
          <button className="scroll-btn" onClick={scrollToBottom}>
            ↓
          </button>
        )}
      </div>
    </div>
  );
}

export default FriendTransactions;