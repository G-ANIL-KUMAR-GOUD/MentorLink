import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, role, userId } = response.data;

            login(token, { email, role, userId });

            if (role === 'MENTOR') {
                navigate('/mentor');
            } else if (role === 'MENTEE') {
                navigate('/mentee');
            } else if (role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError('Invalid email or password');
            console.error('Login failed:', err);
        }
    };

    return (
        <>
            <h1 className="auth-heading">Sign In</h1>
            {error && <div className="auth-error" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit" className="auth-button">Sign In</button>
            </form>
            <div className="auth-link">
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </div>
        </>
    );
};

export default Login;
