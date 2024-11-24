import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    repassword: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    date_of_birth: '',
    gender: '',
    contact_number: '',
    hobbies: '',
    address: '',
    language: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.repassword) {
      setMessage("Passwords do not match.");
      return;
    }
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', formData);
      setMessage(response.data.message);
  
      // Redirect to OTP verification page with userId and email
      if (response.status === 201) {
        const userId = response.data.id;
        const email = response.data.email;
        navigate(`/verify-otp?userId=${userId}&email=${email}`);  // Corrected URL with `?`
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Registration failed.');
    }
  };
  

  return (
    <div className="register-container">
      <h2 className="register-heading">Create an Account</h2>
      <form className="register-form" onSubmit={handleSubmit}>
      <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
      <input type="password" name="repassword" value={formData.repassword} onChange={handleChange} placeholder="Confirm Password" required />
      <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" required />
      <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" required />
      <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} placeholder="Middle Name" required />
      <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
      <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" required />
      <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="Contact Number" required />
      <input type="text" name="hobbies" value={formData.hobbies} onChange={handleChange} placeholder="Hobbies" required />
      <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
      <input type="text" name="language" value={formData.language} onChange={handleChange} placeholder="Language" required />
        <button type="submit" className="register-btn">Register</button>
      </form>
      {message && <p>{message}</p>}
      <p className="login-message">
        Already have an account? <Link to="/login">Log in here</Link>
      </p>
    </div>
  );
}

export default Register;