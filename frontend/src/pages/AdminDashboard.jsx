import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TASKS, EMPLOYEES, getEmployeeUser } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const totalTasks = TASKS.length;
  const inProgressTasks = TASKS.filter(t => t.status === "in_progress").length;
  const completedTasks = TASKS.filter(t => t.status === "done").length;
  const activeNow = EMPLOYEES.filter(e => e.remote_status === "active").length;

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
      {/* Top Banner */}
      <div style={{ border: "1px solid #000000", padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: "bold", margin: 0 }}>
            Executive Administration &amp; Global Operations
          </h2>
          <div style={{ fontSize: 13, color: "#444444", marginTop: 2 }}>
            Organization overview: 3 departments, {EMPLOYEES.length} staff members, {totalTasks} scheduled deliverables.
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-primary" onClick={() => navigate("/admin/tasks/create")}>
            + Create Task
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/admin/monitoring")}>
            View Live Telemetry
          </button>
        </div>
      </div>

      {/* 2x2 Grid */}
      <div className="wt-grid-2x2">
        {/* Card 1: Active vs Idle */}
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Company Active / Idle Summary</h2>
          </div>
          <div>
            <div className="wt-count-callout">
              Total active staff: <strong>{activeNow}</strong> of <strong>{EMPLOYEES.length}</strong>
            </div>
            <table className="wt-table" style={{ marginBottom: 8 }}>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Total Hours</th>
                  <th>Per Empl / Day</th>
                  <th>Ratio</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Active Work</td>
                  <td>102h 09m</td>
                  <td>06h 48m</td>
                  <td><strong>85%</strong></td>
                </tr>
                <tr>
                  <td>Idle / Breaks</td>
                  <td>25h 42m</td>
                  <td>01h 42m</td>
                  <td>21%</td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td>Total Logged</td>
                  <td>127h 51m</td>
                  <td>08h 31m</td>
                  <td>107%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="wt-card-footer-link">
            <span className="wt-table-link" onClick={() => navigate("/admin/monitoring")}>[ Detailed Breakdown ]</span>
          </div>
        </div>

        {/* Card 2: Productivity Index */}
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Organization Productivity Index</h2>
          </div>
          <div>
            <div className="wt-count-callout">
              Average Productivity Rating: <strong>91%</strong>
            </div>
            <table className="wt-table" style={{ marginBottom: 8 }}>
              <thead>
                <tr>
                  <th>Classification</th>
                  <th>Total Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Productive Work</td>
                  <td>99h 20m</td>
                  <td>Normal</td>
                </tr>
                <tr>
                  <td>Neutral Communication</td>
                  <td>02h 00m</td>
                  <td>Normal</td>
                </tr>
                <tr>
                  <td>Idle / Break Time</td>
                  <td>25h 41m</td>
                  <td>Normal</td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td>Total Monitored</td>
                  <td>127h 50m</td>
                  <td>Good</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="wt-card-footer-link">
            <span className="wt-table-link" onClick={() => navigate("/admin/monitoring")}>[ Assign Weights ]</span>
          </div>
        </div>
      </div>

      {/* Hourly Chart & Attendance */}
      <div className="wt-grid-2x2">
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Hourly Activity Distribution (Company Average)</h2>
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
              <span>[Solid Black: Active]</span>
              <span>[Gray: Idle]</span>
            </div>
          </div>
        </div>

        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Attendance &amp; Check-in Log</h2>
          </div>
          <table className="wt-table">
            <thead>
              <tr>
                <th>Arrival Status</th>
                <th>Events</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Early Check-in</td>
                <td>4</td>
                <td>27%</td>
              </tr>
              <tr>
                <td>On-time (09:00 AM)</td>
                <td>8</td>
                <td><strong>53%</strong></td>
              </tr>
              <tr>
                <td>Late Check-in</td>
                <td>3</td>
                <td>20%</td>
              </tr>
              <tr style={{ fontWeight: "bold" }}>
                <td>Total Checked In</td>
                <td>15</td>
                <td>100%</td>
              </tr>
            </tbody>
          </table>
          <div className="wt-card-footer-link">
            <span className="wt-table-link" onClick={() => navigate("/admin/monitoring")}>[ Attendance Records ]</span>
          </div>
        </div>
      </div>

      {/* Master Task Queue */}
      <div className="wt-card">
        <div className="wt-card-header">
          <div>
            <h2 className="wt-card-title">Master Task Deliverables &amp; Workload Queue</h2>
            <div className="wt-card-subtitle">{totalTasks} tasks ({inProgressTasks} in progress, {completedTasks} completed)</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("/admin/tasks")}>
            View All Tasks
          </button>
        </div>

        <table className="wt-table">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Type / Scope</th>
              <th>Estimated Hours</th>
              <th>Deadline</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {TASKS.slice(0, 5).map(task => (
              <tr key={task.id} style={{ cursor: "pointer" }} onClick={() => navigate("/admin/tasks")}>
                <td><strong>{task.title}</strong></td>
                <td>{task.task_type}</td>
                <td>{task.estimated_hours} hrs</td>
                <td>{task.deadline}</td>
                <td><StatusBadge value={task.priority} type="priority" /></td>
                <td><StatusBadge value={task.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
