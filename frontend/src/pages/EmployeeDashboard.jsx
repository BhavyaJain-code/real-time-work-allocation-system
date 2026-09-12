import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ClipboardList, Clock, Star, CheckCircle2, Laptop, Calendar, Award, Play } from "lucide-react";
import { getEmployeeTasks, getEmployeeProgress, getEmployeeSkills, getTaskSkills } from "../data/mockData";

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
      {/* Employee Top Workstation Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, background: "#ffffff", padding: "14px 18px", borderRadius: 4, border: "1px solid var(--wt-border)" }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--wt-text-main)", margin: 0 }}>
            💻 Personal Workstation &amp; Shift Telemetry
          </h2>
          <div style={{ fontSize: 12, color: "var(--wt-text-muted)" }}>
            Welcome back, <strong>{user?.name || "Priya Sharma"}</strong> ({myEmp.position} · {myEmp.department}) · Shift Started at {myEmp.login_time}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className="badge badge-green">🟢 Shift Active</span>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/employee/tasks")}>
            <ClipboardList size={13} /> My Tasks ({tasks.length})
          </button>
        </div>
      </div>

      {/* Top 2 Quadrants for Employee */}
      <div className="wt-grid-2x2">
        {/* Card 1: My Daily Shift Telemetry */}
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">My Shift Telemetry Today</h2>
            <span className="badge badge-blue">WorkTime Live</span>
          </div>

          <div className="wt-stat-block-row">
            <div className="wt-stat-side">
              <table className="wt-mini-table">
                <thead>
                  <tr><th>Metric</th><th>Today&apos;s Value</th></tr>
                </thead>
                <tbody>
                  <tr><td><span className="wt-color-square sq-green" />Active Time</td><td><strong style={{ color: "#16a34a" }}>{myEmp.active_time}</strong></td></tr>
                  <tr><td><span className="wt-color-square sq-yellow" />Idle / Breaks</td><td><strong style={{ color: "#d97706" }}>{myEmp.idle_time}</strong></td></tr>
                  <tr><td><span className="wt-color-square sq-blue" />Productivity Index</td><td><strong style={{ color: "#2563eb" }}>{myEmp.productivity_score}% (High)</strong></td></tr>
                  <tr><td><span className="wt-color-square sq-gray" />Shift Check-in</td><td>{myEmp.login_time} (On-Time)</td></tr>
                </tbody>
              </table>
            </div>

            <div className="wt-donut-wrapper">
              <svg viewBox="0 0 36 36" width="110" height="110">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#22c55e" strokeWidth="6" strokeDasharray="80 100" strokeDashoffset="25" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="6" strokeDasharray="12 100" strokeDashoffset="-55" />
              </svg>
            </div>
          </div>

          <div className="wt-card-footer-link">
            <span className="wt-table-link" onClick={() => navigate("/profile")}>View Settings →</span>
          </div>
        </div>

        {/* Card 2: My Performance & Appraisal Summary */}
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">My Performance &amp; Progress Rating</h2>
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ background: "#fce9db", padding: "16px", borderRadius: 4, textAlign: "center", minWidth: 130 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9a3412", textTransform: "uppercase" }}>Current Grade</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#c2410c", margin: "4px 0" }}>EXCELLENT (A+)</div>
              <div style={{ fontSize: 10.5, color: "#7c2d12" }}>Q3 Progress Review</div>
            </div>

            <div style={{ flex: 1, fontSize: 12 }}>
              <div style={{ marginBottom: 4 }}><strong>Task Completion:</strong> {progress.completionRate || 92}%</div>
              <div style={{ marginBottom: 4 }}><strong>On-Time Delivery:</strong> 100%</div>
              <div style={{ marginBottom: 6 }}><strong>Active Workload:</strong> {myEmp.workload_percentage}% capacity</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${myEmp.workload_percentage}%`, background: "#2563eb" }} />
              </div>
            </div>
          </div>

          <div className="wt-card-footer-link">
            <span className="wt-table-link" onClick={() => navigate("/admin/progress")}>Open Official Progress Report →</span>
          </div>
        </div>
      </div>

      {/* My Assigned Tasks List */}
      <div className="wt-card">
        <div className="wt-card-header">
          <div>
            <h2 className="wt-card-title">My Assigned Tasks &amp; Active Deliverables</h2>
            <div className="wt-card-subtitle">{tasks.length} tasks scheduled on my backlog</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("/employee/tasks")}>
            Task Manager
          </button>
        </div>

        <table className="wt-table">
          <thead>
            <tr>
              <th>Task Description</th>
              <th>Estimated Hours</th>
              <th>Deadline</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Quick Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(t => (
              <tr key={t.id}>
                <td>
                  <strong>{t.title}</strong>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{t.description}</div>
                </td>
                <td>{t.estimated_hours} hrs</td>
                <td><strong>{t.deadline}</strong></td>
                <td>
                  <span className={`badge ${t.priority === "critical" ? "badge-red" : t.priority === "high" ? "badge-amber" : "badge-blue"}`}>
                    {t.priority}
                  </span>
                </td>
                <td>
                  <span className={`badge ${t.status === "done" ? "badge-green" : t.status === "in_progress" ? "badge-blue" : "badge-gray"}`}>
                    {t.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate("/employee/tasks")}>
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
