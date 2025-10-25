import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './LoginPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (event) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    // This URL must be a valid page in your application to handle the password change
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    setLoading(false);

    if (error) {
      setMessage(`Error: ${error.message}`);
      console.error(error);
    } else {
      setMessage('Success! Check your email for the password reset link.');
      setEmail('');
    }
  };

  return (
    <div className="login-page-container">
      <Card>
        <div className="login-form">
          <h2>Reset Password</h2>
          <p className="reset-instruction">Enter your email address to receive a password reset link.</p>
          
          <form onSubmit={handleReset}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            {message && <p className={`status-message ${message.startsWith('Success') ? 'success' : 'error'}`}>{message}</p>}

            <Button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;