import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Triangle } from 'react-loader-spinner';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    
    if (!email) {
        console.log("No email found");
      return toast.error('Please enter your email');
    }

    setLoading(true);
    try {
        console.log("1");
      await axios.post(`${import.meta.env.VITE_API_BASE}/password-reset/request-otp`, {
        email
      });
      console.log("2");
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (error) {
        console.log("error");
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
        console.log("3");
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      return toast.error('Please enter a valid 6-digit OTP');
    }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/password-reset/verify-otp`, {
        email,
        otp
      });
      
      toast.success('OTP verified successfully!');
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/password-reset/reset-password`, {
        email,
        otp,
        newPassword
      });
      
      toast.success('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>🔐 Forgot Password</h2>
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleRequestOTP}>
            <p className="step-description">Enter your email address to receive an OTP</p>
            <input
              type="email"
              placeholder="your-email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="reset-input-field"
              required
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <Triangle height="20" width="20" color="#fff" /> : 'Send OTP'}
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => navigate('/login')}
            >
              Back to Login
            </button>
          </form>
        )}

        {/* Step 2: Enter OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <p className="step-description">Enter the 6-digit OTP sent to <strong>{email}</strong></p>
            <input
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="reset-input-field otp-input"
              maxLength="6"
              required
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <Triangle height="20" width="20" color="#fff" /> : 'Verify OTP'}
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => setStep(1)}
            >
              Change Email
            </button>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <p className="step-description">Create a new password for your account</p>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="reset-input-field"
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="reset-input-field"
              required
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <Triangle height="20" width="20" color="#fff" /> : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
