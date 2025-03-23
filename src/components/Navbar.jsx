import { Link } from 'react-router-dom';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const userLoggedIn = localStorage.getItem('token');
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  }
  return (
    <nav className="navbar">
      <Link className="navbar-link" to="/"><div className="navbar-title">💸 Money Manager</div></Link>
      {userLoggedIn && <Link className="navbar-link" to="/">Home</Link>}
      {userLoggedIn && <button className="navbar-link" onClick={logout}>Logout</button>}
    </nav>
  );
}

export default Navbar;
