import { NavLink, Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Triangle } from "react-loader-spinner";
import { Toaster, toast } from "react-hot-toast";
import "./FriendLayout.css";

function FriendLayout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);

  const prevPath = useRef(location.pathname);
  const [slideClass, setSlideClass] = useState("");

  /* ================= FETCH FRIEND ================= */

  const fetchFriend = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE}/friends/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFriend(res.data);

    } catch (err) {
      toast.error(err.response?.data?.message || err.message, {
        style: {
          border: "3px solid #bb86fc",
          padding: "16px",
          color: "#ffffff",
          background: "#272727",
        },
        iconTheme: {
          primary: "#bb86fc",
          secondary: "#272727",
        },
      });

      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriend();
  }, [id]);

  /* ================= TAB SLIDE LOGIC ================= */

  useEffect(() => {
    const current = location.pathname;
    const previous = prevPath.current;

    const order = ["", "transactions", "settle", "share"];

    const getIndex = (path) => {
      const last = path.split("/").pop();
      return order.indexOf(last);
    };

    const currentIndex = getIndex(current);
    const previousIndex = getIndex(previous);

    if (currentIndex > previousIndex) {
      setSlideClass("slide-left");
    } else if (currentIndex < previousIndex) {
      setSlideClass("slide-right");
    }

    prevPath.current = current;

    const timeout = setTimeout(() => {
      setSlideClass("");
    }, 300);

    return () => clearTimeout(timeout);
  }, [location]);

  /* ================= LOADING SCREEN ================= */

  if (loading) {
    return (
      <div className="center" style={{ minHeight: "60vh" }}>
        <Triangle
          visible={true}
          height="120"
          width="120"
          color="#984bf7"
          ariaLabel="triangle-loading"
        />
      </div>
    );
  }

  /* ================= MAIN UI ================= */

  return (
    <>

      <div className="friend-layout">
        <div className="friend-header">
          <h1>{friend?.name}</h1>
          <div className="balance-display">
            ₹{Number(friend?.balance || 0).toFixed(2)}
          </div>
        </div>

        <div className="friend-tabs">
          <NavLink end to="">
            Add/Subtract
          </NavLink>
          <NavLink to="transactions">Transactions</NavLink>
          <NavLink to="settle">Settle</NavLink>
          <NavLink to="share">Share</NavLink>
          <NavLink to="shared">Shared</NavLink>
        </div>

        <div className="friend-content">
          <div className={`tab-content ${slideClass}`}>
            <Outlet context={{ friend, refresh: fetchFriend }} />
          </div>
        </div>
      </div>
    </>
  );
}

export default FriendLayout;