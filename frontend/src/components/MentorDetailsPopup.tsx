import React, { useState } from "react";
import {
  Calendar,
  User,
  X,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Link,
  Send,
  Star,
} from "lucide-react";
import "../styles/Dashboard.css";
import { type Task } from "./AssignedUsersWidget";
import { taskApi, feedbackApi } from "../services/api";

interface Mentor {
  id: number;
  name: string;
  skills: string[];
  // attributes from MentorsWidget.tsx plus new ones
  email?: string;
  assignedDate?: string;
  assignedBy?: string;
  role?: string;
  tasks?: Task[];
  mapId?: number; // MentorMenteeMap ID for task/feedback operations
}

interface MentorDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: Mentor | null;
  onUpdateProgress?: (taskId: string, newProgress: number) => void;
  onCreateTask?: (task: Task) => void;
  variant: "mentee" | "mentor";
}

const MentorDetailsPopup: React.FC<MentorDetailsPopupProps> = ({
  isOpen,
  onClose,
  mentor,
  onUpdateProgress,
  onCreateTask,
  variant,
}) => {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [creatingTask, setCreatingTask] = useState(false);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  if (!isOpen || !mentor) return null;

  const toggleTask = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "#10B981"; // Green
    if (progress > 0) return "#F59E0B"; // Orange
    return "#9CA3AF"; // Gray
  };

  const handleIncrement = (
    taskId: string,
    currentProgress: number,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    if (onUpdateProgress) {
      onUpdateProgress(taskId, Math.min(100, currentProgress + 1));
    }
  };

  const handleDecrement = (
    taskId: string,
    currentProgress: number,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    if (onUpdateProgress) {
      onUpdateProgress(taskId, Math.max(0, currentProgress - 1));
    }
  };

  const handleInputChange = (
    taskId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && onUpdateProgress) {
      onUpdateProgress(taskId, Math.max(0, Math.min(100, val)));
    }
  };

  // Create task via backend API (taskApi.assignTask)
  const handleCreate = async () => {
    if (!newTaskTitle.trim()) return;

    if (mentor.mapId && newTaskDueDate) {
      try {
        setCreatingTask(true);
        const createdTask = await taskApi.assignTask(
          mentor.mapId,
          `${newTaskTitle}: ${newTaskDesc}`,
          newTaskDueDate,
        );

        const newTask: Task = {
          id: createdTask.taskId.toString(),
          title: newTaskTitle,
          description: createdTask.description,
          progress: 0,
          status: "Not Started",
          assignedDate: new Date(createdTask.createdAt).toLocaleDateString(
            "en-US",
            { month: "short", day: "numeric", year: "numeric" },
          ),
        };

        if (onCreateTask) onCreateTask(newTask);
        setNewTaskTitle("");
        setNewTaskDesc("");
        setNewTaskDueDate("");
      } catch (err) {
        console.error("Error creating task via API:", err);
        alert("Failed to create task. Please try again.");
      } finally {
        setCreatingTask(false);
      }
    } else if (onCreateTask) {
      // Fallback to local creation if no mapId or dueDate
      const newTask: Task = {
        id: `t-${Date.now()}`,
        title: newTaskTitle,
        description: newTaskDesc,
        progress: 0,
        status: "Not Started",
        assignedDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };
      onCreateTask(newTask);
      setNewTaskTitle("");
      setNewTaskDesc("");
      setNewTaskDueDate("");
    }
  };

  // Update task status via backend API (taskApi.updateTaskStatus)
  const handleMarkCompleted = async (taskId: string) => {
    try {
      const numericId = parseInt(taskId);
      if (!isNaN(numericId)) {
        await taskApi.updateTaskStatus(numericId, "COMPLETED");
      }
      if (onUpdateProgress) {
        onUpdateProgress(taskId, 100);
      }
    } catch (err) {
      console.error("Error updating task status:", err);
      alert("Failed to update task status.");
    }
  };

  // Submit feedback via backend API (feedbackApi.submitFeedback)
  const handleSubmitFeedback = async () => {
    if (!mentor.mapId || !feedbackComment.trim() || feedbackRating === 0)
      return;

    try {
      setSubmittingFeedback(true);
      await feedbackApi.submitFeedback(
        mentor.mapId,
        feedbackComment,
        feedbackRating,
      );
      setFeedbackComment("");
      setFeedbackRating(0);
      setShowFeedbackForm(false);
      alert("Feedback submitted successfully!");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <div className="header-left">
            <div className="popup-avatar">{mentor.name.charAt(0)}</div>
            <div className="popup-header-info">
              <h2 className="popup-name">{mentor.name}</h2>
              <a href={`mailto:${mentor.email}`} className="popup-email">
                {mentor.email}
              </a>
            </div>
          </div>
          <button className="btn-cancel" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="popup-assignment-info">
          <div className="assignment-item">
            <Calendar size={16} className="assignment-icon" />
            <span className="assignment-label">
              Assigned on {mentor.assignedDate || "N/A"}
            </span>
          </div>
          <span className="assignment-separator">•</span>
          <div className="assignment-item">
            <User size={16} className="assignment-icon" />
            <span className="assignment-by">
              Assigned by {mentor.assignedBy || "Admin"}
            </span>
          </div>
        </div>
        <div className="popup-skills-section">
          <h4 className="popup-skills-title">
            {variant === "mentor" ? "Skills mentoring" : "Skills Learning"}
          </h4>
          <div className="popup-skills-list">
            {mentor.skills.map((skill, index) => (
              <span key={index} className="popup-skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="popup-divider"></div>

        <div className="popup-content-scrollable">
          {variant === "mentor" && (
            <div className="create-task-container">
              <input
                type="text"
                className="create-task-input create-task-title"
                placeholder="Enter Task Title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <textarea
                className="create-task-input create-task-desc"
                placeholder="Enter Task Description and Details"
                rows={2}
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
              />
              <input
                type="date"
                className="create-task-input"
                placeholder="Due Date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                style={{
                  marginBottom: "10px",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                }}
              />
              <button
                className="btn-create-task"
                onClick={handleCreate}
                disabled={creatingTask}
              >
                {creatingTask ? "Creating..." : "Create Task"}
              </button>
            </div>
          )}

          <div className="popup-tasks-section">
            <h4 className="popup-section-heading">Tasks (10 Pending)</h4>
            <div className="tasks-list">
              {mentor.tasks && mentor.tasks.length > 0 ? (
                mentor.tasks.map((task) => (
                  <div key={task.id} className="task-item">
                    <div
                      className="task-row"
                      onClick={() => toggleTask(task.id)}
                    >
                      <button className="task-chevron">
                        {expandedTaskId === task.id ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </button>
                      <span className="task-title">{task.title}</span>
                      <div className="task-right">
                        <div className="task-progress-tracker">
                          <div className="task-progress-bar-bg">
                            <div
                              className="task-progress-bar-fill"
                              style={{
                                width: `${task.progress}%`,
                                backgroundColor: getProgressColor(
                                  task.progress,
                                ),
                              }}
                            ></div>
                          </div>
                          <span className="task-percentage">
                            {task.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                    {expandedTaskId === task.id && (
                      <div className="task-expanded-desc">
                        {task.description}
                        <div className="task-meta-row">
                          <Calendar size={14} className="task-meta-icon" />
                          <span>Task assigned on {task.assignedDate}</span>
                        </div>
                        <div className="task-actions">
                          <button
                            className="btn-request-review"
                            onClick={() => handleMarkCompleted(task.id)}
                          >
                            {variant === "mentor"
                              ? "Mark as Completed"
                              : "Request Review"}
                          </button>
                          {variant === "mentor" && (
                            <div
                              className="progress-stepper"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className="stepper-btn"
                                onClick={(e) =>
                                  handleDecrement(task.id, task.progress, e)
                                }
                              >
                                <Minus size={15} />
                              </button>
                              <input
                                type="number"
                                className="stepper-input"
                                value={task.progress}
                                onChange={(e) => handleInputChange(task.id, e)}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <button
                                className="stepper-btn"
                                onClick={(e) =>
                                  handleIncrement(task.id, task.progress, e)
                                }
                              >
                                <Plus size={15} />
                              </button>
                            </div>
                          )}
                        </div>
                        <div
                          className="task-comment-row"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button className="btn-icon-action">
                            <Link size={18} />
                          </button>
                          <input
                            type="text"
                            className="comment-input"
                            placeholder="Share resources and details..."
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button className="btn-submit">
                            <Send size={14} />
                          </button>
                        </div>

                        {/* Comments Section */}
                        {task.comments && task.comments.length > 0 && (
                          <div className="task-comments-list">
                            {task.comments.map((comment) => (
                              <div key={comment.id} className="comment-item">
                                <div
                                  className="comment-avatar"
                                  style={{
                                    backgroundColor:
                                      comment.avatarColor || "#3B82F6",
                                  }}
                                >
                                  {comment.author.charAt(0)}
                                </div>
                                <div className="comment-content">
                                  <span className="comment-author">
                                    {comment.author}
                                  </span>
                                  <p className="comment-text">{comment.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-tasks">No Tasks</p>
              )}
            </div>
          </div>

          {/* Feedback Section — uses feedbackApi.submitFeedback */}
          {mentor.mapId && (
            <div className="popup-tasks-section" style={{ marginTop: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h4 className="popup-section-heading">Feedback</h4>
                <button
                  className="btn-request-review"
                  style={{ fontSize: "12px", padding: "4px 12px" }}
                  onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                >
                  {showFeedbackForm ? "Cancel" : "Give Feedback"}
                </button>
              </div>
              {showFeedbackForm && (
                <div style={{ marginTop: "12px" }}>
                  <div
                    style={{ display: "flex", gap: "4px", marginBottom: "8px" }}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFeedbackRating(star)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "2px",
                        }}
                      >
                        <Star
                          size={20}
                          fill={star <= feedbackRating ? "#F59E0B" : "none"}
                          color={star <= feedbackRating ? "#F59E0B" : "#9CA3AF"}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="create-task-input create-task-desc"
                    placeholder="Share your feedback..."
                    rows={2}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                  />
                  <button
                    className="btn-create-task"
                    onClick={handleSubmitFeedback}
                    disabled={
                      submittingFeedback ||
                      feedbackRating === 0 ||
                      !feedbackComment.trim()
                    }
                    style={{ marginTop: "8px" }}
                  >
                    {submittingFeedback ? "Submitting..." : "Submit Feedback"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorDetailsPopup;
