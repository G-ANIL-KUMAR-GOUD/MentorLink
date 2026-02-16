import { useState, useEffect } from "react";
import { Mail, Edit2, Check } from "lucide-react";
import "../styles/Dashboard.css";
import { mentorApi, menteeApi, skillApi } from "../services/api";

interface UserProfile {
  mentorId?: number;
  menteeId?: number;
  name: string;
  email: string;
  headline?: string;
  experienceYears?: number;
  expertiseArea?: string;
  linkedinUrl?: string;
  availability?: string;
  currentRole?: string;
  education?: string;
  goals?: string;
  interests?: string;
  skills: string[];
}

interface Skill {
  skillId: number;
  skillName: string;
}

interface ProfileWidgetProps {
  variant: "mentee" | "mentor";
  userId?: number; // Pass the logged-in user's ID (for now, we'll use default 1)
}

const ProfileWidget = ({ variant, userId = 1 }: ProfileWidgetProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Name and Email are now static/managed outside of local edit state regarding their value
  const [user, setUser] = useState<UserProfile>({
    name: "Loading...",
    email: "loading@example.com",
    skills: [],
  });

  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  // We only need to track skills in the edit form now
  const [skillsInput, setSkillsInput] = useState("");

  // Fetch mentor or mentee profile and available skills
  useEffect(() => {
    if (variant === "mentor") {
      fetchMentorProfile();
      fetchAvailableSkills();
    } else if (variant === "mentee") {
      fetchMenteeProfile();
      fetchAvailableSkills();
    }
  }, [variant, userId]);

  const fetchMentorProfile = async () => {
    try {
      setLoading(true);
      const mentorData = await mentorApi.getMentorById(userId);
      setUser({
        mentorId: mentorData.mentorId,
        name: mentorData.user?.name || "Unknown",
        email: mentorData.user?.email || "No email",
        headline: mentorData.headline,
        experienceYears: mentorData.experienceYears,
        expertiseArea: mentorData.expertiseArea,
        linkedinUrl: mentorData.linkedinUrl,
        availability: mentorData.availability,
        skills: mentorData.skills?.map((s: Skill) => s.skillName) || [],
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching mentor profile:", err);
      setError("Failed to load mentor profile");
      // Fallback to default data for demo
      setUser({
        name: "Henry Carter",
        email: "henry.carter@example.com",
        skills: ["React", "TypeScript", "Node.js", "UI Design", "Spring Boot"],
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSkills = async () => {
    try {
      const skills = await skillApi.getAllSkills();
      setAvailableSkills(skills);
    } catch (err) {
      console.error("Error fetching skills:", err);
    }
  };

  const fetchMenteeProfile = async () => {
    try {
      setLoading(true);
      const menteeData = await menteeApi.getMenteeById(userId);
      setUser({
        menteeId: menteeData.menteeId,
        name: menteeData.user?.name || "Unknown",
        email: menteeData.user?.email || "No email",
        currentRole: menteeData.currentRole,
        education: menteeData.education,
        goals: menteeData.goals,
        interests: menteeData.interests,
        skills: menteeData.skills?.map((s: Skill) => s.skillName) || [],
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching mentee profile:", err);
      setError("Failed to load mentee profile");
      // Fallback to default data for demo
      setUser({
        name: "Jane Smith",
        email: "jane.smith@example.com",
        skills: ["JavaScript", "Python", "UI/UX Design"],
      });
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => {
    setSkillsInput(user.skills.join(", "));
    setIsEditing(true);
  };

  const saveChanges = async () => {
    // For mentee
    if (variant === "mentee" && user.menteeId) {
      try {
        const updatedSkillNames = skillsInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        // Find or create skill IDs
        const skillIds: number[] = [];
        for (const skillName of updatedSkillNames) {
          let skill = availableSkills.find(
            (s) => s.skillName.toLowerCase() === skillName.toLowerCase(),
          );
          if (!skill) {
            try {
              skill = await skillApi.createSkill(skillName);
              setAvailableSkills((prev) => [...prev, skill!]);
            } catch (err) {
              console.error(`Error creating skill ${skillName}:`, err);
              continue;
            }
          }
          if (skill) {
            skillIds.push(skill.skillId);
          }
        }

        // Update skills on backend
        const updatedMentee = await menteeApi.assignSkills(
          user.menteeId,
          skillIds,
        );

        // Update local state
        setUser((prev) => ({
          ...prev,
          skills: updatedMentee.skills?.map((s: Skill) => s.skillName) || [],
        }));

        setIsEditing(false);
      } catch (err) {
        console.error("Error saving mentee skills:", err);
        alert("Failed to save skills. Please try again.");
      }
      return;
    }

    // For mentor
    if (variant === "mentor" && user.mentorId) {
      try {
        // Split by comma, trim, and remove empty strings
        const updatedSkillNames = skillsInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        // Find or create skill IDs
        const skillIds: number[] = [];
        for (const skillName of updatedSkillNames) {
          let skill = availableSkills.find(
            (s) => s.skillName.toLowerCase() === skillName.toLowerCase(),
          );
          if (!skill) {
            // Create new skill if it doesn't exist
            try {
              skill = await skillApi.createSkill(skillName);
              setAvailableSkills((prev) => [...prev, skill!]);
            } catch (err) {
              console.error(`Error creating skill ${skillName}:`, err);
              continue;
            }
          }
          if (skill) {
            skillIds.push(skill.skillId);
          }
        }

        // Update skills on backend
        const updatedMentor = await mentorApi.assignSkills(
          user.mentorId,
          skillIds,
        );

        // Update local state
        setUser((prev) => ({
          ...prev,
          skills: updatedMentor.skills?.map((s: Skill) => s.skillName) || [],
        }));

        setIsEditing(false);
      } catch (err) {
        console.error("Error saving skills:", err);
        alert("Failed to save skills. Please try again.");
      }
      return;
    }

    // Just update locally if no ID
    const updatedSkills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setUser((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
    setIsEditing(false);
  };

  return (
    <div className="dashboard-card profile-widget">
      {loading ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Loading profile...</p>
        </div>
      ) : error ? (
        <div style={{ padding: "20px", textAlign: "center", color: "#dc3545" }}>
          <p>{error}</p>
          <p style={{ fontSize: "12px", marginTop: "10px" }}>Using demo data</p>
        </div>
      ) : null}

      <div className="profile-header-section">
        <div className="profile-avatar-placeholder">{user.name.charAt(0)}</div>
        <div className="profile-info-primary">
          <h2 className="profile-name">{user.name}</h2>
          <div className="profile-meta">
            <Mail size={14} />
            <span>{user.email}</span>
          </div>
        </div>
      </div>

      <div className="profile-divider"></div>

      <div className="profile-section">
        <div className="section-header">
          <span className="profile-section-title">
            {variant === "mentee" ? "Skills to Learn" : "Skills to Mentor"}
          </span>
        </div>

        {!isEditing ? (
          <div className="skills-display">
            <div className="skills-container">
              {user.skills.length > 0 ? (
                user.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="empty-skills-text">No skills added yet.</span>
              )}
            </div>
          </div>
        ) : (
          <div className="edit-form">
            <div className="form-group">
              <label className="form-label">
                Edit Skills (comma separated)
              </label>
              <textarea
                className="form-input skills-textarea"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="e.g. React, UX Writing, Data Analysis"
                rows={3}
              />
            </div>
          </div>
        )}
      </div>

      <div className="widget-actions">
        {!isEditing ? (
          <button className="btn-primary" onClick={startEditing}>
            <Edit2 size={16} />
            <span>Edit Skills</span>
          </button>
        ) : (
          <button className="btn-primary" onClick={saveChanges}>
            <Check size={16} />
            <span>Save Changes</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileWidget;
