import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { EMPLOYEES, USERS, getEmployeeUser } from "../data/mockData";

const INITIAL_FEEDBACK = [
  {
    id: 1,
    fromName: "Alex Vance (Admin)",
    toName: "Ravi Kapoor (Manager)",
    roleFlow: "Admin to Manager",
    subject: "Q3 Sprint Delivery & Architecture Alignment",
    message: "Excellent leadership in coordinating the backend database migration. Ensure team workload remains balanced across junior developers.",
    date: "2026-08-20",
    status: "Acknowledged"
  },
  {
    id: 2,
    fromName: "Ravi Kapoor (Manager)",
    toName: "Priya Sharma (Employee)",
    roleFlow: "Manager to Employee",
    subject: "UI Component Refactor Commendation",
    message: "Great work completing the frontend components ahead of schedule. Your peer review notes have significantly assisted the team.",
    date: "2026-08-22",
    status: "Received"
  },
  {
    id: 3,
    fromName: "Nina Torres (Manager)",
    toName: "Elena Rostova (Employee)",
    roleFlow: "Manager to Employee",
    subject: "Design Token Library Handoff",
    message: "The design tokens and wireframes for the telemetry pages are clean and well structured. Excellent attention to typography guidelines.",
    date: "2026-08-24",
    status: "Received"
  }
];

export default function Feedback() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";

  const [feedbackList, setFeedbackList] = useState(INITIAL_FEEDBACK);
  const [toUser, setToUser] = useState(USERS[1]?.name || "Ravi Kapoor");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState("");

  const handleSendFeedback = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const newFb = {
      id: feedbackList.length + 1,
      fromName: user?.name + " (" + user?.role + ")",
      toName: toUser,
      roleFlow: isAdmin ? "Admin to Manager" : isManager ? "Manager to Employee" : "Peer Feedback",
      subject: subject.trim(),
      message: message.trim(),
      date: new Date().toISOString().split("T")[0],
      status: "Sent"
    };

    setFeedbackList([newFb, ...feedbackList]);
    setSubject("");
    setMessage("");
    setNotification("Feedback recorded and transmitted successfully.");
    setTimeout(() => setNotification(""), 3000);
  };

  return (
    <div>
      {/* Top Banner */}
      <div style={{ border: "1px solid #000000", padding: "12px 16px", marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: "bold", margin: 0 }}>
          Organizational Feedback &amp; Performance Review Channel
        </h2>
        <div style={{ fontSize: 13, color: "#444444", marginTop: 2 }}>
          Structured feedback loops: Admin &rarr; Manager leadership appraisal and Manager &rarr; Employee operational feedback.
        </div>
      </div>

      {notification && (
        <div style={{ border: "1px solid #000000", padding: "8px 12px", marginBottom: 16, fontWeight: "bold" }}>
          Notice: {notification}
        </div>
      )}

      {/* Feedback Submission Form */}
      <div className="wt-card" style={{ marginBottom: 16 }}>
        <div className="wt-card-header">
          <h2 className="wt-card-title">
            Submit Feedback ({isAdmin ? "Admin to Manager" : isManager ? "Manager to Employee" : "Performance Input"})
          </h2>
        </div>
        <form onSubmit={handleSendFeedback} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Recipient:</label>
              <select 
                className="form-control" 
                style={{ width: "100%" }}
                value={toUser}
                onChange={e => setToUser(e.target.value)}
              >
                {USERS.map(u => (
                  <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Subject / Area:</label>
              <input 
                type="text" 
                className="form-control" 
                style={{ width: "100%" }}
                placeholder="e.g. Sprint Delivery &amp; Code Quality" 
                value={subject}
                onChange={e => setSubject(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Feedback Observations &amp; Action Items:</label>
            <textarea 
              className="form-control" 
              style={{ width: "100%", height: 80 }}
              placeholder="Enter constructive feedback, observations, and recommendations..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start", padding: "8px 16px" }}>
            Submit Formal Feedback
          </button>
        </form>
      </div>

      {/* Feedback Log */}
      <div className="wt-card">
        <div className="wt-card-header">
          <h2 className="wt-card-title">Feedback Communication Records</h2>
        </div>

        <table className="wt-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Channel Flow</th>
              <th>From</th>
              <th>To</th>
              <th>Subject &amp; Remarks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {feedbackList.map(fb => (
              <tr key={fb.id}>
                <td>{fb.date}</td>
                <td><strong>{fb.roleFlow}</strong></td>
                <td>{fb.fromName}</td>
                <td>{fb.toName}</td>
                <td>
                  <strong>{fb.subject}</strong>
                  <div style={{ fontSize: 12, marginTop: 2, color: "#333333" }}>{fb.message}</div>
                </td>
                <td><strong>{fb.status}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
