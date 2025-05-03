"use client"

import React, { useState, useEffect, useRef } from "react"
import "../styles/app.css"
import { IoMdClose } from "react-icons/io"
import { IoMdAddCircleOutline } from "react-icons/io"
import { FaSearch } from "react-icons/fa"
import { BsThreeDotsVertical } from "react-icons/bs"
import Savegroup from "../pages/savegroup"

const Leadslist = () => {
  const [leads, setLeads] = useState([])
  const [search, setSearch] = useState("")
  const [selectAll, setSelectAll] = useState(false)
  const [selectedRows, setSelectedRows] = useState({})
  const [showOverlay, setShowOverlay] = useState(false)
  const [importedData, setImportedData] = useState([])
  const [manualEntries, setManualEntries] = useState([
    { name: "", email: "", phoneno: "", company: "", companysize: "", status: "", country: "",url: "" },
  ])
  const fileInputRef = useRef(null)
  const [activeTab, setActiveTab] = useState("import")
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [editingLead, setEditingLead] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState("Select Group")
  const [selectedStatus, setSelectedStatus] = useState("Select Status")

  const fetchLeads = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/User")
      const data = await response.json()
      setLeads(data)
    } catch (error) {
      console.error("Error fetching leads:", error)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const handleSearch = async () => {
    const response = await fetch(`http://localhost:8080/api/User/search?keyword=${search}`)
    const data = await response.json()
    setLeads(data)
  }

  useEffect(() => {
    if (!search.trim()) {
      fetchLeads()
    }
  }, [search])

  // Dropdown handlers
  const toggleDropdown = (index, e) => {
    e.stopPropagation()
    setActiveDropdown(activeDropdown === index ? null : index)
  }

  const handleCopyEmail = (email, e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(email)
    // alert("Email copied to clipboard!");
    setActiveDropdown(null)
  }

  const handleEditLead = (lead, index, e) => {
    e.stopPropagation()
    setEditingLead({ ...lead, index })
    setShowEditForm(true)
    setActiveDropdown(null)
  }

  const handleDeleteLead = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      await fetch(`http://localhost:8080/api/User/${id}`, { method: "DELETE" })

      fetchLeads()
    }
  }
  const handleUpdateLead = async () => {
    if (!editingLead) return // Prevents running if nothing is being edited

    const { id, ...updatedLead } = editingLead // Extract id from the object

    try {
      const response = await fetch(`http://localhost:8080/api/User/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedLead),
      })

      if (response.ok) {
        fetchLeads() // Refresh the leads from backend
        setShowEditForm(false)
        setEditingLead(null)
      } else {
        console.error("Failed to update lead")
      }
    } catch (error) {
      console.error("Error updating lead:", error)
    }
  }

  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    const newSelectedRows = {}
    if (newSelectAll) {
      leads.forEach((lead, index) => {
        newSelectedRows[index] = true
      })
    }
    setSelectedRows(newSelectedRows)
  }

  const handleRowSelect = (index) => {
    const newSelectedRows = { ...selectedRows, [index]: !selectedRows[index] }
    setSelectedRows(newSelectedRows)
    setSelectAll(Object.keys(newSelectedRows).length === leads.length)
  }

  const handleAddNewLead = () => {
    setShowOverlay(true)
  }

  const handleCloseOverlay = () => {
    setShowOverlay(false)
    setImportedData([])
    setManualEntries([{ name: "", email: "", phoneno: "", company: "", companysize: "", status: "", country: "",url: "" }])
    setActiveTab("import")
  }
  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      // Send file to API
      const formData = new FormData()
      formData.append("file", file)
      try {
        const response = await fetch("http://localhost:8080/api/upload", {
          method: "POST",
          body: formData,
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        console.log("File uploaded successfully")
        fetchLeads()
      } catch (error) {
        console.error("Error uploading file:", error)
      }

      // Process file locally
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        const rows = content.split("\n")
        const headers = rows[0].split(",")
        const data = rows.slice(1).map((row) => {
          const values = row.split(",")
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]
            return obj
          }, {})
        })
        setImportedData(data)
      }
      reader.readAsText(file)
    }
  }

  const handleManualEntryChange = (index, field, value) => {
    const updatedEntries = [...manualEntries]
    updatedEntries[index][field] = value
    setManualEntries(updatedEntries)
  }
  const handleSaveLeads = async () => {
    if (manualEntries.length === 0) {
      alert("No lead data to save!")
      return
    }

    const newLead = manualEntries[0] // Extract a single entry

    try {
      const response = await fetch("http://localhost:8080/api/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead), // Send a single object, not an array
      })

      if (!response.ok) {
        console.log("error")
      }

      await fetchLeads() // Refresh leads after successful save
      handleCloseOverlay()
    } catch (error) {
      console.error("Error saving lead:", error)
      alert("Failed to save lead. Please try again.")
    }
  }

  const handleAddManualEntry = () => {
    setManualEntries([
      ...manualEntries,
      { name: "", email: "", phoneno: "", company: "", companysize: "", status: "", country: "",url: "" },
    ])
  }

  const handleRemoveManualEntry = (index) => {
    const updatedEntries = manualEntries.filter((_, i) => i !== index)
    setManualEntries(updatedEntries)
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null)
    }
    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  return (
    <div className="main-content-wrapper">
      <div className="leads-header">
        <h2>Leads List</h2>
        <button className="add-lead-btn" onClick={handleAddNewLead}>
          <IoMdAddCircleOutline className="add-lead-btn-icon" />
          <span className="add-lead-btn-text">Add New Lead</span>
        </button>
      </div>

      <div className="filter-container">
        <select
          name="group"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="filter-dropdown"
        >
          <option value="Select Group" disabled>
            Select Group
          </option>
          <option value="Group 1">Group 1</option>
          <option value="Group 2">Group 2</option>
          <option value="Group 3">Group 3</option>
        </select>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              handleSearch(e.target.value) // Call search function on input change
            }}
            placeholder="Search all columns..."
            className="search-input"
          />
        </div>

        <select
          name="status"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="filter-dropdown"
        >
          <option value="Select Status" disabled>
            Select Status
          </option>
          <option value="All status">All Status</option>
          <option value="Qualified">Qualified</option>
          <option value="Contacted">Contacted</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>
              <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Company Name</th>
            <th>Company Size</th>
            <th>Status</th>
            <th>Country</th>
            <th>Url</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <tr key={index}>
              <td>
                <input type="checkbox" checked={selectedRows[index] || false} onChange={() => handleRowSelect(index)} />
              </td>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.phoneno}</td>
              <td>{lead.company}</td>
              <td>{lead.companysize}</td>
              <td>{lead.status}</td>
              <td>{lead.country}</td>
              <td>{lead.url}</td>
              <td className="actions-cell">
                <div className="actions-wrapper">
                  <button className="action-button" onClick={(e) => toggleDropdown(index, e)}>
                    <BsThreeDotsVertical />
                  </button>
                  {activeDropdown === index && (
                    <div className="dropdown-menu">
                      <button onClick={(e) => handleCopyEmail(lead.email, e)}>Copy email</button>
                      <button onClick={(e) => handleEditLead(lead, index, e)}>Edit lead</button>
                      <button onClick={() => handleDeleteLead(lead.id)}>Delete Lead</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <Savegroup />
      </div>

      {showEditForm && editingLead && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="close-btn" onClick={() => setShowEditForm(false)}>
              <IoMdClose />
            </button>
            <h3>Edit Lead</h3>
            <div className="edit-form">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={editingLead.name}
                  onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={editingLead.email}
                  onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  value={editingLead.phoneno}
                  onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Company:</label>
                <input
                  type="text"
                  value={editingLead.company}
                  onChange={(e) => setEditingLead({ ...editingLead, company: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Company Size:</label>
                <input
                  type="text"
                  value={editingLead.companysize}
                  onChange={(e) => setEditingLead({ ...editingLead, companysize: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select
                  value={editingLead.status}
                  onChange={(e) => setEditingLead({ ...editingLead, status: e.target.value })}
                >
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Qualified">Qualified</option>
                </select>
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  value={editingLead.country}
                  onChange={(e) => setEditingLead({ ...editingLead, country: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button className="form-actions-update" onClick={handleUpdateLead}>
                  Update
                </button>
                <button onClick={() => setShowEditForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
       
      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="close-btn" onClick={handleCloseOverlay}>
              <IoMdClose />
            </button>
            <h3>Add New Lead</h3>
            <div className="tabs">
              <button
                className={`tab ${activeTab === "import" ? "active" : ""}`}
                onClick={() => setActiveTab("import")}
              >
                Import
              </button>
              <button
                className={`tab ${activeTab === "manual" ? "active" : ""}`}
                onClick={() => setActiveTab("manual")}
              >
                Manual Entry
              </button>
            </div>
            {activeTab === "import" && (
              <div className="import-section">
                <h4>Import CSV</h4>
                <input type="file" accept=".csv" onChange={handleFileUpload} ref={fileInputRef} />
                {importedData.length > 0 && (
                  <div className="preview-table">
                    <h5>Preview</h5>
                    <table>
                      <thead>
                        <tr>
                          {Object.keys(importedData[0]).map((header, index) => (
                            <th key={index}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {importedData.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {Object.values(row).map((value, valueIndex) => (
                              <td key={valueIndex}>{value}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            {activeTab === "manual" && (
              <div className="manual-entry-section">
                <h4>Manual Entry</h4>
                {manualEntries.map((entry, index) => (
                  <div key={index} className="manual-entry-row">
                    <input
                      type="text"
                      placeholder="Name"
                      value={entry.name}
                      onChange={(e) => handleManualEntryChange(index, "name", e.target.value)}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={entry.email}
                      onChange={(e) => handleManualEntryChange(index, "email", e.target.value)}
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={entry.phoneno}
                      onChange={(e) => handleManualEntryChange(index, "phoneno", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={entry.company}
                      onChange={(e) => handleManualEntryChange(index, "company", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Company Size"
                      value={entry.companysize}
                      onChange={(e) => handleManualEntryChange(index, "companysize", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={entry.country}
                      onChange={(e) => handleManualEntryChange(index, "country", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Url"
                      value={entry.url}
                      onChange={(e) => handleManualEntryChange(index, "url", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="New"
                      value="New"
                      onChange={(e) => handleManualEntryChange(index, "status", "New")}
                    />
                    <button onClick={() => handleRemoveManualEntry(index)}>Remove</button>
                  </div>
                ))}
                <button onClick={handleAddManualEntry}>Add Row</button>
              </div>
            )}
            <div className="overlay-actions">
              <button onClick={handleSaveLeads}>Save</button>
              <button onClick={handleCloseOverlay}>Cancel</button>
            </div>
          </div>
        </div>
      )}
     
     
               
    </div>
  )
}

export default Leadslist;

