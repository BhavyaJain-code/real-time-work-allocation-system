import { useState } from "react";
import { EMPLOYEES, getEmployeeUser } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

export default function RemoteMonitoring() {
  const { user, employee, managedDept } = useAuth();
  const isAdmin = user?.role === "admin";
  const isMgr = user?.role === "manager";
  const isEmp = user?.role === "employee";

  // State for Admin & Manager tabs
  const [activeTab, setActiveTab] = useState("active_idle");
  const [deptFilter, setDeptFilter] = useState(isMgr ? (managedDept || "All") : "All");

  // Mock hourly data
  const hourlyData = [
    { hour: "12am", active: 0, idle: 0 },
    { hour: "2am", active: 0, idle: 0 },
    { hour: "4am", active: 0, idle: 0 },
    { hour: "6am", active: 2, idle: 2 },
    { hour: "8am", active: 16, idle: 4 },
    { hour: "9am", active: 48, idle: 4 },
    { hour: "10am", active: 52, idle: 3 },
    { hour: "11am", active: 38, idle: 5 },
    { hour: "12pm", active: 37, idle: 6 },
    { hour: "1pm", active: 14, idle: 4 },
    { hour: "2pm", active: 16, idle: 3 },
    { hour: "3pm", active: 12, idle: 4 },
    { hour: "4pm", active: 8, idle: 3 },
    { hour: "5pm", active: 4, idle: 2 },
    { hour: "6pm", active: 3, idle: 2 },
    { hour: "8pm", active: 1, idle: 1 },
    { hour: "10pm", active: 0, idle: 0 },
  ];

  // If Employee, find their own employee record (or fallback to first matching user ID)
  const currentEmp = employee || EMPLOYEES.find(e => e.user_id === user?.id) || EMPLOYEES[0];

  // Employee personal timeline mock logs
  const employeeSessionLogs = [
    { time: "09:00 AM", event: "Shift Session Started", application: "System Login", category: "System", duration: "—", status: "active" },
    { time: "09:15 AM - 11:30 AM", event: "Code Implementation & Testing", application: "VS Code · User Dashboard API", category: "Development", duration: "2h 15m", status: "active" },
    { time: "11:30 AM - 12:15 PM", event: "Team Daily Standup & Sync", application: "Google Meet · Daily Sync", category: "Meeting", duration: "45m", status: "in_meeting" },
    { time: "12:15 PM - 12:40 PM", event: "Lunch & Rest Interval", application: "Screen Lock / Idle", category: "Break", duration: "25m", status: "idle" },
    { time: "12:40 PM - 02:30 PM", event: "Database Query Optimization", application: "DBeaver / PostgreSQL", category: "Database", duration: "1h 50m", status: "active" },
    { time: "02:30 PM - Present", event: "Active Component Refactoring", application: currentEmp?.current_activity || "VS Code · Frontend Architecture", category: "Development", duration: "Ongoing", status: "active" },
  ];

  // Manager/Admin filtered employees list
  const filteredEmployees = EMPLOYEES.filter(emp => {
    if (isMgr) {
      if (deptFilter === "All") {
        return managedDept ? emp.department === managedDept : true;
      }
      return emp.department === deptFilter;
    }
    if (isAdmin) {
      if (deptFilter === "All") return true;
      return emp.department === deptFilter;
    }
    return true;
  });

  // ─────────────────────────────────────────────────────────
  // 1. EMPLOYEE PERSONAL LIVE TELEMETRY VIEW
  // ─────────────────────────────────────────────────────────
  if (isEmp) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Personal Header Banner */}
        <div className="wt-card" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 className="wt-card-title" style={{ fontSize: 18, marginBottom: 4 }}>
                Personal Workstation Live Telemetry
              </h2>
              <div style={{ fontSize: 13, color: "#333333" }}>
                Staff: <strong>{user?.name}</strong> | Position: <strong>{currentEmp?.position}</strong> ({currentEmp?.department} Department)
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ textAlign: "right", fontSize: 12 }}>
                <div>Login Time: <strong>{currentEmp?.login_time || "09:00 AM"}</strong></div>
                <div>Agent Sync: <strong style={{ color: "#2f3f2f" }}>Active (2s latency)</strong></div>
              </div>
              <StatusBadge value={currentEmp?.remote_status || "active"} />
            </div>
          </div>
        </div>

        {/* Key Personal Metrics 4-Box */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          <div className="wt-card" style={{ padding: 14 }}>
            <div style={{ fontSize: 12, color: "#555" }}>Current Focus Application</div>
            <div style={{ fontSize: 14, fontWeight: "bold", marginTop: 4, color: "var(--header)" }}>
              {currentEmp?.current_activity || "VS Code · React Frontend"}
            </div>
          </div>

          <div className="wt-card" style={{ padding: 14 }}>
            <div style={{ fontSize: 12, color: "#555" }}>Active Working Time</div>
            <div style={{ fontSize: 16, fontWeight: "bold", marginTop: 4 }}>
              {currentEmp?.active_time || "5h 45m"}
            </div>
            <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>Shift Target: 8h 00m</div>
          </div>

          <div className="wt-card" style={{ padding: 14 }}>
            <div style={{ fontSize: 12, color: "#555" }}>Idle / Break Duration</div>
            <div style={{ fontSize: 16, fontWeight: "bold", marginTop: 4 }}>
              {currentEmp?.idle_time || "25m"}
            </div>
            <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>Allowed: up to 1h 00m</div>
          </div>

          <div className="wt-card" style={{ padding: 14 }}>
            <div style={{ fontSize: 12, color: "#555" }}>Daily Productivity Score</div>
            <div style={{ fontSize: 16, fontWeight: "bold", marginTop: 4, color: "var(--footer)" }}>
              {currentEmp?.productivity_score || 94}%
            </div>
            <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>Rating: High Output</div>
          </div>
        </div>

        {/* 2-Column: Personal Hourly Graph & Workstation Specs */}
        <div className="wt-grid-2x2">
          <div className="wt-card">
            <div className="wt-card-header">
              <h2 className="wt-card-title">My Hourly Activity Timeline</h2>
            </div>
            <div className="wt-hourly-chart">
              <div className="wt-hourly-bars">
                {hourlyData.map((d, i) => (
                  <div key={i} className="wt-hourly-col" title={d.hour + ": " + d.active + "m active, " + d.idle + "m idle"}>
                    <div className="wt-bar-idle" style={{ height: (d.idle / 60 * 100) + "%" }} />
                    <div className="wt-bar-active" style={{ height: (d.active / 60 * 100) + "%" }} />
                  </div>
                ))}
              </div>
              <div className="wt-hourly-labels">
                <span>12:00 am</span><span>6:00 am</span><span>12:00 pm</span><span>6:00 pm</span><span>10:00 pm</span>
              </div>
              <div className="wt-hourly-legend">
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "inline-block", width: 10, height: 10, backgroundColor: "var(--header)" }}></span>
                  Active Working
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "inline-block", width: 10, height: 10, backgroundColor: "var(--accent)" }}></span>
                  Idle / Break
                </span>
              </div>
            </div>
          </div>

          <div className="wt-card">
            <div className="wt-card-header">
              <h2 className="wt-card-title">Workstation Telemetry Diagnostics</h2>
            </div>
            <table className="wt-table">
              <tbody>
                <tr>
                  <td><strong>Workstation Protocol</strong></td>
                  <td>Secure TLS Background Telemetry</td>
                </tr>
                <tr>
                  <td><strong>Monitoring Status</strong></td>
                  <td>Continuous (Active Shift Window)</td>
                </tr>
                <tr>
                  <td><strong>Key & Mouse Capture</strong></td>
                  <td>Aggregated Velocity & Idle Interval Only</td>
                </tr>
                <tr>
                  <td><strong>Current Task Assigned</strong></td>
                  <td>Redesign login & auth UI</td>
                </tr>
                <tr>
                  <td><strong>Allocated Capacity</strong></td>
                  <td>{currentEmp?.workload_percentage || 65}% Assigned</td>
                </tr>
                <tr>
                  <td><strong>Burnout Risk Index</strong></td>
                  <td>{currentEmp?.burnout_risk || "Low"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Personal Session Activity Logs */}
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Today's Shift Activity & Focus History</h2>
          </div>
          <table className="wt-table">
            <thead>
              <tr>
                <th>Time Window</th>
                <th>Activity Description</th>
                <th>Application / Window</th>
                <th>Category</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employeeSessionLogs.map((log, index) => (
                <tr key={index}>
                  <td>{log.time}</td>
                  <td><strong>{log.event}</strong></td>
                  <td>{log.application}</td>
                  <td>{log.category}</td>
                  <td>{log.duration}</td>
                  <td><StatusBadge value={log.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // 2. MANAGER & ADMIN LIVE TELEMETRY VIEW
  // ─────────────────────────────────────────────────────────
  return (
    <div>
      {/* Role Header Banner with Department Filter if Manager or Admin */}
      <div className="wt-card" style={{ padding: "14px 18px", marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 className="wt-card-title" style={{ fontSize: 17, marginBottom: 2 }}>
              {isMgr ? `${managedDept || "Department"} Telemetry & Monitoring` : "Organization Live Telemetry"}
            </h2>
            <div style={{ fontSize: 13, color: "#444444" }}>
              {isMgr 
                ? `Real-time active/idle monitoring for ${managedDept || "assigned"} staff members.` 
                : "Real-time active/idle monitoring across all enterprise departments."}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {isAdmin && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: "bold" }}>Filter Department:</span>
                <select 
                  className="form-control"
                  style={{ width: "auto", padding: "4px 8px", fontSize: 13 }}
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Data">Data</option>
                </select>
              </div>
            )}
            {isMgr && (
              <div style={{ fontSize: 13 }}>
                Managing: <strong>{managedDept || "Engineering"}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Selectors */}
      <div style={{ display: "flex", gap: 4, borderBottom: "2px solid var(--border)", marginBottom: 16 }}>
        <button
          onClick={() => setActiveTab("active_idle")}
          className={"btn " + (activeTab === "active_idle" ? "btn-primary" : "btn-secondary")}
        >
          Active / Idle Report
        </button>
        <button
          onClick={() => setActiveTab("whats_now")}
          className={"btn " + (activeTab === "whats_now" ? "btn-primary" : "btn-secondary")}
        >
          Live Telemetry Feed
        </button>
        <button
          onClick={() => setActiveTab("in_office_remote")}
          className={"btn " + (activeTab === "in_office_remote" ? "btn-primary" : "btn-secondary")}
        >
          Remote vs. In-Office
        </button>
      </div>

      {/* TAB 1: Active / Idle Report */}
      {activeTab === "active_idle" && (
        <div>
          <div className="wt-grid-2x2">
            <div className="wt-card">
              <div className="wt-card-header">
                <h2 className="wt-card-title">
                  {isMgr ? `${managedDept || "Team"} Active / Idle Summary` : "Organization Active / Idle Summary"}
                </h2>
              </div>
              <table className="wt-table">
                <thead>
                  <tr><th>Category</th><th>Total Hours</th><th>Per Employee</th><th>Ratio</th></tr>
                </thead>
                <tbody>
                  <tr><td>Active Working</td><td>103h 28m</td><td>06h 05m</td><td>78%</td></tr>
                  <tr><td>Idle / Break</td><td>13h 02m</td><td>00h 46m</td><td>10%</td></tr>
                  <tr style={{ fontWeight: "bold" }}><td>Total Monitored</td><td>116h 30m</td><td>06h 51m</td><td>88%</td></tr>
                </tbody>
              </table>
            </div>

            <div className="wt-card">
              <div className="wt-card-header">
                <h2 className="wt-card-title">Hourly Activity (24 Hours)</h2>
              </div>
              <div className="wt-hourly-chart">
                <div className="wt-hourly-bars">
                  {hourlyData.map((d, i) => (
                    <div key={i} className="wt-hourly-col" title={d.hour + ": " + d.active + "m active, " + d.idle + "m idle"}>
                      <div className="wt-bar-idle" style={{ height: (d.idle / 60 * 100) + "%" }} />
                      <div className="wt-bar-active" style={{ height: (d.active / 60 * 100) + "%" }} />
                    </div>
                  ))}
                </div>
                <div className="wt-hourly-labels">
                  <span>12:00 am</span><span>6:00 am</span><span>12:00 pm</span><span>6:00 pm</span><span>10:00 pm</span>
                </div>
                <div className="wt-hourly-legend">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ display: "inline-block", width: 10, height: 10, backgroundColor: "var(--header)" }}></span>
                    Active
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ display: "inline-block", width: 10, height: 10, backgroundColor: "var(--accent)" }}></span>
                    Idle
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="wt-card">
            <div className="wt-card-header">
              <h2 className="wt-card-title">Staff Activity Logs</h2>
            </div>
            <table className="wt-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Current Status</th>
                  <th>Active Time</th>
                  <th>Idle Time</th>
                  <th>Productivity</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(emp => {
                  const u = getEmployeeUser(emp);
                  return (
                    <tr key={emp.id}>
                      <td><strong>{u?.name}</strong> ({emp.position})</td>
                      <td>{emp.department}</td>
                      <td><StatusBadge value={emp.remote_status} /></td>
                      <td><strong>{emp.active_time}</strong></td>
                      <td>{emp.idle_time}</td>
                      <td><strong>{emp.productivity_score}%</strong></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Live Telemetry Feed */}
      {activeTab === "whats_now" && (
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Live Real-Time Activity Feed</h2>
          </div>
          <table className="wt-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Current Active Application / Window</th>
                <th>Active Time</th>
                <th>Productivity</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => {
                const u = getEmployeeUser(emp);
                return (
                  <tr key={emp.id}>
                    <td><StatusBadge value={emp.remote_status} /></td>
                    <td><strong>{u?.name}</strong> ({emp.position})</td>
                    <td>{emp.department}</td>
                    <td>{emp.current_activity}</td>
                    <td>{emp.active_time}</td>
                    <td><strong>{emp.productivity_score}%</strong></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: Remote vs In-Office */}
      {activeTab === "in_office_remote" && (
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Remote vs. In-Office Performance Comparison</h2>
          </div>
          <table className="wt-table">
            <thead>
              <tr>
                <th>Work Mode</th>
                <th>Staff Count</th>
                <th>Active Ratio</th>
                <th>Productivity Index</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Remote Telemetry</td><td>{filteredEmployees.length} staff</td><td>85%</td><td>91%</td></tr>
              <tr><td>In-Office Onsite</td><td>0 staff</td><td>0%</td><td>0%</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
