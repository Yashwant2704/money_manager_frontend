import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/money-logo.svg'

function Navbar() {
  const navigate = useNavigate();
  const userLoggedIn = localStorage.getItem('token');
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  }
  return (
    <nav className="navbar">
      <Link className="navbar-link" to="/"><div className="navbar-title"><img src={logo} alt="logo" className='logo-svg' /> Y-MoneyManager</div></Link>
      {/* {userLoggedIn && <Link className="navbar-link" to="/">Home</Link>} */}
      {userLoggedIn && <button className="navbar-link" onClick={logout}>Logout</button>}
    </nav>
  );
}

export default Navbar;
