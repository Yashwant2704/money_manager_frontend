import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { Triangle } from "react-loader-spinner";
import logo from '../assets/money-logo.svg';
import { Toaster, toast } from 'react-hot-toast';

function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);    // Toggle login/register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Backend API URL (change if needed)
  const API_URL =`${import.meta.env.VITE_API_BASE}/auth`;
;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const endpoint = isLogin ? `${API_URL}/login` : `${API_URL}/register`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error');

      if (isLogin && data.token) {
        // Save token from backend
        localStorage.setItem('token', data.token);
        toast.success('Login Successful!', {
          style: {
            border: '3px solid #bb86fc',
            padding: '16px',
            color: '#ffffff',
            background: '#272727'
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#272727',
          },
        });
        navigate('/');
      } else {
        toast.success('Registration Successful!', {
          style: {
            border: '3px solid #bb86fc',
            padding: '16px',
            color: '#ffffff',
            background: '#272727'
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#272727',
          },
        });
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message, {
        style: {
          border: '3px solid #bb86fc',
          padding: '16px',
          color: '#ffffff',
          background: '#272727'
        },
        iconTheme: {
          primary: '#bb86fc',
          secondary: '#272727',
        },
      });
    }
    setLoading(false);
  };

  return (
    <div className='Login'>
      <div className="login-container">
        <img src={logo} alt="logo" className='logo-login' />
        <h1>{isLogin ? 'Login' : 'Register'}</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            className='login-input'
            type="email"
            name='email'
            placeholder="Email"
            required
          />
          <input
            className='login-input'
            type="password"
            name='password'
            placeholder="Password"
            required
          />
          {loading && (
                      <div className="center">
                        <Triangle
                          visible={true}
                          height="50"
                          width="50"
                          color="#984bf7"
                          ariaLabel="triangle-loading"
                        />
                      </div>
          )}
          {!loading && <button disabled={loading}>{isLogin ? 'Login' : 'Register'}</button>}
        </form>
        <div style={{marginTop: '10px', cursor: 'pointer'}} className='options-menu'>
          {isLogin ? (
            <span onClick={() => setIsLogin(false)}>
              New user? <b className='light-purple'>Register here</b>
            </span>
          ) : (
            <span onClick={() => setIsLogin(true)}>
              Already registered? <b className='light-purple'>Login here</b>
            </span>
          )}
          <p>
    Forgot your password?{' '}
    <a href="/forgot-password" style={{ color: '#bb86fc', textDecoration: 'none' }}>
      Reset it here
    </a>
  </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
