import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Triangle } from "react-loader-spinner";
import "./FriendList.css";

function FriendList({ refreshTrigger }) {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function getFriends() {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE}/friends`)
      .then((res) => {
        setFriends(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }
  useEffect(() => {
    getFriends();
  }, [refreshTrigger]);

  let totalGetBack = 0;
  let totalOweOthers = 0;
  for(let friend of friends){
    if(friend.balance < 0){ totalOweOthers = totalOweOthers + friend.balance; }
    else totalGetBack = totalGetBack + friend.balance;
  }

  return (
    <div className="friend-list">
      <h2 className="friend-list-title">Friends</h2>
      <div className="verdict">
     {!loading && ( <div className="friend-list-total"><p className="white">You get</p><p className="total get">₹{totalGetBack}</p></div>)}
     {!loading && ( <div className="friend-list-total"><p className="white">You owe</p><p className="total owe">₹{totalOweOthers*-1}</p></div>)}
      </div>
      {loading && (
        <div className="center">
        <Triangle
        visible={true}
        height="80"
        width="80"
        color="#984bf7"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
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
