import React from 'react';
import { Plus } from 'lucide-react';
import '../styles/Dashboard.css';

interface CreateGroupCardProps {
    onClick: () => void;
}

const CreateGroupCard: React.FC<CreateGroupCardProps> = ({ onClick }) => {
    return (
        <div className="admin-card create-group-card" onClick={onClick}>
            <div className="create-group-content">
                <div className="create-icon-wrapper">
                    <Plus size={24} />
                </div>
                <span className="create-text">Create New Group</span>
            </div>
        </div>
    );
};

export default CreateGroupCard;
