import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './LoginPage.css';

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSessionAvailable, setIsSessionAvailable] = useState(false); // New state to track token
  const navigate = useNavigate();

  // Effect to listen for the URL hash and verify the session
  useEffect(() => {
    // Check if Supabase successfully redirected us with a session fragment
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
            // A session is available from the URL fragment! We can proceed.
            setIsSessionAvailable(true);
        } else {
            // No session was found in the URL.
            setMessage("Error: Reset link is invalid or expired. Please request a new one.");
        }
    });
  }, []);

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Error: Passwords do not match.');
      return;
    }
    
    // Check if we verified the session before proceeding
    if (!isSessionAvailable) {
        setMessage('Error: Cannot update password. Invalid session or token expired.');
        return;
    }

    setLoading(true);

    // Supabase automatically uses the token it detected earlier to update the user.
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setMessage(`Error: ${error.message}. Please try the 'Forgot Password' link again.`);
      console.error('Password update error:', error);
    } else {
      setMessage('Success! Your password has been updated. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <div className="login-page-container">
      <Card>
        <div className="login-form">
          <h2>Set New Password</h2>
          <p className="reset-instruction">Enter and confirm your new strong password.</p>
          
          <form onSubmit={handleUpdatePassword}>
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            
            {/* Show status message */}
            {message && <p className={`status-message ${message.startsWith('Success') ? 'success' : 'error'}`}>{message}</p>}

            {/* Disable button if loading or session is not verified */}
            <Button type="submit" disabled={loading || !isSessionAvailable}>
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default UpdatePasswordPage;