import { useState, useEffect } from "react";
import AddFriendForm from "../components/AddFriendForm";
import FriendList from "../components/FriendList";
import SplitModal from "../components/SplitModal";
import axios from "axios";
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [splitModalOpen, setSplitModalOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    document.title = "YMoneyManager";
    fetchFriends();
  }, [refreshTrigger]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error('You must be logged in to perform this action.', {
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
      console.error('Error fetching friends:', error);
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
      
      toast.success(`Successfully split ₹${splitData.totalAmount} among ${splitData.selectedFriends.length + 1} people!`, {
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
      
      setSplitModalOpen(false);
    } catch (error) {
      console.error('Split transaction error:', error);
      toast.error(error.response?.data?.message || 'Failed to create split transaction', {
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
      throw error;
    }
  };

  return (
    <div className="home">
      <FriendList refreshTrigger={refreshTrigger} />
      <AddFriendForm refresh={triggerRefresh} />
      
      <button 
        className="split-toggle-btn"
        onClick={() => setSplitModalOpen(true)}
        disabled={friends.length === 0}
      >
        Split Between Friends
      </button>

      <SplitModal
        isOpen={splitModalOpen}
        onClose={() => setSplitModalOpen(false)}
        onSubmit={handleSplitTransaction}
        friends={friends}
      />
    </div>
  );
}

export default Home;
