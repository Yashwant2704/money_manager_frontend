import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-title">💸 Money Manager</div>
      <Link className="navbar-link" to="/">Home</Link>
    </nav>
  );
}

export default Navbar;
