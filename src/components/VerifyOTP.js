import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Extract userId and email from query params
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');
  const email = queryParams.get('email');

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/verify-otp/', {
        user_id: userId,
        email: email,
        otp_code: otp
      });

      setMessage(response.data.message);

      if (response.status === 200) {
        navigate('/login');
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'OTP verification failed.');
    }
  };

  return (
    <div className="otp-container">
      <h2 className="otp-heading">Verify OTP</h2>
      <form className="otp-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Enter OTP:</label>
          <input type="text" name="otp" value={otp} onChange={handleChange} required />
        </div>
        <button type="submit" className="otp-btn">Verify OTP</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default VerifyOtp;
