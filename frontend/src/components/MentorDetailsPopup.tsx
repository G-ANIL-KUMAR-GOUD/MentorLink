import React, { useState } from 'react';
import { Calendar, User as UserIcon, X } from 'lucide-react';
import '../styles/Dashboard.css';
import { AssignedUser, Task } from '../types'; // Using AssignedUser as Mentor type here since it fits
import TaskItem from './TaskItem';

interface MentorDetailsPopupProps {
    isOpen: boolean;
    onClose: () => void;
    mentor: AssignedUser | null;
    onUpdateProgress?: (taskId: string, newProgress: number) => void;
    onCreateTask?: (task: Task) => void;
    variant: 'mentee' | 'mentor';
}

const MentorDetailsPopup: React.FC<MentorDetailsPopupProps> = ({ isOpen, onClose, mentor, onUpdateProgress, onCreateTask, variant }) => {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');

    if (!isOpen || !mentor) return null;

    const handleCreate = () => {
        if (!newTaskTitle.trim() || !onCreateTask) return;

        const newTask: Task = {
            id: `t-${Date.now()}`,
            title: newTaskTitle,
            description: newTaskDesc,
            progress: 0,
            status: 'Not Started',
            assignedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        onCreateTask(newTask);
        setNewTaskTitle('');
        setNewTaskDesc('');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    <div className="header-left">
                        <div className="popup-avatar">
                            {mentor.name.charAt(0)}
                        </div>
                        <div className="popup-header-info">
                            <h2 className="popup-name">{mentor.name}</h2>
                            <a href={`mailto:${mentor.email}`} className="popup-email">{mentor.email}</a>
                        </div>
                    </div>
                    <button className="btn-cancel" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="popup-assignment-info">
                    <div className="assignment-item">
                        <Calendar size={16} className="assignment-icon" />
                        <span className="assignment-label">Assigned on {mentor.assignedDate || 'N/A'}</span>
                    </div>
                    <span className="assignment-separator">•</span>
                    <div className="assignment-item">
                        <UserIcon size={16} className="assignment-icon" />
                        <span className="assignment-by">Assigned by {mentor.assignedBy || 'Admin'}</span>
                    </div>
                </div>
                <div className="popup-skills-section">
                    <h4 className="popup-skills-title">
                        {variant === 'mentor' ? 'Skills mentoring' : 'Skills Learning'}
                    </h4>
                    <div className="popup-skills-list">
                        {mentor.skills.map((skill, index) => (
                            <span key={index} className="popup-skill-tag">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="popup-divider"></div>

                <div className="popup-content-scrollable">
                    {variant === 'mentor' && (
                        <div className="create-task-container">
                            <input
                                type="text"
                                className="create-task-input create-task-title"
                                placeholder="Enter Task Title"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                            />
                            <textarea
                                className="create-task-input create-task-desc"
                                placeholder="Enter Task Description and Details"
                                rows={2}
                                value={newTaskDesc}
                                onChange={(e) => setNewTaskDesc(e.target.value)}
                            />
                            <button className="btn-create-task" onClick={handleCreate}>
                                Create Task
                            </button>
                        </div>
                    )}

                    <div className="popup-tasks-section">
                        <h4 className="popup-section-heading">Tasks ({mentor.tasks?.length || 0} Pending)</h4>
                        <div className="tasks-list">
                            {mentor.tasks && mentor.tasks.length > 0 ? (
                                mentor.tasks.map((task) => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        variant={variant}
                                        onUpdateProgress={onUpdateProgress}
                                    />
                                ))
                            ) : (
                                <p className="no-tasks">No Tasks</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default MentorDetailsPopup;
