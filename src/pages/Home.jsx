import { useState } from "react";
import AddFriendForm from "../components/AddFriendForm";
import FriendList from "../components/FriendList";
import "./Home.css";
import { useEffect } from "react";

function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(()=>{
    document.title="YMoneyManager"
  })

  return (
    <div className="home">
      <FriendList refreshTrigger={refreshTrigger} />
      <AddFriendForm refresh={triggerRefresh} />
    </div>
  );
}

export default Home;
