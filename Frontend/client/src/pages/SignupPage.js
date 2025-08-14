import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link
import { supabase } from '../supabaseClient';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './LoginPage.css'; // Reusing the login page styles

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      alert('Signup successful! Please check your email to verify.');
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  return (
    <div className="login-page-container">
      <Card>
        <div className="login-form">
          <h2>Create an Account</h2>
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit">Sign Up</Button>
          </form>

          {/* 2. Add the login link at the bottom */}
          <div className="login-links">
            <span>
              Already have an account? <Link to="/login">Log in</Link>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SignupPage;