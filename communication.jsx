// "use client"

// import { useState, useEffect } from "react"
// import ReactMarkdown from "react-markdown"
// import "../styles/communication.css"
// import { IoIosSearch } from "react-icons/io"
// import { FiMaximize2, FiMinimize2 } from "react-icons/fi"

// const Communication = () => {
//   // State declarations
//   const [leads, setLeads] = useState([])
//   const [selectedStatus, setSelectedStatus] = useState("Select Campaign")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [activeFilter, setActiveFilter] = useState("All")
//   const [filteredLeads, setFilteredLeads] = useState([])
//   const [selectedLead, setSelectedLead] = useState(null)
//   const [activeTab, setActiveTab] = useState("Conversation")
//   const [isExpanded, setIsExpanded] = useState(false)
//   const [researchData, setResearchData] = useState(null)
//   const [emailContent, setEmailContent] = useState([])
//   const [newMessage, setNewMessage] = useState({
//     subject: "",
//     content: "",
//   })
//   const [loadingResearch, setLoadingResearch] = useState(false)
//   const [loadingEmail, setLoadingEmail] = useState(false)
//   const [researchError, setResearchError] = useState(null)
//   const [emailError, setEmailError] = useState(null)
//   const [campaigns, setCampaigns] = useState([])
//   const [selectedCampaignId, setSelectedCampaignId] = useState("")
//   const [sendingMessage, setSendingMessage] = useState(false)

//   useEffect(() => {
//     fetchcampaign()
//   }, [])

//   const fetchcampaign = async () => {
//     try {
//       const response = await fetch("http://localhost:8080/api/campaigns")
//       const data = await response.json()
//       setCampaigns(data)
//     } catch (error) {
//       console.error("Error fetching campaigns:", error)
//     }
//   }

//   const handleChange = (e) => {
//     const selectedId = e.target.value
//     setSelectedCampaignId(selectedId)
//   }

//   const fetchLeads = async (selectedCampaignId) => {
//     try {
//       const response = await fetch(`http://localhost:8080/api/${selectedCampaignId}/leads`)
//       const data = await response.json()
//       setLeads(data)
//     } catch (error) {
//       console.error("Error fetching leads:", error)
//     }
//   }

//   const fetchEmail = async (selectedCampaignId, leadid) => {
//     setLoadingEmail(true)
//     setEmailError(null)

//     try {
//       const response = await fetch(`http://localhost:8080/api/${selectedCampaignId}/${leadid}/emailcontent`)
//       if (!response.ok) throw new Error("Failed to fetch email content")
//       const data = await response.json()
//       setEmailContent([{ id: 1, emailcontent: data.emailcontent }]) // Wrap in array if you're mapping
//     } catch (error) {
//       setEmailError(error.message)
//       console.error("Error fetching email:", error)
//     } finally {
//       setLoadingEmail(false)
//     }
//   }

//   const fetchResearch = async (selectedCampaignId, leadid) => {
//     setLoadingResearch(true)
//     setResearchError(null)

//     try {
//       const response = await fetch(`http://localhost:8080/api/${selectedCampaignId}/${leadid}/research`)
//       if (!response.ok) throw new Error("Failed to fetch research")
//       const data = await response.json()
//       setResearchData(data.research) // ← Just a string
//     } catch (error) {
//       setResearchError(error.message)
//       console.error("Error fetching research:", error)
//     } finally {
//       setLoadingResearch(false)
//     }
//   }

//   const handleSendMessage = async (selectedCampaignId, leadid) => {
//     console.log("Sending message for:", { selectedCampaignId, leadid })

//     // Check if we have all required data
//     if (!selectedCampaignId || !leadid) {
//       alert("Please select a campaign and lead before sending a message")
//       return
//     }

//     // Prevent multiple clicks
//     if (sendingMessage) return
//     setSendingMessage(true)

//     try {
//       // Send a POST request without a body - the backend only needs the IDs in the URL
//       const response = await fetch(`http://localhost:8080/api/${selectedCampaignId}/${leadid}/send`, {
//         method: "POST",
//       })

