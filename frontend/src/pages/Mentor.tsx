import React from "react";
import ProfileWidget from "../components/ProfileWidget";
import AssignedUsersWidget from "../components/AssignedUsersWidget";
import "../styles/Dashboard.css";

const Mentor = () => {
  // TODO: Get the actual logged-in user ID from auth context/state
  const currentUserId = parseInt(localStorage.getItem("userId") || "1");

  return (
    <div className="dashboard-layout">
      <div className="dashboard-left">
        <AssignedUsersWidget variant="mentor" userId={currentUserId} />
      </div>

      <div className="dashboard-right">
        <ProfileWidget variant="mentor" userId={currentUserId} />
      </div>
    </div>
  );
};

export default Mentor;
