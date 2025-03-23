import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import FriendPage from './pages/FriendPage';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import { useEffect } from 'react';

import './App.css';

function App() {
  const navigate = useNavigate();
  const userLoggedIn = localStorage.getItem('token');
  useEffect(() => {
    if (!userLoggedIn) {
      navigate('/login'); // ✅ Use inside useEffect
    }
  }, [userLoggedIn, navigate]);


  return (
    <div className="app dark-theme">
     {userLoggedIn &&( <Navbar />)}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/friend/:id" element={<FriendPage />} />
      </Routes>
    </div>
  );
}

export default App;