//       if (response.ok) {
//         const message = await response.text()
//         console.log("Success response:", message)
//         alert(message) // Show as popup
//         // Clear the message form after successful send
//         setNewMessage({ subject: "", content: "" })
//       } else {
//         console.error("Failed to send message:", response.statusText)
//         alert("Failed to send message. Please try again.")
//       }
//     } catch (error) {
//       console.error("Error sending message:", error)
//       alert("An error occurred while sending the message.")
//     } finally {
//       setSendingMessage(false)
//     }
//   }
  

//   // Handle lead selection
//   const handleLeadSelect = (lead) => {
//     setSelectedLead(lead)
//     console.log("Selected Lead ID:", lead.id)
//     fetchEmail(selectedCampaignId, lead.id)
//     fetchResearch(selectedCampaignId, lead.id)
//   }

//   // Filter leads based on search term and active filter
//   useEffect(() => {
//     let result = leads

//     if (searchTerm) {
//       result = result.filter(
//         (lead) =>
//           lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           lead.email.toLowerCase().includes(searchTerm.toLowerCase()),
//       )
//     }

//     if (activeFilter !== "All") {
//       result = result.filter((lead) => lead.status === activeFilter)
//     }

//     setFilteredLeads(result)
//   }, [searchTerm, activeFilter, leads])

//   // Set default selected lead on initial load
//   useEffect(() => {
//     if (filteredLeads.length > 0 && !selectedLead) {
//       handleLeadSelect(filteredLeads[0])
//     }
//   }, [filteredLeads])

//   // Handle search input change
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value)
//   }

//   // Handle filter click
//   const handleFilterClick = (filter) => {
//     setActiveFilter(filter)
//   }

//   // Handle tab change
//   const handleTabChange = (tab) => {
//     setActiveTab(tab)
//     if (tab === "Research" && isExpanded) {
//       setIsExpanded(false)
//     }
//   }

//   // Toggle expanded view
  
//   useEffect(() => {
//     if (selectedCampaignId) {
//       fetchLeads(selectedCampaignId)
//     }
//   }, [selectedCampaignId])

//   function getFullNameInCaps(name) {
//     if (!name) return "";
//     const parts = name.trim().split(" ");
//     return parts.map(word => word.charAt(0)).join("").toUpperCase();

    
//   }
  

//   return (
//     <div className="communications-container">
//       <div className="communication-header">
//         <h2 className="communication-title">Email Communications</h2>
//         <div className="filter1-container">
//           <select name="campaign" value={selectedCampaignId} onChange={handleChange} className="filter-dropdown">
//             <option value="" disabled >
//               Select Campaign
//             </option>
//             {campaigns.map((campaign) => (
//               <option key={campaign.campaignid} value={campaign.campaignid}>
//                 {campaign.campaignname}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="communication-content">
//         {/* Leads List */}
//         <div className="leads-content">
//           <div className="leads-header">
//             <div className="leads-content-header">
//               <h3>Leads</h3>
//               <div className="search-container">
//                 <input
//                   type="text"
//                   placeholder="Search leads..."
//                   className="search-input"
//                   value={searchTerm}
//                   onChange={handleSearchChange}
//                 />
//                 <IoIosSearch className="search-icon" />
//               </div>
//             </div>
//             <div className="filter-tabs">
//               <p className="filter-label">Filter by stage:</p>
//               <div className="tabs-container">
//                 {["All", "Active", "Inactive", "Converted", "Follow Up"].map((filter) => (
//                   <button
//                     key={filter}
//                     className={`tab ${activeFilter === filter ? "active" : ""}`}
//                     onClick={() => handleFilterClick(filter)}
//                   >
//                     {filter}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="leads-list">
//             {filteredLeads.map((lead) => (
//               <div
//                 className={`lead-item ${selectedLead?.id === lead.id ? "selected" : ""}`}
//                 key={lead.id}
//                 onClick={() => handleLeadSelect(lead)}
//               >
//                 <div className="lead-info">
//                   <div className="lead-initials">{getFullNameInCaps(lead.name)}</div>
//                   <div className="lead-details">
//                     <h4 className="lead-name">{lead.name}</h4>
//                     <p className="lead-email">{lead.email}</p>
//                     <span className={`lead-status ${lead.status.toLowerCase().replace(" ", "-")}`}>{lead.status}</span>
//                   </div>
//                 </div>
//                 <div className="lead-date">{lead.date}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Email Content */}
//         <div className="email-content">
//           {selectedLead ? (
//             <>
//               <div className="lead-profile">
//                 <div className="lead-profile-header">
//                   <div className="lead-profile-initials">{getFullNameInCaps(selectedLead.name)}</div>
                  
