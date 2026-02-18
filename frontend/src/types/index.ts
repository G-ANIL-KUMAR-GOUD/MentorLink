export interface Task {
    id: string;
    title: string;
    description: string;
    progress: number;
    status: string;
    assignedDate: string;
    comments?: Comment[];
}

export interface Comment {
    id: number | string;
    author: string;
    text: string;
    avatarColor?: string;
}

export interface User {
    id: number;
    name: string;
    email?: string;
    role?: string;
}

export interface AssignedUser extends User {
    skills: string[];
    progress: number;
    assignedDate: string;
    assignedBy: string;
    tasks: Task[];
}
