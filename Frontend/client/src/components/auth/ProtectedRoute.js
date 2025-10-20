import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import Spinner from '../common/Spinner';

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useUser();

  // If the UserContext is still performing its initial check, show a full-page spinner.
  // This is the only state where the spinner should block the UI.
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spinner size="large" />
      </div>
    );
  }

  // If loading is complete and there is no valid session, redirect to the login page.
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // If loading is complete and a session exists, the user is authenticated. Render the page.
  return children;
};

export default ProtectedRoute;