import React from 'react';
import '../styles/Dashboard.css';
import { ChevronRight } from 'lucide-react';

interface Group {
    id: number;
    name: string;
    createdBy: string;
    memberCount: number;
}

const MyGroupWidget = () => {
    // Static data
    const groups: Group[] = [
        { id: 1, name: 'Interns 2026', createdBy: 'Ameena Shaikh', memberCount: 20 },
        { id: 2, name: 'Interns 2025', createdBy: 'Sarah Smith', memberCount: 12 },
    ];

    return (
        <div className="dashboard-card my-group-widget">
            <div className="my-group-header">
                <h3 className="my-group-title">My Groups ({groups.length})</h3>
            </div>

            <div className="my-group-list">
                {groups.map((group, index) => (
                    <React.Fragment key={group.id}>
                        <div className="my-group-row">
                            <div className="my-group-details">
                                <span className="my-group-name">{group.name}</span>
                                <span className="my-group-meta">Created by {group.createdBy} • {group.memberCount} members</span>
                            </div>
                        </div>
                        {index < groups.length - 1 && <div className="my-group-divider" />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default MyGroupWidget;
