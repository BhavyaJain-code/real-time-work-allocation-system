import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Plus, CheckSquare, Users, AlertCircle, Clock, Video, Laptop, Coffee } from "lucide-react";
import { TASKS, EMPLOYEES, TASK_ASSIGNMENTS, getEmployeeUser } from "../data/mockData";

export default function ManagerDashboard() {
  const { user, managedDept } = useAuth();
  const navigate = useNavigate();

  const departmentName = managedDept || "Engineering";
  const myEmployees = EMPLOYEES.filter(e => e.department === departmentName);
  const myEmpIds = myEmployees.map(e => e.id);
  const deptAssignments = TASK_ASSIGNMENTS.filter(a => myEmpIds.includes(a.employee_id));
  
  const activeCount = myEmployees.filter(e => e.remote_status === "active").length;
  const inMeetingCount = myEmployees.filter(e => e.remote_status === "in_meeting").length;
  const avgDeptScore = Math.round(myEmployees.reduce((a, b) => a + (b.productivity_score || 0), 0) / (myEmployees.length || 1));

  return (
    <div>
      {/* Department Lead Top Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, background: "#ffffff", padding: "14px 18px", borderRadius: 4, border: "1px solid var(--wt-border)" }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--wt-text-main)", margin: 0 }}>
            ⚡ {departmentName} Department Lead Dashboard
          </h2>
          <div style={{ fontSize: 12, color: "var(--wt-text-muted)" }}>
            Managing {myEmployees.length} team members · {activeCount} active right now · Avg Productivity: {avgDeptScore}%
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/manager/tasks")}>
            <Plus size={13} /> Assign Department Task
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("/manager/monitoring")}>
            Team Live Telemetry
          </button>
        </div>
      </div>

      {/* Quadrants for Department Manager */}
      <div className="wt-grid-2x2">
        {/* Quadrant 1: Team Members Live Focus */}
        <div className="wt-card">
          <div className="wt-card-header">
            <div>
              <h2 className="wt-card-title">Direct Reports Live Focus &amp; Status</h2>
              <div className="wt-card-subtitle">Real-time telemetry for {departmentName} team</div>
            </div>
            <span className="badge badge-green">🟢 {activeCount} Active</span>
          </div>

          <table className="wt-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Status</th>
                <th>Current Active Task / App</th>
                <th>Active Today</th>
              </tr>
            </thead>
            <tbody>
              {myEmployees.map(emp => {
                const u = getEmployeeUser(emp);
                return (
                  <tr key={emp.id}>
                    <td>
                      <strong>{u?.name}</strong>
                      <div style={{ fontSize: 11, color: "var(--wt-text-muted)" }}>{emp.position}</div>
                    </td>
                    <td>
                      {emp.remote_status === "active" ? (
                        <span><span className="wt-color-square sq-green" />Active</span>
                      ) : emp.remote_status === "in_meeting" ? (
                        <span><span className="wt-color-square sq-purple" />In Meeting</span>
                      ) : (
                        <span><span className="wt-color-square sq-yellow" />Idle</span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: 11.5, fontWeight: 500 }}>{emp.current_activity}</div>
                    </td>
                    <td><strong style={{ color: "#16a34a" }}>{emp.active_time}</strong></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="wt-card-footer-link">
            <span className="wt-table-link" onClick={() => navigate("/manager/monitoring")}>View Telemetry →</span>
          </div>
        </div>

        {/* Quadrant 2: Department Workload Capacity & Balancing */}
        <div className="wt-card">
          <div className="wt-card-header">
            <div>
              <h2 className="wt-card-title">Team Workload Capacity &amp; Balance</h2>
              <div className="wt-card-subtitle">Prevent bottlenecks and balance sprint workloads</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {myEmployees.map(emp => {
              const u = getEmployeeUser(emp);
              const wColor = emp.workload_percentage >= 85 ? "#ef4444" : emp.workload_percentage >= 60 ? "#f59e0b" : "#22c55e";
              return (
                <div key={emp.id} style={{ background: "#f8fafc", padding: "8px 12px", borderRadius: 4, border: "1px solid var(--wt-border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, fontSize: 12 }}>
                    <div>
                      <strong>{u?.name}</strong>
                      <span style={{ color: "#64748b", marginLeft: 6 }}>({emp.position})</span>
                    </div>
                    <span style={{ fontWeight: 700, color: wColor }}>
                      {emp.workload_percentage}% Capacity
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${emp.workload_percentage}%`, background: wColor }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="wt-card-footer-link">
            <span className="wt-table-link" onClick={() => navigate("/manager/assignments")}>Rebalance Staff →</span>
          </div>
        </div>
      </div>

      {/* Active Department Assignments Table */}
      <div className="wt-card">
        <div className="wt-card-header">
          <div>
            <h2 className="wt-card-title">{departmentName} Active Deliverables &amp; Assignments</h2>
            <div className="wt-card-subtitle">{deptAssignments.length} total tasks currently allocated</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/manager/assignments")}>
            <Plus size={12} /> Assign Task
          </button>
        </div>

        <table className="wt-table">
          <thead>
            <tr>
              <th>Task Deliverable</th>
              <th>Assigned Engineer</th>
              <th>Assigned Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {deptAssignments.map(a => {
              const task = TASKS.find(t => t.id === a.task_id);
              const emp = EMPLOYEES.find(e => e.id === a.employee_id);
              const u = getEmployeeUser(emp);
              return (
                <tr key={a.id}>
                  <td>
                    <strong>{task?.title}</strong>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Due: {task?.deadline} · {task?.estimated_hours} hrs</div>
                  </td>
                  <td>
                    <span className="wt-table-link">{u?.name}</span>
                  </td>
                  <td>{a.assigned_at}</td>
                  <td>
                    <span className={`badge ${a.status === "completed" ? "badge-green" : a.status === "in_progress" ? "badge-blue" : "badge-amber"}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
