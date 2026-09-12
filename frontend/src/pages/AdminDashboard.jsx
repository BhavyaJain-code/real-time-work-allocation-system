import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowRight, UserCheck, CheckCircle2, Clock, Users, Activity, Laptop, MonitorCheck, AlertTriangle } from "lucide-react";
import { TASKS, EMPLOYEES, TASK_ASSIGNMENTS, getEmployeeUser, getTask, getOverdueTasks } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [filterDept, setFilterDept] = useState("all");

  const totalTasks      = TASKS.length;
  const activeTasks     = TASKS.filter(t => t.status === "in_progress").length;
  const completedTasks  = TASKS.filter(t => t.status === "done").length;
  const activeNowCount  = EMPLOYEES.filter(e => e.remote_status === "active").length;
  const inMeetingCount  = EMPLOYEES.filter(e => e.remote_status === "in_meeting").length;
  const avgProductivity = Math.round(EMPLOYEES.reduce((acc, e) => acc + (e.productivity_score || 0), 0) / EMPLOYEES.length);

  // Features list exactly matching the user's uploaded screenshot
  const features = [
    {
      title: "Task Assignment",
      desc: "Allows administrators to assign tasks and responsibilities to staff members.",
      colorClass: "card-green-1",
      link: "/admin/tasks",
    },
    {
      title: "Task Details",
      desc: "Provides detailed task descriptions including deadlines, priorities, and instructions.",
      colorClass: "card-yellow",
      link: "/admin/tasks",
    },
    {
      title: "Staff Allocation",
      desc: "Assigns tasks based on staff expertise, qualifications, and availability.",
      colorClass: "card-peach",
      link: "/admin/assignments",
    },
    {
      title: "Task Tracking",
      desc: "Enables staff to monitor task progress and update completion status.",
      colorClass: "card-pink",
      link: "/admin/tasks",
    },
    {
      title: "Workload Distribution",
      desc: "Ensures balanced allocation of work across team members to prevent burnout.",
      colorClass: "card-blue",
      link: "/admin/analytics",
    },
    {
      title: "Task Reassignment",
      desc: "Allows reallocation of tasks based on changing workloads and schedule priorities.",
      colorClass: "card-green-2",
      link: "/admin/assignments",
    },
    {
      title: "Task History",
      desc: "Maintains records of completed and pending tasks for reporting and audit.",
      colorClass: "card-sand",
      link: "/admin/log",
    },
    {
      title: "Notifications & Reminders",
      desc: "Sends alerts for deadlines, assignments, and priority changes to staff.",
      colorClass: "card-green-3",
      link: "/admin/progress",
    },
  ];

  const filteredEmployees = EMPLOYEES.filter(e => filterDept === "all" || e.department === filterDept);

  return (
    <div>
      {/* Hero Section matching screenshot */}
      <div className="hero-section">
        <h1 className="hero-title">Work Allocation System</h1>
        <p className="hero-subtitle">
          The Work Allocation System ensures efficient task distribution, streamlined operations, and effective coordination among staff and administrators.
        </p>
      </div>

      {/* Features Section heading & 8 Pastel Cards matching screenshot */}
      <div style={{ marginBottom: 36 }}>
        <h2 className="section-heading">Features</h2>

        <div className="features-grid">
          {features.map((f, i) => (
            <div
              key={i}
              className={`feature-card ${f.colorClass}`}
              onClick={() => navigate(f.link)}
            >
              <h3 className="feature-card-title">{f.title}</h3>
              <p className="feature-card-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* WORKTIME REMOTE EMPLOYEE MONITORING PANEL */}
      <div className="content-panel" style={{ marginBottom: 32 }}>
        <div className="panel-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MonitorCheck size={20} color="#2563eb" />
              <h3 className="panel-title">Remote Employee Activity & Monitoring</h3>
            </div>
            <div className="panel-subtitle">
              Live tracking of remote staff active/idle hours, current task focus, and productivity scores (WorkTime format)
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span className="badge badge-green">🟢 {activeNowCount} Active Now</span>
            <span className="badge badge-purple">🟣 {inMeetingCount} In Meeting</span>
            <span className="badge badge-blue">⚡ {avgProductivity}% Avg Productivity</span>
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/admin/monitoring")}>
              Full Monitoring Hub →
            </button>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Remote Employee</th>
                <th>Current Status</th>
                <th>Logged In</th>
                <th>Active Time Today</th>
                <th>Idle Time</th>
                <th>Current Activity / Focus</th>
                <th>Productivity Score</th>
                <th>Workload Capacity</th>
              </tr>
            </thead>
            <tbody>
              {EMPLOYEES.map(emp => {
                const u = getEmployeeUser(emp);
                const wColor = emp.workload_percentage >= 85 ? "#ef4444" : emp.workload_percentage >= 60 ? "#f59e0b" : "#10b981";
                const pColor = emp.productivity_score >= 90 ? "#10b981" : emp.productivity_score >= 80 ? "#2563eb" : "#f59e0b";
                return (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "#111827" }}>{u?.name}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{emp.position} · {emp.department}</div>
                    </td>
                    <td>
                      <StatusBadge value={emp.remote_status} />
                    </td>
                    <td style={{ color: "#4b5563", fontSize: 12.5 }}>{emp.login_time}</td>
                    <td>
                      <strong style={{ color: "#15803d" }}>{emp.active_time}</strong>
                    </td>
                    <td style={{ color: "#b45309", fontSize: 12.5 }}>{emp.idle_time}</td>
                    <td>
                      <div style={{ fontSize: 12.5, color: "#1f2937", maxWidth: 220, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {emp.current_activity}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontWeight: 700, color: pColor, fontSize: 13 }}>{emp.productivity_score}%</span>
                        <span style={{ fontSize: 11, color: "#6b7280" }}>
                          {emp.productivity_score >= 90 ? "High" : emp.productivity_score > 0 ? "Good" : "—"}
                        </span>
                      </div>
                    </td>
                    <td style={{ minWidth: 130 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 3 }}>
                        <span>Workload</span>
                        <strong style={{ color: wColor }}>{emp.workload_percentage}%</strong>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${emp.workload_percentage}%`, background: wColor }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Queue & Workload Distribution */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, alignItems: "start" }}>
        {/* Active Task Queue */}
        <div className="content-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Active Task Queue</h3>
              <div className="panel-subtitle">{TASKS.length} total tasks scheduled in system</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={() => navigate("/admin/tasks/create")}>
                <Plus size={14} /> Add Task
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate("/admin/tasks")}>
                View All
              </button>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Deadline</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {TASKS.slice(0, 5).map(task => (
                  <tr key={task.id} style={{ cursor: "pointer" }} onClick={() => navigate("/admin/tasks")}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{task.title}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{task.estimated_hours} hours allocated</div>
                    </td>
                    <td style={{ color: "#4b5563" }}>{task.deadline}</td>
                    <td><StatusBadge value={task.priority} type="priority" /></td>
                    <td><StatusBadge value={task.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staff Workload Distribution */}
        <div className="content-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Burnout & Workload Distribution</h3>
              <div className="panel-subtitle">Overtime alerts and active capacity balance</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate("/admin/analytics")}>
              Analytics
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {EMPLOYEES.map(emp => {
              const u = getEmployeeUser(emp);
              const wColor = emp.workload_percentage >= 85 ? "#ef4444" : emp.workload_percentage >= 60 ? "#f59e0b" : "#10b981";
              return (
                <div key={emp.id} style={{ padding: "10px 12px", background: "#f9fafb", borderRadius: 8, border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 13.5 }}>{u?.name}</span>
                      <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 6 }}>({emp.department})</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {emp.burnout_risk === "High" && (
                        <span className="badge badge-red" style={{ fontSize: 10 }}>⚠️ Overtime Risk</span>
                      )}
                      <span style={{ fontSize: 12, fontWeight: 700, color: wColor }}>
                        {emp.workload_percentage}% Capacity
                      </span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${emp.workload_percentage}%`, background: wColor }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
