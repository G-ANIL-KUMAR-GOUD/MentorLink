import React from "react";
import ProfileWidget from "../components/ProfileWidget";
import AssignedUsersWidget from "../components/AssignedUsersWidget";
import MyGroupWidget from "../components/MyGroupWidget";
import "../styles/Dashboard.css";

const Mentee = () => {
  // TODO: Get the actual logged-in user ID from auth context/state
  const currentUserId = parseInt(localStorage.getItem("userId") || "1");

  return (
    <div className="dashboard-layout">
      <div className="dashboard-left">
        <AssignedUsersWidget variant="mentee" userId={currentUserId} />
        <MyGroupWidget />
      </div>

      <div className="dashboard-right">
        <ProfileWidget variant="mentee" userId={currentUserId} />
      </div>
    </div>
  );
};

export default Mentee;
