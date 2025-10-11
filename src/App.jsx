import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import FriendPage from './pages/FriendPage';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import TransactionPage from './pages/TransactionPage';
import ImpersonationBanner from './components/ImpersonationBanner';
import Footer from './components/Footer';
import Banner from './components/Banner';
import { Toaster } from 'react-hot-toast';

import './App.css';
import AdminApp from './pages/AdminApp';
import TestPage from './pages/TestPage';

function App() {
  const navigate = useNavigate();
  const userLoggedIn = localStorage.getItem('token');
  useEffect(() => {
    if (!userLoggedIn) {
      navigate('/login'); // ✅ Use inside useEffect
    }
  }, [userLoggedIn, navigate]);

  const [bannerVisible, setBannerVisible] = useState(true);

  const latestChangesMessage = "⚠️ Latest fix (26/09/25): Fixed delete transaction function";
  const [dismissAnimating, setDismissAnimating] = useState(false);

  const handleClose = () => {
    setDismissAnimating(true);
    setTimeout(() => {
      setBannerVisible(false);
      setDismissAnimating(false);
    }, 400); // Duration matches slideUpFade animation
  };
  return (
    <div className="app dark-theme">
      <ImpersonationBanner />
    <div><Toaster/></div>
     {userLoggedIn &&( <Navbar />)}
     {/* {bannerVisible && (
        <Banner 
          message={latestChangesMessage} 
          onClose={handleClose} 
          className={dismissAnimating ? 'slide-up-fade' : 'slide-down-fade'}
        />
      )} */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/friend/:id" element={<FriendPage />} />
        <Route path="/transaction/:id" element={<TransactionPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
