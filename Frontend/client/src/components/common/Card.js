import React from 'react';
import styles from './Card.module.css'; // Import CSS module

const Card = ({ children, className = '' }) => {
  return (
    <div className={`${styles.card} ${className}`}>
      {children}
    </div>
  );
};
export default Card;