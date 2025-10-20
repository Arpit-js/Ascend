import React from 'react';
import styles from './AuthLayout.module.css';
import Logo from '../../assets/logo.png';
import Card from '../common/Card';

const AuthLayout = ({ title, children }) => {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <img src={Logo} alt="Ascend Logo" className={styles.authLogo} />
        <h2 className={styles.authTitle}>{title}</h2>
        <Card className={styles.authCard}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;