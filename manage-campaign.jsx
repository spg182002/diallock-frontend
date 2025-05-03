"use client"

import { useState, useEffect, useRef } from "react"
import "../styles/manage-campaign.css"

const ManageCampaign = () => {
  // Sample campaign data
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Summer Sale 2023",
      status: "Active",
      startDate: "Jun 1, 2023",
      emailsSent: 1245,
      buttonState: "running", // running, paused, stopped
    },
    {
      id: 2,
      name: "Product Launch",
      status: "Paused",
      startDate: "May 15, 2023",
      emailsSent: 875,    
      buttonState: "paused",
    },
    {
      id: 3,
      name: "Follow-up Campaign",
      status: "Active",
      startDate: "Jun 10, 2023",
      emailsSent: 532,     
      buttonState: "running",
    },
    {
      id: 4,
      name: "Re-engagement Campaign",
      status: "Active",
      startDate: "Apr 1, 2023",
      emailsSent: 1500,
      buttonState: "running",
    },
  ])

  // State to track which dropdown is open
  const [openDropdownId, setOpenDropdownId] = useState(null)
  
  // Reference to detect clicks outside dropdown
  const dropdownRef = useRef(null)

  // Toggle dropdown menu
  const toggleDropdown = (e, id) => {
    e.stopPropagation()
    if (openDropdownId === id) {
      setOpenDropdownId(null)
    } else {
      setOpenDropdownId(id)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle campaign actions
  const handleCampaignAction = (e, id, action) => {
    e.stopPropagation()
    setCampaigns(
      campaigns.map((campaign) => {
        if (campaign.id === id) {
          let newButtonState = campaign.buttonState
          let newStatus = campaign.status

          switch (action) {
            case "start":
              newButtonState = "running"
              newStatus = "Active"
              break
            case "pause":
              newButtonState = "paused"
              newStatus = "Paused"
              break
            case "resume":
              newButtonState = "running"
              newStatus = "Active"
              break
            case "stop":
              newButtonState = "stopped"
              newStatus = "Stopped"
              break
            default:
              break
          }

          return { ...campaign, buttonState: newButtonState, status: newStatus }
        }
        return campaign
      }),
    )
  }

  // Handle menu actions
  const handleMenuAction = (e, id, action) => {
    e.stopPropagation()
    console.log(`${action} campaign with id ${id}`)
    // Implement view, edit, delete functionality here

    // Close dropdown after action
    setOpenDropdownId(null)
  }

  return (
    <div className="manage-container">
        <h2 className="manage-title">Campaign Statistics</h2>

      <div className="campaign-panel">
        <div className="campaign-header">
          <h1>Active Campaign Management</h1>
          <p>Monitor and control your active email campaigns</p>
        </div>

        <div className="campaign-table">
          <div className="table-header">
            <div className="column campaign-name">Campaign Name</div>
            <div className="column status">Status</div>
            <div className="column start-date">Start Date</div>
            <div className="column emails-sent">Emails Sent</div>
            <div className="column actions">Actions</div>
          </div>

          {campaigns.map((campaign) => (
            <div className="table-row" key={campaign.id}>
              <div className="column campaign-name">{campaign.name}</div>
              <div className="column status">
                <span className={`status-badge ${campaign.status.toLowerCase()}`}>{campaign.status}</span>
              </div>
              <div className="column start-date">{campaign.startDate}</div>
              <div className="column emails-sent">{campaign.emailsSent}</div>
              <div className="column actions">
                {campaign.buttonState === "stopped" || campaign.buttonState === "initial" ? (
                  <button
                    className="action-button start"
                    onClick={(e) => handleCampaignAction(e, campaign.id, "start")}
                  >
                    <i className="icon-play"></i> Start
                  </button>
                ) : (
                  <>
                    {campaign.buttonState === "running" ? (
                      <button
                        className="action-button pause"
                        onClick={(e) => handleCampaignAction(e, campaign.id, "pause")}
                      >
                        <i className="icon-pause"></i> Pause
                      </button>
                    ) : (
                      <button
                        className="action-button resume"
                        onClick={(e) => handleCampaignAction(e, campaign.id, "resume")}
                      >
                        <i className="icon-play"></i> Resume
                      </button>
                    )}
                    <button
                      className="action-button stop"
                      onClick={(e) => handleCampaignAction(e, campaign.id, "stop")}
                    >
                      <i className="icon-stop"></i> Stop
                    </button>
                  </>
                )}
                {/* <div className="dropdown-container" ref={dropdownRef}>
                  <button
                    className="action-button more"
                    onClick={(e) => toggleDropdown(e, campaign.id)}
                  >
                    <i className="icon-more"></i>
                  </button>
                  {openDropdownId === campaign.id && (
                    <div className="dropdown-menu">
                      <div
                        className="dropdown-item"
                        onClick={(e) => handleMenuAction(e, campaign.id, "view")}
                      >
                        View Details
                      </div>
                      <div
                        className="dropdown-item"
                        onClick={(e) => handleMenuAction(e, campaign.id, "edit")}
                      >
                        Edit Campaign
                      </div>
                      <div
                        className="dropdown-item"
                        onClick={(e) => handleMenuAction(e, campaign.id, "duplicate")}
                      >
                        Duplicate
                      </div>
                      <div
                        className="dropdown-item delete"
                        onClick={(e) => handleMenuAction(e, campaign.id, "delete")}
                      >
                        Delete Campaign
                      </div>
                    </div>
                  )}
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ManageCampaign
