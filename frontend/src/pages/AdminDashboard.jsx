import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowRight, MonitorCheck, Play, Pause, Download, ExternalLink } from "lucide-react";
import { TASKS, EMPLOYEES, getEmployeeUser } from "../data/mockData";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const totalTasks = TASKS.length;
  const inProgressTasks = TASKS.filter(t => t.status === "in_progress").length;
  const activeNow = EMPLOYEES.filter(e => e.remote_status === "active").length;

  const hourlyData = [
    { hour: "12am", active: 0, idle: 0 },
    { hour: "1am", active: 0, idle: 0 },
    { hour: "2am", active: 0, idle: 0 },
    { hour: "3am", active: 0, idle: 0 },
    { hour: "4am", active: 0, idle: 0 },
    { hour: "5am", active: 0, idle: 0 },
    { hour: "6am", active: 2, idle: 2 },
    { hour: "7am", active: 5, idle: 4 },
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
    { hour: "7pm", active: 3, idle: 1 },
    { hour: "8pm", active: 1, idle: 1 },
    { hour: "9pm", active: 1, idle: 0 },
    { hour: "10pm", active: 0, idle: 0 },
    { hour: "11pm", active: 0, idle: 0 },
  ];

  return (
    <div>
      {/* Top 2 Quadrants (Image 2) */}
      <div className="wt-grid-2x2">
        {/* Card 1: Active/idle */}
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Active/idle</h2>
          </div>
          <div className="wt-stat-block-row">
            <div className="wt-stat-side">
              <div className="wt-count-callout">
                <strong>15</strong> active employees <span style={{ color: "#64748b", fontSize: 11 }}>(out of 15)</span>
              </div>
              <table className="wt-mini-table">
                <thead>
                  <tr><th></th><th>Total time</th><th>Per empl/work day</th><th>%</th></tr>
                </thead>
                <tbody>
                  <tr><td><span className="wt-color-square sq-green" />Active</td><td>102:09:25</td><td>06:48:38</td><td><strong>85%</strong></td></tr>
                  <tr><td><span className="wt-color-square sq-yellow" />Idle</td><td>25:42:25</td><td>01:42:50</td><td>21%</td></tr>
                  <tr style={{ fontWeight: 700 }}><td>Total</td><td>127:51:50</td><td>08:31:28</td><td>107%</td></tr>
                </tbody>
              </table>
            </div>
            <div className="wt-donut-wrapper">
              <svg viewBox="0 0 36 36" width="110" height="110">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#22c55e" strokeWidth="6" strokeDasharray="74 100" strokeDashoffset="25" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="6" strokeDasharray="18 100" strokeDashoffset="-49" />
              </svg>
            </div>
          </div>
          <div className="wt-card-footer-link">
            <span className="wt-table-link" onClick={() => navigate("/admin/monitoring")}>More info</span>
          </div>
        </div>

        {/* Card 2: Productivity */}
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Productivity</h2>
          </div>
          <div className="wt-stat-block-row">
            <div className="wt-stat-side">
              <div className="wt-count-callout">
                <strong>15</strong> active employees <span style={{ color: "#64748b", fontSize: 11 }}>(out of 15)</span>
              </div>
              <table className="wt-mini-table">
                <thead>
                  <tr><th></th><th>Total time</th><th>Per empl/work day</th></tr>
                </thead>
                <tbody>
                  <tr><td><span className="wt-color-square sq-green" />Productive</td><td>99:20:29</td><td>06:37:22</td></tr>
                  <tr><td><span className="wt-color-square sq-red" />Unproductive</td><td>02:00:28</td><td>00:08:02</td></tr>
                  <tr><td><span className="wt-color-square sq-blue" /><a href="#!">Undefined</a></td><td>00:48:02</td><td>00:03:12</td></tr>
                  <tr><td><span className="wt-color-square sq-yellow" />Idle</td><td>25:41:50</td><td>01:42:47</td></tr>
                  <tr style={{ fontWeight: 700 }}><td>Total</td><td>127:50:49</td><td>08:31:23 (107%)</td></tr>
                </tbody>
              </table>
            </div>
            <div className="wt-donut-wrapper">
              <svg viewBox="0 0 36 36" width="110" height="110">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#22c55e" strokeWidth="6" strokeDasharray="72 100" strokeDashoffset="25" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" strokeWidth="6" strokeDasharray="4 100" strokeDashoffset="-47" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" strokeWidth="6" strokeDasharray="2 100" strokeDashoffset="-51" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="6" strokeDasharray="20 100" strokeDashoffset="-53" />
              </svg>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto", paddingTop: 10, fontSize: 11.5 }}>
            <span className="wt-table-link" onClick={() => navigate("/admin/monitoring")}>Assign productivity</span>
            <span className="wt-table-link" onClick={() => navigate("/admin/monitoring")}>More info</span>
          </div>
        </div>
      </div>

      {/* Middle 2 Quadrants */}
      <div className="wt-grid-2x2">
        {/* Card 3: Hourly Bars */}
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Active/idle per hour (average per employee/day)</h2>
          </div>
          <div className="wt-hourly-chart">
            <div className="wt-hourly-bars">
              {hourlyData.map((d, i) => (
                <div key={i} className="wt-hourly-col">
                  <div className="wt-bar-idle" style={{ height: (d.idle / 60 * 100) + "%" }} />
                  <div className="wt-bar-active" style={{ height: (d.active / 60 * 100) + "%" }} />
                </div>
              ))}
            </div>
            <div className="wt-hourly-labels">
              <span>12:00 am</span><span>4:00 am</span><span>8:00 am</span><span>12:00 pm</span><span>4:00 pm</span><span>8:00 pm</span><span>11:00 pm</span>
            </div>
            <div className="wt-hourly-legend">
              <span><span className="wt-color-square sq-green" />Active</span>
              <span><span className="wt-color-square sq-yellow" />Idle</span>
            </div>
          </div>
          <div className="wt-card-footer-link">
            <span className="wt-table-link" onClick={() => navigate("/admin/monitoring")}>More info</span>
          </div>
        </div>

        {/* Card 4: Attendance - work started */}
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Attendance - work started</h2>
          </div>
          <div className="wt-stat-block-row">
            <div className="wt-stat-side">
              <table className="wt-mini-table">
                <thead><tr><th>Event</th><th>Events#</th><th>Empl/day</th><th>%</th></tr></thead>
                <tbody>
                  <tr><td><span className="wt-color-square sq-green" />Early</td><td>4</td><td>4</td><td>27%</td></tr>
                  <tr><td><span className="wt-color-square sq-green" />On time</td><td>8</td><td>8</td><td><strong>53%</strong></td></tr>
                  <tr><td><span className="wt-color-square sq-yellow" />Late</td><td>3</td><td>3</td><td>20%</td></tr>
                  <tr><td>Off work</td><td>0</td><td>0</td><td>0%</td></tr>
                  <tr style={{ fontWeight: 700 }}><td>Total</td><td>15</td><td>15</td><td>100%</td></tr>
                </tbody>
              </table>
            </div>
            <div className="wt-donut-wrapper">
              <svg viewBox="0 0 36 36" width="110" height="110">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#22c55e" strokeWidth="6" strokeDasharray="80 100" strokeDashoffset="25" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="6" strokeDasharray="20 100" strokeDashoffset="-55" />
              </svg>
            </div>
          </div>
          <div className="wt-card-footer-link">
            <span className="wt-table-link" onClick={() => navigate("/admin/monitoring")}>More info</span>
          </div>
        </div>
      </div>

      {/* Bottom Wave: Active Time Progress */}
      <div className="wt-card" style={{ marginBottom: 20 }}>
        <div className="wt-card-header">
          <h2 className="wt-card-title">Active time progress</h2>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <div style={{ minWidth: 180 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#16a34a" }}>↑ 12%</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>Active time %: <strong style={{ color: "#1e293b" }}>86%</strong></div>
            <div style={{ fontSize: 11, color: "#64748b" }}>Total active: <strong style={{ color: "#1e293b" }}>2 063:54:50</strong></div>
            <div style={{ fontSize: 11, color: "#64748b" }}>Per empl/day: <strong style={{ color: "#1e293b" }}>06:15:15</strong></div>
          </div>
          <div style={{ flex: 1 }}>
            <svg viewBox="0 0 500 80" width="100%" height="90">
              <line x1="0" y1="24" x2="500" y2="24" stroke="#94a3b8" strokeDasharray="3 3" />
              <text x="5" y="20" fontSize="9" fill="#94a3b8">Goal 80%</text>
              <path d="M 0 80 Q 50 15 100 24 T 200 20 T 300 22 T 400 18 T 500 20 L 500 80 Z" fill="#fef3c7" opacity="0.8" />
              <path d="M 0 80 Q 50 20 100 24 T 200 20 T 300 22 T 400 18 T 500 20 L 500 80 Z" fill="#bbf7d0" opacity="0.9" />
              <path d="M 0 35 Q 50 15 100 24 T 200 20 T 300 22 T 400 18 T 500 20" fill="none" stroke="#16a34a" strokeWidth="2" />
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "#94a3b8" }}>
              <span>5/20</span><span>5/25</span><span>5/30</span><span>6/4</span><span>6/9</span><span>6/14</span><span>6/18</span>
            </div>
          </div>
        </div>
        <div className="wt-card-footer-link">
          <span className="wt-table-link" onClick={() => navigate("/admin/monitoring")}>More info</span>
        </div>
      </div>

      {/* Task Queue & Workload Allocation Panel */}
      <div className="wt-card">
        <div className="wt-card-header">
          <div>
            <h2 className="wt-card-title">Active Task Deliverables & Allocation</h2>
            <div className="wt-card-subtitle">{totalTasks} tasks managed across departments</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/admin/tasks/create")}>
            <Plus size={12} /> Add Task
          </button>
        </div>

        <table className="wt-table">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Department / Scope</th>
              <th>Hours</th>
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
                <td>{task.estimated_hours}h</td>
                <td>{task.deadline}</td>
                <td>
                  <span className={`badge ${task.priority === "critical" ? "badge-red" : task.priority === "high" ? "badge-amber" : "badge-blue"}`}>
                    {task.priority}
                  </span>
                </td>
                <td>
                  <span className={`badge ${task.status === "done" ? "badge-green" : task.status === "in_progress" ? "badge-blue" : "badge-gray"}`}>
                    {task.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
