import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Triangle } from "react-loader-spinner";
import "./FriendList.css";

function FriendList({ refreshTrigger }) {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function getFriends() {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/friends`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFriends(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to load friends. Please try again later.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getFriends();
  }, [refreshTrigger]);

  let totalGetBack = 0;
  let totalOweOthers = 0;
  for (let friend of friends) {
    if (friend.balance < 0) {
      totalOweOthers += friend.balance;
    } else totalGetBack += friend.balance;
  }

  return (
    <div className="friend-list">
      <h2 className="friend-list-title">Friends</h2>

      {error && <div className="error-container">{error}</div>}

      {!loading && (
        <div>
          <div className="verdict">
            <div className="friend-list-total">
              <p className="white">You get</p>
            </div>
            <div className="friend-list-total">
              <p className="white">You owe</p>
            </div>
          </div>
          <div className="verdict verdict2">
            <p className="total get">₹{totalGetBack}</p>
            <p className="total owe">₹{totalOweOthers * -1}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="center">
          <Triangle
            visible={true}
            height="80"
            width="80"
            color="#984bf7"
            ariaLabel="triangle-loading"
          />
        </div>
      )}
      <ul className="friend-list-items">
        {friends.map((friend) => (
          <li
            className="friend-list-item"
            key={friend._id}
            onClick={() => navigate(`/friend/${friend._id}`)}
          >
            <div>{friend.name}</div>
            <div className="friend-balance">₹{friend.balance}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FriendList;
