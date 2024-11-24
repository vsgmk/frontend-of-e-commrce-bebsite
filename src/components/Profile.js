import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

function Profile() {
    const [userData, setUserData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch user data from backend
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setErrorMessage('No token found. Please log in.');
                    return;
                }

                const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Store the fetched user data
                setUserData(response.data);
            } catch (error) {
                // Handle errors from fetching the profile
                setErrorMessage('Failed to load profile data.');
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfileData();
    }, []);

    // Handle input changes for editable fields
    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    // Handle form submission to update user data
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setErrorMessage('No token found. Please log in.');
                return;
            }

            const response = await axios.put('http://127.0.0.1:8000/api/profile/', userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Display success message after successful update
            setSuccessMessage('Profile updated successfully.');
            setEditMode(true);  // Stay in edit mode after successful update

            // Optional: Refetch user data if needed
            // fetchProfileData();
        } catch (error) {
            // Handle errors from updating the profile
            setErrorMessage('Failed to update profile. Please try again.');
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="profile-container">
            <h2>Profile Information</h2>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            {userData ? (
                <form className="profile-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={userData.username}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label>First Name:</label>
                        <input
                            type="text"
                            name="first_name"
                            value={userData.first_name}
                            disabled={!editMode}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name:</label>
                        <input
                            type="text"
                            name="last_name"
                            value={userData.last_name}
                            disabled={!editMode}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Contact Number:</label>
                        <input
                            type="text"
                            name="contact_number"
                            value={userData.contact_number}
                            disabled={!editMode}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Hobbies:</label>
                        <input
                            type="text"
                            name="hobbies"
                            value={userData.hobbies}
                            disabled={!editMode}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Address:</label>
                        <input
                            type="text"
                            name="address"
                            value={userData.address}
                            disabled={!editMode}
                            onChange={handleChange}
                        />
                    </div>

                    {editMode ? (
                        <div>
                            <button type="submit" className="save-btn">Save Changes</button>
                            <button type="button" className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
                        </div>
                    ) : (
                        <button type="button" className="edit-btn" onClick={() => setEditMode(true)}>
                            Edit Profile
                        </button>
                    )}
                </form>
            ) : (
                <p>Loading profile data...</p>
            )}
        </div>
    );
}

export default Profile;
