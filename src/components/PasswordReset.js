import React, { useState } from 'react';
import axios from 'axios';

const PasswordReset = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState('');  // Store userId when OTP is sent
    const [otpSent, setOtpSent] = useState(false);  // Track OTP sent status

    const requestOtp = async () => {
        if (!username || !email) {
            setMessage('Username and Email are required.');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/password-reset-request/', { username, email });
            setMessage(response.data.message);
            setUserId(response.data.user_id);  // Store the userId for resetting the password
            setOtpSent(true);  // Set OTP sent state to true
        } catch (error) {
            setMessage(error.response ? error.response.data.error : 'An error occurred while sending OTP.');
        }
    };

    const resetPassword = async () => {
        if (!otp || !newPassword) {
            setMessage('OTP and New Password are required.');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/password-reset/', {
                username,
                otp_code: otp,
                new_password: newPassword,
                user_id: userId  // Use stored userId to reset password
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response ? error.response.data.error : 'An error occurred while resetting the password.');
        }
    };

    return (
        <div>
            <h2>Password Reset</h2>
            <div>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <button onClick={requestOtp}>Send OTP</button>
            </div>
            {otpSent && (  // Show OTP and new password fields only if OTP is sent
                <div>
                    <input 
                        type="text" 
                        placeholder="OTP" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="New Password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                    />
                    <button onClick={resetPassword}>Reset Password</button>
                </div>
            )}
            {message && <p>{message}</p>}
        </div>
    );
};

export default PasswordReset;
