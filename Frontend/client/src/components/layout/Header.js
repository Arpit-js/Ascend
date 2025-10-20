import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { supabase } from '../../supabaseClient';
import styles from './Header.module.css'; // Import CSS module

// Import Assets
import ProfileIcon from '../../assets/user-fill.png';
import LogoutIcon from '../../assets/logout-box-line.png';
import SettingsIcon from '../../assets/settings-line.png';
import MenuIcon from '../../assets/menu-line.png';

const Header = ({ onMenuClick }) => {
  const { profile } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    navigate('/login');
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

  // Use profile avatar if available, otherwise fallback icon
  const avatarSrc = profile?.avatar_url || ProfileIcon;

  return (
    <header className={styles.mainHeader}>
      <div className={styles.headerLeft}>
        <div className={styles.headerIconWrapper} onClick={onMenuClick}>
          <img src={MenuIcon} alt="Menu" className={styles.headerMenuIcon} />
        </div>
        <h2 className={styles.headerTitle}>Welcome back, {profile?.name || 'User'}!</h2>
      </div>
      <div className={styles.headerRight} ref={dropdownRef}>
        <button className={styles.userAvatarContainer} onClick={toggleDropdown}>
          <img 
            src={avatarSrc} 
            alt="Avatar" 
            className={styles.userAvatarImg} 
            onError={(e) => { e.target.onerror = null; e.target.src = ProfileIcon; }} // Fallback on image error
          />
        </button>
        
        {isDropdownOpen && (
          <div className={styles.profileDropdown}>
            <div className={styles.dropdownHeader}>My Account</div>
            <ul>
              <li>
                <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>
                  <img src={ProfileIcon} alt="Profile" className={styles.dropdownIcon} />
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link to="/settings" onClick={() => setIsDropdownOpen(false)}>
                  <img src={SettingsIcon} alt="Settings" className={styles.dropdownIcon} />
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
            <div className={styles.dropdownDivider}></div>
            <button onClick={handleLogout} className={styles.logoutButton}>
              <img src={LogoutIcon} alt="Logout" className={styles.dropdownIcon} />
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;