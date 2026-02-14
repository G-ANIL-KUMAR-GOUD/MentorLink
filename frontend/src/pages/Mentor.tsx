import React from 'react';
import ProfileWidget from '../components/ProfileWidget';
import AssignedUsersWidget from '../components/AssignedUsersWidget';
import '../styles/Dashboard.css';


const Mentor = () => {
    return (
        <div className="dashboard-layout">
            <div className="dashboard-left">
                <AssignedUsersWidget variant="mentor" />
            </div>

            <div className="dashboard-right">
                <ProfileWidget variant="mentor" />
            </div>
        </div >
    );
};

export default Mentor;
