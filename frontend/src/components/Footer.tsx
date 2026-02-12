import React from 'react';
import '../styles/Layout.css';
import logo from '../assets/synchrony_logo_dark.png';

const Footer = () => {
    return (
        <footer className="main-footer">
            <img src={logo} alt="Synchrony Logo" className="footer-logo" />
        </footer>
    );
};

export default Footer;
