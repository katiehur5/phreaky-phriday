import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Style separately or inline

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-logo">phreaky phriday</div>
      <div className="nav-links">
        <Link to="/home">home</Link>
        <Link to="/items">browse</Link>
        <Link to="/add-item">upload</Link>
        <Link to="/profile">profile</Link>
        {/* Add more links as you build */}
      </div>
    </nav>
  );
};

export default Navbar;
