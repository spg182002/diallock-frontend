import React, { useState, useEffect } from "react";
import "../styles/savegroup.css"; // Import the CSS file

const API_URL = "http://localhost:8080/api/groups"; // Adjust as per backend

const Savegroup = () => {
  const [groupType, setGroupType] = useState("existing");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [groups, setGroups] = useState([]);

  // Fetch existing groups from backend
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleGroupTypeChange = (type) => {
    setGroupType(type);
    setSelectedGroup("");
    setNewGroupName("");
  };

  const handleSaveGroup = async () => {
    if (groupType === "existing" && !selectedGroup) {
      alert("Please select a group");
      return;
    }
    if (groupType === "new" && !newGroupName) {
      alert("Please enter a group name");
      return;
    }

    const groupData = {
      type: groupType,
      value: groupType === "existing" ? selectedGroup : newGroupName,
    };

    try {
      const response = await fetch(`${API_URL}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(groupData),
      });

      if (response.ok) {
        console.log("Group saved:", groupData);
        alert("Group saved successfully!");

        // Refresh group list if a new group was added
        if (groupType === "new") {
          fetchGroups();
          setNewGroupName("");
          setGroupType("existing"); // Switch to existing after adding
        }
      } else {
        alert("Failed to save group");
      }
    } catch (error) {
      console.error("Error saving group:", error);
      alert("An error occurred while saving the group.");
    }
  };

  return (
    <div className="save-group-container">
      <h3>Save Selected to Group</h3>
      <div className="radio-group">
        <label className="radio-label">
          <input
            type="radio"
            name="groupType"
            checked={groupType === "existing"}
            onChange={() => handleGroupTypeChange("existing")}
          />
          Existing Group
        </label>

        <label className="radio-label">
          <input
            type="radio"
            name="groupType"
            checked={groupType === "new"}
            onChange={() => handleGroupTypeChange("new")}
          />
          New Group
        </label>
      </div>

      {groupType === "existing" ? (
        <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} className="group-select">
          <option value="" disabled>
            Select existing group
          </option>
          <option value="" >
            Group 1
          </option>
          <option value="" >
            Group 2
          </option>
          <option value="" >
            Group 3
          </option>

          {groups.map((group) => (
            <option key={group.id} value={group.name}>
              {group.name}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="Enter new group name"
          className="group-input"
        />
      )}

      <button onClick={handleSaveGroup} className="save-button">
        Save to Group
      </button>
    </div>
  );
};

export default Savegroup;
