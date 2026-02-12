
import '../styles/Mentee.css';
import { UserPlus } from 'lucide-react';

interface Mentor {
    id: number;
    name: string;
    email: string;
    skills: string[];
}

const MyGroupWidget = () => {
    // Static data for now
    const members: Mentor[] = [
        { id: 1, name: 'Liam Anderson', email: 'liam.anderson@example.com', skills: ['React', 'CSS', 'Redux', 'TypeScript'] },
        { id: 2, name: 'Ava Thompson', email: 'ava.thompson@example.com', skills: ['UX Design', 'Figma', 'Prototyping', 'Wireframing'] },
        { id: 3, name: 'Noah Martinez', email: 'noah.martinez@example.com', skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'] },
        { id: 4, name: 'Isabella Clark', email: 'isabella.clark@example.com', skills: ['Python', 'Django', 'PostgreSQL', 'Docker'] },
        { id: 5, name: 'Ethan Patel', email: 'ethan.patel@example.com', skills: ['Java', 'Spring Boot', 'Hibernate', 'Microservices'] },
        { id: 6, name: 'Mia Rodriguez', email: 'mia.rodriguez@example.com', skills: ['Frontend', 'Testing', 'Jest', 'Cypress'] },
        { id: 7, name: 'Lucas Kim', email: 'lucas.kim@example.com', skills: ['Angular', 'RxJS', 'TypeScript', 'SCSS'] },
        { id: 8, name: 'Sophia Bennett', email: 'sophia.bennett@example.com', skills: ['Product', 'Agile', 'Scrum', 'Jira'] },
    ];

    return (
        <div className="dashboard-card mentors-widget">
            <div className="mentors-header">
                <h3 className="mentors-title">Group - Interns 2026 ({members.length})</h3>
            </div>

            <div className="mentors-list divided-list">
                {members.map((member) => (
                    <div key={member.id} className="group-member-item">
                        <div className="mentor-row">
                            <div className="mentor-avatar">
                                {member.name.charAt(0)}
                            </div>
                            <div className="mentor-details">
                                <span className="mentor-name">{member.name}</span>
                                <span className="mentor-skills">{member.email}</span>
                            </div>
                        </div>
                        <div className="skills-row">
                            <span className="profile-section-title" style={{ fontSize: '11px' }}>Skills to Learn</span>
                            <div className="skills-container">
                                {member.skills.map((skill) => (
                                    <span key={skill} className="skill-tag">{skill}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyGroupWidget;
