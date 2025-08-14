import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import CareerPathsPage from './pages/CareerPathsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EditProfilePage from './pages/EditProfilePage';
import './App.css';

const AppContent = () => {
  const { session } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // Add the dynamic class here
    <div className={`app-layout ${isSidebarOpen ? 'sidebar-is-open' : ''}`}>
      {session && <Sidebar isOpen={isSidebarOpen} onLinkClick={() => setIsSidebarOpen(false)} />}
      <div className="main-content-wrapper">
        {session && <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />}
        <div className="page-content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/edit-profile" element={<EditProfilePage />} />
              <Route path="/paths" element={<CareerPathsPage />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}

const App = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;