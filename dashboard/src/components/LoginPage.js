import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await axios.post(`${API_URL}/auth/login`, {
          email,
          password
        });
        
        if (response.data.success) {
          localStorage.setItem('userId', response.data.userId);
          localStorage.setItem('userEmail', response.data.email);
          localStorage.setItem('userName', response.data.name || '');
          localStorage.setItem('userAge', response.data.age || '');
          onLogin(response.data);
        }
      } else {
        // Register
        const response = await axios.post(`${API_URL}/auth/register`, {
          email,
          password,
          name: name || null,
          age: age ? parseInt(age) : null
        });
        
        if (response.data.success) {
          // Auto-login after registration
          localStorage.setItem('userId', response.data.userId);
          localStorage.setItem('userEmail', response.data.email);
          localStorage.setItem('userName', name || '');
          localStorage.setItem('userAge', age || '');
          onLogin({
            userId: response.data.userId,
            email: response.data.email,
            name: name || null,
            age: age ? parseInt(age) : null
          });
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <span className="login-icon">🧠⚙️</span>
          <h1>AI Awareness Tracker</h1>
          <p>Track your AI usage across all devices</p>
        </div>

        <div className="login-tabs">
          <button
            className={`tab-button ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
          >
            Login
          </button>
          <button
            className={`tab-button ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="name">Name (Optional)</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="age">Age (Optional)</label>
                <input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Your age"
                  min="1"
                  max="120"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isLogin ? "Your password" : "At least 6 characters"}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button
                  className="link-button"
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                  }}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  className="link-button"
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                  }}
                >
                  Login
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
