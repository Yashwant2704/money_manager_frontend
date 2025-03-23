import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link className="navbar-link" to="/"><div className="navbar-title">💸 Money Manager</div></Link>
      
      <Link className="navbar-link" to="/">Home</Link>
    </nav>
  );
}

export default Navbar;
