import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { EMPLOYEES, USERS, getEmployeeUser, getManagerEmployees } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

const INITIAL_FEEDBACK = [
  {
    id: 1,
    fromName: "Alex Johnson",
    fromRole: "admin",
    toName: "Ravi Kapoor",
    toRole: "manager",
    roleFlow: "Admin to Manager",
    category: "Leadership & Architecture",
    rating: "Excellent",
    subject: "Q3 Sprint Delivery & Architecture Alignment",
    message: "Excellent leadership in coordinating the backend database migration. Ensure team workload remains balanced across junior developers.",
    actionItems: "1. Monitor sprint allocation for junior devs.\n2. Schedule architecture sync for next month.",
    date: "2026-08-20",
    status: "Acknowledged"
  },
  {
    id: 2,
    fromName: "Alex Johnson",
    fromRole: "admin",
    toName: "Priya Sharma",
    toRole: "employee",
    roleFlow: "Admin to Employee",
    category: "Technical Execution",
    rating: "Excellent",
    subject: "Company-Wide Frontend UI Architecture Commendation",
    message: "Outstanding work establishing consistent UI design tokens and responsive layouts.",
    actionItems: "1. Lead frontend workshop for engineering team.\n2. Document reusable CSS components.",
    date: "2026-08-21",
    status: "Acknowledged"
  },
  {
    id: 3,
    fromName: "Ravi Kapoor",
    fromRole: "manager",
    toName: "Marcus Lee",
    toRole: "employee",
    roleFlow: "Manager to Employee",
    category: "Technical Execution",
    rating: "Excellent",
    subject: "Backend Query Optimization Performance",
    message: "Significant speed improvements achieved on the task assignment queries. Great diligence in database indexing.",
    actionItems: "1. Monitor production query latency.\n2. Assist in Docker deployment setup.",
    date: "2026-08-22",
    status: "Received"
  },
  {
    id: 4,
    fromName: "Ravi Kapoor",
    fromRole: "manager",
    toName: "Alex Johnson",
    toRole: "admin",
    roleFlow: "Manager to Admin",
    category: "Strategic Resource Allocation",
    rating: "Good",
    subject: "Engineering Department Q4 Headcount & Cloud Server Budget",
    message: "Engineering velocity is on track. Requesting budget approval for additional AWS staging environments and 1 junior backend developer for Q4.",
    actionItems: "1. Review Q4 infrastructure budget forecast.\n2. Schedule admin approval meeting.",
    date: "2026-08-24",
    status: "Acknowledged"
  },
  {
    id: 5,
    fromName: "Nina Torres",
    fromRole: "manager",
    toName: "Sara Patel",
    toRole: "employee",
    roleFlow: "Manager to Employee",
    category: "Design Quality",
    rating: "Good",
    subject: "Telemetry UI Wireframes Approval",
    message: "The design tokens and wireframes for the telemetry pages are clean and well structured.",
    actionItems: "1. Finalize dark mode contrast specs.\n2. Align spacing tokens with engineering.",
    date: "2026-08-25",
    status: "Received"
  }
];

const INITIAL_SUGGESTIONS = [
  {
    id: 101,
    employeeName: "Priya Sharma",
    department: "Engineering",
    type: "Workplace / Process Suggestion",
    directedTo: "Ravi Kapoor (Manager)",
    urgency: "Medium",
    subject: "Automated ESLint and Pre-commit Hooks",
    message: "Suggest implementing automated pre-commit husky hooks for ESLint and Prettier to avoid manual formatting reviews in PRs.",
    date: "2026-08-24",
    status: "Under Review",
    response: "Good idea, will discuss in next engineering sync."
  },
  {
    id: 102,
    employeeName: "Marcus Lee",
    department: "Engineering",
    type: "Software & Hardware Request",
    directedTo: "Alex Johnson (Admin)",
    urgency: "High",
    subject: "Docker Desktop Enterprise License Upgrade",
    message: "Need license renewal for local containerized development and database integration testing.",
    date: "2026-08-25",
    status: "Resolved",
    response: "License renewed and credentials sent via email."
  },
  {
    id: 103,
    employeeName: "Sara Patel",
    department: "Design",
    type: "Workload / Capacity Adjustment Request",
    directedTo: "Nina Torres (Manager)",
    urgency: "Low",
    subject: "Request for Figma Plugin Access",
    message: "Would like approval for the Stark accessibility contrast analyzer plugin.",
    date: "2026-08-26",
    status: "Approved",
    response: "Approved for the entire Design department."
  }
];

