import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import '../styles/Layout.css';
import logo from '../assets/synchrony_logo_dark.png'; // Make sure this path is correct

const Header = () => {
    const userFilename = "C";

    return (
        <header className="main-header">
            <div className="header-left">
                <img src={logo} alt="Synchrony Logo" className="header-logo" />
                <span className="header-title">MentorLink</span>
            </div>

            <div className="header-right">
                <Link to="/faq" className="nav-link">FAQs</Link>

                <div className="user-controls">
                    <div className="profile-icon">
                        {userFilename}
                    </div>
                    <button className="logout-button" title="Logout">
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
