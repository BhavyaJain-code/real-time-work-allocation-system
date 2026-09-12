import { useNavigate } from "react-router-dom";
import { ClipboardList, Users, CheckSquare, AlertCircle, Plus, ArrowRight } from "lucide-react";
import { TASKS, EMPLOYEES, TASK_ASSIGNMENTS, getEmployeeUser, getTask, initials, avatarColors, getOverdueTasks } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const totalTasks      = TASKS.length;
  const activeTasks     = TASKS.filter(t => t.status === "in_progress").length;
  const completedTasks  = TASKS.filter(t => t.status === "done").length;
  const activeEmployees = EMPLOYEES.filter(e => e.availability_status !== "offline").length;
  const overdueTasks    = getOverdueTasks();
  const overdueCount    = overdueTasks.length;

  const recentTasks = TASKS.slice(0, 5);
  const recentAssignments = TASK_ASSIGNMENTS.slice(0, 5);

  const stats = [
    { label: "Total Tasks",      value: totalTasks,      sub: `${activeTasks} In Progress` },
    { label: "Total Employees",  value: EMPLOYEES.length, sub: `${activeEmployees} Active Now` },
    { label: "Completed Tasks",  value: completedTasks,  sub: "Successfully Finished" },
    { label: "Overdue Tasks",    value: overdueCount,    sub: "Action Required" },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Admin Dashboard</div>
          <div className="page-subtitle">Overview of tasks, employee workload, and allocation status</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary" onClick={() => navigate("/admin/tasks")}>
            <ClipboardList size={15} /> View Tasks
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/admin/tasks/create")}>
            <Plus size={15} /> Add Task
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Boxes */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ borderLeftColor: i === 3 && overdueCount > 0 ? "#dc3545" : "#0d6efd" }}>
            <span className="stat-label">{s.label}</span>
            <div className="stat-value" style={{ color: i === 3 && overdueCount > 0 ? "#dc3545" : "#212529" }}>
              {s.value}
            </div>
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
              View All <ArrowRight size={13} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {recentTasks.map(task => (
              <div
                key={task.id}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
                onClick={() => navigate("/admin/tasks")}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{task.title}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Deadline: {task.deadline} · {task.estimated_hours} hrs</div>
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
            <span className="card-title">Employee Workload Status</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/admin/employees")}>
              View All <ArrowRight size={13} />
            </button>
          </div>
          <div>
            {EMPLOYEES.map(emp => {
              const user = getEmployeeUser(emp);
              const wColor = emp.workload_percentage >= 85 ? "#dc3545" : emp.workload_percentage >= 60 ? "#0d6efd" : "#198754";
              return (
                <div
                  key={emp.id}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", borderBottom: "1px solid var(--border)" }}
                >
                  <div className="avatar avatar-sm" style={{ background: "#e9ecef", color: "#495057" }}>{initials(user?.name)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{user?.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{emp.department} · {emp.position}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 120 }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div
                        className="progress-fill"
                        style={{ width: `${emp.workload_percentage}%`, background: wColor }}
                      />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: wColor, minWidth: 32 }}>{emp.workload_percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header">
          <span className="card-title">Recent Task Allocations</span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/admin/assignments")}>
            View All <ArrowRight size={13} />
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Assigned Employee</th>
                <th>Date Assigned</th>
                <th>Status</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {recentAssignments.map(a => {
                const task = getTask(a.task_id);
                const emp  = EMPLOYEES.find(e => e.id === a.employee_id);
                const user = emp ? getEmployeeUser(emp) : null;
                return (
                  <tr key={a.id}>
                    <td className="td-bold">{task?.title}</td>
                    <td>{user?.name || "—"}</td>
                    <td className="td-muted">{a.assigned_at}</td>
                    <td><StatusBadge value={a.status} /></td>
                    <td><strong>{a.assignment_score ? `${a.assignment_score}/100` : "—"}</strong></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overdue Tasks Alert */}
      {overdueCount > 0 && (
        <div className="card" style={{ marginTop: 16, borderLeft: "4px solid #dc3545" }}>
          <div className="card-header" style={{ background: "#fff5f5" }}>
            <span className="card-title" style={{ color: "#dc3545", display: "flex", alignItems: "center", gap: 6 }}>
              <AlertCircle size={16} /> Overdue Tasks ({overdueCount})
            </span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Assigned To</th>
                  <th>Deadline</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {overdueTasks.map(({ task, assignee }) => (
                  <tr key={task.id}>
                    <td className="td-bold" style={{ color: "#dc3545" }}>{task.title}</td>
                    <td>{assignee?.name || "Unassigned"}</td>
                    <td style={{ color: "#dc3545", fontWeight: 600 }}>{task.deadline}</td>
                    <td><StatusBadge value={task.priority} type="priority" /></td>
                    <td><StatusBadge value={task.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
