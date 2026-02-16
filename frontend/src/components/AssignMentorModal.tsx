import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import "../styles/Dashboard.css";
import { mentorApi } from "../services/api";

interface Mentor {
  id: number;
  name: string;
  email: string;
}

interface AssignMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (mentorId: number) => void;
}

const AssignMentorModal: React.FC<AssignMentorModalProps> = ({
  isOpen,
  onClose,
  onAssign,
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState("");
  const [allMentors, setAllMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch mentors when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchMentors();
    }
  }, [isOpen]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const mentorsData = await mentorApi.getAllMentors();

      const formattedMentors: Mentor[] = mentorsData.map((mentor: any) => ({
        id: mentor.mentorId,
        name: mentor.user?.name || "Unknown",
        email: mentor.user?.email || "No email",
      }));

      setAllMentors(formattedMentors);
      setError(null);
    } catch (err) {
      console.error("Error fetching mentors:", err);
      setError("Failed to load mentors");
      // Fallback to demo data
      setAllMentors([
        { id: 101, name: "Sarah Wilson", email: "sarah.w@example.com" },
        { id: 102, name: "Mike Ross", email: "mike.r@example.com" },
        { id: 103, name: "Jessica Pearson", email: "jessica.p@example.com" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMentors = allMentors.filter(
    (mentor) =>
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 1)
      .concat(name.split(" ")[1] ? name.split(" ")[1][0].toUpperCase() : "");
  };

  return (
    <div className="assign-modal-overlay" onClick={onClose}>
      <div
        className="assign-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="assign-modal-header">
          <h2 className="assign-modal-title">Assign Mentor</h2>
          <button className="btn-icon-action" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div
          className="assign-search-container"
          style={{ position: "relative" }}
        >
          <Search
            className="search-icon"
            size={18}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6B7280",
            }}
          />
          <input
            type="text"
            className="assign-search-input"
            placeholder="Search mentors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            style={{ paddingLeft: "40px" }}
          />
        </div>

        <div className="assign-results-list">
          {loading ? (
            <div
              style={{ padding: "20px", textAlign: "center", color: "#666" }}
            >
              Loading mentors...
            </div>
          ) : error ? (
            <div
              style={{ padding: "20px", textAlign: "center", color: "#dc3545" }}
            >
              {error}
            </div>
          ) : filteredMentors.length > 0 ? (
            filteredMentors.map((mentor) => (
              <div key={mentor.id} className="assign-mentor-row">
                <div className="assign-mentor-avatar">
                  {getInitials(mentor.name)}
                </div>
                <div className="assign-mentor-info">
                  <span className="assign-mentor-name">{mentor.name}</span>
                  <span className="assign-mentor-email">{mentor.email}</span>
                </div>
                <button
                  className="btn-assign-action"
                  onClick={() => onAssign(mentor.id)}
                >
                  Assign
                </button>
              </div>
            ))
          ) : (
            <div
              className="no-mentors-text"
              style={{ textAlign: "center", padding: "20px" }}
            >
              No mentors found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignMentorModal;
