import React, { useState } from "react";
import { Users, Copy, Info, Trash2 } from "lucide-react";
import "../styles/Dashboard.css";

export interface GroupData {
  id: number;
  name: string;
  description?: string; // Optional now in view, used in edit
  memberCount: number;
  status: "good" | "warning" | "critical";
  statusText: string;
}

interface GroupCardProps {
  group: GroupData;
  initialEditMode?: boolean;
  onSave: (id: number, name: string, description: string) => void;
  onDetails: (group: GroupData) => void;
  onDelete?: (id: number) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({
  group,
  initialEditMode = false,
  onSave,
  onDetails,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [name, setName] = useState(group.name);
  // Description field removed from UI, keeping generic/empty for now
  const description = group.description || "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(group.id, name, description);
      setIsEditing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "#10B981"; // Emerald 500
      case "warning":
        return "#F59E0B"; // Amber 500
      case "critical":
        return "#EF4444"; // Red 500
      default:
        return "#9CA3AF";
    }
  };

  if (isEditing) {
    return (
      <div className="admin-card create-group-card active">
        <form onSubmit={handleSubmit} className="create-group-form">
          <div className="create-group-header">
            <input
              type="text"
              placeholder="Enter Group Name"
              className="group-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <button type="submit" className="btn-submit-group">
            Create Group
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-card group-card">
      {/* Title */}
      <h3 className="group-card-title">{group.name}</h3>

      {/* Member Count */}
      <div className="group-meta-row">
        <Users size={16} className="group-meta-icon" />
        <span className="group-meta-text">{group.memberCount} members</span>
      </div>

      {/* Status */}
      <div className="group-status-row">
        <div
          className="status-dot"
          style={{ backgroundColor: getStatusColor(group.status) }}
        />
        <span className="status-text">{group.statusText}</span>
      </div>

      {/* Divider */}
      <div className="group-card-divider" />

      {/* Actions */}
      <div className="group-actions">
        <button className="btn-group-action-copy">
          <Copy size={16} style={{ marginRight: "8px" }} />
          Copy Link
        </button>
        <button
          className="btn-group-action-details"
          onClick={() => onDetails(group)}
        >
          <Info size={16} style={{ marginRight: "8px", marginTop: "1px" }} />
          See Details
        </button>
        {onDelete && (
          <button
            className="btn-group-action-details"
            onClick={() => onDelete(group.id)}
            style={{ color: "#EF4444", marginLeft: "4px" }}
          >
            <Trash2 size={16} style={{ marginRight: "4px" }} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default GroupCard;
