import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { EMPLOYEES, USERS, getEmployeeUser } from "../data/mockData";

const INITIAL_FEEDBACK = [
  {
    id: 1,
    fromName: "Alex Vance",
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
    fromName: "Ravi Kapoor",
    fromRole: "manager",
    toName: "Priya Sharma",
    toRole: "employee",
    roleFlow: "Manager to Employee",
    category: "Technical Execution",
    rating: "Excellent",
    subject: "UI Component Refactor Commendation",
    message: "Great work completing the frontend components ahead of schedule. Your peer review notes have significantly assisted the team.",
    actionItems: "1. Continue mentoring junior frontend developers.\n2. Prepare design system documentation.",
    date: "2026-08-22",
    status: "Received"
  },
  {
    id: 3,
    fromName: "Nina Torres",
    fromRole: "manager",
    toName: "Elena Rostova",
    toRole: "employee",
    roleFlow: "Manager to Employee",
    category: "Design Quality",
    rating: "Good",
    subject: "Design Token Library Handoff",
    message: "The design tokens and wireframes for the telemetry pages are clean and well structured. Excellent attention to typography guidelines.",
    actionItems: "1. Finalize dark mode contrast specs.\n2. Align spacing tokens with engineering.",
    date: "2026-08-24",
    status: "Received"
  },
  {
    id: 4,
    fromName: "Priya Sharma",
    fromRole: "employee",
    toName: "Ravi Kapoor",
    toRole: "manager",
    roleFlow: "Employee to Manager",
    category: "Workflow & Tooling",
    rating: "Good",
    subject: "CI/CD Deployment Pipeline Feedback",
    message: "The automated build pipelines have saved significant deployment time during sprint reviews. Suggest adding automated lint checks on pull requests.",
    actionItems: "1. Review ESLint rule configuration.\n2. Enable pre-commit hooks.",
    date: "2026-08-25",
    status: "Acknowledged"
  }
];

export default function Feedback() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const isEmployee = user?.role === "employee";

  const [feedbackList, setFeedbackList] = useState(INITIAL_FEEDBACK);
  const [toUser, setToUser] = useState(USERS[1]?.name || "Ravi Kapoor");
  const [category, setCategory] = useState("Technical Execution");
  const [rating, setRating] = useState("Excellent");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [actionItems, setActionItems] = useState("");
  const [notification, setNotification] = useState("");
  const [filterFlow, setFilterFlow] = useState("all");

  const handleSendFeedback = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const recipientObj = USERS.find(u => u.name === toUser);
    let determinedFlow = "General Feedback";
    if (isAdmin && recipientObj?.role === "manager") determinedFlow = "Admin to Manager";
    else if (isAdmin && recipientObj?.role === "employee") determinedFlow = "Admin to Employee";
    else if (isManager && recipientObj?.role === "employee") determinedFlow = "Manager to Employee";
    else if (isManager && recipientObj?.role === "admin") determinedFlow = "Manager to Admin";
    else if (isEmployee && recipientObj?.role === "manager") determinedFlow = "Employee to Manager";
    else determinedFlow = "Peer Feedback";

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
    setNotification("Feedback submitted and recorded successfully.");
    setTimeout(() => setNotification(""), 3500);
  };

  const handleAcknowledge = (fbId) => {
    setFeedbackList(prev => prev.map(f => f.id === fbId ? { ...f, status: "Acknowledged" } : f));
    setNotification("Feedback acknowledged.");
    setTimeout(() => setNotification(""), 2500);
  };

  const filteredFeedback = feedbackList.filter(f => {
    if (filterFlow !== "all" && f.roleFlow !== filterFlow) return false;
    return true;
  });

  return (
    <div>
      {/* Top Banner */}
      <div style={{ border: "1px solid var(--border)", padding: "12px 16px", marginBottom: 16, backgroundColor: "#ffffff" }}>
        <h2 style={{ fontSize: 18, fontWeight: "bold", margin: 0 }}>
          Organizational Feedback &amp; Performance Review
        </h2>
        <div style={{ fontSize: 13, color: "var(--footer)", marginTop: 2 }}>
          Structured appraisal loops: Admin &rarr; Manager leadership evaluation, Manager &rarr; Employee reviews, and Employee &rarr; Manager feedback.
        </div>
      </div>

      {notification && (
        <div style={{ border: "1px solid var(--border)", padding: "8px 12px", marginBottom: 16, fontWeight: "bold", backgroundColor: "var(--body)" }}>
          Notice: {notification}
        </div>
      )}

      {/* Feedback Submission Form */}
      <div className="wt-card" style={{ marginBottom: 16 }}>
        <div className="wt-card-header">
          <h2 className="wt-card-title">
            Submit Feedback (Logged in as: {user?.name} - {user?.role?.toUpperCase()})
          </h2>
        </div>
        <form onSubmit={handleSendFeedback} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Recipient:</label>
              <select 
                className="form-control" 
                style={{ width: "100%" }}
                value={toUser}
                onChange={e => setToUser(e.target.value)}
              >
                {USERS.filter(u => u.id !== user?.id).map(u => (
                  <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
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
                <option value="Design Quality">Design Quality</option>
                <option value="Sprint Delivery">Sprint Delivery</option>
                <option value="Workflow & Tooling">Workflow &amp; Tooling</option>
                <option value="Communication & Teamwork">Communication &amp; Teamwork</option>
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
              placeholder="e.g. Sprint Milestone Review &amp; Code Quality Feedback" 
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
                placeholder="Provide constructive feedback, key accomplishments, or observations..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Action Items / Recommendations:</label>
              <textarea 
                className="form-control" 
                style={{ width: "100%", height: 75 }}
                placeholder="Suggested follow-up tasks, upskilling, or workflow improvements..."
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
            <h2 className="wt-card-title">Feedback Communication Records ({filteredFeedback.length})</h2>
            <div className="wt-card-subtitle">Complete review trail and action item tracking across the organization</div>
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
              <option value="Manager to Employee">Manager to Employee</option>
              <option value="Employee to Manager">Employee to Manager</option>
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
    </div>
  );
}
