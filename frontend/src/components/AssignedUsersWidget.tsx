import '../styles/Dashboard.css';
import { ChevronRight, AlertCircle, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { menteeService } from '../utils/menteeService';
import { mentorService } from '../utils/mentorService';
import { taskService, Task as APITask } from '../utils/taskService';
import MentorDetailsPopup from './MentorDetailsPopup';

interface AssignedUsersWidgetProps {
    variant: 'mentee' | 'mentor';
}

interface AssignedUser {
    id: number;
    firstName: string;
    lastName: string;
    name: string;
    skills: string[];
    progress: number;
    email: string;
    assignedDate: string;
    assignedBy?: string;
    tasks: Task[];
}

export interface Task {
    id: string | number;
    title: string;
    description: string;
    progress: number;
    assignedDate: string;
    status: 'Not Started' | 'In Progress' | 'Completed';
    comments?: Comment[];
}

export interface Comment {
    id: string | number;
    author: string;
    text: string;
    avatarColor?: string;
}

const AssignedUsersWidget = ({ variant }: AssignedUsersWidgetProps) => {
    const { user } = useAuth();
    const [users, setUsers] = useState<AssignedUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<AssignedUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!user?.userId) return;
            
            try {
                setLoading(true);
                setError(null);

                let usersData: AssignedUser[] = [];

                if (variant === 'mentee') {
                    // Fetch assigned mentors for mentee
                    const mentors = await menteeService.getAssignedMentors(user.userId);
                    usersData = mentors.map(mentor => ({
                        id: mentor.mentorId,
                        firstName: mentor.firstName,
                        lastName: mentor.lastName,
                        name: `${mentor.firstName} ${mentor.lastName}`,
                        skills: mentor.skills,
                        progress: 0, // Calculate from tasks
                        email: mentor.email,
                        assignedDate: mentor.assignedDate,
                        tasks: [],
                    }));
                } else {
                    // Fetch assigned mentees for mentor
                    // You'll need to create a getMentees endpoint similar to getAssignedMentors
                    // For now, return empty array
                    usersData = [];
                }

                // Fetch tasks for each user
                if (usersData.length > 0) {
                    const tasksPerUser: { [key: number]: APITask[] } = {};
                    
                    for (const userData of usersData) {
                        try {
                            let tasks: APITask[] = [];
                            if (variant === 'mentee') {
                                tasks = await taskService.getTasksByMentor(userData.id);
                            } else {
                                tasks = await taskService.getTasksByMentee(userData.id);
                            }
                            tasksPerUser[userData.id] = tasks;
                        } catch (err) {
                            console.error(`Failed to fetch tasks for user ${userData.id}:`, err);
                            tasksPerUser[userData.id] = [];
                        }
                    }

                    // Map API tasks to UI tasks
                    usersData = usersData.map(u => ({
                        ...u,
                        tasks: (tasksPerUser[u.id] || []).map(t => ({
                            id: t.id,
                            title: t.title,
                            description: t.description,
                            progress: t.progress,
                            assignedDate: t.assignedDate,
                            status: t.status === 'NOT_STARTED' ? 'Not Started' : 
                                    t.status === 'IN_PROGRESS' ? 'In Progress' : 'Completed',
                            comments: [],
                        })),
                        progress: tasksPerUser[u.id] && tasksPerUser[u.id].length > 0
                            ? Math.round(
                                tasksPerUser[u.id].reduce((sum, t) => sum + t.progress, 0) /
                                tasksPerUser[u.id].length
                            )
                            : 0,
                    }));
                }

                setUsers(usersData);
            } catch (err: any) {
                setError(err.message || 'Failed to load users');
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user, variant]);

    const handleTaskProgressUpdate = async (taskId: string | number, newProgress: number) => {
        try {
            await taskService.updateTask(Number(taskId), { progress: newProgress });

            // Update local state
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
        } catch (err) {
            console.error('Failed to update task progress:', err);
        }
    };

    const handleCreateTask = async (userId: number, newTask: Task) => {
        try {
            // Create task via API
            const createdTask = await taskService.createTask({
                taskTitle: newTask.title,
                taskDescription: newTask.description,
                mentorMenteeMapId: userId,
            });

            // Update local state
            const updatedUsers = users.map(user => {
                if (user.id === userId) {
                    return {
                        ...user,
                        tasks: [...(user.tasks || []), {
                            id: createdTask.id,
                            title: createdTask.title,
                            description: createdTask.description,
                            progress: createdTask.progress,
                            assignedDate: createdTask.assignedDate,
                            status: createdTask.status === 'NOT_STARTED' ? 'Not Started' :
                                    createdTask.status === 'IN_PROGRESS' ? 'In Progress' : 'Completed',
                        }]
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
        } catch (err) {
            console.error('Failed to create task:', err);
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

    const title = variant === 'mentee' 
        ? `Mentors Assigned to Me (${users.length})` 
        : `Mentees Assigned to Me (${users.length})`;

    if (loading) {
        return (
            <div className="dashboard-card mentors-widget" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Loader size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                <p style={{ marginTop: '16px' }}>Loading {variant === 'mentee' ? 'mentors' : 'mentees'}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-card mentors-widget" style={{ padding: '20px' }}>
                <div style={{ color: '#991b1b', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                        <p style={{ margin: '0 0 8px 0' }}>Failed to load users</p>
                        <p style={{ margin: 0, fontSize: '13px' }}>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-card mentors-widget">
            <div className="mentors-header">
                <h3 className="mentors-title">{title}</h3>
            </div>

            {users.length === 0 ? (
                <div style={{ padding: '30px 20px', textAlign: 'center', color: '#666' }}>
                    <p>No {variant === 'mentee' ? 'mentors' : 'mentees'} assigned yet.</p>
                </div>
            ) : (
                <div className="mentors-list">
                    {users.map((user) => (
                        <div key={user.id} className="mentor-row">
                            <div className="mentor-avatar">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="mentor-details">
                                <span className="mentor-name">{user.name}</span>
                                <span className="mentor-skills">
                                    {user.skills && user.skills.length > 0 
                                        ? user.skills.join(', ')
                                        : 'No skills listed'}
                                </span>
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
            )}

            {selectedUser && (
                <MentorDetailsPopup
                    isOpen={!!selectedUser}
                    onClose={handleClosePopup}
                    mentor={selectedUser as any}
                    onUpdateProgress={handleTaskProgressUpdate}
                    onCreateTask={(task) => handleCreateTask(selectedUser.id, task)}
                    variant={variant}
                />
            )}
        </div>
    );
};

export default AssignedUsersWidget;
