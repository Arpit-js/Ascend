import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../contexts/UserContext';
import styles from './SettingsPage.module.css';
import Card from '../components/common/Card';
import ThemeToggle from '../components/common/ThemeToggle';
import ConfirmationModal from '../components/common/ConfirmationModal';
import Button from '../components/common/Button';

const SettingsPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteAccount = async () => {
    setIsModalOpen(false);
    if (!user) return;

    try {
      // It's good practice to have a server-side function to handle this
      // to also delete user-related data from other tables.
      const { error } = await supabase.rpc('delete_user');
      
      if (error) throw error;

      // Force a sign out and navigate to login
      await supabase.auth.signOut();
      navigate('/login');

    } catch (error) {
      alert(`Error deleting account: ${error.message}`);
    }
  };


  return (
    <div className={styles.settingsPage}>
      <h1 className={styles.pageTitle}>Settings</h1>

      <Card>
        <h2 className={styles.cardTitle}>Appearance</h2>
        <div className={styles.settingItem}>
          <div>
            <h3 className={styles.settingName}>Theme</h3>
            <p className={styles.settingDescription}>Choose between light and dark mode.</p>
          </div>
          <ThemeToggle />
        </div>
      </Card>
      
      <Card>
        <h2 className={styles.cardTitle}>Account</h2>
        <div className={styles.settingItem}>
           <div>
            <h3 className={styles.settingName}>Delete Account</h3>
            <p className={styles.settingDescription}>Permanently delete your account and all data.</p>
          </div>
           <Button variant="secondary" className={styles.deleteButton} onClick={() => setIsModalOpen(true)}>Delete</Button>
        </div>
      </Card>

       <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
      >
        <p>Are you sure you want to delete your account? This action is irreversible and will delete all your data.</p>
      </ConfirmationModal>
    </div>
  );
};

export default SettingsPage;