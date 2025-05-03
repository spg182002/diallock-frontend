"use client"

import React, { useState, useEffect, useRef } from "react"
import "./styles/app.css"
import Navbar from "./pages/navbar"
import Sidebar from "./pages/sidebar"
import Leadslist from "./pages/leadslist";
import Createcampaign from "./pages/create-campaign";
import Settings from "./pages/settings";
import ManageCampaign from "./pages/manage-campaign";
import Communication from "./pages/communication"
import { Routes, Route } from "react-router-dom"; 


const App = () => {
  const [leads, setLeads] = useState([])
  const [search, setSearch] = useState("")
  const [selectAll, setSelectAll] = useState(false)
  const [selectedRows, setSelectedRows] = useState({})
  const [showOverlay, setShowOverlay] = useState(false)
  const [importedData, setImportedData] = useState([])
  const [manualEntries, setManualEntries] = useState([
    { name: "", email: "", phoneno: "", company: "", companysize: "", status: "", country: "" },
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
    setManualEntries([{ name: "", email: "", phoneno: "", company: "", companysize: "", status: "", country: "" }])
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
        body: JSON.stringify(newLead), 
      })

      if (!response.ok) {
        console.log("error")
      }

      await fetchLeads() 
      handleCloseOverlay()
    } catch (error) {
      console.error("Error saving lead:", error)
      alert("Failed to save lead. Please try again.")
    }
  }

  const handleAddManualEntry = () => {
    setManualEntries([
      ...manualEntries,
      { name: "", email: "", phoneno: "", company: "", companysize: "", status: "", country: "" },
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
    <div className="app">
      <Navbar />
      <div className="container">
        <Sidebar />
       
        <main className="main-content">
        <Routes>
            <Route path="/" element={<Leadslist />} />
            <Route path="/create-campaign" element={<Createcampaign/>}/>
            <Route path="/manage-campaign" element={<ManageCampaign/>}/>
            <Route path="/communications" element={<Communication/>}/>
            <Route path="/settings" element={<Settings/>} />
          </Routes>
          {/* <Leadslist /> */}
        </main>
      </div>

      
    </div>
  )
}

export default App

