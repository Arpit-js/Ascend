// Pathfinder-main/Frontend/client/src/components/common/Card.js
// No changes needed in the JS file.
import React from 'react';
import './Card.css';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;