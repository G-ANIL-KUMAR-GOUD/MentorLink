import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import { batchApi, userRoleApi, analyticsApi } from "../services/api";

interface Group {
  id: number;
  name: string;
  createdBy: string;
  memberCount: number;
  analytics?: { totalMembers?: number; [key: string]: any };
}

const MyGroupWidget = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserBatches();
  }, []);

  const fetchUserBatches = async () => {
    try {
      setLoading(true);
      const userId = parseInt(localStorage.getItem("userId") || "1");

      // Get user roles to find their batches
      const userRoles = await userRoleApi.getRolesForUser(userId);

      // Extract unique batch IDs
      const batchIds = [
        ...new Set(userRoles.map((ur: any) => ur.batch.batchId)),
      ] as number[];

      // Fetch details for each batch
      const batchPromises = batchIds.map((batchId: number) =>
        batchApi.getBatchById(batchId),
      );
      const batches = await Promise.all(batchPromises);

      const formattedGroups: Group[] = await Promise.all(
        batches.map(async (batch: any) => {
          // Fetch batch analytics (analyticsApi.getBatchAnalytics)
          let batchAnalytics = {};
          try {
            batchAnalytics = await analyticsApi.getBatchAnalytics(
              batch.batchId,
            );
          } catch (err) {
            console.error(
              `Error fetching analytics for batch ${batch.batchId}:`,
              err,
            );
          }

          return {
            id: batch.batchId,
            name: batch.batchName,
            createdBy: batch.manager?.name || "System Admin",
            memberCount:
              (batchAnalytics as any)?.totalMembers || batch.memberCount || 0,
            analytics: batchAnalytics,
          };
        }),
      );

      setGroups(formattedGroups);
      setError(null);
    } catch (err) {
      console.error("Error fetching batches:", err);
      setError("Failed to load groups");
      // Fallback to demo data
      setGroups([
        {
          id: 1,
          name: "Interns 2026",
          createdBy: "Ameena Shaikh",
          memberCount: 20,
        },
        {
          id: 2,
          name: "Interns 2025",
          createdBy: "Sarah Smith",
          memberCount: 12,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-card my-group-widget">
      <div className="my-group-header">
        <h3 className="my-group-title">My Groups ({groups.length})</h3>
      </div>

      {loading ? (
        <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
          Loading groups...
        </div>
      ) : error ? (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "#dc3545",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      ) : groups.length === 0 ? (
        <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
          No groups found
        </div>
      ) : (
        <div className="my-group-list">
          {groups.map((group, index) => (
            <React.Fragment key={group.id}>
              <div className="my-group-row">
                <div className="my-group-details">
                  <span className="my-group-name">{group.name}</span>
                  <span className="my-group-meta">
                    Created by {group.createdBy} • {group.memberCount} members
                  </span>
                </div>
              </div>
              {index < groups.length - 1 && (
                <div className="my-group-divider" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGroupWidget;
