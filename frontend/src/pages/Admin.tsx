import { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import CreateGroupCard from "../components/CreateGroupCard";
import GroupCard, { type GroupData } from "../components/GroupCard";
import GroupDetailsPopup from "../components/GroupDetailsPopup";
import {
  batchApi,
  analyticsApi,
  adminApi,
  roleApi,
  userApi,
} from "../services/api";

interface RoleItem {
  roleId: number;
  roleName: string;
}

interface UserItem {
  userId: number;
  name: string;
  email: string;
}

const Admin = () => {
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupData | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showManagerForm, setShowManagerForm] = useState(false);
  const [managerForm, setManagerForm] = useState({
    name: "",
    email: "",
    passwordHash: "",
  });
  const [creatingManager, setCreatingManager] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "batches" | "users" | "roles" | "analytics"
  >("batches");
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [allUsers, setAllUsers] = useState<UserItem[]>([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [editingRoleName, setEditingRoleName] = useState("");
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingUserData, setEditingUserData] = useState({
    name: "",
    email: "",
  });
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [analyticsInput, setAnalyticsInput] = useState({
    type: "mentor",
    id: "",
  });
  const [assignManagerForm, setAssignManagerForm] = useState({
    batchId: "",
    managerId: "",
  });

  // Fetch batches on component mount
  useEffect(() => {
    fetchBatches();
    handleFetchAdminBatches();
    fetchRoles();
    fetchAllUsers();
  }, []);

  const fetchRoles = async () => {
    try {
      const data = await roleApi.getAllRoles();
      setRoles(data);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const data = await userApi.getAllUsers();
      setAllUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

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

  // Delete a batch (batchApi.deleteBatch)
  const handleDeleteBatch = async (batchId: number) => {
    if (!window.confirm("Are you sure you want to delete this batch?")) return;
    try {
      await batchApi.deleteBatch(batchId);
      setGroups(groups.filter((g) => g.id !== batchId));
    } catch (err) {
      console.error("Error deleting batch:", err);
      alert("Failed to delete batch. Please try again.");
    }
  };

  // Assign manager to a batch (adminApi.assignManagerToBatch / batchApi.assignManager)
  const handleAssignManager = async (batchId: number, managerId: number) => {
    try {
      await adminApi.assignManagerToBatch(batchId, managerId);
      // Refresh batches to show updated manager
      await fetchBatches();
    } catch (err) {
      console.error("Error assigning manager:", err);
      alert("Failed to assign manager. Please try again.");
    }
  };

  // Create a manager user (adminApi.createManager)
  const handleCreateManager = async () => {
    if (!managerForm.name.trim() || !managerForm.email.trim()) return;
    try {
      setCreatingManager(true);
      await adminApi.createManager({
        name: managerForm.name,
        email: managerForm.email,
        passwordHash: managerForm.passwordHash,
      });
      setManagerForm({ name: "", email: "", passwordHash: "" });
      setShowManagerForm(false);
      alert("Manager created successfully!");
    } catch (err) {
      console.error("Error creating manager:", err);
      alert("Failed to create manager. Please try again.");
    } finally {
      setCreatingManager(false);
    }
  };

  // Get all admin batches (adminApi.getAllBatches)
  const handleFetchAdminBatches = async () => {
    try {
      const adminBatches = await adminApi.getAllBatches();
      console.log("Admin batches:", adminBatches);
    } catch (err) {
      console.error("Error fetching admin batches:", err);
    }
  };

  // Delete a user (userApi.deleteUser)
  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await userApi.deleteUser(userId);
      alert("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  // Update a user (userApi.updateUser)
  const handleUpdateUser = async (userId: number, userData: any) => {
    try {
      await userApi.updateUser(userId, userData);
      alert("User updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user.");
    }
  };

  // Role CRUD operations (roleApi)
  const handleCreateRole = async (roleName: string) => {
    try {
      await roleApi.createRole({ roleName });
      alert("Role created successfully!");
    } catch (err) {
      console.error("Error creating role:", err);
      alert("Failed to create role.");
    }
  };

  const handleUpdateRole = async (roleId: number, roleName: string) => {
    try {
      await roleApi.updateRole(roleId, { roleName });
      alert("Role updated successfully!");
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Failed to update role.");
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      await roleApi.deleteRole(roleId);
      alert("Role deleted successfully!");
    } catch (err) {
      console.error("Error deleting role:", err);
      alert("Failed to delete role.");
    }
  };

  // Fetch mentor/mentee performance analytics
  const handleFetchMentorPerformance = async (mentorId: number) => {
    try {
      const performance = await analyticsApi.getMentorPerformance(mentorId);
      return performance;
    } catch (err) {
      console.error("Error fetching mentor performance:", err);
      return null;
    }
  };

  const handleFetchMenteeProgress = async (menteeId: number) => {
    try {
      const progress = await analyticsApi.getMenteeProgress(menteeId);
      return progress;
    } catch (err) {
      console.error("Error fetching mentee progress:", err);
      return null;
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

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
          borderBottom: "2px solid #eee",
          paddingBottom: "8px",
        }}
      >
        {(["batches", "users", "roles", "analytics"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px 6px 0 0",
              cursor: "pointer",
              fontWeight: activeTab === tab ? 600 : 400,
              backgroundColor: activeTab === tab ? "#4F46E5" : "#f1f1f1",
              color: activeTab === tab ? "white" : "#333",
              textTransform: "capitalize",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ---- BATCHES TAB ---- */}
      {activeTab === "batches" && (
        <>
          {/* Manager Creation Section — adminApi.createManager */}
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn-create-task"
              style={{ padding: "8px 16px", fontSize: "14px" }}
              onClick={() => setShowManagerForm(!showManagerForm)}
            >
              {showManagerForm ? "Cancel" : "Create Manager"}
            </button>
          </div>

          {showManagerForm && (
            <div
              style={{
                padding: "20px",
                marginBottom: "20px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                border: "1px solid #dee2e6",
              }}
            >
              <h3 style={{ marginBottom: "12px", fontSize: "16px" }}>
                Create New Manager
              </h3>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="Manager Name"
                  value={managerForm.name}
                  onChange={(e) =>
                    setManagerForm({ ...managerForm, name: e.target.value })
                  }
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    minWidth: "150px",
                  }}
                />
                <input
                  type="email"
                  placeholder="Manager Email"
                  value={managerForm.email}
                  onChange={(e) =>
                    setManagerForm({ ...managerForm, email: e.target.value })
                  }
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    minWidth: "150px",
                  }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={managerForm.passwordHash}
                  onChange={(e) =>
                    setManagerForm({
                      ...managerForm,
                      passwordHash: e.target.value,
                    })
                  }
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    minWidth: "150px",
                  }}
                />
                <button
                  className="btn-create-task"
                  onClick={handleCreateManager}
                  disabled={creatingManager}
                  style={{ padding: "8px 20px" }}
                >
                  {creatingManager ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          )}

          {/* Assign Manager to Batch */}
          <div
            style={{
              marginBottom: "20px",
              padding: "16px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
            }}
          >
            <h4 style={{ marginBottom: "10px", fontSize: "14px" }}>
              Assign Manager to Batch
            </h4>
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <select
                value={assignManagerForm.batchId}
                onChange={(e) =>
                  setAssignManagerForm({
                    ...assignManagerForm,
                    batchId: e.target.value,
                  })
                }
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  minWidth: "150px",
                }}
              >
                <option value="">Select Batch</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              <select
                value={assignManagerForm.managerId}
                onChange={(e) =>
                  setAssignManagerForm({
                    ...assignManagerForm,
                    managerId: e.target.value,
                  })
                }
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  minWidth: "150px",
                }}
              >
                <option value="">Select Manager</option>
                {allUsers.map((u) => (
                  <option key={u.userId} value={u.userId}>
                    {u.name}
                  </option>
                ))}
              </select>
              <button
                className="btn-create-task"
                style={{ padding: "8px 16px" }}
                onClick={() => {
                  if (
                    assignManagerForm.batchId &&
                    assignManagerForm.managerId
                  ) {
                    handleAssignManager(
                      Number(assignManagerForm.batchId),
                      Number(assignManagerForm.managerId),
                    );
                  }
                }}
              >
                Assign
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              Loading batches...
            </div>
          ) : (
            <div className="admin-grid">
              {!isCreating && <CreateGroupCard onClick={handleCreateClick} />}
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
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  initialEditMode={false}
                  onSave={handleUpdateGroup}
                  onDetails={handleOpenDetails}
                  onDelete={handleDeleteBatch}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ---- USERS TAB ---- */}
      {activeTab === "users" && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            border: "1px solid #dee2e6",
          }}
        >
          <h3 style={{ marginBottom: "16px" }}>User Management</h3>
          {allUsers.length === 0 ? (
            <p style={{ color: "#666" }}>No users found.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #dee2e6" }}>
                  <th style={{ textAlign: "left", padding: "8px" }}>ID</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Name</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Email</th>
                  <th style={{ textAlign: "right", padding: "8px" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u) => (
                  <tr key={u.userId} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "8px" }}>{u.userId}</td>
                    <td style={{ padding: "8px" }}>
                      {editingUserId === u.userId ? (
                        <input
                          value={editingUserData.name}
                          onChange={(e) =>
                            setEditingUserData({
                              ...editingUserData,
                              name: e.target.value,
                            })
                          }
                          style={{
                            padding: "4px 8px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                          }}
                        />
                      ) : (
                        u.name
                      )}
                    </td>
                    <td style={{ padding: "8px" }}>
                      {editingUserId === u.userId ? (
                        <input
                          value={editingUserData.email}
                          onChange={(e) =>
                            setEditingUserData({
                              ...editingUserData,
                              email: e.target.value,
                            })
                          }
                          style={{
                            padding: "4px 8px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                          }}
                        />
                      ) : (
                        u.email
                      )}
                    </td>
                    <td style={{ padding: "8px", textAlign: "right" }}>
                      {editingUserId === u.userId ? (
                        <>
                          <button
                            onClick={async () => {
                              await handleUpdateUser(u.userId, editingUserData);
                              setEditingUserId(null);
                              fetchAllUsers();
                            }}
                            style={{
                              padding: "4px 10px",
                              marginRight: "4px",
                              border: "1px solid #10B981",
                              backgroundColor: "#10B981",
                              color: "white",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            style={{
                              padding: "4px 10px",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingUserId(u.userId);
                              setEditingUserData({
                                name: u.name,
                                email: u.email,
                              });
                            }}
                            style={{
                              padding: "4px 10px",
                              marginRight: "4px",
                              border: "1px solid #4F46E5",
                              color: "#4F46E5",
                              backgroundColor: "transparent",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteUser(u.userId).then(() =>
                                fetchAllUsers(),
                              )
                            }
                            style={{
                              padding: "4px 10px",
                              border: "1px solid #EF4444",
                              color: "#EF4444",
                              backgroundColor: "transparent",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ---- ROLES TAB ---- */}
      {activeTab === "roles" && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            border: "1px solid #dee2e6",
          }}
        >
          <h3 style={{ marginBottom: "16px" }}>Role Management</h3>
          {/* Create Role */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <input
              type="text"
              placeholder="New role name"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                maxWidth: "300px",
              }}
            />
            <button
              className="btn-create-task"
              style={{ padding: "8px 16px" }}
              onClick={async () => {
                if (newRoleName.trim()) {
                  await handleCreateRole(newRoleName.trim());
                  setNewRoleName("");
                  fetchRoles();
                }
              }}
            >
              Create Role
            </button>
          </div>
          {/* Roles list */}
          {roles.length === 0 ? (
            <p style={{ color: "#666" }}>No roles found.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {roles.map((role) => (
                <li
                  key={role.roleId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {editingRoleId === role.roleId ? (
                    <>
                      <input
                        value={editingRoleName}
                        onChange={(e) => setEditingRoleName(e.target.value)}
                        style={{
                          padding: "4px 8px",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                        }}
                      />
                      <button
                        onClick={async () => {
                          await handleUpdateRole(role.roleId, editingRoleName);
                          setEditingRoleId(null);
                          fetchRoles();
                        }}
                        style={{
                          padding: "4px 10px",
                          border: "1px solid #10B981",
                          backgroundColor: "#10B981",
                          color: "white",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingRoleId(null)}
                        style={{
                          padding: "4px 10px",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span style={{ flex: 1 }}>{role.roleName}</span>
                      <button
                        onClick={() => {
                          setEditingRoleId(role.roleId);
                          setEditingRoleName(role.roleName);
                        }}
                        style={{
                          padding: "4px 10px",
                          border: "1px solid #4F46E5",
                          color: "#4F46E5",
                          backgroundColor: "transparent",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteRole(role.roleId).then(() => fetchRoles())
                        }
                        style={{
                          padding: "4px 10px",
                          border: "1px solid #EF4444",
                          color: "#EF4444",
                          backgroundColor: "transparent",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ---- ANALYTICS TAB ---- */}
      {activeTab === "analytics" && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            border: "1px solid #dee2e6",
          }}
        >
          <h3 style={{ marginBottom: "16px" }}>Performance Analytics</h3>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            <select
              value={analyticsInput.type}
              onChange={(e) =>
                setAnalyticsInput({ ...analyticsInput, type: e.target.value })
              }
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            >
              <option value="mentor">Mentor Performance</option>
              <option value="mentee">Mentee Progress</option>
            </select>
            <input
              type="number"
              placeholder={`${analyticsInput.type === "mentor" ? "Mentor" : "Mentee"} ID`}
              value={analyticsInput.id}
              onChange={(e) =>
                setAnalyticsInput({ ...analyticsInput, id: e.target.value })
              }
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                width: "150px",
              }}
            />
            <button
              className="btn-create-task"
              style={{ padding: "8px 16px" }}
              onClick={async () => {
                if (!analyticsInput.id) return;
                const id = Number(analyticsInput.id);
                const data =
                  analyticsInput.type === "mentor"
                    ? await handleFetchMentorPerformance(id)
                    : await handleFetchMenteeProgress(id);
                setAnalyticsData(data);
              }}
            >
              Fetch Analytics
            </button>
          </div>
          {analyticsData && (
            <pre
              style={{
                backgroundColor: "#f8f9fa",
                padding: "16px",
                borderRadius: "8px",
                overflow: "auto",
                fontSize: "13px",
              }}
            >
              {JSON.stringify(analyticsData, null, 2)}
            </pre>
          )}
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
