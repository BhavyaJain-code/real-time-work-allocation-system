import { useState } from "react";
import { EMPLOYEES, getEmployeeUser } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function RemoteMonitoring() {
  const [activeTab, setActiveTab] = useState("active_idle");

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

  return (
    <div>
      {/* Tab Selectors */}
      <div style={{ display: "flex", gap: 4, borderBottom: "2px solid var(--border)", marginBottom: 16 }}>
        <button
          onClick={() => setActiveTab("active_idle")}
          className={"btn " + (activeTab === "active_idle" ? "btn-primary" : "btn-secondary")}
        >
          Active / Idle Report
        </button>
        <button
          onClick={() => setActiveTab("summary")}
          className={"btn " + (activeTab === "summary" ? "btn-primary" : "btn-secondary")}
        >
          Executive Summary
        </button>
        <button
          onClick={() => setActiveTab("in_office_remote")}
          className={"btn " + (activeTab === "in_office_remote" ? "btn-primary" : "btn-secondary")}
        >
          Remote vs. In-Office
        </button>
        <button
          onClick={() => setActiveTab("whats_now")}
          className={"btn " + (activeTab === "whats_now" ? "btn-primary" : "btn-secondary")}
        >
          Live Telemetry Feed
        </button>
      </div>

      {activeTab === "active_idle" && (
        <div>
          <div className="wt-grid-2x2">
            <div className="wt-card">
              <div className="wt-card-header">
                <h2 className="wt-card-title">Active / Idle Summary</h2>
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
                {EMPLOYEES.map(emp => {
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
              {EMPLOYEES.map(emp => {
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

      {activeTab === "summary" && (
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Executive Summary Overview</h2>
          </div>
          <table className="wt-table">
            <thead>
              <tr>
                <th>Performance Category</th>
                <th>Total Hours</th>
                <th>Average / Staff</th>
                <th>Compliance</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Productive Engineering &amp; Design</td><td>99h 20m</td><td>06h 37m</td><td>Optimal</td></tr>
              <tr><td>Unproductive / Neutral Time</td><td>02h 00m</td><td>00h 08m</td><td>Normal</td></tr>
              <tr><td>Scheduled Break &amp; Idle Hours</td><td>25h 41m</td><td>01h 42m</td><td>Compliant</td></tr>
              <tr style={{ fontWeight: "bold" }}><td>Total Workload Logged</td><td>127h 50m</td><td>08h 31m</td><td>100%</td></tr>
            </tbody>
          </table>
        </div>
      )}

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
              <tr><td>Remote Telemetry</td><td>15 staff</td><td>85%</td><td>91%</td></tr>
              <tr><td>In-Office Onsite</td><td>0 staff</td><td>0%</td><td>0%</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
