import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <label className={styles.switch}>
      <input 
        type="checkbox" 
        onChange={toggleTheme}
        checked={theme === 'dark'}
      />
      <span className={styles.slider}></span>
    </label>
  );
};

export default ThemeToggle;