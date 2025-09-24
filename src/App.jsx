import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import FriendPage from './pages/FriendPage';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import TransactionPage from './pages/TransactionPage';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

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
    <div><Toaster/></div>
     {userLoggedIn &&( <Navbar />)}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/friend/:id" element={<FriendPage />} />
        <Route path="/transaction/:id" element={<TransactionPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
