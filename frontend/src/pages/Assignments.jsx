import { TASK_ASSIGNMENTS, EMPLOYEES, TASKS, getEmployeeUser, getTask, initials } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function Assignments() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Task Assignments Table</div>
          <div className="page-subtitle">{TASK_ASSIGNMENTS.length} total work allocations in database</div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
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
                return (
                  <tr key={a.id}>
                    <td className="td-muted">#{a.id}</td>
                    <td>
                      <div className="td-bold">{task?.title || "—"}</div>
                      <div style={{ marginTop: 2 }}>{task?.priority && <StatusBadge value={task.priority} type="priority" />}</div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="avatar avatar-sm" style={{ background: "#e9ecef", color: "#495057" }}>{initials(user?.name)}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{user?.name || "—"}</div>
                          <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{emp?.department} · {emp?.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="td-muted">{a.assigned_at}</td>
                    <td className="td-muted">{a.completed_at || "In Progress"}</td>
                    <td><StatusBadge value={a.status} /></td>
                    <td>
                      {a.assignment_score ? (
                        <span style={{ fontWeight: 600, color: "#0d6efd" }}>
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
