import { useState } from 'react';
import AddFriendForm from '../components/AddFriendForm';
import FriendList from '../components/FriendList';
import './Home.css';

function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  return (
    <div className="home">
      <AddFriendForm refresh={triggerRefresh} />
      <FriendList refreshTrigger={refreshTrigger} />
    </div>
  );
}

export default Home;
