import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userApi, roleApi, userRoleApi, batchApi } from "../services/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "mentee", // default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create new user
      const newUser = await userApi.createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      // Get all roles to find the selected role
      const roles = await roleApi.getAllRoles();
      const selectedRole = roles.find(
        (r: any) => r.roleName.toLowerCase() === formData.role.toLowerCase(),
      );

      if (selectedRole) {
        // Get a default batch (you might want to let user select this)
        const batches = await batchApi.getAllBatches();
        const defaultBatch = batches[0]; // Use first batch as default

        if (defaultBatch) {
          // Assign role to user
          await userRoleApi.assignRole(
            newUser.userId,
            selectedRole.roleId,
            defaultBatch.batchId,
          );
        }
      }

      // Store user info
      localStorage.setItem("userId", newUser.userId.toString());
      localStorage.setItem("userName", newUser.name);
      localStorage.setItem("userEmail", newUser.email);

      // Navigate to appropriate dashboard
      navigate(`/${formData.role}`);
    } catch (err) {
      console.error("Signup error:", err);
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <h1 className="auth-heading">Sign Up</h1>
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
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="form-input"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter your phone number"
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
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Create a password"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="role" className="form-label">
            I am a
          </label>
          <select
            id="role"
            name="role"
            className="form-input"
            value={formData.role}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="mentee">Mentee</option>
            <option value="mentor">Mentor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
      <div className="auth-link">
        Already have an account? <Link to="/login">Sign In</Link>
      </div>
    </>
  );
};

export default Signup;
