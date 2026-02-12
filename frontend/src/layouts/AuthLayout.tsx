import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/Auth.css';
import logo from '../assets/synchrony_logo.png'; // Make sure this path is correct

const AuthLayout = () => {
    return (
        <div className="auth-container">
            <img src={logo} alt="Synchrony Logo" className="auth-logo" />
            <div className="auth-card">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
