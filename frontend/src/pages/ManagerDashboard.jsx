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

      {/* 1. What's Now Data (Live Team Telemetry) */}
      <div className="wt-card" style={{ marginBottom: 16 }}>
        <div className="wt-card-header">
          <div>
            <h2 className="wt-card-title">1. Live &quot;What&#39;s Now&quot; Team Telemetry Feed</h2>
            <div className="wt-card-subtitle">Real-time application windows and active working status for {departmentName}</div>
          </div>
          <span className="wt-table-link" onClick={() => navigate("/manager/monitoring")}>[ Full Telemetry ]</span>
        </div>
        <table className="wt-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Team Member</th>
              <th>Position</th>
              <th>Current Active Window / Task</th>
              <th>Active Hours</th>
              <th>Idle Hours</th>
              <th>Productivity</th>
            </tr>
          </thead>
          <tbody>
            {myEmployees.map(emp => {
              const u = getEmployeeUser(emp);
              return (
                <tr key={emp.id}>
                  <td><StatusBadge value={emp.remote_status} /></td>
                  <td><strong>{u?.name}</strong></td>
                  <td>{emp.position}</td>
                  <td>{emp.current_activity}</td>
                  <td><strong>{emp.active_time}</strong></td>
                  <td>{emp.idle_time}</td>
                  <td><strong>{emp.productivity_score}%</strong></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 2. Workload & Performance Review */}
      <div className="wt-card" style={{ marginBottom: 16 }}>
        <div className="wt-card-header">
          <div>
            <h2 className="wt-card-title">2. Workload Capacity &amp; Performance Review</h2>
            <div className="wt-card-subtitle">Capacity allocation and burnout risk for each staff member under your supervision</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("/manager/employees")}>
            Staff Directory ({myEmployees.length})
          </button>
        </div>
        <table className="wt-table">
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Position</th>
              <th>Assigned Tasks</th>
              <th>Workload Allocation</th>
              <th>Productivity Rating</th>
              <th>Burnout Risk</th>
              <th>Review Action</th>
            </tr>
          </thead>
          <tbody>
            {myEmployees.map(emp => {
              const u = getEmployeeUser(emp);
              const assignedCount = deptAssignments.filter(a => a.employee_id === emp.id).length;
              return (
                <tr key={emp.id}>
                  <td><strong>{u?.name}</strong></td>
                  <td>{emp.position}</td>
                  <td>{assignedCount} tasks</td>
                  <td><strong>{emp.workload_percentage}%</strong></td>
                  <td><strong>{emp.productivity_score}%</strong></td>
                  <td>{emp.burnout_risk || "Low"}</td>
                  <td>
                    <button 
                      className="btn btn-sm" 
                      onClick={() => navigate("/manager/progress")}
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 3. Tasks Info (Table) */}
      <div className="wt-card">
        <div className="wt-card-header">
          <div>
            <h2 className="wt-card-title">3. Department Tasks &amp; Deliverables Info</h2>
            <div className="wt-card-subtitle">{deptAssignments.length} active assignments in {departmentName}</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/manager/assignments")}>
            + Allocate Task
          </button>
        </div>

        <table className="wt-table">
          <thead>
            <tr>
              <th>Task Deliverable</th>
              <th>Assigned Staff</th>
              <th>Estimated Duration</th>
              <th>Deadline</th>
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
                    <div style={{ fontSize: 11, color: "#444444" }}>{task?.description}</div>
                  </td>
                  <td>
                    <strong>{u?.name}</strong>
                    <div style={{ fontSize: 11, color: "#444444" }}>{emp?.position}</div>
                  </td>
                  <td>{task?.estimated_hours} hrs</td>
                  <td><strong>{task?.deadline}</strong></td>
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
