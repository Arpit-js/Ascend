import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import AuthLayout from '../components/layout/AuthLayout';
import Button from '../components/common/Button';
import { FormGroup, Label, Input } from '../components/common/FormControls';
import styles from './LoginPage.module.css'; // Re-use login styles
import pageStyles from './ForgotPasswordPage.module.css'; // For success message

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin, // URL to redirect to after reset
      });
      if (error) throw error;
      setMessage('Password reset link sent! Check your email inbox.');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset Your Password">
      <form onSubmit={handlePasswordReset}>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {message && <p className={pageStyles.successMessage}>{message}</p>}
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@company.com"
          />
        </FormGroup>
        <Button type="submit" variant="primary" disabled={loading} className={styles.authButton}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>
      <p className={styles.bottomLink}>
        Remember your password? <Link to="/login">Log In</Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;