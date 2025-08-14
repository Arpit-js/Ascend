import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './Sidebar.css';

const Sidebar = ({ isOpen, onLinkClick }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if(onLinkClick) onLinkClick();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <span className="sidebar-logo">❑</span>
        <h2>Pathfinder</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" onClick={onLinkClick}>
              <span className="sidebar-icon">📊</span>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" onClick={onLinkClick}>
              <span className="sidebar-icon">👤</span>
              <span>My Profile</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/paths" onClick={onLinkClick}>
              <span className="sidebar-icon">📈</span>
              <span>Career Paths</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-logout-button">
            <span className="sidebar-icon">➡️</span>
            <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;