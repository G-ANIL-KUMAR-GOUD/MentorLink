import { useState, useEffect } from "react";
import { Mail, Edit2, Check, X, Plus } from "lucide-react";
import "../styles/Dashboard.css";
import {
  mentorApi,
  menteeApi,
  skillApi,
  userApi,
  mentorProfileApi,
  menteeProfileApi,
  feedbackApi,
} from "../services/api";

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
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  // Fetch mentor or mentee profile and available skills
  useEffect(() => {
    if (variant === "mentor") {
      fetchMentorProfile();
      fetchAvailableSkills();
      fetchProfileDTO();
    } else if (variant === "mentee") {
      fetchMenteeProfile();
      fetchAvailableSkills();
      fetchProfileDTO();
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

  // Add a single skill via API (mentorApi.addSkill / menteeApi.addSkill)
  const handleAddSingleSkill = async (skillId: number) => {
    try {
      if (variant === "mentor" && user.mentorId) {
        const updated = await mentorApi.addSkill(user.mentorId, skillId);
        setUser((prev) => ({
          ...prev,
          skills: updated.skills?.map((s: Skill) => s.skillName) || [],
        }));
      } else if (variant === "mentee" && user.menteeId) {
        const updated = await menteeApi.addSkill(user.menteeId, skillId);
        setUser((prev) => ({
          ...prev,
          skills: updated.skills?.map((s: Skill) => s.skillName) || [],
        }));
      }
    } catch (err) {
      console.error("Error adding skill:", err);
    }
  };

  // Remove a single skill via API (mentorApi.removeSkill / menteeApi.removeSkill)
  const handleRemoveSingleSkill = async (skillId: number) => {
    try {
      if (variant === "mentor" && user.mentorId) {
        const updated = await mentorApi.removeSkill(user.mentorId, skillId);
        setUser((prev) => ({
          ...prev,
          skills: updated.skills?.map((s: Skill) => s.skillName) || [],
        }));
      } else if (variant === "mentee" && user.menteeId) {
        const updated = await menteeApi.removeSkill(user.menteeId, skillId);
        setUser((prev) => ({
          ...prev,
          skills: updated.skills?.map((s: Skill) => s.skillName) || [],
        }));
      }
    } catch (err) {
      console.error("Error removing skill:", err);
    }
  };

  // Update user details via API (userApi.updateUser)
  const handleUpdateUserDetails = async (updatedData: {
    name?: string;
    email?: string;
    profileInfo?: string;
  }) => {
    try {
      const updatedUser = await userApi.updateUser(userId, updatedData);
      setUser((prev) => ({
        ...prev,
        name: updatedUser.name || prev.name,
        email: updatedUser.email || prev.email,
      }));
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user details.");
    }
  };

  // Fetch profile via mentorProfileApi / menteeProfileApi (DTO response)
  const fetchProfileDTO = async () => {
    try {
      if (variant === "mentor") {
        const profile = await mentorProfileApi.getMentorProfile(userId);
        console.log("Mentor profile DTO:", profile);
      } else {
        const profile = await menteeProfileApi.getMenteeProfile(userId);
        console.log("Mentee profile DTO:", profile);
      }
    } catch (err) {
      console.error("Error fetching profile DTO:", err);
    }
  };

  // Fetch feedback for mentor/mentee (feedbackApi)
  const fetchFeedback = async () => {
    try {
      let feedbackData;
      if (variant === "mentor" && user.mentorId) {
        feedbackData = await feedbackApi.getFeedbackForMentor(user.mentorId);
      } else if (variant === "mentee" && user.menteeId) {
        feedbackData = await feedbackApi.getFeedbackForMentee(user.menteeId);
      }
      setFeedbacks(feedbackData || []);
      setShowFeedback(true);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setFeedbacks([]);
    }
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
    // Also sync name/email to backend via userApi.updateUser
    await handleUpdateUserDetails({ name: user.name, email: user.email });
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
                user.skills.map((skill, index) => {
                  const matchedSkill = availableSkills.find(
                    (s) => s.skillName.toLowerCase() === skill.toLowerCase(),
                  );
                  return (
                    <span
                      key={index}
                      className="skill-tag"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {skill}
                      {matchedSkill && (
                        <button
                          onClick={() =>
                            handleRemoveSingleSkill(matchedSkill.skillId)
                          }
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            lineHeight: 1,
                            color: "#999",
                          }}
                          title="Remove skill"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </span>
                  );
                })
              ) : (
                <span className="empty-skills-text">No skills added yet.</span>
              )}
            </div>
            {/* Quick-add from available skills */}
            {availableSkills.filter(
              (s) =>
                !user.skills.some(
                  (us) => us.toLowerCase() === s.skillName.toLowerCase(),
                ),
            ).length > 0 && (
              <div style={{ marginTop: "8px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    marginRight: "6px",
                  }}
                >
                  Add:
                </span>
                {availableSkills
                  .filter(
                    (s) =>
                      !user.skills.some(
                        (us) => us.toLowerCase() === s.skillName.toLowerCase(),
                      ),
                  )
                  .slice(0, 5)
                  .map((skill) => (
                    <button
                      key={skill.skillId}
                      onClick={() => handleAddSingleSkill(skill.skillId)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "2px",
                        padding: "2px 8px",
                        marginRight: "4px",
                        marginBottom: "4px",
                        border: "1px dashed #ccc",
                        borderRadius: "12px",
                        background: "none",
                        cursor: "pointer",
                        fontSize: "12px",
                        color: "#666",
                      }}
                    >
                      <Plus size={12} /> {skill.skillName}
                    </button>
                  ))}
              </div>
            )}
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
          <>
            <button className="btn-primary" onClick={startEditing}>
              <Edit2 size={16} />
              <span>Edit Skills</span>
            </button>
            <button
              className="btn-primary"
              onClick={fetchFeedback}
              style={{ marginLeft: "8px", backgroundColor: "#6366f1" }}
            >
              <Mail size={16} />
              <span>View Feedback</span>
            </button>
          </>
        ) : (
          <button className="btn-primary" onClick={saveChanges}>
            <Check size={16} />
            <span>Save Changes</span>
          </button>
        )}
      </div>

      {/* Feedback display section — feedbackApi.getFeedbackForMentor / getFeedbackForMentee */}
      {showFeedback && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <h4 style={{ margin: 0, fontSize: "14px" }}>
              Feedback ({feedbacks.length})
            </h4>
            <button
              onClick={() => setShowFeedback(false)}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <X size={16} />
            </button>
          </div>
          {feedbacks.length > 0 ? (
            feedbacks.map((fb: any, idx: number) => (
              <div
                key={idx}
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #eee",
                  fontSize: "13px",
                }}
              >
                <div
                  style={{ display: "flex", gap: "4px", marginBottom: "4px" }}
                >
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      style={{ color: s <= fb.rating ? "#F59E0B" : "#ddd" }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p style={{ margin: 0, color: "#555" }}>{fb.comments}</p>
              </div>
            ))
          ) : (
            <p style={{ fontSize: "13px", color: "#999" }}>No feedback yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileWidget;
