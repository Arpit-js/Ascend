import React from 'react';
import Card from '../components/common/Card';
import './LoginPage.css'; // We can reuse login page styles

const ForgotPasswordPage = () => {
  return (
    <div className="login-page-container">
      <Card>
        <div className="login-form">
          <h2>Reset Password</h2>
          <p>Enter your email address to receive a password reset link.</p>
          <form>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="you@example.com" />
            </div>
            <button type="submit" className="btn btn-primary">Send Reset Link</button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;