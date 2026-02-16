import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  userApi,
  roleApi,
  userRoleApi,
  batchApi,
  mentorProfileApi,
  menteeProfileApi,
} from "../services/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "mentee", // default role
    // Mentor-specific fields
    headline: "",
    experienceYears: 0,
    expertiseArea: "",
    linkedinUrl: "",
    availability: "",
    // Mentee-specific fields
    currentRole: "",
    education: "",
    goals: "",
    interests: "",
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
        passwordHash: formData.password,
        profileInfo: formData.phone,
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

      // Create role-specific profile using mentorProfileApi / menteeProfileApi
      if (formData.role === "mentor") {
        try {
          await mentorProfileApi.createMentorProfile({
            userId: newUser.userId,
            headline: formData.headline || "New Mentor",
            experienceYears: formData.experienceYears || 0,
            expertiseArea: formData.expertiseArea || "General",
            linkedinUrl: formData.linkedinUrl || undefined,
            availability: formData.availability || undefined,
          });
        } catch (profileErr) {
          console.error("Error creating mentor profile:", profileErr);
        }
      } else if (formData.role === "mentee") {
        try {
          await menteeProfileApi.createMenteeProfile({
            userId: newUser.userId,
            currentRole: formData.currentRole || "New Mentee",
            education: formData.education || "",
            goals: formData.goals || "",
            interests: formData.interests || "",
          });
        } catch (profileErr) {
          console.error("Error creating mentee profile:", profileErr);
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

        {/* Mentor-specific fields — used by mentorProfileApi.createMentorProfile */}
        {formData.role === "mentor" && (
          <>
            <div className="form-group">
              <label htmlFor="headline" className="form-label">
                Headline
              </label>
              <input
                type="text"
                id="headline"
                name="headline"
                className="form-input"
                value={formData.headline}
                onChange={handleChange}
                placeholder="e.g. Senior Software Engineer"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="experienceYears" className="form-label">
                Years of Experience
              </label>
              <input
                type="number"
                id="experienceYears"
                name="experienceYears"
                className="form-input"
                value={formData.experienceYears}
                onChange={handleChange}
                placeholder="0"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="expertiseArea" className="form-label">
                Expertise Area
              </label>
              <input
                type="text"
                id="expertiseArea"
                name="expertiseArea"
                className="form-input"
                value={formData.expertiseArea}
                onChange={handleChange}
                placeholder="e.g. Full Stack Development"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="linkedinUrl" className="form-label">
                LinkedIn URL (optional)
              </label>
              <input
                type="url"
                id="linkedinUrl"
                name="linkedinUrl"
                className="form-input"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="availability" className="form-label">
                Availability (optional)
              </label>
              <input
                type="text"
                id="availability"
                name="availability"
                className="form-input"
                value={formData.availability}
                onChange={handleChange}
                placeholder="e.g. Weekdays 5-7 PM"
                disabled={loading}
              />
            </div>
          </>
        )}

        {/* Mentee-specific fields — used by menteeProfileApi.createMenteeProfile */}
        {formData.role === "mentee" && (
          <>
            <div className="form-group">
              <label htmlFor="currentRole" className="form-label">
                Current Role
              </label>
              <input
                type="text"
                id="currentRole"
                name="currentRole"
                className="form-input"
                value={formData.currentRole}
                onChange={handleChange}
                placeholder="e.g. Junior Developer"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="education" className="form-label">
                Education
              </label>
              <input
                type="text"
                id="education"
                name="education"
                className="form-input"
                value={formData.education}
                onChange={handleChange}
                placeholder="e.g. B.Tech Computer Science"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="goals" className="form-label">
                Goals
              </label>
              <input
                type="text"
                id="goals"
                name="goals"
                className="form-input"
                value={formData.goals}
                onChange={handleChange}
                placeholder="e.g. Become a full-stack developer"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="interests" className="form-label">
                Interests
              </label>
              <input
                type="text"
                id="interests"
                name="interests"
                className="form-input"
                value={formData.interests}
                onChange={handleChange}
                placeholder="e.g. Web Development, AI"
                disabled={loading}
              />
            </div>
          </>
        )}
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
