import { TASK_ASSIGNMENTS, EMPLOYEES, TASKS, getEmployeeUser, getTask, initials, avatarColors } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function Assignments() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Assignments</div>
          <div className="page-subtitle">{TASK_ASSIGNMENTS.length} total assignments</div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { label: "Assigned",    value: TASK_ASSIGNMENTS.filter(a => a.status === "assigned").length,    cls: "badge-indigo" },
          { label: "In Progress", value: TASK_ASSIGNMENTS.filter(a => a.status === "in_progress").length, cls: "badge-blue" },
          { label: "Completed",   value: TASK_ASSIGNMENTS.filter(a => a.status === "completed").length,   cls: "badge-green" },
          { label: "Cancelled",   value: TASK_ASSIGNMENTS.filter(a => a.status === "cancelled").length,   cls: "badge-red" },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <span className={`badge ${s.cls}`} style={{ alignSelf: "flex-start" }}>{s.label}</span>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Task</th>
                <th>Employee</th>
                <th>Assigned At</th>
                <th>Started At</th>
                <th>Completed At</th>
                <th>Status</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {TASK_ASSIGNMENTS.map(a => {
                const task = getTask(a.task_id);
                const emp  = EMPLOYEES.find(e => e.id === a.employee_id);
                const user = emp ? getEmployeeUser(emp) : null;
                const av   = avatarColors(user?.name || "");
                return (
                  <tr key={a.id}>
                    <td className="td-muted">#{a.id}</td>
                    <td>
                      <div className="td-bold">{task?.title || "—"}</div>
                      <div className="td-muted">{task?.priority && <StatusBadge value={task.priority} type="priority" />}</div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="avatar avatar-sm" style={{ background: av.bg, color: av.color }}>{initials(user?.name)}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{user?.name || "—"}</div>
                          <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{emp?.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="td-muted">{a.assigned_at}</td>
                    <td className="td-muted">{a.started_at || "—"}</td>
                    <td className="td-muted">{a.completed_at || "—"}</td>
                    <td><StatusBadge value={a.status} /></td>
                    <td>
                      {a.assignment_score ? (
                        <span style={{
                          fontWeight: 800, fontSize: 15,
                          color: a.assignment_score >= 80 ? "var(--green)" : a.assignment_score >= 60 ? "var(--amber)" : "var(--red)"
                        }}>
                          {a.assignment_score}
                        </span>
                      ) : "—"}
                    </td>
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
