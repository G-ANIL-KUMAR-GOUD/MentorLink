import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Loader } from 'lucide-react';
import { authService } from '../utils/authService';

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        role: 'mentee', // default role
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = (): string | null => {
        if (!formData.email || !formData.password || !formData.confirmPassword || 
            !formData.firstName || !formData.lastName) {
            return 'Please fill in all fields';
        }
        if (!formData.email.includes('@')) {
            return 'Please enter a valid email address';
        }
        if (formData.password.length < 6) {
            return 'Password must be at least 6 characters long';
        }
        if (formData.password !== formData.confirmPassword) {
            return 'Passwords do not match';
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            const response = await authService.signup({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                roleId: formData.role === 'mentor' ? 2 : 3, // Adjust based on your role IDs
            });
            
            authService.setToken(response.token);
            setUser(response);
            
            // Navigate based on role
            const role = response.role?.toLowerCase();
            if (role === 'mentor') {
                navigate('/mentor');
            } else if (role === 'mentee') {
                navigate('/mentee');
            } else if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/mentee');
            }
        } catch (err: any) {
            setError(err.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1 className="auth-heading">Sign Up</h1>
            {error && (
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
                    <span>{error}</span>
                </div>
            )}
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="form-input"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={loading}
                        required
                        placeholder="Enter your first name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="form-input"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={loading}
                        required
                        placeholder="Enter your last name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        value={formData.email}
                        onChange={handleInputChange}
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
                        name="password"
                        className="form-input"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={loading}
                        required
                        placeholder="Create a password (min 6 characters)"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="form-input"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        disabled={loading}
                        required
                        placeholder="Confirm your password"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="role" className="form-label">I want to be a:</label>
                    <select
                        id="role"
                        name="role"
                        className="form-input"
                        value={formData.role}
                        onChange={handleInputChange}
                        disabled={loading}
                        required
                    >
                        <option value="mentee">Mentee</option>
                        <option value="mentor">Mentor</option>
                    </select>
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
                            Creating account...
                        </>
                    ) : (
                        'Sign Up'
                    )}
                </button>
            </form>
            <div className="auth-link">
                Already have an account? <Link to="/login">Sign In</Link>
            </div>
        </>
    );
};

export default Signup;
