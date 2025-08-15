import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FriendAccount from '../components/FriendAccount';
import { Triangle } from "react-loader-spinner";
import './FriendPage.css';

function FriendPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFriend = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/friends`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const found = res.data.find(f => f._id === id);
      if (!found) {
        setError('Friend not found');
        setFriend(null);
      } else {
        setFriend(found);
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to load friend data');
      }
      setFriend(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriend();
  }, [id]);

  return (
    <div className="friend-page">
      {loading && (
        <div className="center">
          <Triangle
            visible={true}
            height="150"
            width="150"
            color="#984bf7"
            ariaLabel="triangle-loading"
          />
        </div>
      )}
      {!loading && error && <div className="error">{error}</div>}
      {!loading && friend && <FriendAccount friend={friend} refresh={fetchFriend} />}
    </div>
  );
}

export default FriendPage;
