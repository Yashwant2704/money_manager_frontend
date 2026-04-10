import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import FriendLayout from "./components/FriendLayout";
import FriendOverview from "./components/FriendOverview";
import FriendPage from "./pages/FriendPage";
import FriendTransactions from "./components/FriendTransactions";
import FriendSettle from "./components/FriendSettle";
import FriendShare from "./components/FriendShare";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import TransactionPage from "./pages/TransactionPage";
import ImpersonationBanner from "./components/ImpersonationBanner";
import ForgotPassword from "./pages/ForgotPassword";
import Footer from "./components/Footer";
import Banner from "./components/Banner";
import { Toaster } from "react-hot-toast";
import CoinLoader from "./components/CoinLoader";

import "./App.css";
import AdminApp from "./pages/AdminApp";
import TestPage from "./pages/TestPage";
import SharedTransactions from "./components/SharedTransactions";

function App() {
  const navigate = useNavigate();
  const userLoggedIn = localStorage.getItem("token");
  const publicRoutes = ["/login", "/forgot-password"];

  useEffect(() => {
    const isPublicRoute = publicRoutes.includes(location.pathname);
    if (!userLoggedIn && !isPublicRoute) {
      navigate("/login"); // ✅ Use inside useEffect
    }
  }, [userLoggedIn, navigate]);

  const [bannerVisible, setBannerVisible] = useState(true);
  const [isLoading, setLoading] = useState(true);

  const latestChangesMessage =
    "⚠️ Latest fix (26/09/25): Fixed delete transaction function";
  const [dismissAnimating, setDismissAnimating] = useState(false);

  const handleClose = () => {
    setDismissAnimating(true);
    setTimeout(() => {
      setBannerVisible(false);
      setDismissAnimating(false);
    }, 400); // Duration matches slideUpFade animation
  };

  // if (isLoading) {
  //   return <CoinLoader />; // Use your new loader here
  // }
  return (
    <div className="app dark-theme">
      <ImpersonationBanner />
      <div>
        <Toaster />
      </div>
      {userLoggedIn && <Navbar />}
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
        <Route path="/friend/:id" element={<FriendLayout />}>
          <Route index element={<FriendOverview />} />
          <Route path="transactions" element={<FriendTransactions />} />
          <Route path="settle" element={<FriendSettle />} />
          <Route path="share" element={<FriendShare />} />
          <Route path="shared" element={<SharedTransactions />} />
        </Route>
        <Route path="/transaction/:id" element={<TransactionPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/friendAccount/:id" element={<FriendPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
