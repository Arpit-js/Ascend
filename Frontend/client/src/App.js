import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useUser } from './contexts/UserContext';

// Layout
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Spinner from './components/common/Spinner';

// Pages
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import CareerPathsPage from './pages/CareerPathsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Import CSS Module
import styles from './App.module.css';

const App = () => {
  const { session, loading } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  // While the UserContext is establishing the session, show a full-page spinner.
  // This prevents any redirects or UI flashes before we know if the user is logged in.
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
        <Spinner size="large" />
      </div>
    );
  }

  // If the user is authenticated, render the main application layout.
  // Otherwise, render only the authentication routes.
  return (
    <>
      {session ? (
        <div className={styles.appLayout}>
          <Sidebar isOpen={isSidebarOpen} onLinkClick={closeSidebar} />
          <div className={styles.mainContent}>
            <Header onMenuClick={toggleSidebar} />
            <main className={styles.pageContainer}>
              <Routes>
                <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
                <Route path="/paths" element={<ProtectedRoute><CareerPathsPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                {/* If an authenticated user tries to visit any other page, redirect them to the dashboard */}
                <Route path="*" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              </Routes>
            </main>
          </div>
          {isSidebarOpen && <div className={styles.mobileOverlay} onClick={closeSidebar}></div>}
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          {/* If a non-authenticated user tries to visit any other page, redirect them to login */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      )}
    </>
  );
}

export default App;