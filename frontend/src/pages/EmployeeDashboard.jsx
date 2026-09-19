import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getEmployeeTasks, getEmployeeProgress, getEmployeeSkills } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function EmployeeDashboard() {
  const { user, employee } = useAuth();
  const navigate = useNavigate();

  const myEmp = employee || {
    id: 1,
    position: "Senior Frontend Dev",
    department: "Engineering",
    active_time: "5h 45m",
    idle_time: "25m",
    productivity_score: 94,
    login_time: "09:00 AM",
    workload_percentage: 65
  };

  const tasks = getEmployeeTasks(myEmp.id);
  const progress = getEmployeeProgress(myEmp.id);
  const skills = getEmployeeSkills(myEmp.id);

  return (
    <div>
      {/* Top Banner */}
      <div style={{ border: "1px solid #000000", padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: "bold", margin: 0 }}>
            Personal Workstation &amp; Shift Telemetry
          </h2>
          <div style={{ fontSize: 13, color: "#444444", marginTop: 2 }}>
            Logged in: <strong>{user?.name || "Priya Sharma"}</strong> ({myEmp.position} | {myEmp.department}) | Shift Started: {myEmp.login_time}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span className="badge">[Shift: Active]</span>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/employee/tasks")}>
            My Tasks ({tasks.length})
          </button>
        </div>
      </div>

      <div className="wt-grid-2x2">
        {/* Card 1: Shift Telemetry */}
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Daily Shift Activity</h2>
          </div>
          <table className="wt-table">
            <thead>
              <tr>
                <th>Telemetry Metric</th>
                <th>Recorded Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Active Working Time</td>
                <td><strong>{myEmp.active_time}</strong></td>
              </tr>
              <tr>
                <td>Idle / Breaks</td>
                <td><strong>{myEmp.idle_time}</strong></td>
              </tr>
              <tr>
                <td>Productivity Rating</td>
                <td><strong>{myEmp.productivity_score}%</strong></td>
              </tr>
              <tr>
                <td>Login Timestamp</td>
                <td>{myEmp.login_time} (On-Time)</td>
              </tr>
            </tbody>
          </table>
          <div className="wt-card-footer-link">
            <span className="wt-table-link" onClick={() => navigate("/employee/availability")}>[ Working Hours &amp; Schedule ]</span>
          </div>
        </div>

        {/* Card 2: Performance Progress */}
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Performance Progress &amp; Appraisal</h2>
          </div>
          <div style={{ border: "1px solid #000000", padding: "12px", marginBottom: 8, textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: "bold" }}>CURRENT APPRAISAL GRADE</div>
            <div style={{ fontSize: 22, fontWeight: "bold", margin: "4px 0" }}>GRADE: A (EXCELLENT)</div>
            <div style={{ fontSize: 12, color: "#444444" }}>Quarterly Evaluation</div>
          </div>
          <div style={{ fontSize: 13, marginBottom: 4 }}>
            <div>Task Completion: <strong>{progress.completionRate || 92}%</strong></div>
            <div>On-Time Rate: <strong>100%</strong></div>
            <div style={{ marginTop: 4 }}>Capacity Allocated: <strong>{myEmp.workload_percentage}%</strong></div>
            <div className="progress-bar" style={{ marginTop: 4 }}>
              <div className="progress-fill" style={{ width: myEmp.workload_percentage + "%" }} />
            </div>
          </div>
          <div className="wt-card-footer-link">
            <span className="wt-table-link" onClick={() => navigate("/employee/progress")}>[ View Progress Report ]</span>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="wt-card">
        <div className="wt-card-header">
          <div>
            <h2 className="wt-card-title">My Assigned Tasks &amp; Deliverables</h2>
            <div className="wt-card-subtitle">{tasks.length} total tasks assigned</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("/employee/tasks")}>
            Manage Tasks
          </button>
        </div>

        <table className="wt-table">
          <thead>
            <tr>
              <th>Task Deliverable</th>
              <th>Estimated Time</th>
              <th>Deadline</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(t => (
              <tr key={t.id}>
                <td>
                  <strong>{t.title}</strong>
                  <div style={{ fontSize: 11, color: "#444444" }}>{t.description}</div>
                </td>
                <td>{t.estimated_hours} hrs</td>
                <td><strong>{t.deadline}</strong></td>
                <td><StatusBadge value={t.priority} type="priority" /></td>
                <td><StatusBadge value={t.status} /></td>
                <td>
                  <button className="btn btn-sm" onClick={() => navigate("/employee/tasks")}>
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
