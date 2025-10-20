import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import AuthLayout from '../components/layout/AuthLayout';
import Button from '../components/common/Button';
import { FormGroup, Label, Input } from '../components/common/FormControls';
import styles from './LoginPage.module.css'; // Re-use login styles for errors/links

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // 1. Create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error('Sign up successful, but no user data returned.');

      // 2. Create the public user profile in 'users' table
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          { id: authData.user.id, name, email } // 'id' must match the auth user's ID
        ]);
      if (profileError) throw profileError;

      // Navigate to dashboard. Supabase auth listener will pick up the new session.
      // A "check your email" message might be better if email verification is on.
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Your Account">
      <form onSubmit={handleSignup}>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <FormGroup>
          <Label htmlFor="name">Full Name</Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Jane Doe"
          />
        </FormGroup>
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
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Minimum 6 characters"
          />
        </FormGroup>
        <Button type="submit" variant="primary" disabled={loading} className={styles.authButton}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>
      <p className={styles.bottomLink}>
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </AuthLayout>
  );
};

export default SignupPage;