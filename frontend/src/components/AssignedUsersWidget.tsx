import '../styles/Dashboard.css';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import MentorDetailsPopup from './MentorDetailsPopup';

interface AssignedUsersWidgetProps {
    variant: 'mentee' | 'mentor';
}

interface AssignedUser { // common interface for Mentor and Mentee
    id: number;
    name: string;
    skills: string[];
    progress: number;
    email: string;
    assignedDate: string;
    assignedBy: string;
    tasks: Task[];
}

export interface Task {
    id: string;
    title: string;
    description: string;
    progress: number;
    assignedDate: string;
    status: 'Not Started' | 'In Progress' | 'Completed';
    comments?: Comment[];
}

export interface Comment {
    id: string;
    author: string;
    text: string;
    avatarColor?: string;
}

const AssignedUsersWidget = ({ variant }: AssignedUsersWidgetProps) => {
    // Static data for Mentors (displayed on Mentee page)
    const mentorsData: AssignedUser[] = [
        {
            id: 1,
            name: 'Sarah Wilson',
            skills: ['React', 'TypeScript', 'UX Design'],
            progress: 75,
            email: 'sarah.wilson@example.com',
            assignedDate: 'Oct 12, 2024',
            assignedBy: 'Ameena Shaikh',
            tasks: [
                {
                    id: 't1',
                    title: 'Complete React Fundamentals',
                    description: 'Go through the official React documentation and complete all the tutorials',
                    progress: 100,
                    assignedDate: 'Oct 15, 2024',
                    status: 'Completed',
                    comments: [
                        { id: 'c1', author: 'Ameena Shaikh', text: 'Great job completing this so quickly! The documentation review was thorough.', avatarColor: '#8B5CF6' },
                        { id: 'c2', author: 'Sarah Wilson', text: 'Thanks! I found the section on Hooks particularly useful.', avatarColor: '#3B82F6' }
                    ]
                },
                {
                    id: 't2',
                    title: 'Build a Todo App',
                    description: 'Create a simple Todo application using React hooks (useState, useEffect).',
                    progress: 80,
                    assignedDate: 'Oct 20, 2024',
                    status: 'In Progress',
                    comments: [
                        { id: 'c3', author: 'Ameena Shaikh', text: 'Let me know if you need any help with the state management part.', avatarColor: '#8B5CF6' }
                    ]
                },
                {
                    id: 't3',
                    title: 'Learn Context API',
                    description: 'Understand how to use React Context for state management.',
                    progress: 0,
                    assignedDate: 'Oct 25, 2024',
                    status: 'Not Started'
                }
            ]
        },
        {
            id: 2,
            name: 'James Rodriguez',
            skills: ['Data Science'],
            progress: 50,
            email: 'j.rodriguez@example.com',
            assignedDate: 'Nov 05, 2024',
            assignedBy: 'Program Manager',
            tasks: [
                {
                    id: 't4',
                    title: 'Analyze Dataset',
                    description: 'Perform exploratory data analysis on the provided sales dataset.',
                    progress: 45,
                    assignedDate: 'Nov 10, 2024',
                    status: 'In Progress'
                }
            ]
        },
        {
            id: 3,
            name: 'Emily Chen',
            skills: ['Leadership', 'Management'],
            progress: 30,
            email: 'emily.chen@example.com',
            assignedDate: 'Jan 15, 2025',
            assignedBy: 'HR Director',
            tasks: []
        },
    ];

    // Static data for Mentees (displayed on Mentor page)
    const menteesData: AssignedUser[] = [
        {
            id: 1,
            name: 'Alice Johnson',
            skills: ['Python', 'Django', 'Data Analysis'], // Skills they want to learn
            progress: 60,
            email: 'alice.johnson@example.com',
            assignedDate: 'Oct 12, 2024',
            assignedBy: 'System',
            tasks: [
                {
                    id: 't1',
                    title: 'Complete Python Service',
                    description: 'Build the backend service using Django REST framework',
                    progress: 80,
                    assignedDate: 'Oct 15, 2024',
                    status: 'In Progress',
                    comments: [
                        { id: 'c1', author: 'Henry Carter', text: 'Looks good, but check the database optimizations.', avatarColor: '#8B5CF6' },
                        { id: 'c2', author: 'Alice Johnson', text: 'Will do, thanks!', avatarColor: '#3B82F6' }
                    ]
                }
            ]
        },
        {
            id: 2,
            name: 'Bob Smith',
            skills: ['React', 'Frontend'],
            progress: 30,
            email: 'bob.smith@example.com',
            assignedDate: 'Nov 01, 2024',
            assignedBy: 'System',
            tasks: [
                {
                    id: 't2',
                    title: 'Design Home Page',
                    description: 'Create the landing page with responsive design.',
                    progress: 30,
                    assignedDate: 'Nov 05, 2024',
                    status: 'In Progress'
                }
            ]
        }
    ];

    const [users, setUsers] = useState<AssignedUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<AssignedUser | null>(null);

    // Initialize data based on variant
    useEffect(() => {
        if (variant === 'mentee') {
            setUsers(mentorsData);
        } else {
            setUsers(menteesData);
        }
    }, [variant]);


    const handleTaskProgressUpdate = (taskId: string, newProgress: number) => {
        // Update local users state
        const updatedUsers = users.map(user => {
            if (user.tasks.some(t => t.id === taskId)) {
                return {
                    ...user,
                    tasks: user.tasks.map(task =>
                        task.id === taskId ? { ...task, progress: newProgress } : task
                    )
                };
            }
            return user;
        });
        setUsers(updatedUsers);

        // Update selectedUser if it's the one being modified
        if (selectedUser && selectedUser.tasks.some(t => t.id === taskId)) {
            setSelectedUser(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    tasks: prev.tasks.map(task =>
                        task.id === taskId ? { ...task, progress: newProgress } : task
                    )
                };
            });
        }
    };

    const handleCreateTask = (userId: number, newTask: Task) => {
        const updatedUsers = users.map(user => {
            if (user.id === userId) {
                return {
                    ...user,
                    tasks: [...(user.tasks || []), newTask]
                };
            }
            return user;
        });
        setUsers(updatedUsers);

        if (selectedUser && selectedUser.id === userId) {
            setSelectedUser(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    tasks: [...(prev.tasks || []), newTask]
                };
            });
        }
    };

    const handleUserClick = (user: AssignedUser) => {
        setSelectedUser(user);
    };

    const handleClosePopup = () => {
        setSelectedUser(null);
    };

    const getProgressColor = (progress: number) => {
        if (progress < 40) return '#EF4444'; // Red
        if (progress < 75) return '#F59E0B'; // Orange
        return '#10B981'; // Green
    };

    const title = variant === 'mentee' ? `Mentors Assigned to Me (${users.length})` : `Mentees Assigned to Me (${users.length})`;

    return (
        <div className="dashboard-card mentors-widget">
            <div className="mentors-header">
                <h3 className="mentors-title">{title}</h3>
            </div>

            <div className="mentors-list">
                {users.map((user) => (
                    <div key={user.id} className="mentor-row">
                        <div className="mentor-avatar">
                            {user.name.charAt(0)}
                        </div>
                        <div className="mentor-details">
                            <span className="mentor-name">{user.name}</span>
                            <span className="mentor-skills">{user.skills.join(', ')}</span>
                        </div>
                        <div className="mentor-progress-container">
                            <div
                                className="mentor-progress-fill"
                                style={{
                                    width: `${user.progress}%`,
                                    backgroundColor: getProgressColor(user.progress)
                                }}
                            />
                        </div>
                        <button className="btn-details" onClick={() => handleUserClick(user)}>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                ))}
            </div>

            <MentorDetailsPopup
                isOpen={!!selectedUser}
                onClose={handleClosePopup}
                mentor={selectedUser as any} // Keeping generic for now
                onUpdateProgress={handleTaskProgressUpdate}
                onCreateTask={(task) => selectedUser && handleCreateTask(selectedUser.id, task)}
                variant={variant}
            />
        </div>
    );
};

export default AssignedUsersWidget;
