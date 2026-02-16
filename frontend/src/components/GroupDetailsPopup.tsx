import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  User,
  UserPlus,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import "../styles/Dashboard.css";
import type { GroupData } from "./GroupCard";
import AssignMentorModal from "./AssignMentorModal";
import { userRoleApi, mentorMenteeMapApi, taskApi } from "../services/api";

interface Mentor {
  id: number;
  name: string;
  email: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  progress: number;
}

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  joinedDate: string;
  status: "active" | "inactive";
  progress: number;
  skills: string[];
  mentors: Mentor[];
}

interface GroupDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  group: GroupData | null;
}

const GroupDetailsPopup: React.FC<GroupDetailsPopupProps> = ({
  isOpen,
  onClose,
  group,
}) => {
  if (!isOpen || !group) return null;

  const [expandedMemberId, setExpandedMemberId] = useState<number | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch batch members when popup opens
  useEffect(() => {
    if (isOpen && group) {
      fetchBatchMembers();
    }
  }, [isOpen, group]);

  const fetchBatchMembers = async () => {
    try {
      setLoading(true);
      // Fetch users for this batch
      const batchUsers = await userRoleApi.getUsersForRole(group.id);

      // For each user, get their mentor mappings and tasks
      const membersData: Member[] = await Promise.all(
        batchUsers.map(async (userRole: any) => {
          const user = userRole.user;

          // Get mentor mappings for this user (if they're a mentee)
          let mentors: Mentor[] = [];
          try {
            const mappings = await mentorMenteeMapApi.getMentorsForMentee(
              user.userId,
            );
            mentors = await Promise.all(
              mappings.map(async (mapping: any) => {
                // Get tasks for this mapping
                const tasks = await taskApi.getTasksForMapping(mapping.mapId);
                const totalTasks = tasks.length;
                const completedTasks = tasks.filter(
                  (t: any) => t.status === "Completed",
                ).length;
                const pendingTasks = totalTasks - completedTasks;
                const progress =
                  totalTasks > 0
                    ? Math.round((completedTasks / totalTasks) * 100)
                    : 0;

                return {
                  id: mapping.mentor.mentorId,
                  name: mapping.mentor.user?.name || "Unknown",
                  email: mapping.mentor.user?.email || "No email",
                  totalTasks,
                  completedTasks,
                  pendingTasks,
                  progress,
                };
              }),
            );
          } catch (err) {
            console.error(
              `Error fetching mentors for user ${user.userId}:`,
              err,
            );
          }

          // Calculate overall progress
          const progress =
            mentors.length > 0
              ? Math.round(
                  mentors.reduce((acc, m) => acc + m.progress, 0) /
                    mentors.length,
                )
              : 0;

          return {
            id: user.userId,
            name: user.name,
            email: user.email,
            role: userRole.role.roleName,
            joinedDate: new Date(
              userRole.assignedDate || Date.now(),
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            status: "active" as "active" | "inactive",
            progress,
            skills: [], // Could fetch from profile if needed
            mentors,
          };
        }),
      );

      setMembers(membersData);
    } catch (err) {
      console.error("Error fetching batch members:", err);
      // Fallback to demo data
      setMembersDemoData();
    } finally {
      setLoading(false);
    }
  };

  const setMembersDemoData = () => {
    setMembers([
      {
        id: 1,
        name: "Alice Johnson",
        email: "alice@example.com",
        role: "Team Lead",
        joinedDate: "Jan 10, 2026",
        status: "active",
        progress: 75,
        skills: ["React", "TypeScript", "Node.js"],
        mentors: [
          {
            id: 101,
            name: "Sarah Wilson",
            email: "sarah.w@example.com",
            totalTasks: 12,
            completedTasks: 9,
            pendingTasks: 3,
            progress: 75,
          },
        ],
      },
      {
        id: 2,
        name: "Bob Smith",
        email: "bob@example.com",
        role: "Member",
        joinedDate: "Jan 12, 2026",
        status: "active",
        progress: 45,
        skills: ["UI/UX", "Figma", "CSS"],
        mentors: [
          {
            id: 102,
            name: "Mike Ross",
            email: "mike.r@example.com",
            totalTasks: 8,
            completedTasks: 4,
            pendingTasks: 4,
            progress: 50,
          },
        ],
      },
      {
        id: 3,
        name: "Charlie Brown",
        email: "charlie@example.com",
        role: "Member",
        joinedDate: "Jan 15, 2026",
        status: "inactive",
        progress: 20,
        skills: ["Python", "Django"],
        mentors: [],
      },
    ]);
  };

  const toggleExpand = (memberId: number) => {
    setExpandedMemberId(expandedMemberId === memberId ? null : memberId);
  };

  const handleAssignClick = (e: React.MouseEvent, memberId: number) => {
    e.stopPropagation();
    setSelectedMemberId(memberId);
    setIsAssignModalOpen(true);
  };

  const handleAssignConfirm = async (mentorId: number) => {
    if (!selectedMemberId) return;

    try {
      // Get the first batch for this user (simplified)
      const batchId = group.id;

      // Create mentor-mentee mapping
      await mentorMenteeMapApi.requestMentor(
        selectedMemberId,
        mentorId,
        batchId,
        "General Mentorship",
      );

      // Refresh members data
      await fetchBatchMembers();

      setIsAssignModalOpen(false);
      setSelectedMemberId(null);
    } catch (err) {
      console.error("Error assigning mentor:", err);
      alert("Failed to assign mentor. Please try again.");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 1);
  };

  return (
    <div className="group-modal-overlay" onClick={onClose}>
      <div
        className="group-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="group-popup-header">
          <div className="group-header-left">
            <div className="group-popup-header-info">
              <h2 className="group-popup-name">{group.name}</h2>
            </div>
          </div>
          <button className="group-btn-cancel" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="group-popup-meta-info">
          <div className="group-meta-item">
            <Calendar size={16} className="group-meta-icon" />
            <span className="group-meta-label">Created on 13 Feb, 2026</span>
          </div>
          <span className="group-meta-separator">•</span>
          <div className="group-meta-item">
            <User size={16} className="group-meta-icon" />
            <span className="group-meta-label">Created by Ameena Shaikh</span>
          </div>
        </div>

        <div className="group-popup-divider" />

        <div className="group-popup-content-scrollable">
          <div className="group-members-section">
            <div className="group-members-header">
              <h4 className="group-section-heading">
                Members ({members.length})
              </h4>
            </div>

            {loading ? (
              <div
                style={{ padding: "20px", textAlign: "center", color: "#666" }}
              >
                Loading members...
              </div>
            ) : (
              <div className="group-members-list">
                {members.map((member) => (
                  <div key={member.id} className="group-member-container">
                    <div
                      className={`group-member-row ${expandedMemberId === member.id ? "expanded" : ""}`}
                      onClick={() => toggleExpand(member.id)}
                    >
                      {expandedMemberId === member.id ? (
                        <ChevronDown
                          size={20}
                          className="group-member-chevron"
                        />
                      ) : (
                        <ChevronRight
                          size={20}
                          className="group-member-chevron"
                        />
                      )}

                      <div className="group-member-avatar">
                        {getInitials(member.name)}
                      </div>

                      <div className="group-member-info">
                        <span className="group-member-name">{member.name}</span>
                        <span className="group-member-email">
                          {member.email}
                        </span>
                      </div>

                      <div className="member-right-section">
                        <div className="member-progress-container">
                          <div
                            className="member-progress-fill"
                            style={{
                              width: `${member.progress}%`,
                              backgroundColor:
                                member.progress > 50 ? "#10B981" : "#F59E0B",
                            }}
                          />
                        </div>

                        <button
                          className="btn-assign-mentor"
                          onClick={(e) => handleAssignClick(e, member.id)}
                        >
                          <UserPlus size={16} />
                          <span>Assign Mentor</span>
                        </button>
                      </div>
                    </div>

                    {expandedMemberId === member.id && (
                      <div className="group-member-expanded-details">
                        {/* Skills Section */}
                        <div className="expanded-section">
                          <h5 className="expanded-section-title">
                            Skills to Mentor
                          </h5>
                          <div className="expanded-skills-container">
                            {member.skills.map((skill, idx) => (
                              <span key={idx} className="skill-tag">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Mentors Section */}
                        <div className="expanded-section">
                          <h5 className="expanded-section-title">Mentors</h5>
                          <div className="expanded-mentors-list">
                            {member.mentors.length > 0 ? (
                              member.mentors.map((mentor) => (
                                <div
                                  key={mentor.id}
                                  className="expanded-mentor-row"
                                >
                                  <div className="mentor-avatar-small">
                                    {getInitials(mentor.name).substring(0, 1)}
                                  </div>
                                  <div className="mentor-info-col">
                                    <span className="mentor-name-text">
                                      {mentor.name}
                                    </span>
                                    <span className="mentor-email-text">
                                      {mentor.email}
                                    </span>
                                    <span className="mentor-stats-text">
                                      Total Tasks: {mentor.totalTasks} •
                                      Completed: {mentor.completedTasks} •
                                      Pending: {mentor.pendingTasks}
                                    </span>
                                  </div>
                                  <div className="mentor-progress-col">
                                    <div className="mentor-progress-bar-container">
                                      <div
                                        className="mentor-progress-fill"
                                        style={{ width: `${mentor.progress}%` }}
                                      />
                                    </div>
                                    <span className="mentor-progress-text">
                                      {mentor.progress}%
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="no-mentors-text">
                                No mentors assigned yet.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AssignMentorModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={handleAssignConfirm}
      />
    </div>
  );
};

export default GroupDetailsPopup;
