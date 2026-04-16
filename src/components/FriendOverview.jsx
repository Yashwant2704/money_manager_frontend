import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Triangle } from "react-loader-spinner";
import "./FriendOverview.css";

function FriendOverview() {
  const { friend, refresh } = useOutletContext();

  const [mode, setMode] = useState("single");
  const [loading, setLoading] = useState(false);

  // single entry state
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  // multi entry state
  const [rows, setRows] = useState([{ amount: "", note: "" }]);

  const token = localStorage.getItem("token");

  const api = `${import.meta.env.VITE_API_BASE}/friends/transaction/${
    friend._id
  }`;

  /* ---------------- SINGLE TRANSACTION ---------------- */

  const handleSingle = async (value) => {
    if (!amount) return toast.error("Enter amount");

    try {
      setLoading(true);

      await axios.post(
        api,
        {
          amount: parseFloat(value),
          note,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAmount("");
      setNote("");
      refresh();
    } catch (err) {
      console.error(err);
      toast.error("Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- MULTIPLE TRANSACTIONS ---------------- */

  const handleMulti = async (type) => {
    const transactions = rows
      .filter((r) => r.amount)
      .map((r) => ({
        amount: type === "add" ? parseFloat(r.amount) : -parseFloat(r.amount),
        note: r.note,
      }));

    if (!transactions.length) {
      return toast.error("Enter at least one amount");
    }

    try {
      setLoading(true);

      await axios.post(
        api,
        { transactions },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRows([{ amount: "", note: "" }]);
      refresh();
    } catch (err) {
      console.error(err);
      toast.error("Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- TABLE HELPERS ---------------- */

  const addRow = () => {
    setRows([...rows, { amount: "", note: "" }]);
  };

  const removeRow = (index) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated.length ? updated : [{ amount: "", note: "" }]);
  };

  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  /* ---------------- UI ---------------- */
  if (loading) {
    return (
      <div className="center" style={{ minHeight: "20vh" }}>
        <Triangle
          visible={true}
          height="120"
          width="120"
          color="#984bf7"
          ariaLabel="triangle-loading"
        />
      </div>
    );
  }
  return (
    <>
      {!loading && (
        <div className="transaction-section noprint">
          <div className="mode-toggle">
            <span className={mode === "single" ? "active-label" : ""}>
              Single
            </span>

            <label className="switch">
              <input
                type="checkbox"
                checked={mode === "multi"}
                onChange={() => setMode(mode === "single" ? "multi" : "single")}
              />
              <span className="slider"></span>
            </label>

            <span className={mode === "multi" ? "active-label" : ""}>
              Multiple
            </span>
          </div>

          <h4 style={{ marginBottom: "10px" }}>Add / Subtract Money</h4>

          {/* ---------- SINGLE ENTRY ---------- */}

          {mode === "single" && (
            <>
              <input
                type="number"
                className="input-field"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <input
                type="text"
                className="input-field"
                placeholder="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <div className="transaction-buttons">
                <button
                  className="btn add-btn"
                  disabled={loading}
                  onClick={() => handleSingle(amount)}
                >
                  I paid
                </button>

                <button
                  className="btn subtract-btn"
                  disabled={loading}
                  onClick={() => handleSingle(-amount)}
                >
                  They paid
                </button>
              </div>
            </>
          )}

          {/* ---------- MULTI ENTRY TABLE ---------- */}

          {mode === "multi" && (
            <>
              <table style={{ width: "100%", marginBottom: "10px" }}>
                <thead>
                  <tr>
                    <th style={{ width: "150px", textAlign: "left" }}>
                      Amount
                    </th>
                    <th style={{ textAlign: "left" }}>Note</th>
                    <th style={{ width: "50px" }}></th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="number"
                          className="input-field"
                          placeholder="Amount"
                          value={row.amount}
                          onChange={(e) =>
                            updateRow(index, "amount", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Note"
                          value={row.note}
                          onChange={(e) =>
                            updateRow(index, "note", e.target.value)
                          }
                        />
                      </td>

                      <td>
                        <button
                          onClick={() => removeRow(index)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "16px",
                          }}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                className="btn"
                style={{ marginBottom: "10px" }}
                onClick={addRow}
              >
                + Add Row
              </button>

              <div className="transaction-buttons">
                <button
                  className="btn add-btn"
                  disabled={loading}
                  onClick={() => handleMulti("add")}
                >
                  I paid
                </button>

                <button
                  className="btn subtract-btn"
                  disabled={loading}
                  onClick={() => handleMulti("subtract")}
                >
                  They paid
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default FriendOverview;
