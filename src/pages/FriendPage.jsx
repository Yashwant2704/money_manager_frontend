import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import FriendAccount from '../components/FriendAccount';
import './FriendPage.css';

function FriendPage() {
  const { id } = useParams();
  const [friend, setFriend] = useState(null);

  const fetchFriend = () => {
    axios.get(`${import.meta.env.VITE_API_BASE}/friends`)
      .then(res => {
        const found = res.data.find(f => f._id === id);
        setFriend(found);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchFriend();
  }, [id]);

  return (
    <div className="friend-page">
      {friend ? <FriendAccount friend={friend} refresh={fetchFriend} /> : <p>Loading...</p>}
    </div>
  );
}

export default FriendPage;
