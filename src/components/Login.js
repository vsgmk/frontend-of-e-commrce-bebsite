import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [attemptCount, setAttemptCount] = useState(0);
    const [showResetLink, setShowResetLink] = useState(false);
    const navigate = useNavigate();

    // Function to refresh the token
    const refreshAuthToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
                refresh: refreshToken,
            });

            localStorage.setItem('token', response.data.access); // Store new access token
        } catch (error) {
            console.error('Token refresh failed', error);
            setErrorMessage('Session expired. Please log in again.');
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            navigate('/login');
        }
    };

    // Login submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear previous error messages

        // Check if username and password match the admin credentials
        if (username === 'admin' && password === 'nitraj9922') {
            // Directly navigate to Owner Dashboard
            navigate('/owner-dashboard');
            return; // Exit the function
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', {
                username,
                password,
            });

            if (response.status === 200) {
                localStorage.setItem('token', response.data.access); // Store access token
                localStorage.setItem('refresh_token', response.data.refresh); // Store refresh token

                // Set interval to refresh the token every 4 minutes (token expiry is 5 minutes)
                setInterval(() => {
                    refreshAuthToken();
                }, 1000 * 60 * 1000);

                // Redirect to the index page for non-admin users
                navigate('/index'); // Navigate to index.js (homepage)
            }
        } catch (error) {
            setAttemptCount((prevCount) => prevCount + 1);

            // Check if the error is related to invalid credentials
            if (error.response?.status === 401) {
                setErrorMessage('Invalid username or password. Please try again.');
            } else {
                setErrorMessage('Login failed. Please try again later.');
            }

            // Show reset password link after 3 failed attempts
            if (attemptCount >= 2) {
                setShowResetLink(true);
            }
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-heading">Welcome Back!</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-btn">
                    Log In
                </button>
            </form>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <p className="register-message">
                Don't have an account? <Link to="/register">Register here</Link>
            </p>

            {showResetLink && (
                <p className="reset-password-message">
                    Forgot your password? <Link to="/password-reset">Click here to reset it.</Link>
                </p>
            )}
        </div>
    );
}

export default Login;
