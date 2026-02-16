import { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import CreateGroupCard from "../components/CreateGroupCard";
import GroupCard, { type GroupData } from "../components/GroupCard";
import GroupDetailsPopup from "../components/GroupDetailsPopup";
import { batchApi, analyticsApi } from "../services/api";

const Admin = () => {
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupData | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Fetch batches on component mount
  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const batches = await batchApi.getAllBatches();

      // Transform batches to GroupData format
      const formattedGroups: GroupData[] = await Promise.all(
        batches.map(async (batch: any) => {
          // Optionally fetch analytics for each batch
          let statusInfo = {
            status: "good" as "good" | "warning" | "error",
            statusText: "All members on track",
          };

          try {
            const analytics = await analyticsApi.getBatchAnalytics(
              batch.batchId,
            );
            // You can use analytics data to determine status
            // This is a simplified example
            statusInfo = {
              status: "good",
              statusText: `${analytics.totalMembers || 0} members`,
            };
          } catch (err) {
            console.error(
              `Error fetching analytics for batch ${batch.batchId}:`,
              err,
            );
          }

          return {
            id: batch.batchId,
            name: batch.batchName,
            description: batch.description || "No description available",
            memberCount: 0, // Will be updated from backend or analytics
            status: statusInfo.status,
            statusText: statusInfo.statusText,
          };
        }),
      );

      setGroups(formattedGroups);
      setError(null);
    } catch (err) {
      console.error("Error fetching batches:", err);
      setError("Failed to load batches");
      // Fallback to demo data
      setGroups([
        {
          id: 1,
          name: "Frontend Developers",
          description: "Group for frontend engineering team.",
          memberCount: 12,
          status: "good",
          statusText: "Everyone on track",
        },
        {
          id: 2,
          name: "Backend Interns",
          description: "2026 Batch backend interns.",
          memberCount: 8,
          status: "warning",
          statusText: "3/8 members falling behind",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setIsCreating(true);
  };

  const handleOpenDetails = (group: GroupData) => {
    setSelectedGroup(group);
    setIsPopupOpen(true);
  };

  const handleCloseDetails = () => {
    setIsPopupOpen(false);
    setSelectedGroup(null);
  };

  const handleSaveNewGroup = async (
    _: number,
    name: string,
    description: string,
  ) => {
    try {
      // Create batch on backend
      const newBatch = await batchApi.createBatch({
        batchName: name,
        description: description,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      });

      const newGroup: GroupData = {
        id: newBatch.batchId,
        name: newBatch.batchName,
        description: newBatch.description,
        memberCount: 0,
        status: "good",
        statusText: "Newly created",
      };

      setGroups([newGroup, ...groups]);
      setIsCreating(false);
    } catch (err) {
      console.error("Error creating batch:", err);
      alert("Failed to create batch. Please try again.");
    }
  };

  const handleUpdateGroup = async (
    id: number,
    name: string,
    description: string,
  ) => {
    try {
      await batchApi.updateBatch(id, {
        batchName: name,
        description: description,
      });

      setGroups(
        groups.map((g) => (g.id === id ? { ...g, name, description } : g)),
      );
    } catch (err) {
      console.error("Error updating batch:", err);
      alert("Failed to update batch. Please try again.");
    }
  };

  return (
    <div className="admin-container">
      {error && (
        <div
          style={{
            padding: "15px",
            marginBottom: "20px",
            backgroundColor: "#fff3cd",
            color: "#856404",
            borderRadius: "4px",
            border: "1px solid #ffeaa7",
          }}
        >
          {error}
        </div>
      )}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          Loading batches...
        </div>
      ) : (
        <div className="admin-grid">
          {/* Create Group Card (Trigger) - Always visible if not creating? 
                    Requirement: "This new card becomes the group creation form."
                    So we HIDE the CreateGroupCard when creating.
                */}
          {!isCreating && <CreateGroupCard onClick={handleCreateClick} />}

          {/* If creating, show the form in place of the trigger */}
          {isCreating && (
            <GroupCard
              group={{
                id: 0,
                name: "",
                description: "",
                memberCount: 0,
                status: "good",
                statusText: "",
              }}
              initialEditMode={true}
              onSave={handleSaveNewGroup}
              onDetails={() => {}}
            />
          )}

          {/* Existing Groups */}
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              initialEditMode={false}
              onSave={handleUpdateGroup}
              onDetails={handleOpenDetails}
            />
          ))}
        </div>
      )}
      <GroupDetailsPopup
        isOpen={isPopupOpen}
        onClose={handleCloseDetails}
        group={selectedGroup}
      />
    </div>
  );
};

export default Admin;
