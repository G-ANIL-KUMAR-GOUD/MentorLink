import { useState } from 'react';
import { Mail, Edit2, Check } from 'lucide-react';
import '../styles/Dashboard.css';

interface UserProfile {
    name: string;
    email: string;
    skills: string[];
}

interface ProfileWidgetProps {
    variant: 'mentee' | 'mentor';
}

const ProfileWidget = ({ variant }: ProfileWidgetProps) => {
    const [isEditing, setIsEditing] = useState(false);

    // Name and Email are now static/managed outside of local edit state regarding their value
    const [user, setUser] = useState<UserProfile>({
        name: 'Henry Carter',
        email: 'henry.carter@example.com',
        skills: ['React', 'TypeScript', 'Node.js', 'UI Design', 'Spring Boot']
    });

    // We only need to track skills in the edit form now
    const [skillsInput, setSkillsInput] = useState('');

    const startEditing = () => {
        setSkillsInput(user.skills.join(', '));
        setIsEditing(true);
    };

    const saveChanges = () => {
        // Split by comma, trim, and remove empty strings
        const updatedSkills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);

        setUser(prev => ({
            ...prev,
            skills: updatedSkills
        }));
        setIsEditing(false);
    };

    return (
        <div className="dashboard-card profile-widget">
            <div className="profile-header-section">
                <div className="profile-avatar-placeholder">
                    {user.name.charAt(0)}
                </div>
                <div className="profile-info-primary">
                    <h2 className="profile-name">{user.name}</h2>
                    <div className="profile-meta">
                        <Mail size={14} />
                        <span>{user.email}</span>
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
                            {user.skills.length > 0 ? (
                                user.skills.map((skill, index) => (
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
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="widget-actions">
                {!isEditing ? (
                    <button className="btn-primary" onClick={startEditing}>
                        <Edit2 size={16} />
                        <span>Edit Skills</span>
                    </button>
                ) : (
                    <button className="btn-primary" onClick={saveChanges}>
                        <Check size={16} />
                        <span>Save Changes</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProfileWidget;
