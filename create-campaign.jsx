"use client"

import { useState, useRef } from "react"
import "../styles/create-campaign.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Createcampaign = () => {
  const [campaignName, setCampaignName] = useState("")
  const [description, setDescription] = useState("")
  const [savedGroup, setSavedGroup] = useState("")
  const [existingCampaign, setExistingCampaign] = useState("")
  const [prompt, setPrompt] = useState("")
  const [productUrl, setProductUrl] = useState("")
  const [knowledgeBase, setKnowledgeBase] = useState("")
  const [importedData, setImportedData] = useState([])
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        console.log("File content:\n", e.target.result)
        const parsedData = parseCSV(e.target.result)
        console.log("Parsed Data:", parsedData)
        setImportedData(parsedData)
      }
      reader.readAsText(file)
    }
  }

  const parseCSV = (csvText) => {
    const lines = csvText.split(/\r?\n/).map((line) => line.trim()) // Handle different line endings
    if (lines.length < 2) return [] // Ensure there's data

    const headers = lines[0].split(/[;,]/).map((header) => header.trim())
    console.log("Headers Detected:", headers)
    const data = []

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i]) continue
      const values = lines[i].split(/[;,]/).map((value) => value.trim())

      const entry = {}
      headers.forEach((header, index) => {
        entry[header] = values[index] || ""
      })

      data.push(entry)
    }
    return data
  }

  const handleFileDeselect = () => {
    setSelectedFile(null)
    setImportedData([])

    if (fileInputRef.current) {
      fileInputRef.current.value = "" // Reset input field
    }
  }

  const handleSubmit = async () => {
    if (!campaignName || !prompt || !selectedFile) {
      toast.error("Please provide campaign name, prompt, and upload a CSV file.")
      return
    }
  
    try {
      setLoading(true) // Start loading
  
      const formData = new FormData()
      formData.append("campaignName", campaignName)
      formData.append("prompt", prompt)
      formData.append("file", selectedFile)
  
      const response = await fetch("http://localhost:8080/api/campaign/start", {
        method: "POST",
        body: formData,
      })
  
      if (response.ok) {
        const result = await response.text()
        toast.success(result || "Campaign created successfully!")
      } else {
        const errorText = await response.text()
        toast.error(`Error: ${errorText}`)
      }
    } catch (error) {
      console.error("Error submitting campaign:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false) // End loading regardless of success or failure
    }
  }
  
  return (
    <div className="campaign-container">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Creating your campaign...</p>
          </div>
        </div>
      )}

      <h1 className="campaign-title">Campaign & Sequence Management</h1>

      <div className="campaign-form-container">
        <h3 className="form-section-title">Import Leads</h3>
        <p className="import-description">Import leads from various sources to use in your campaigns</p>

        <div className="import-options">
          <div className="import-option">
            <div className="import-content">
              <div className="import-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <div className="import-text">
                <h4>Upload CSV</h4>
                <p>Import leads from a CSV or Excel file</p>
              </div>
            </div>

            <div className="file-input-container">
              <input type="file" accept=".csv" onChange={handleFileUpload} ref={fileInputRef} className="file-input" />
              <button className="upload-button" onClick={() => fileInputRef.current.click()}>
                Choose File
              </button>
              <span className="file-name">{selectedFile ? selectedFile.name : "No file chosen"}</span>

              {selectedFile && (
                <button className="deselect-button" onClick={handleFileDeselect}>
                  Deselect File
                </button>
              )}
            </div>
            {importedData.length > 0 && (
              <div className="preview-table">
                <h5>Preview</h5>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Company Name</th>
                        <th>Company Size</th>
                        <th>Status</th>
                        <th>Country</th>
                        <th>url</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importedData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <td>{row["name"] || "-"}</td>
                          <td>{row["email"] || "-"}</td>
                          <td>{row["phoneno"] || "-"}</td>
                          <td>{row["company"] || "-"}</td>
                          <td>{row["companysize"] || "-"}</td>
                          <td>{row["status"] || "-"}</td>
                          <td>{row["country"] || "-"}</td>
                          <td>{row["url"] || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="campaign-form-container">
        <h3 className="form-section-title">Create New Campaign</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="campaignName">Campaign Name</label>
            <input
              type="text"
              id="campaignName"
              placeholder="Enter campaign name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="prompt">Enter prompt</label>
            <textarea
              id="prompt"
              placeholder="Describe your product or service"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
        </form>
      </div>

      <div className="email-sender"></div>
      <button type="submit" className="save-button1" onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating..." : "Create Campaign"}
      </button>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}

export default Createcampaign

