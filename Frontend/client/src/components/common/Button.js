import React from 'react';
import styles from './Button.module.css'; // Import CSS module

const Button = ({ children, onClick, variant = 'primary', type = 'button', disabled = false, className = '' }) => {
  // Use module styles
  const buttonClass = `${styles.btn} ${styles[variant]} ${className}`;

  return (
    <button className={buttonClass} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;