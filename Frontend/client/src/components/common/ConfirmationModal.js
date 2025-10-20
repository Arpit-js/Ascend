import React from 'react';
import styles from './ConfirmationModal.module.css';
import Button from './Button';
import Card from './Card';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <Card className={styles.modal}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.content}>
          {children}
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onConfirm}>Confirm</Button>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmationModal;