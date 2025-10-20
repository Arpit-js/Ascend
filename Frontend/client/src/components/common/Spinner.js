import React from 'react';
import styles from './Spinner.module.css';

const Spinner = ({ size = 'medium' }) => {
  const sizeClass = styles[size] || styles.medium;
  return <div className={`${styles.spinner} ${sizeClass}`}></div>;
};

export default Spinner;