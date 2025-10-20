import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import styles from './Sidebar.module.css'; // Import CSS module

// Import Assets
import AscendLogo from '../../assets/logo.png';
import DashboardIcon from '../../assets/dashboard-line.png';
import ProfileIcon from '../../assets/user-fill.png';
import CareerIcon from '../../assets/route-line.png';
import SettingsIcon from '../../assets/settings-line.png';
import LogoutIcon from '../../assets/logout-box-line.png';

const Sidebar = ({ isOpen, onLinkClick }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (onLinkClick) onLinkClick(); // Close sidebar on mobile
    navigate('/login');
  };

  // Function to determine active NavLink class
  const getNavLinkClass = ({ isActive }) => {
    return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.sidebarHeader}>
        <img src={AscendLogo} alt="Ascend Logo" className={styles.sidebarLogoImg} />
        <h2 className={styles.sidebarTitle}>Ascend</h2>
      </div>
      <nav className={styles.sidebarNav}>
        <ul>
          <li>
            <NavLink to="/" end className={getNavLinkClass} onClick={onLinkClick}>
              <img src={DashboardIcon} alt="" className={styles.navIcon} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={getNavLinkClass} onClick={onLinkClick}>
              <img src={ProfileIcon} alt="" className={styles.navIcon} />
              <span>My Profile</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/paths" className={getNavLinkClass} onClick={onLinkClick}>
              <img src={CareerIcon} alt="" className={styles.navIcon} />
              <span>Career Paths</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={getNavLinkClass} onClick={onLinkClick}>
              <img src={SettingsIcon} alt="" className={styles.navIcon} />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className={styles.sidebarFooter}>
        <button onClick={handleLogout} className={styles.sidebarLogoutButton}>
          <img src={LogoutIcon} alt="Logout" className={styles.navIcon} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;