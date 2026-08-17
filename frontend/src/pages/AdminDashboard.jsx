import { useNavigate } from "react-router-dom";
import { ClipboardList, Users, CheckSquare, TrendingUp, ArrowRight, AlertCircle } from "lucide-react";
import { TASKS, EMPLOYEES, TASK_ASSIGNMENTS, USERS, getEmployeeUser, getTask, initials, avatarColors } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import TaskCard from "../components/TaskCard";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const totalTasks      = TASKS.length;
  const activeTasks     = TASKS.filter(t => t.status === "in_progress").length;
  const completedTasks  = TASKS.filter(t => t.status === "done").length;
  const activeEmployees = EMPLOYEES.filter(e => e.availability_status !== "offline").length;
  const completionRate  = Math.round((completedTasks / totalTasks) * 100);
  const overdueCount    = TASKS.filter(t => t.deadline < new Date().toISOString().split("T")[0] && t.status !== "done").length;

  const recentTasks = TASKS.slice(0, 5);
  const recentAssignments = TASK_ASSIGNMENTS.slice(0, 5);

  const stats = [
    { label: "Total Tasks",      value: totalTasks,      icon: <ClipboardList size={18} />, bg: "var(--primary-lt)", color: "var(--primary)",  sub: `${activeTasks} in progress` },
    { label: "Active Employees", value: activeEmployees, icon: <Users size={18} />,         bg: "var(--green-lt)",   color: "var(--green)",    sub: `${EMPLOYEES.length} total` },
    { label: "Completed Tasks",  value: completedTasks,  icon: <CheckSquare size={18} />,   bg: "var(--blue-lt)",    color: "var(--blue)",     sub: `${completionRate}% rate` },
    { label: "Overdue Tasks",    value: overdueCount,    icon: <AlertCircle size={18} />,   bg: "var(--red-lt)",     color: "var(--red)",      sub: "Need attention" },
  ];

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-card-header">
              <span className="stat-label">{s.label}</span>
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid-2" style={{ alignItems: "start" }}>
        {/* Recent Tasks */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Tasks</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/admin/tasks")}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {recentTasks.map(task => (
              <div
                key={task.id}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
                onClick={() => navigate("/admin/tasks")}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{task.title}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Due {task.deadline}</div>
                </div>
                <StatusBadge value={task.priority} type="priority" />
                <StatusBadge value={task.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Employee Workload */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Employee Workload</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/admin/employees")}>
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ padding: "6px 0" }}>
            {EMPLOYEES.map(emp => {
              const user = getEmployeeUser(emp);
              const av   = avatarColors(user?.name || "");
              const wColor = emp.workload_percentage >= 85 ? "var(--red)" : emp.workload_percentage >= 60 ? "var(--amber)" : "var(--green)";
              return (
                <div key={emp.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 18px", borderBottom: "1px solid var(--border)" }}>
                  <div className="avatar avatar-sm" style={{ background: av.bg, color: av.color }}>{initials(user?.name)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{emp.department}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 120 }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className="progress-fill" style={{ width: `${emp.workload_percentage}%`, background: wColor }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: wColor, minWidth: 32 }}>{emp.workload_percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <span className="card-title">Recent Assignments</span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/admin/assignments")}>
            View all <ArrowRight size={14} />
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Employee</th>
                <th>Assigned At</th>
                <th>Status</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {recentAssignments.map(a => {
                const task = getTask(a.task_id);
                const emp  = EMPLOYEES.find(e => e.id === a.employee_id);
                const user = emp ? getEmployeeUser(emp) : null;
                const av   = avatarColors(user?.name || "");
                return (
                  <tr key={a.id}>
                    <td className="td-bold">{task?.title}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="avatar avatar-sm" style={{ background: av.bg, color: av.color }}>{initials(user?.name)}</div>
                        {user?.name}
                      </div>
                    </td>
                    <td className="td-muted">{a.assigned_at}</td>
                    <td><StatusBadge value={a.status} /></td>
                    <td className="td-bold">{a.assignment_score ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
