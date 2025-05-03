"use client";
import { useState, useEffect } from "react";
import "../styles/settings.css";

const Settings = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    jobTitle: "",
    companyWebsite: "",
    companyDescription: "",
    usp: "",
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(true);
  const [savedData, setSavedData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = "This field is required(*)";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:8080/api/addsetting", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          console.error("Error saving data to backend");
          return;
        }
        setSavedData({ ...formData });
        setIsEditing(false);
      } catch (error) {
        console.error("Error saving lead:", error);
        alert("Failed to save. Please try again.");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/getsetting");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            fullName: data.fullName || "",
            companyName: data.companyName || "",
            jobTitle: data.jobTitle || "",
            companyWebsite: data.companyWebsite || "",
            companyDescription: data.companyDescription || "",
            usp: data.usp || "",
          });
          setSavedData(data);
          setIsEditing(false);
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    };
    fetchData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (savedData) {
      setFormData(savedData);
    }
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">Company Settings</h2>
      <p className="settings-subtitle">Manage your company information and settings</p>

      <div className="company-profile">
        <h3>Company Profile</h3>
        <p>
          Update your company information. This information will be used across the platform and in communications
          with your leads.
        </p>

        {!isEditing && savedData ? (
          <div className="profile-data">
            <div className="edit-container">
              <button className="edit-btn" onClick={handleEdit}>
                <i className="edit-icon">✎</i> Edit
              </button>
            </div>
            <table className="data-table">
              <tbody>
                <tr>
                  <th>Full Name</th>
                  <td>{savedData.fullName}</td>
                </tr>
                <tr>
                  <th>Company Name</th>
                  <td>{savedData.companyName}</td>
                </tr>
                <tr>
                  <th>Job Title</th>
                  <td>{savedData.jobTitle}</td>
                </tr>
                <tr>
                  <th>Company Website</th>
                  <td>{savedData.companyWebsite}</td>
                </tr>
                <tr>
                  <th>Company Description</th>
                  <td>{savedData.companyDescription}</td>
                </tr>
                <tr>
                  <th>Unique Selling Proposition</th>
                  <td>{savedData.usp}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your Full name.."
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? "error-input" : ""}
              />
              {errors.fullName && <p className="error">{errors.fullName}</p>}
            </div>

            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                placeholder="Your registered company name"
                value={formData.companyName}
                onChange={handleChange}
                className={errors.companyName ? "error-input" : ""}
              />
              {errors.companyName && <p className="error">{errors.companyName}</p>}
            </div>

            <div className="form-group">
              <label>Your Job Title</label>
              <input
                type="text"
                name="jobTitle"
                placeholder="Your position within the company"
                value={formData.jobTitle}
                onChange={handleChange}
                className={errors.jobTitle ? "error-input" : ""}
              />
              {errors.jobTitle && <p className="error">{errors.jobTitle}</p>}
            </div>

            <div className="form-group">
              <label>Company Website</label>
              <input
                type="text"
                name="companyWebsite"
                placeholder="Your company's website URL"
                value={formData.companyWebsite}
                onChange={handleChange}
                className={errors.companyWebsite ? "error-input" : ""}
              />
              {errors.companyWebsite && <p className="error">{errors.companyWebsite}</p>}
            </div>

            <div className="form-group">
              <label>Company Description</label>
              <textarea
                name="companyDescription"
                placeholder="Describe your company..."
                value={formData.companyDescription}
                onChange={handleChange}
                className={errors.companyDescription ? "error-input" : ""}
              />
              {errors.companyDescription && <p className="error">{errors.companyDescription}</p>}
            </div>

            <div className="form-group">
              <label>Unique Selling Proposition (USP)</label>
              <textarea
                name="usp"
                placeholder="What makes your company unique? What value do you provide others don't?"
                value={formData.usp}
                onChange={handleChange}
                className={errors.usp ? "error-input" : ""}
              />
              {errors.usp && <p className="error">{errors.usp}</p>}
            </div>

            <div className="button-group">
              <button className="save-btn" onClick={handleSave}>
                Save Changes
              </button>
              {savedData && isEditing && (
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
