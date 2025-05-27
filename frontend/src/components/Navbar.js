import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css'; // Style separately or inline

const Navbar = () => {
  const userId = localStorage.getItem('userId');
  return (
    <nav className="navbar">
      <Link to="/home"><div className="nav-logo">phreaky<br />phriday</div></Link>
      <div className="nav-links">
        <Link to="/home">home</Link>
        <Link to="/items">browse</Link>
        <Link to="/add-item">upload</Link>
        <Link to={`/profile/${userId}`}>profile</Link>
        {/* Add more links as you build */}
      </div>
    </nav>
  );
};

export default Navbar;