//                   {/* <div className="lead-profile-initials">{selectedLead.name.charAt(0)}</div> */}
//                   <div className="lead-profile-info">
//                     <h3 className="lead-profile-name">{selectedLead.name}</h3>
//                     <p className="lead-profile-email">
//                       {selectedLead.email} • {selectedLead.company}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="email-tabs">
//                   <button
//                     className={`email-tab ${activeTab === "Conversation" ? "active" : ""}`}
//                     onClick={() => handleTabChange("Conversation")}
//                   >
//                     Conversation
//                   </button>
//                   <button
//                     className={`email-tab ${activeTab === "Research" ? "active" : ""}`}
//                     onClick={() => handleTabChange("Research")}
//                   >
//                     Research
//                   </button>
//                   {activeTab === "Conversation" && (
//                     <button
//                       className="expand-icon"
//                       onClick={toggleExpandView}
//                       aria-label={isExpanded ? "Collapse view" : "Expand view"}
//                     >
//                       <FiMaximize2 />
//                     </button>
//                   )}
//                 </div>

//                 {activeTab === "Conversation" && (
//                   <div className="conversation-container">
                    
//                         <div className="conversation-messages">
//                           {emailContent && emailContent.length > 0 ? (
//                             emailContent.map((email, index) => (
//                               <div
//                                 key={email.id || index}
//                                 className={`message ${index % 2 === 0 ? "outgoing" : "incoming"}`}
//                               >
//                                 <div className="message-header">
//                                   <h4 className="message-subject">{email.subject || "Email Communication"}</h4>
//                                   <span className="message-time">
//                                     {email.timestamp
//                                       ? new Date(email.timestamp).toLocaleTimeString([], {
//                                           hour: "2-digit",
//                                           minute: "2-digit",
//                                         })
//                                       : "Recent"}
//                                   </span>
//                                 </div>
//                                 <div className="message-body">
//                                   {email.emailcontent ? (
//                                     typeof email.emailcontent === "string" ? (
//                                       email.emailcontent.split("\n").map((line, i) => <p key={i}>{line}</p>)
//                                     ) : (
//                                       <p>{JSON.stringify(email.emailcontent)}</p>
//                                     )
//                                   ) : (
//                                     <p>No content available</p>
//                                   )}
//                                 </div>
//                               </div>
//                             ))
//                           ) : (
//                             <div className="no-conversations">
//                               <p>No emails found for this lead.</p>
//                             </div>
//                           )}
//                         </div>

//                         <div className="message-compose">
//                           <div className="message-subject-input">
//                             <label>Subject:</label>
//                             <input
//                               type="text"
//                               placeholder="Enter message subject"
//                               value={newMessage.subject}
//                               onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
//                             />
//                           </div>

//                           <button className="ai-assist-btn">AI Assist</button>

//                           <div className="message-body-input">
//                             <label>Message:</label>
//                             <textarea
//                               placeholder="Type your message"
//                               value={newMessage.content}
//                               onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
//                             />
//                           </div>

//                           <div className="message-actions">
//                             <button
//                               className="send-message-btn"
//                               onClick={() => handleSendMessage(selectedCampaignId, selectedLead.id)}
//                               disabled={sendingMessage || !selectedLead}
//                             >
//                               
//                             </button>
//                           </div>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 )}

