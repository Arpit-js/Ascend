import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/');
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  return (
    <div className="login-page-container">
      <Card>
        <div className="login-form">
          <h2>Welcome Back</h2>
          <form onSubmit={handleLogin}>
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
            <Button type="submit">Log In</Button>
          </form>
          
          <div className="login-links">
            <Link to="/forgot-password">Forgot your password?</Link>
            <span>
              New user? <Link to="/signup">Sign up</Link>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;