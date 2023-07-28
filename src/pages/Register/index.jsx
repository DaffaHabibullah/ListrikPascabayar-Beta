import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleRegister = (event) => {
        event.preventDefault();

        // Perform client-side form validation
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        // Make a POST request to the backend server
        axios
            .post('http://localhost:9000/register', { username, password })
            .then((response) => {
                console.log(response.data); // Handle the response accordingly
                setError('');
                setUsername('');
                setPassword('');

                navigate('/login');
            })
            .catch((error) => {
                console.error(error);
                setError('Registration failed');
            });
    };

    return (
        <div className="container">
            <div className="register-container">
                <h2>Register</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>
                    <p className="mt-3">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
