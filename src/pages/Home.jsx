import { useState } from "react";
import AddFriendForm from "../components/AddFriendForm";
import FriendList from "../components/FriendList";
import "./Home.css";

function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  return (
    <div className="home">
      <FriendList refreshTrigger={refreshTrigger} />
      <AddFriendForm refresh={triggerRefresh} />
    </div>
  );
}

export default Home;
