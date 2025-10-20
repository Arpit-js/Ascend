import React from 'react';
import styles from './FormControls.module.css';

export const FormGroup = ({ children }) => {
  return <div className={styles.formGroup}>{children}</div>;
};

export const Label = ({ htmlFor, children }) => {
  return <label htmlFor={htmlFor} className={styles.label}>{children}</label>;
};

export const Input = (props) => {
  return <input {...props} className={`${styles.input} ${props.className || ''}`} />;
};

export const Textarea = (props) => {
  return <textarea {...props} className={`${styles.textarea} ${props.className || ''}`} />;
};