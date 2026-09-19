import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TASKS, EMPLOYEES, TASK_ASSIGNMENTS, getEmployeeUser } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function ManagerDashboard() {
  const { user, managedDept } = useAuth();
  const navigate = useNavigate();

  const departmentName = managedDept || "Engineering";
  const myEmployees = EMPLOYEES.filter(e => e.department === departmentName);
  const myEmpIds = myEmployees.map(e => e.id);
  const deptAssignments = TASK_ASSIGNMENTS.filter(a => myEmpIds.includes(a.employee_id));
  
  const activeCount = myEmployees.filter(e => e.remote_status === "active").length;
  const avgDeptScore = Math.round(myEmployees.reduce((a, b) => a + (b.productivity_score || 0), 0) / (myEmployees.length || 1));

  return (
    <div>
      {/* Top Banner */}
      <div style={{ border: "1px solid #000000", padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: "bold", margin: 0 }}>
            {departmentName} Department Lead Dashboard
          </h2>
          <div style={{ fontSize: 13, color: "#444444", marginTop: 2 }}>
            Team Management: {myEmployees.length} staff members | {activeCount} currently active | Average Team Productivity: {avgDeptScore}%
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-primary" onClick={() => navigate("/manager/tasks")}>
            + Assign Task
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/manager/monitoring")}>
            Team Telemetry
          </button>
        </div>
      </div>

      <div className="wt-grid-2x2">
        {/* Team Live Status */}
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Team Active Status &amp; Focus</h2>
          </div>
          <table className="wt-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Status</th>
                <th>Current Focus Task</th>
                <th>Active Hours</th>
              </tr>
            </thead>
            <tbody>
              {myEmployees.map(emp => {
                const u = getEmployeeUser(emp);
                return (
                  <tr key={emp.id}>
                    <td>
                      <strong>{u?.name}</strong>
                      <div style={{ fontSize: 11, color: "#444444" }}>{emp.position}</div>
                    </td>
                    <td>
                      <StatusBadge value={emp.remote_status} />
                    </td>
                    <td>{emp.current_activity}</td>
                    <td><strong>{emp.active_time}</strong></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="wt-card-footer-link">
            <span className="wt-table-link" onClick={() => navigate("/manager/monitoring")}>[ Full Telemetry ]</span>
          </div>
        </div>

        {/* Team Capacity */}
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Team Workload Capacity &amp; Balance</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {myEmployees.map(emp => {
              const u = getEmployeeUser(emp);
              return (
                <div key={emp.id} style={{ border: "1px solid #000000", padding: "6px 10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                    <span><strong>{u?.name}</strong> ({emp.position})</span>
                    <span><strong>{emp.workload_percentage}%</strong></span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: emp.workload_percentage + "%" }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="wt-card-footer-link">
            <span className="wt-table-link" onClick={() => navigate("/manager/assignments")}>[ Reallocate Tasks ]</span>
          </div>
        </div>
      </div>

      {/* Active Department Assignments */}
      <div className="wt-card">
        <div className="wt-card-header">
          <div>
            <h2 className="wt-card-title">{departmentName} Active Deliverables</h2>
            <div className="wt-card-subtitle">{deptAssignments.length} total tasks assigned</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("/manager/assignments")}>
            Assign Task
          </button>
        </div>

        <table className="wt-table">
          <thead>
            <tr>
              <th>Task Deliverable</th>
              <th>Assigned Staff</th>
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
                    <div style={{ fontSize: 11, color: "#444444" }}>Deadline: {task?.deadline} | {task?.estimated_hours} hrs</div>
                  </td>
                  <td>
                    <span className="wt-table-link">{u?.name}</span>
                  </td>
                  <td>{a.assigned_at}</td>
                  <td><StatusBadge value={a.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
