import { useState, useEffect } from 'react';
import { Mail, Edit2, Check, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mentorService } from '../utils/mentorService';
import { menteeService } from '../utils/menteeService';
import '../styles/Dashboard.css';

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    skills: string[];
}

interface ProfileWidgetProps {
    variant: 'mentee' | 'mentor';
}

const ProfileWidget = ({ variant }: ProfileWidgetProps) => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [skillsInput, setSkillsInput] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.userId) return;
            
            try {
                setLoading(true);
                setError(null);
                let data;
                if (variant === 'mentor') {
                    const mentorData = await mentorService.getCurrentMentorProfile();
                    data = {
                        firstName: mentorData.firstName,
                        lastName: mentorData.lastName,
                        email: mentorData.email,
                        skills: mentorData.skills,
                    };
                } else {
                    const menteeData = await menteeService.getCurrentMenteeProfile();
                    data = {
                        firstName: menteeData.firstName,
                        lastName: menteeData.lastName,
                        email: menteeData.email,
                        skills: menteeData.skills,
                    };
                }
                setProfileData(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load profile');
                // Set default data on error
                setProfileData({
                    firstName: user?.firstName || 'User',
                    lastName: user?.lastName || '',
                    email: user?.email || 'unknown@example.com',
                    skills: [],
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, variant]);

    const startEditing = () => {
        if (profileData?.skills) {
            setSkillsInput(profileData.skills.join(', '));
        }
        setIsEditing(true);
    };

    const saveChanges = async () => {
        if (!user?.userId || !profileData) return;

        try {
            setSaving(true);
            setError(null);
            const updatedSkills = skillsInput
                .split(',')
                .map(s => s.trim())
                .filter(Boolean);

            if (variant === 'mentor') {
                await mentorService.updateMentorProfile(user.userId, {
                    ...profileData,
                    skills: updatedSkills,
                });
            } else {
                await menteeService.updateMenteeProfile(user.userId, {
                    ...profileData,
                    skills: updatedSkills,
                });
            }

            setProfileData(prev => prev ? { ...prev, skills: updatedSkills } : null);
            setIsEditing(false);
        } catch (err: any) {
            setError(err.message || 'Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-card profile-widget" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Loader size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                <p style={{ marginTop: '16px' }}>Loading profile...</p>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="dashboard-card profile-widget" style={{ padding: '20px' }}>
                <div style={{ color: '#991b1b', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>Failed to load profile data</span>
                </div>
            </div>
        );
    }

    const displayName = `${profileData.firstName} ${profileData.lastName}`.trim();

    return (
        <div className="dashboard-card profile-widget">
            {error && (
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    padding: '12px',
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    borderRadius: '6px',
                    marginBottom: '16px',
                    fontSize: '13px'
                }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{error}</span>
                </div>
            )}

            <div className="profile-header-section">
                <div className="profile-avatar-placeholder">
                    {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info-primary">
                    <h2 className="profile-name">{displayName}</h2>
                    <div className="profile-meta">
                        <Mail size={14} />
                        <span>{profileData.email}</span>
                    </div>
                </div>
            </div>

            <div className="profile-divider"></div>

            <div className="profile-section">
                <div className="section-header">
                    <span className="profile-section-title">
                        {variant === 'mentee' ? 'Skills to Learn' : 'Skills to Mentor'}
                    </span>
                </div>

                {!isEditing ? (
                    <div className="skills-display">
                        <div className="skills-container">
                            {profileData.skills && profileData.skills.length > 0 ? (
                                profileData.skills.map((skill, index) => (
                                    <span key={index} className="skill-tag">{skill}</span>
                                ))
                            ) : (
                                <span className="empty-skills-text">No skills added yet.</span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="edit-form">
                        <div className="form-group">
                            <label className="form-label">Edit Skills (comma separated)</label>
                            <textarea
                                className="form-input skills-textarea"
                                value={skillsInput}
                                onChange={(e) => setSkillsInput(e.target.value)}
                                placeholder="e.g. React, UX Writing, Data Analysis"
                                rows={3}
                                disabled={saving}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="widget-actions">
                {!isEditing ? (
                    <button className="btn-primary" onClick={startEditing} disabled={loading}>
                        <Edit2 size={16} />
                        <span>Edit Skills</span>
                    </button>
                ) : (
                    <button 
                        className="btn-primary" 
                        onClick={saveChanges}
                        disabled={saving}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        {saving ? (
                            <>
                                <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Check size={16} />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProfileWidget;
