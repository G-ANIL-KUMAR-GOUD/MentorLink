import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Loader } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login, loading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        // Validation
        if (!email || !password) {
            setLocalError('Please fill in all fields');
            return;
        }

        if (!email.includes('@')) {
            setLocalError('Please enter a valid email address');
            return;
        }

        try {
            await login(email, password);
            // Navigate based on role after login
            const token = localStorage.getItem('auth_token');
            if (token) {
                // Decode token to get role (simple JWT decode)
                const payload = JSON.parse(atob(token.split('.')[1]));
                const role = payload.role?.toLowerCase();
                
                if (role === 'mentor') {
                    navigate('/mentor');
                } else if (role === 'mentee') {
                    navigate('/mentee');
                } else if (role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/mentee'); // default
                }
            }
        } catch (err: any) {
            setLocalError(err.message || 'Login failed. Please try again.');
        }
    };

    return (
        <>
            <h1 className="auth-heading">Sign In</h1>
            {localError && (
                <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    padding: '12px', 
                    backgroundColor: '#fee2e2', 
                    color: '#991b1b',
                    borderRadius: '6px',
                    marginBottom: '16px',
                    fontSize: '14px'
                }}>
                    <AlertCircle size={18} style={{ flexShrink: 0 }} />
                    <span>{localError}</span>
                </div>
            )}
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
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
                        disabled={loading}
                        required
                        placeholder="Enter your password"
                    />
                </div>
                <button 
                    type="submit" 
                    className="auth-button"
                    disabled={loading}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                    {loading ? (
                        <>
                            <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                            Signing in...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </button>
            </form>
            <div className="auth-link">
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </div>
        </>
    );
};

export default Login;