export default function Feedback() {
  const { user, managedDept } = useAuth();
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const isEmployee = user?.role === "employee";

  // State for Feedback (Admin & Manager)
  const [feedbackList, setFeedbackList] = useState(INITIAL_FEEDBACK);
  const [category, setCategory] = useState("Technical Execution");
  const [rating, setRating] = useState("Excellent");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [actionItems, setActionItems] = useState("");
  const [notification, setNotification] = useState("");
  const [filterFlow, setFilterFlow] = useState("all");
  const [activeTab, setActiveTab] = useState("feedback"); // 'feedback' | 'suggestions'

  // State for Employee Help / Suggestion Box
  const [suggestionsList, setSuggestionsList] = useState(INITIAL_SUGGESTIONS);
  const [suggType, setSuggType] = useState("Workplace / Process Suggestion");
  const [suggDirectedTo, setSuggDirectedTo] = useState(isEmployee ? "Department Manager" : "System Administrator");
  const [suggUrgency, setSuggUrgency] = useState("Medium");
  const [suggSubject, setSuggSubject] = useState("");
  const [suggMessage, setSuggMessage] = useState("");

  // Determine selectable recipients based on role rules:
  // - Admin can give feedback to: Manager and Employee
  // - Manager can give feedback to: Employee and Admin
  const getEligibleRecipients = () => {
    if (isAdmin) {
      // Managers and Employees
      return USERS.filter(u => u.id !== user?.id && (u.role === "manager" || u.role === "employee"));
    }
    if (isManager) {
      // Employees in team / company and Admins
      return USERS.filter(u => u.id !== user?.id && (u.role === "employee" || u.role === "admin"));
    }
    return [];
  };

  const eligibleRecipients = getEligibleRecipients();
  const [toUser, setToUser] = useState(eligibleRecipients[0]?.name || "");

  // Handle Feedback Submission (Admin / Manager)
  const handleSendFeedback = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || !toUser) return;

    const recipientObj = USERS.find(u => u.name === toUser);
    let determinedFlow = "General Feedback";
    if (isAdmin && recipientObj?.role === "manager") determinedFlow = "Admin to Manager";
    else if (isAdmin && recipientObj?.role === "employee") determinedFlow = "Admin to Employee";
    else if (isManager && recipientObj?.role === "employee") determinedFlow = "Manager to Employee";
    else if (isManager && recipientObj?.role === "admin") determinedFlow = "Manager to Admin";

    const newFb = {
      id: feedbackList.length + 1,
      fromName: user?.name || "Anonymous",
      fromRole: user?.role || "user",
      toName: toUser,
      toRole: recipientObj?.role || "user",
      roleFlow: determinedFlow,
      category: category,
      rating: rating,
      subject: subject.trim(),
      message: message.trim(),
      actionItems: actionItems.trim() || "None specified.",
      date: new Date().toISOString().split("T")[0],
      status: "Submitted"
    };

    setFeedbackList([newFb, ...feedbackList]);
    setSubject("");
    setMessage("");
    setActionItems("");
    setNotification("Performance feedback submitted and recorded successfully.");
    setTimeout(() => setNotification(""), 3500);
  };

  // Handle Suggestion / Help Box Submission (Employee)
  const handleSendSuggestion = (e) => {
    e.preventDefault();
    if (!suggSubject.trim() || !suggMessage.trim()) return;

    const newTicket = {
      id: 100 + suggestionsList.length + 1,
      employeeName: user?.name || "Employee",
      department: managedDept || "Engineering",
      type: suggType,
      directedTo: suggDirectedTo,
      urgency: suggUrgency,
      subject: suggSubject.trim(),
      message: suggMessage.trim(),
      date: new Date().toISOString().split("T")[0],
      status: "Submitted",
      response: "Pending review by supervisor."
    };

    setSuggestionsList([newTicket, ...suggestionsList]);
    setSuggSubject("");
    setSuggMessage("");
    setNotification("Your suggestion/ticket has been submitted to management.");
    setTimeout(() => setNotification(""), 3500);
  };

  const handleAcknowledge = (fbId) => {
    setFeedbackList(prev => prev.map(f => f.id === fbId ? { ...f, status: "Acknowledged" } : f));
    setNotification("Feedback marked as acknowledged.");
    setTimeout(() => setNotification(""), 2500);
  };

  const handleUpdateTicketStatus = (ticketId, newStatus) => {
    setSuggestionsList(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
    setNotification("Ticket status updated.");
    setTimeout(() => setNotification(""), 2500);
  };

  const filteredFeedback = feedbackList.filter(f => {
    if (filterFlow !== "all" && f.roleFlow !== filterFlow) return false;
    // Managers only see relevant channels (Manager to Employee, Manager to Admin, Admin to Manager)
    if (isManager && !isAdmin) {
      if (f.fromName !== user?.name && f.toName !== user?.name) return false;
    }
    return true;
  });

  // ─────────────────────────────────────────────────────────
  // 1. EMPLOYEE VIEW: HELP BOX / SUGGESTION BOX ONLY
  // ─────────────────────────────────────────────────────────
  if (isEmployee) {
    const myTickets = suggestionsList.filter(t => t.employeeName === user?.name || t.employeeName === "Priya Sharma");

    return (
      <div>
        {/* Top Header Banner */}
        <div style={{ border: "1px solid var(--border)", padding: "14px 18px", marginBottom: 16, backgroundColor: "#ffffff" }}>
          <h2 style={{ fontSize: 18, fontWeight: "bold", margin: 0 }}>
            Employee Help Desk &amp; Workplace Suggestion Box
          </h2>
          <div style={{ fontSize: 13, color: "var(--footer)", marginTop: 4 }}>
            Direct communication channel for staff: Submit technical blockers, process improvements, workstation requests, or queries to Department Managers and System Administrators.
          </div>
        </div>

        {notification && (
          <div style={{ border: "1px solid var(--border)", padding: "8px 12px", marginBottom: 16, fontWeight: "bold", backgroundColor: "var(--body)" }}>
            Notice: {notification}
          </div>
        )}

        {/* Suggestion / Help Submission Form */}
        <div className="wt-card" style={{ marginBottom: 16 }}>
          <div className="wt-card-header">
            <h2 className="wt-card-title">
              Submit a Request or Suggestion (Staff: {user?.name})
            </h2>
          </div>
          <form onSubmit={handleSendSuggestion} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Request Type:</label>
                <select 
                  className="form-control" 
                  style={{ width: "100%" }}
                  value={suggType}
                  onChange={e => setSuggType(e.target.value)}
                >
                  <option value="Workplace / Process Suggestion">Workplace / Process Suggestion</option>
                  <option value="Technical Blocker / Help Needed">Technical Blocker / Help Needed</option>
                  <option value="Software & Hardware Request">Software &amp; Hardware Request</option>
                  <option value="Workload / Capacity Adjustment Request">Workload / Capacity Adjustment Request</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Direct Request To:</label>
                <select
                  className="form-control"
                  style={{ width: "100%" }}
                  value={suggDirectedTo}
                  onChange={e => setSuggDirectedTo(e.target.value)}
                >
                  <option value="Department Manager">Department Manager (Team Lead)</option>
                  <option value="System Administrator">System Administrator (Executive)</option>
                  <option value="Both Manager & Admin">Both Manager &amp; Admin</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Urgency Level:</label>
                <select
                  className="form-control"
                  style={{ width: "100%" }}
                  value={suggUrgency}
                  onChange={e => setSuggUrgency(e.target.value)}
                >
                  <option value="Low">Low (General suggestion/idea)</option>
                  <option value="Medium">Medium (Workflow enhancement)</option>
                  <option value="High">High (Impacting current sprint)</option>
                  <option value="Critical">Critical (Immediate blocker)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Subject / Summary:</label>
              <input 
                type="text" 
                className="form-control" 
                style={{ width: "100%" }}
                placeholder="Brief summary of your query or suggestion..." 
                value={suggSubject}
                onChange={e => setSuggSubject(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Detailed Description / Notes:</label>
              <textarea 
                className="form-control" 
                style={{ width: "100%", height: 80 }}
                placeholder="Explain the context, proposed idea, or specific help needed..."
                value={suggMessage}
                onChange={e => setSuggMessage(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start", padding: "8px 18px" }}>
              Submit Request to Management
            </button>
          </form>
        </div>

        {/* Employee's Tracked Requests */}
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">My Submitted Tickets &amp; Suggestions ({myTickets.length})</h2>
          </div>
          <table className="wt-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Date</th>
                <th>Category</th>
                <th>Directed To</th>
                <th>Urgency</th>
                <th>Subject &amp; Details</th>
                <th>Status</th>
                <th>Supervisor Response</th>
              </tr>
            </thead>
            <tbody>
              {myTickets.map(t => (
                <tr key={t.id}>
                  <td><strong>#{t.id}</strong></td>
                  <td>{t.date}</td>
                  <td>{t.type}</td>
                  <td>{t.directedTo}</td>
                  <td><span style={{ fontWeight: "bold" }}>{t.urgency}</span></td>
                  <td>
                    <strong>{t.subject}</strong>
                    <div style={{ fontSize: 12, marginTop: 2, color: "#444" }}>{t.message}</div>
                  </td>
                  <td><strong>{t.status}</strong></td>
                  <td style={{ fontSize: 12, color: "var(--footer)" }}>{t.response}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // 2. ADMIN & MANAGER VIEW
  // - Admin gives feedback to: Manager & Employee
  // - Manager gives feedback to: Employee & Admin
  // - Both can review Employee Help & Suggestion tickets
  // ─────────────────────────────────────────────────────────
  return (
    <div>
      {/* Top Banner */}
      <div style={{ border: "1px solid var(--border)", padding: "14px 18px", marginBottom: 16, backgroundColor: "#ffffff" }}>
        <h2 style={{ fontSize: 18, fontWeight: "bold", margin: 0 }}>
          {isAdmin ? "Executive Performance Feedback & Evaluation" : "Department Management Feedback & Review"}
        </h2>
        <div style={{ fontSize: 13, color: "var(--footer)", marginTop: 4 }}>
          {isAdmin 
            ? "Admin Appraisal Console: Give performance feedback and directives to Managers and Employees."
            : `Manager Appraisal Console: Give performance reviews to Team Employees and submit resource requests/feedback to Admins.`}
        </div>
      </div>

      {notification && (
        <div style={{ border: "1px solid var(--border)", padding: "8px 12px", marginBottom: 16, fontWeight: "bold", backgroundColor: "var(--body)" }}>
          Notice: {notification}
        </div>
      )}

      {/* View Switcher Tabs: Feedback Form vs Employee Help Box Inbox */}
      <div style={{ display: "flex", gap: 4, borderBottom: "2px solid var(--border)", marginBottom: 16 }}>
        <button
          onClick={() => setActiveTab("feedback")}
          className={"btn " + (activeTab === "feedback" ? "btn-primary" : "btn-secondary")}
        >
          {isAdmin ? "Give Feedback (to Managers & Employees)" : "Give Feedback (to Employees & Admins)"}
        </button>
        <button
          onClick={() => setActiveTab("suggestions")}
          className={"btn " + (activeTab === "suggestions" ? "btn-primary" : "btn-secondary")}
        >
          Employee Help &amp; Suggestion Inbox ({suggestionsList.length})
        </button>
      </div>

      {activeTab === "feedback" && (
        <>
          {/* Feedback Submission Form */}
          <div className="wt-card" style={{ marginBottom: 16 }}>
            <div className="wt-card-header">
              <h2 className="wt-card-title">
                {isAdmin ? "Give Performance Feedback to Manager or Employee" : "Give Performance Feedback to Employee or Admin"}
              </h2>
            </div>
            <form onSubmit={handleSendFeedback} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>
                    Select Recipient ({isAdmin ? "Managers & Employees" : "Employees & Admins"}):
                  </label>
                  <select 
                    className="form-control" 
                    style={{ width: "100%" }}
                    value={toUser}
                    onChange={e => setToUser(e.target.value)}
                    required
                  >
                    {eligibleRecipients.map(u => (
                      <option key={u.id} value={u.name}>
                        {u.name} — ({u.role.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Category / Competency:</label>
                  <select
                    className="form-control"
                    style={{ width: "100%" }}
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    <option value="Technical Execution">Technical Execution</option>
                    <option value="Leadership & Architecture">Leadership &amp; Architecture</option>
                    <option value="Sprint Delivery">Sprint Delivery</option>
                    <option value="Design Quality">Design Quality</option>
                    <option value="Strategic Resource Allocation">Strategic Resource Allocation</option>
                    <option value="Workflow & Tooling">Workflow &amp; Tooling</option>
                    <option value="Quality Compliance">Quality Compliance</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Performance Rating:</label>
                  <select
                    className="form-control"
                    style={{ width: "100%" }}
                    value={rating}
                    onChange={e => setRating(e.target.value)}
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Satisfactory">Satisfactory</option>
                    <option value="Needs Improvement">Needs Improvement</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Subject / Summary:</label>
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ width: "100%" }}
                  placeholder="e.g. Q3 Sprint Milestone Review &amp; Architecture Directives" 
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Observations &amp; Remarks:</label>
                  <textarea 
                    className="form-control" 
                    style={{ width: "100%", height: 75 }}
                    placeholder="Provide constructive feedback, accomplishments, or operational directions..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Action Items / Directives:</label>
                  <textarea 
                    className="form-control" 
                    style={{ width: "100%", height: 75 }}
                    placeholder="Actionable deliverables, upskilling goals, or timeline requirements..."
                    value={actionItems}
                    onChange={e => setActionItems(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start", padding: "8px 18px" }}>
                Submit Feedback
              </button>
            </form>
          </div>

          {/* Feedback Communication History Table */}
          <div className="wt-card">
            <div className="wt-card-header">
              <div>
                <h2 className="wt-card-title">Feedback &amp; Appraisal Records ({filteredFeedback.length})</h2>
                <div className="wt-card-subtitle">
                  {isAdmin 
                    ? "Admin to Manager, Admin to Employee, and Manager communication logs" 
                    : "Manager to Employee, and Manager to Admin evaluation records"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <label style={{ fontSize: 12, fontWeight: "bold" }}>Filter Channel:</label>
                <select
                  className="form-control"
                  style={{ fontSize: 12, padding: "2px 6px" }}
                  value={filterFlow}
                  onChange={e => setFilterFlow(e.target.value)}
                >
                  <option value="all">All Channels</option>
                  <option value="Admin to Manager">Admin to Manager</option>
                  <option value="Admin to Employee">Admin to Employee</option>
                  <option value="Manager to Employee">Manager to Employee</option>
                  <option value="Manager to Admin">Manager to Admin</option>
                </select>
              </div>
            </div>

            <table className="wt-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Channel Flow</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Category</th>
                  <th>Rating</th>
                  <th>Subject &amp; Remarks</th>
                  <th>Action Items</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedback.map(fb => (
                  <tr key={fb.id}>
                    <td>{fb.date}</td>
                    <td><strong>{fb.roleFlow}</strong></td>
                    <td>{fb.fromName}</td>
                    <td>{fb.toName}</td>
                    <td>{fb.category}</td>
                    <td><strong>{fb.rating}</strong></td>
                    <td>
                      <strong>{fb.subject}</strong>
                      <div style={{ fontSize: 12, marginTop: 2, color: "var(--footer)" }}>{fb.message}</div>
                    </td>
                    <td style={{ fontSize: 12 }}>{fb.actionItems}</td>
                    <td><strong>{fb.status}</strong></td>
                    <td>
                      {fb.status !== "Acknowledged" ? (
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleAcknowledge(fb.id)}
                        >
                          Acknowledge
                        </button>
                      ) : (
                        <span style={{ fontSize: 12, color: "var(--footer)" }}>Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "suggestions" && (
        <div className="wt-card">
          <div className="wt-card-header">
            <div>
              <h2 className="wt-card-title">Employee Help &amp; Suggestion Inbox ({suggestionsList.length})</h2>
              <div className="wt-card-subtitle">Staff tickets, blockers, resource requests, and workplace suggestions</div>
            </div>
          </div>
          <table className="wt-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Date</th>
                <th>Employee</th>
                <th>Category</th>
                <th>Directed To</th>
                <th>Urgency</th>
                <th>Subject &amp; Details</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suggestionsList.map(t => (
                <tr key={t.id}>
                  <td><strong>#{t.id}</strong></td>
                  <td>{t.date}</td>
                  <td><strong>{t.employeeName}</strong> ({t.department})</td>
                  <td>{t.type}</td>
                  <td>{t.directedTo}</td>
                  <td><strong>{t.urgency}</strong></td>
                  <td>
                    <strong>{t.subject}</strong>
                    <div style={{ fontSize: 12, marginTop: 2, color: "#444" }}>{t.message}</div>
                  </td>
                  <td><strong>{t.status}</strong></td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      {t.status !== "Resolved" && (
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleUpdateTicketStatus(t.id, "Resolved")}
                        >
                          Resolve
                        </button>
                      )}
                      {t.status === "Submitted" && (
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleUpdateTicketStatus(t.id, "Under Review")}
                        >
                          Review
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
