
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './Sidebar.css';

import appLogo from '../../assets/logo.png'; 
import dashboardIcon from '../../assets/dashboard-line.png';
import profileIcon from '../../assets/user-fill.png';
import pathIcon from '../../assets/route-line.png';
import logoutIcon from '../../assets/logout-box-line.png';

const Sidebar = ({ isOpen, onLinkClick }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if(onLinkClick) onLinkClick(); // Close sidebar on mobile after logout
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
  
  <img src={appLogo} alt="Ascend Logo" className="sidebar-logo-img" />
  
  <h2 className="sidebar-app-name">Ascend</h2>
</div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" onClick={onLinkClick}>
              {/* Use imported dashboard icon */}
              <img src={dashboardIcon} alt="" className="sidebar-icon-img" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" onClick={onLinkClick}>
               {/* Use imported profile icon */}
              <img src={profileIcon} alt="" className="sidebar-icon-img" />
              <span>My Profile</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/paths" onClick={onLinkClick}>
              {/* Use imported path icon */}
              <img src={pathIcon} alt="" className="sidebar-icon-img" />
              <span>Career Paths</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-logout-button">
            {/* Use imported logout icon */}
            <img src={logoutIcon} alt="" className="sidebar-icon-img logout-icon" />
            <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;