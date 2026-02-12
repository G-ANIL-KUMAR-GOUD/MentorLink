
import '../styles/Mentee.css';
import { ChevronRight } from 'lucide-react';

interface Mentor {
    id: number;
    name: string;
    skills: string[];
}

const MentorsWidget = () => {
    // Static data for now
    const mentors: Mentor[] = [
        { id: 1, name: 'Sarah Wilson', skills: ['React', 'TypeScript', 'UX Design'] },
        { id: 2, name: 'James Rodriguez', skills: ['Data Science'] },
        { id: 3, name: 'Emily Chen', skills: ['Leadership', 'Management'] },
    ];

    return (
        <div className="dashboard-card mentors-widget">
            <div className="mentors-header">
                <h3 className="mentors-title">Mentors Assigned to Me ({mentors.length})</h3>
            </div>

            <div className="mentors-list">
                {mentors.map((mentor) => (
                    <div key={mentor.id} className="mentor-row">
                        <div className="mentor-avatar">
                            {mentor.name.charAt(0)}
                        </div>
                        <div className="mentor-details">
                            <span className="mentor-name">{mentor.name}</span>
                            <span className="mentor-skills">{mentor.skills.join(', ')}</span>
                        </div>
                        <button className="btn-details">
                            <span>See Details</span>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MentorsWidget;
