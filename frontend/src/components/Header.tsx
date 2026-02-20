import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Layout.css';
import logo from '../assets/synchrony_logo_dark.png';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const userInitial = user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="main-header">
            <div className="header-left-top">
                <img src={logo} alt="Synchrony Logo" className="header-logo" />
                <span className="header-title">MentorLink</span>
            </div>

            <div className="header-right">
                <a href="#faq" className="nav-link">FAQs</a>

                <div className="user-controls">
                    <div className="profile-icon" title={user?.email}>
                        {userInitial}
                    </div>
                    <button 
                        className="logout-button" 
                        title="Logout"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
