import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleOtpRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/reset-password/', {
        username: username.trim(),
        email: email.trim(),
      });
      setMessage(response.data.message);
      setError('');
      setIsOtpSent(true);  // Set to true to show the OTP fields
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
      setMessage('');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== rePassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/reset-password/', {
        username: username.trim(),
        email: email.trim(),
        otp_code: otpCode,
        new_password: newPassword,
        re_password: rePassword,
      });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password.');
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={isOtpSent ? handlePasswordReset : handleOtpRequest}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        {isOtpSent && (
          <>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Enter OTP"
              required
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              required
            />
            <input
              type="password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              placeholder="Confirm password"
              required
            />
          </>
        )}
        <button type="submit">{isOtpSent ? 'Reset Password' : 'Send OTP'}</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ResetPassword;
