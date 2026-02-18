
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Calendar, Plus, Minus, Type, Link as LinkIcon, Send } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
    task: Task;
    variant: 'mentee' | 'mentor';
    onUpdateProgress?: (taskId: string, newProgress: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, variant, onUpdateProgress }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [commentText, setCommentText] = useState('');

    const toggleTask = () => setIsExpanded(!isExpanded);

    const getProgressColor = (progress: number) => {
        if (progress === 100) return '#10B981'; // Green
        if (progress > 0) return '#F59E0B'; // Orange
        return '#9CA3AF'; // Gray
    };

    const handleIncrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onUpdateProgress) {
            onUpdateProgress(task.id, Math.min(100, task.progress + 1));
        }
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onUpdateProgress) {
            onUpdateProgress(task.id, Math.max(0, task.progress - 1));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val) && onUpdateProgress) {
            onUpdateProgress(task.id, Math.max(0, Math.min(100, val)));
        }
    };

    return (
        <div className="task-item">
            <div className="task-row" onClick={toggleTask}>
                <button className="task-chevron">
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
                <span className="task-title">{task.title}</span>
                <div className="task-right">
                    <div className="task-progress-tracker">
                        <div className="task-progress-bar-bg">
                            <div
                                className="task-progress-bar-fill"
                                style={{
                                    width: `${task.progress}%`,
                                    backgroundColor: getProgressColor(task.progress)
                                }}
                            ></div>
                        </div>
                        <span className="task-percentage">{task.progress}%</span>
                    </div>
                </div>
            </div>
            {isExpanded && (
                <div className="task-expanded-desc">
                    {task.description}
                    <div className="task-meta-row">
                        <Calendar size={14} className="task-meta-icon" />
                        <span>Task assigned on {task.assignedDate}</span>
                    </div>
                    <div className="task-actions">
                        <button className="btn-request-review">
                            {variant === 'mentor' ? 'Mark as Completed' : 'Request Review'}
                        </button>
                        {variant === 'mentor' && (
                            <div className="progress-stepper" onClick={(e) => e.stopPropagation()}>
                                <button className="stepper-btn" onClick={handleDecrement}>
                                    <Minus size={15} />
                                </button>
                                <input
                                    type="number"
                                    className="stepper-input"
                                    value={task.progress}
                                    onChange={handleInputChange}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <button className="stepper-btn" onClick={handleIncrement}>
                                    <Plus size={15} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Simplified comment section for now */}
                    <div className="task-comment-row" onClick={(e) => e.stopPropagation()}>
                        <button className="btn-icon-action">
                            <LinkIcon size={18} />
                        </button>
                        <input
                            type="text"
                            className="comment-input"
                            placeholder="Share resources and details..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button className="btn-submit">
                            <Send size={14} />
                        </button>
                    </div>

                    {task.comments && task.comments.length > 0 && (
                        <div className="task-comments-list">
                            {task.comments.map((comment: any) => (
                                <div key={comment.id} className="comment-item">
                                    <div className="comment-avatar" style={{ backgroundColor: comment.avatarColor || '#3B82F6' }}>
                                        {comment.author.charAt(0)}
                                    </div>
                                    <div className="comment-content">
                                        <span className="comment-author">{comment.author}</span>
                                        <p className="comment-text">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskItem;
