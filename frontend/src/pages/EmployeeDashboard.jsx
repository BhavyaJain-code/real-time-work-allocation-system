import { useNavigate } from "react-router-dom";
import { ClipboardList, CalendarDays, Bell, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getEmployeeTasks, getEmployeeProgress, getEmployeeNotifications,
  getTaskSkills, TASK_TYPE_LABEL, TASK_TYPE_BADGE
} from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function EmployeeDashboard() {
  const { user, employee } = useAuth();
  const navigate = useNavigate();

  if (!employee) {
    return (
      <div className="card">
        <div className="empty-state">
          <h3>No Employee Profile Linked</h3>
          <p>Please contact the system administrator to link your profile.</p>
        </div>
      </div>
    );
  }

  const tasks    = getEmployeeTasks(employee.id);
  const progress = getEmployeeProgress(employee.id);
  const notifs   = getEmployeeNotifications(employee.id);

  const stats = [
    { label: "My Total Tasks", value: progress.total,      sub: `${progress.inProgress} in progress` },
    { label: "Completed",      value: progress.completed,  sub: `${progress.completionRate}% completion rate` },
    { label: "Workload",       value: `${employee.workload_percentage}%`, sub: `Status: ${employee.availability_status}` },
    { label: "Average Rating", value: progress.avgScore ? `${progress.avgScore}/100` : "N/A", sub: "Performance score" },
  ];

  const wColor = employee.workload_percentage >= 85 ? "#dc3545" : employee.workload_percentage >= 60 ? "#0d6efd" : "#198754";

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Welcome back, {user?.name}!</div>
          <div className="page-subtitle">{employee.position} · {employee.department} Department</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-primary" onClick={() => navigate("/employee/tasks")}>
            <ClipboardList size={15} /> View My Tasks
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <span className="stat-label">{s.label}</span>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        {/* Tasks list */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">My Assigned Tasks ({tasks.length})</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/employee/tasks")}>
              View All
            </button>
          </div>
          <div>
            {tasks.length === 0 ? (
              <div style={{ padding: 20, textAlign: "center", color: "var(--muted)" }}>No tasks currently assigned.</div>
            ) : tasks.slice(0, 5).map(task => (
              <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{task.title}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Due: {task.deadline} · {task.estimated_hours} hrs</div>
                </div>
                <StatusBadge value={task.priority} type="priority" />
                <StatusBadge value={task.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Notifications & Capacity */}
        <div>
          {/* Workload */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Current Workload Capacity</span>
            </div>
            <div className="card-body">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                <span>Workload: <strong>{employee.workload_percentage}%</strong></span>
                <span style={{ color: wColor, fontWeight: 600 }}>{employee.availability_status.toUpperCase()}</span>
              </div>
              <div className="progress-bar" style={{ height: 10 }}>
                <div className="progress-fill" style={{ width: `${employee.workload_percentage}%`, background: wColor }} />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Recent Notifications</span>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate("/employee/notifications")}>
                View All
              </button>
            </div>
            <div>
              {notifs.slice(0, 4).map(n => (
                <div key={n.id} style={{ padding: "9px 16px", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
                  <div>{n.message}</div>
                  <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>{new Date(n.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
