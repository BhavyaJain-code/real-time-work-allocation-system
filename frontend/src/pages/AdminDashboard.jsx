import { useNavigate } from "react-router-dom";
import { Plus, ArrowRight, UserCheck, CheckCircle2, Clock, Users } from "lucide-react";
import { TASKS, EMPLOYEES, TASK_ASSIGNMENTS, getEmployeeUser, getTask, getOverdueTasks } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const totalTasks      = TASKS.length;
  const activeTasks     = TASKS.filter(t => t.status === "in_progress").length;
  const completedTasks  = TASKS.filter(t => t.status === "done").length;
  const activeEmployees = EMPLOYEES.filter(e => e.availability_status !== "offline").length;

  const overdueTasks    = getOverdueTasks();

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

      {/* Interactive Quick Management Panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, alignItems: "start" }}>
        {/* Recent Tasks Panel */}
        <div className="content-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Active Task Queue</h3>
              <div className="panel-subtitle">{TASKS.length} total tasks registered in system</div>
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

        {/* Staff Workload Panel */}
        <div className="content-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Staff Workload Overview</h3>
              <div className="panel-subtitle">{EMPLOYEES.length} active team members</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate("/admin/employees")}>
              View All
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
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{u?.name}</span>
                      <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 6 }}>({emp.department})</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: wColor }}>
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
        </div>
      </div>
    </div>
  );
}
