import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FriendList.css';

function FriendList({ refreshTrigger }) {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE}/friends`)
      .then(res => setFriends(res.data))
      .catch(err => console.error(err));
  }, [refreshTrigger]);

  return (
    <div className="friend-list">
      <h2 className="friend-list-title">Friends</h2>
      <ul className="friend-list-items">
        {friends.map(friend => (
          <li className="friend-list-item" key={friend._id} onClick={() => navigate(`/friend/${friend._id}`)}>
            <div>{friend.name}</div>
            <div className="friend-balance">₹{friend.balance}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FriendList;
