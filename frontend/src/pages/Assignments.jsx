import { TASK_ASSIGNMENTS, EMPLOYEES, TASKS, getEmployeeUser, getTask, initials, avatarColors } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function Assignments() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Work Allocations Registry</div>
          <div className="page-subtitle">{TASK_ASSIGNMENTS.length} total active and completed assignments</div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Task Details</th>
                <th>Assigned Employee</th>
                <th>Assigned Date</th>
                <th>Completed Date</th>
                <th>Status</th>
                <th>Evaluation Score</th>
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
                      <div className="td-bold" style={{ color: "var(--text)" }}>{task?.title || "—"}</div>
                      <div style={{ marginTop: 4 }}>{task?.priority && <StatusBadge value={task.priority} type="priority" />}</div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="avatar avatar-sm" style={{ background: av.bg, color: av.color }}>{initials(user?.name)}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{user?.name || "—"}</div>
                          <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{emp?.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="td-muted">{a.assigned_at}</td>
                    <td className="td-muted">{a.completed_at || "In Progress"}</td>
                    <td><StatusBadge value={a.status} /></td>
                    <td>
                      {a.assignment_score ? (
                        <span style={{ fontWeight: 800, color: "#f5d982", fontSize: 13.5 }}>
                          {a.assignment_score} / 100
                        </span>
                      ) : (
                        <span className="td-muted">—</span>
                      )}
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
