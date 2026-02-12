import React from 'react';
import ProfileWidget from '../components/ProfileWidget';
import MentorsWidget from '../components/MentorsWidget';
import MyGroupWidget from '../components/MyGroupWidget';
import '../styles/Mentee.css';


const Mentee = () => {
    return (
        <div className="mentee-dashboard">
            <div className="dashboard-left">
                <MentorsWidget />
                <MyGroupWidget />
            </div>

            <div className="dashboard-right">
                <ProfileWidget />
            </div>
        </div>
    );
};

export default Mentee;
