import React, { useState } from 'react';
import '../styles/Dashboard.css';
import CreateGroupCard from '../components/CreateGroupCard';
import GroupCard, { type GroupData } from '../components/GroupCard';

const Admin = () => {
    const [groups, setGroups] = useState<GroupData[]>([
        {
            id: 1,
            name: 'Frontend Developers',
            description: 'Group for frontend engineering team.',
            memberCount: 12,
            status: 'good',
            statusText: 'Everyone on track'
        },
        {
            id: 2,
            name: 'Backend Interns',
            description: '2026 Batch backend interns.',
            memberCount: 8,
            status: 'warning',
            statusText: '3/8 members falling behind'
        },
        {
            id: 3,
            name: 'Design Team',
            description: 'UI/UX Design group.',
            memberCount: 5,
            status: 'good',
            statusText: '1/8 members falling behind'
        }
    ]);

    // We handle "new" cards by temporarily adding flexible items to the list or handling them differently.
    // For now, let's keep the logic simple: Create Group adds a temporary "new" item.
    // However, the new GroupCard logic expects a full GroupData object for view mode.
    // For edit mode, it needs to handle the creation.

    // Let's modify the flow slightly to support the requirement:
    // "When a group is created using the Create Group card, the form card should convert into this group card layout."

    const [isCreating, setIsCreating] = useState(false);

    const handleCreateClick = () => {
        setIsCreating(true);
    };

    const handleSaveNewGroup = (id: number, name: string, description: string) => {
        // id is 0 here from the temp card, so ignore it and generate new
        const newGroup: GroupData = {
            id: Date.now(),
            name,
            description,
            memberCount: 0,
            status: 'good',
            statusText: 'Newly created'
        };
        // Add to the START of the list (requirement says "alongside the Create Group card")
        // But usually "Create Group" is first.
        // Let's add it to the list.
        setGroups([newGroup, ...groups]);
        setIsCreating(false);
    };

    const handleUpdateGroup = (id: number, name: string, description: string) => {
        setGroups(groups.map(g =>
            g.id === id ? { ...g, name, description } : g
        ));
    };

    return (
        <div className="admin-container">
            <div className="admin-grid">
                {/* Create Group Card (Trigger) - Always visible if not creating? 
                    Requirement: "This new card becomes the group creation form."
                    So we HIDE the CreateGroupCard when creating.
                */}
                {!isCreating && <CreateGroupCard onClick={handleCreateClick} />}

                {/* If creating, show the form in place of the trigger */}
                {isCreating && (
                    <GroupCard
                        group={{
                            id: 0,
                            name: '',
                            description: '',
                            memberCount: 0,
                            status: 'good',
                            statusText: ''
                        }}
                        initialEditMode={true}
                        onSave={handleSaveNewGroup}
                    />
                )}

                {/* Existing Groups */}
                {groups.map((group) => (
                    <GroupCard
                        key={group.id}
                        group={group}
                        initialEditMode={false}
                        onSave={handleUpdateGroup}
                    />
                ))}
            </div>
        </div>
    );
};

export default Admin;
