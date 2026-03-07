import { useState, useEffect } from "react";
import AddFriendForm from "../components/AddFriendForm";
import FriendList from "../components/FriendList";
import SplitModal from "../components/SplitModal";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [splitModalOpen, setSplitModalOpen] = useState(false);
  const [friends, setFriends] = useState([]);

  const [upiModalOpen, setUpiModalOpen] = useState(false);
  const [upiId, setUpiId] = useState("");

  const navigate = useNavigate();

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    document.title = "YMoneyManager";
    fetchFriends();

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUpiId(parsed.upiId || "");
    }

  }, [refreshTrigger]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in.");
      navigate("/login");
      return null;
    }

    return { Authorization: `Bearer ${token}` };
  };

  const fetchFriends = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/friends`,
        { headers }
      );

      setFriends(response.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const handleSplitTransaction = async (splitData) => {

    const headers = getAuthHeaders();
    if (!headers) return;

    try {

      await axios.post(
        `${import.meta.env.VITE_API_BASE}/friends/transaction/split`,
        splitData,
        { headers }
      );

      triggerRefresh();

      toast.success(
        `Successfully split ₹${splitData.totalAmount} among ${
          splitData.selectedFriends.length + 1
        } people!`
      );

      setSplitModalOpen(false);

    } catch (error) {

      console.error("Split transaction error:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to create split transaction"
      );

      throw error;
    }
  };

  const saveUpi = async () => {

    const headers = getAuthHeaders();
    if (!headers) return;

    try {

      await axios.put(
        `${import.meta.env.VITE_API_BASE}/profile/users/upi`,
        { upiId },
        { headers }
      );

      const storedUser = JSON.parse(localStorage.getItem("user"));
      storedUser.upiId = upiId;

      localStorage.setItem("user", JSON.stringify(storedUser));

      toast.success("UPI ID updated");

      setUpiModalOpen(false);

    } catch (err) {

      toast.error("Failed to update UPI ID");

    }
  };

  return (
    <div className="home">

      <FriendList refreshTrigger={refreshTrigger} />

      <AddFriendForm refresh={triggerRefresh} />

      <div className="add-friend-form2">

        <h2>Split between</h2>

        <div className="split-actions">

          <button
            className="split-toggle-btn"
            onClick={() => setSplitModalOpen(true)}
            disabled={friends.length === 0}
          >
            Split Between Friends
          </button>

          <button
            className="upi-btn"
            onClick={() => setUpiModalOpen(true)}
          >
            Update UPI
          </button>

        </div>
      </div>

      <SplitModal
        isOpen={splitModalOpen}
        onClose={() => setSplitModalOpen(false)}
        onSubmit={handleSplitTransaction}
        friends={friends}
        upiId={upiId}
      />

      {/* UPI MODAL */}

      {upiModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setUpiModalOpen(false)}
        >

          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >

            <h3>Update UPI ID</h3>

            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="example@upi"
              className="upi-input"
            />

            <div className="modal-actions">

              <button
                onClick={() => setUpiModalOpen(false)}
              >
                Cancel
              </button>

              <button
                onClick={saveUpi}
              >
                Save
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Home;