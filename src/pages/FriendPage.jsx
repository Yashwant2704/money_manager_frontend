import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import FriendAccount from '../components/FriendAccount';
import { Triangle } from "react-loader-spinner";
import './FriendPage.css';

function FriendPage() {
  const { id } = useParams();
  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(false);


  const fetchFriend = () => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_BASE}/friends`)
      .then(res => {
        const found = res.data.find(f => f._id === id);
        setFriend(found);
        setLoading(false);
      })
      .catch(err => console.error(err));
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
        wrapperStyle={{}}
        wrapperClass=""
        />
        </div>
      )}
      {!loading && friend && (<FriendAccount friend={friend} refresh={fetchFriend} />)}
    </div>
  );
}

export default FriendPage;
