import React from 'react';
import './Button.css';

const Button = ({ children, onClick, variant = 'primary', type = 'button', disabled = false }) => {
  const buttonClass = `btn ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'}`;
  return (
    <button className={buttonClass} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
};
export default Button;