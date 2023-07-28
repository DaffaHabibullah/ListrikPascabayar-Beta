import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { AppContext } from '../../AppContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser, setCustomerId } = useContext(AppContext);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = (event) => {
        event.preventDefault();

        // Perform client-side form validation
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        // Make a POST request to the backend server
        axios
        .post('http://localhost:9000/login', { username, password })
        .then((response) => {
            console.log(response.data); // Handle the response accordingly

            // Pastikan server mengirimkan 'id_pelanggan' dan 'username' dalam respons
            if (response.data.id_pelanggan && response.data.username) {
                setError('');
                setUsername('');
                setPassword('');

                // Save the user login data in localStorage
                localStorage.setItem('user', response.data.username);
                localStorage.setItem('customerId', response.data.id_pelanggan);

                setUser(response.data.username);
                setCustomerId(response.data.id_pelanggan); // Set the customerId here

                navigate('/dashboard');
            } else {
                setError('Invalid username or password');
            }
        })
        .catch((error) => {
            console.error(error);
            setError('Invalid username or password');
        });
    };

    return (
        <div className="container">
            <div className="login-container">
                <h2>Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Username:</label>
                        <input type="text" className="form-control" value={username} onChange={handleUsernameChange} />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password" className="form-control" value={password} onChange={handlePasswordChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Login
                    </button>
                    <p className="mt-3">
                        Don't have an account? <Link to="/register">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
