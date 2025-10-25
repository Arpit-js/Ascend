// Pathfinder-main/Frontend/client/src/components/common/Button.js
import React from 'react';
import './Button.css';

const Button = ({ children, onClick, variant = 'primary', type = 'button', disabled = false, className = '' }) => {
  // Combine base, variant, and any additional classes
  const buttonClass = `btn btn-${variant} ${className}`;

  return (
    <button className={buttonClass} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
};
export default Button;