import React, { useState } from 'react';
import { X, Calendar, User, UserPlus, ChevronRight, ChevronDown } from 'lucide-react';
import '../styles/Dashboard.css';
import type { GroupData } from './GroupCard';
import AssignMentorModal from './AssignMentorModal';

interface Mentor {
    id: number;
    name: string;
    email: string;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    progress: number;
}

interface Member {
    id: number;
    name: string;
    email: string;
    role: string;
    joinedDate: string;
    status: 'active' | 'inactive';
    progress: number;
    skills: string[];
    mentors: Mentor[];
}

interface GroupDetailsPopupProps {
    isOpen: boolean;
    onClose: () => void;
    group: GroupData | null;
}

const GroupDetailsPopup: React.FC<GroupDetailsPopupProps> = ({ isOpen, onClose, group }) => {
    if (!isOpen || !group) return null;

    const [expandedMemberId, setExpandedMemberId] = useState<number | null>(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

    const toggleExpand = (id: number) => {
        setExpandedMemberId(expandedMemberId === id ? null : id);
    };

    const handleAssignClick = (e: React.MouseEvent, memberId: number) => {
        e.stopPropagation();
        setSelectedMemberId(memberId);
        setIsAssignModalOpen(true);
    };

    const handleAssignConfirm = (mentorId: number) => {
        console.log(`Assigning mentor ${mentorId} to member ${selectedMemberId}`);
        // Logic to assign mentor would go here
        setIsAssignModalOpen(false);
        setSelectedMemberId(null);
    };

    // Dummy members data
    const [members] = useState<Member[]>([
        {
            id: 1,
            name: 'Alice Johnson',
            email: 'alice@example.com',
            role: 'Team Lead',
            joinedDate: 'Jan 10, 2026',
            status: 'active',
            progress: 75,
            skills: ['React', 'TypeScript', 'Node.js'],
            mentors: [
                { id: 101, name: 'Sarah Wilson', email: 'sarah.w@example.com', totalTasks: 12, completedTasks: 9, pendingTasks: 3, progress: 75 }
            ]
        },
        {
            id: 2,
            name: 'Bob Smith',
            email: 'bob@example.com',
            role: 'Member',
            joinedDate: 'Jan 12, 2026',
            status: 'active',
            progress: 45,
            skills: ['UI/UX', 'Figma', 'CSS'],
            mentors: [
                { id: 102, name: 'Mike Ross', email: 'mike.r@example.com', totalTasks: 8, completedTasks: 4, pendingTasks: 4, progress: 50 }
            ]
        },
        {
            id: 3,
            name: 'Charlie Brown',
            email: 'charlie@example.com',
            role: 'Member',
            joinedDate: 'Jan 15, 2026',
            status: 'inactive',
            progress: 20,
            skills: ['Python', 'Django'],
            mentors: []
        },
    ]);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 1);
    };

    return (
        <div className="group-modal-overlay" onClick={onClose}>
            <div className="group-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="group-popup-header">
                    <div className="group-header-left">
                        <div className="group-popup-header-info">
                            <h2 className="group-popup-name">{group.name}</h2>
                        </div>
                    </div>
                    <button className="group-btn-cancel" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="group-popup-meta-info">
                    <div className="group-meta-item">
                        <Calendar size={16} className="group-meta-icon" />
                        <span className="group-meta-label">Created on 13 Feb, 2026</span>
                    </div>
                    <span className="group-meta-separator">•</span>
                    <div className="group-meta-item">
                        <User size={16} className="group-meta-icon" />
                        <span className="group-meta-label">Created by Ameena Shaikh</span>
                    </div>
                </div>

                <div className="group-popup-divider" />

                <div className="group-popup-content-scrollable">
                    <div className="group-members-section">
                        <div className="group-members-header">
                            <h4 className="group-section-heading">Members ({members.length})</h4>
                        </div>

                        <div className="group-members-list">
                            {members.map((member) => (
                                <div key={member.id} className="group-member-container">
                                    <div
                                        className={`group-member-row ${expandedMemberId === member.id ? 'expanded' : ''}`}
                                        onClick={() => toggleExpand(member.id)}
                                    >
                                        {expandedMemberId === member.id ? (
                                            <ChevronDown size={20} className="group-member-chevron" />
                                        ) : (
                                            <ChevronRight size={20} className="group-member-chevron" />
                                        )}

                                        <div className="group-member-avatar">
                                            {getInitials(member.name)}
                                        </div>

                                        <div className="group-member-info">
                                            <span className="group-member-name">{member.name}</span>
                                            <span className="group-member-email">{member.email}</span>
                                        </div>

                                        <div className="member-right-section">
                                            <div className="member-progress-container">
                                                <div
                                                    className="member-progress-fill"
                                                    style={{ width: `${member.progress}%`, backgroundColor: member.progress > 50 ? '#10B981' : '#F59E0B' }}
                                                />
                                            </div>

                                            <button
                                                className="btn-assign-mentor"
                                                onClick={(e) => handleAssignClick(e, member.id)}
                                            >
                                                <UserPlus size={16} />
                                                <span>Assign Mentor</span>
                                            </button>
                                        </div>
                                    </div>

                                    {expandedMemberId === member.id && (
                                        <div className="group-member-expanded-details">
                                            {/* Skills Section */}
                                            <div className="expanded-section">
                                                <h5 className="expanded-section-title">Skills to Mentor</h5>
                                                <div className="expanded-skills-container">
                                                    {member.skills.map((skill, idx) => (
                                                        <span key={idx} className="skill-tag">{skill}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Mentors Section */}
                                            <div className="expanded-section">
                                                <h5 className="expanded-section-title">Mentors</h5>
                                                <div className="expanded-mentors-list">
                                                    {member.mentors.length > 0 ? (
                                                        member.mentors.map((mentor) => (
                                                            <div key={mentor.id} className="expanded-mentor-row">
                                                                <div className="mentor-avatar-small">
                                                                    {getInitials(mentor.name).substring(0, 1)}
                                                                </div>
                                                                <div className="mentor-info-col">
                                                                    <span className="mentor-name-text">{mentor.name}</span>
                                                                    <span className="mentor-email-text">{mentor.email}</span>
                                                                    <span className="mentor-stats-text">
                                                                        Total Tasks: {mentor.totalTasks} • Completed: {mentor.completedTasks} • Pending: {mentor.pendingTasks}
                                                                    </span>
                                                                </div>
                                                                <div className="mentor-progress-col">
                                                                    <div className="mentor-progress-bar-container">
                                                                        <div
                                                                            className="mentor-progress-fill"
                                                                            style={{ width: `${mentor.progress}%` }}
                                                                        />
                                                                    </div>
                                                                    <span className="mentor-progress-text">{mentor.progress}%</span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="no-mentors-text">No mentors assigned yet.</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <AssignMentorModal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                onAssign={handleAssignConfirm}
            />
        </div>
    );
};

export default GroupDetailsPopup;
