import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userApi, userRoleApi } from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get all users and find matching email
      const users = await userApi.getAllUsers();
      const user = users.find((u: any) => u.email === email);

      if (!user) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      // Get user roles to determine dashboard
      const userRoles = await userRoleApi.getRolesForUser(user.userId);

      // Store user info in localStorage
      localStorage.setItem("userId", user.userId.toString());
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userEmail", user.email);

      // Navigate based on role
      if (userRoles.length > 0) {
        const primaryRole = userRoles[0].role.roleName.toLowerCase();
        navigate(`/${primaryRole}`);
      } else {
        navigate("/mentee"); // Default to mentee
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = (role: "admin" | "mentor" | "mentee") => {
    navigate(`/${role}`);
  };

  return (
    <>
      <h1 className="auth-heading">Sign In</h1>
      {error && (
        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            backgroundColor: "#fee",
            color: "#c33",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            disabled={loading}
          />
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <h3 style={{ fontSize: "14px", color: "#666" }}>Test Sign In:</h3>
        <button
          onClick={() => handleTestLogin("admin")}
          className="auth-button"
          style={{ backgroundColor: "#dc3545" }}
        >
          Sign In as Admin
        </button>
        <button
          onClick={() => handleTestLogin("mentor")}
          className="auth-button"
          style={{ backgroundColor: "#28a745" }}
        >
          Sign In as Mentor
        </button>
        <button
          onClick={() => handleTestLogin("mentee")}
          className="auth-button"
          style={{ backgroundColor: "#007bff" }}
        >
          Sign In as Mentee
        </button>
      </div>

      <div className="auth-link">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </div>
    </>
  );
};

export default Login;
