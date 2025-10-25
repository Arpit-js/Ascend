import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="navbar">
      <button className="hamburger-menu" onClick={onMenuClick}>
        ☰
      </button>

      <div className="navbar-logo">
        <Link to="/">Pathfinder</Link>
      </div>

      <div className="profile-menu-container" ref={dropdownRef}>
        <div className="profile-link" onClick={toggleDropdown}>
          <span className="profile-icon">👤</span>
          <span className="profile-text"></span>
        </div>

        {isDropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-header">My Account</div>
            <ul>
              <li><Link to="/profile" onClick={() => setIsDropdownOpen(false)}>My Profile</Link></li>
              <li><Link to="/settings" onClick={() => setIsDropdownOpen(false)}>Setting</Link></li>
            </ul>
            <div className="dropdown-divider"></div>
            <ul>
              <li><Link to="/login" onClick={() => setIsDropdownOpen(false)}>Logout</Link></li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;