//                 {activeTab === "Research" && (
//                   <div className="research-content">
//                     {loadingResearch ? (
//                       <div className="loading-state">Loading research...</div>
//                     ) : researchError ? (
//                       <div className="error-state">
//                         {researchError}
//                         <button onClick={() => fetchResearch(selectedCampaignId, selectedLead.id)}>Retry</button>
//                       </div>
//                     ) : researchData ? (
//                       <div className="research-data prose max-w-none">
//                         <ReactMarkdown>{researchData}</ReactMarkdown>
//                       </div>
//                     ) : (
//                       <div className="no-research-data">
//                         <p>No research data available for this lead.</p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </>
//           ) : (
//             <div className="no-lead-selected">
//               <p>Select a lead to view details</p>
//             </div>
//           )}
//         </div>
//       </div>





// Updated Communication.tsx with integrated theme from snippet
"use client"

"use client"

import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import "../styles/communication.css"
import { IoIosSearch } from "react-icons/io"
import { FiMaximize2, FiMinimize2 } from "react-icons/fi"

const Communication = () => {
  const [leads, setLeads] = useState([])
  const [selectedStatus, setSelectedStatus] = useState("Select Campaign")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [filteredLeads, setFilteredLeads] = useState([])
  const [selectedLead, setSelectedLead] = useState(null)
  const [activeTab, setActiveTab] = useState("Conversation")
  const [isExpanded, setIsExpanded] = useState(false)
  const [researchData, setResearchData] = useState(null)
  const [newMessage, setNewMessage] = useState({ subject: "", content: "" })
  const [loadingResearch, setLoadingResearch] = useState(false)
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [researchError, setResearchError] = useState(null)
  const [emailError, setEmailError] = useState(null)
  const [campaigns, setCampaigns] = useState([])
  const [selectedCampaignId, setSelectedCampaignId] = useState("")
  const [emailContent, setEmailContent] = useState(null)

  useEffect(() => {
    fetchcampaign()
  }, [])

  useEffect(() => {
    if (selectedCampaignId) {
      fetchLeads(selectedCampaignId)
      setSelectedLead(null)
      setEmailContent([])
      setResearchData(null)
    }
  }, [selectedCampaignId])

  const fetchcampaign = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/campaigns")
      const data = await response.json()
      setCampaigns(data)
    } catch (error) {
      console.error("Error fetching campaigns:", error)
    }
  }

  const handleChange = (e) => {
    const selectedId = e.target.value
    setSelectedCampaignId(selectedId)
  }

  const fetchLeads = async (selectedCampaignId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/${selectedCampaignId}/leads`)
      const data = await response.json()
      setLeads(data)
    } catch (error) {
      console.error("Error fetching leads:", error)
    }
  }

  const fetchEmail = async (campaignId, leadId) => {
    setLoadingEmail(true)
    setEmailError(null)
    try {
      const [subjectRes, bodyRes] = await Promise.all([
        fetch(`http://localhost:8080/api/${campaignId}/${leadId}/subject`),
        fetch(`http://localhost:8080/api/${campaignId}/${leadId}/body`),
      ])
      if (!subjectRes.ok || !bodyRes.ok) throw new Error("Failed to fetch email content")
      const subject = await subjectRes.text()
      const body = await bodyRes.text()
      setNewMessage({ subject, content: body })
    } catch (error) {
      setEmailError(error.message)
    } finally {
      setLoadingEmail(false)
    }
  }

  const fetchResearch = async (campaignId, leadId) => {
    setLoadingResearch(true)
    setResearchError(null)
    try {
      const res = await fetch(`http://localhost:8080/api/${campaignId}/${leadId}/research`)
      if (!res.ok) throw new Error("Failed to fetch research")
      const data = await res.json()
      setResearchData(data.research)
    } catch (error) {
      setResearchError(error.message)
    } finally {
      setLoadingResearch(false)
    }
  }

  const handleLeadSelect = (lead) => {
    setSelectedLead(lead)
    fetchEmail(selectedCampaignId, lead.id)
    fetchResearch(selectedCampaignId, lead.id)
    fetchConversation(selectedCampaignId, lead.id) // ✅ NEW
  }

  const fetchConversation = async (campaignId, leadId) => {
    try {
      // Step 1: First fetch the emails and store them in DB
      const readRes = await fetch(`http://localhost:8080/api/${campaignId}/${leadId}/read`);
      if (!readRes.ok) throw new Error("Failed to fetch and store emails");
  
      // Step 2: Then fetch the conversation details
      const convoRes = await fetch(`http://localhost:8080/api/${campaignId}/${leadId}/conversation`);
      if (!convoRes.ok) throw new Error("Failed to fetch conversation");
  
      const data = await convoRes.json();
      setEmailContent(data); // Display the conversation
    } catch (err) {
      console.error("Error loading conversation:", err);
      setEmailContent([]); // fallback in case of error
    }
  };
  

  const handleSendMessage = async (campaignId, leadId) => {
    if (!campaignId || !leadId) {
      alert("Please select a campaign and lead");
      return;
    }
  
    try {
      const res = await fetch(`http://localhost:8080/api/${campaignId}/${leadId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage), // Send subject + content from form
      });
  
      const message = await res.text();
      alert(message);
  
      // Clear the form
      setNewMessage({ subject: "", content: "" });
  
      // Refresh conversation from DB
      fetchConversation(campaignId, leadId);
    } catch (err) {
      alert("Failed to send message");
    }
  };
  
  

  useEffect(() => {
    let result = leads
    if (searchTerm) {
      result = result.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    if (activeFilter !== "All") {
      result = result.filter((lead) => lead.status === activeFilter)
    }
    setFilteredLeads(result)
  }, [searchTerm, activeFilter, leads])

  useEffect(() => {
    if (filteredLeads.length > 0 && !selectedLead) {
      handleLeadSelect(filteredLeads[0])
    }
  }, [filteredLeads])
  const toggleExpandView = () => {
    setIsExpanded(!isExpanded)
  }


  function getFullNameInCaps(name) {
  if (!name) return "";
  const parts = name.trim().split(" ");
  return parts.slice(0, 2).map(word => word.charAt(0)).join("").toUpperCase();
}

  return (
    <div className="communications-container">
      <div className="communication-header">
        <h2 className="communication-title">Email Communications</h2>
        <div className="filter1-container">
          <select className="filter-dropdown" value={selectedCampaignId} onChange={handleChange}>
            <option value="" disabled>
              Select Campaign
            </option>
            {campaigns.map((c) => (
              <option key={c.campaignid} value={c.campaignid}>
                {c.campaignname}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="communication-content">
        {/* Sidebar */}
        <div className="leads-content">
          <div className="leads-header">
            <div className="leads-content-header">
              <h3>Leads</h3>
              <div className="search-container">
                <input
                  className="search-input"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <IoIosSearch className="search-icon" />
              </div>
            </div>
            <div className="filter-tabs">
              <p className="filter-label">Filter by stage:</p>
               <div className="tabs-container">
                {["All", "Active", "Inactive", "Converted", "Follow Up"].map((filter) => (
                  <button
                    key={filter}
                    className={`tab ${activeFilter === filter ? "active" : ""}`}
                    onClick={() => handleFilterClick(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="leads-list">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className={`lead-item ${selectedLead?.id === lead.id ? "selected" : ""}`}
                onClick={() => handleLeadSelect(lead)}
              >
                <div className="lead-info">
                  <div className="lead-initials">{getFullNameInCaps(lead.name)}</div>
                  <div className="lead-details">
                    <h4 className="lead-name">{lead.name}</h4>
                    <p className="lead-email">{lead.email}</p>
                    <span className={`lead-status ${lead.status.toLowerCase().replace(/\s/g, "-")}`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
                <div className="lead-date">{lead.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="email-content">
          {selectedLead ? (
            <div className="lead-profile">
              <div className="lead-profile-header">
                <div className="lead-profile-initials">{getFullNameInCaps(selectedLead.name)}</div>
                <div className="lead-profile-info">
                  <h3 className="lead-profile-name">{selectedLead.name}</h3>
                  <p className="lead-profile-email">
                    {selectedLead.email} • {selectedLead.company}
                  </p>
                </div>
              </div>
              <div className="email-tabs">
                <button
                  className={`email-tab ${activeTab === "Conversation" ? "active" : ""}`}
                  onClick={() => setActiveTab("Conversation")}
                >
                  Conversation
                </button>
                <button
                  className={`email-tab ${activeTab === "Research" ? "active" : ""}`}
                  onClick={() => setActiveTab("Research")}
                >
                  Research
                </button>
                {activeTab === "Conversation" && (
                  <button className="expand-icon" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? <FiMinimize2 /> : <FiMaximize2 />}
                  </button>
                )}
              </div>

              {activeTab === "Conversation" && (
                <div className="conversation-container">
                  <div className="conversation-messages">
                      {emailContent && emailContent.length > 0 ? (
                        emailContent.map((email, index) => (
                          <div
                            key={email.id || index}
                            className={`message ${email.direction === "SENT" ? "outgoing" : "incoming"}`}
                          >
                            <div className="message-header">
                              <h4 className="message-subject">{email.subject || "Email Communication"}</h4>
                              <span className="message-time">
                                {email.timestamp
                                  ? new Date(email.timestamp).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "Recent"}
                              </span>
                            </div>
                            <div className="message-body">
                              {typeof email.body === "string" ? (
                                email.body.split("\n").map((line, i) => <p key={i}>{line}</p>)
                              ) : (
                                <p>{JSON.stringify(email.body)}</p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No messages found.</p>
                      )}
                    </div>


                  <div className="message-compose">
                    <div className="message-subject-input">
                      <label>Subject:</label>
                      <input
                        value={newMessage.subject}
                        onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                      />
                    </div>
                    <button className="ai-assist-btn">AI Assist</button>
                    <div className="message-body-input">
                      <label>Message:</label>
                      <textarea
                        value={newMessage.content}
                        onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                      />
                    </div>
                    <div className="message-actions">
                      <button
                        className="send-message-btn"
                        onClick={() => handleSendMessage(selectedCampaignId, selectedLead.id)}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Research" && (
                <div className="research-content">
                  {loadingResearch ? (
                    <div className="loading-state">Loading research...</div>
                  ) : researchError ? (
                    <div className="error-state">
                      {researchError}
                      <button onClick={() => fetchResearch(selectedCampaignId, selectedLead.id)}>Retry</button>
                    </div>
                  ) : researchData ? (
                    <div className="research-data prose max-w-none">
                      <ReactMarkdown>{researchData}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="no-research-data">
                      <p>No research data available for this lead.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="no-lead-selected">
              <p>Select a Campaign to view details</p>
            </div>
          )}
        </div>
      </div>
          {isExpanded && activeTab === "Conversation" && selectedLead && emailContent.length > 0 && (
        <div className="expanded-overlay">
          <div className="expanded-content">
            <div className="expanded-header">
              <h3>{selectedLead.name} - Conversation</h3>
              <button className="close-expanded" onClick={toggleExpandView}>
                <FiMinimize2 />
              </button>
            </div>
            <div className="expanded-messages">
              {emailContent && emailContent.length > 0 ? (
                        emailContent.map((email, index) => (
                          <div
                            key={email.id || index}
                            className={`message ${email.direction === "SENT" ? "outgoing" : "incoming"}`}
                          >
                            <div className="message-header">
                              <h4 className="message-subject">{email.subject || "Email Communication"}</h4>
                              <span className="message-time">
                                {email.timestamp
                                  ? new Date(email.timestamp).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "Recent"}
                              </span>
                            </div>
                            <div className="message-body">
                              {typeof email.body === "string" ? (
                                email.body.split("\n").map((line, i) => <p key={i}>{line}</p>)
                              ) : (
                                <p>{JSON.stringify(email.body)}</p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No messages found.</p>
                      )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Communication;


