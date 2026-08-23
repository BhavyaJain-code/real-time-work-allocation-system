import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  TASK_ASSIGNMENTS, EMPLOYEES, TASKS,
  getEmployeeUser, getTask, initials, avatarColors
} from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import AssignTaskModal from "../components/AssignTaskModal";
import { UserCheck } from "lucide-react";

export default function ManagerAssignments() {
  const { managedDept } = useAuth();
  const [assignments, setAssignments] = useState(TASK_ASSIGNMENTS);
  const [showAssign, setShowAssign]   = useState(false);

  const myEmpIds = EMPLOYEES.filter(e => e.department === managedDept).map(e => e.id);
  const myAssignments = assignments.filter(a => myEmpIds.includes(a.employee_id));

  const stats = [
    { label: "Assigned",    value: myAssignments.filter(a => a.status === "assigned").length,    cls: "badge-indigo" },
    { label: "In Progress", value: myAssignments.filter(a => a.status === "in_progress").length, cls: "badge-blue" },
    { label: "Completed",   value: myAssignments.filter(a => a.status === "completed").length,   cls: "badge-green" },
  ];

  const handleAssign = (taskId, empId) => {
    const newA = {
      id: Date.now(), task_id: taskId, employee_id: empId,
      assigned_at: new Date().toISOString().split("T")[0],
      started_at: null, completed_at: null, assignment_score: null, status: "assigned",
    };
    setAssignments(a => [...a, newA]);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{managedDept} Assignments</div>
          <div className="page-subtitle">{myAssignments.length} total</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAssign(true)}>
          <UserCheck size={16} /> Assign Task
        </button>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {stats.map(s => (
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
                <th>#</th><th>Task</th><th>Employee</th>
                <th>Assigned At</th><th>Status</th><th>Score</th>
              </tr>
            </thead>
            <tbody>
              {myAssignments.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--muted)", padding: 28 }}>No assignments yet.</td></tr>
              ) : myAssignments.map(a => {
                const task = getTask(a.task_id);
                const emp  = EMPLOYEES.find(e => e.id === a.employee_id);
                const user = emp ? getEmployeeUser(emp) : null;
                const av   = avatarColors(user?.name || "");
                return (
                  <tr key={a.id}>
                    <td className="td-muted">#{a.id}</td>
                    <td>
                      <div className="td-bold">{task?.title || "—"}</div>
                      {task && <StatusBadge value={task.priority} type="priority" />}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="avatar avatar-sm" style={{ background: av.bg, color: av.color }}>{initials(user?.name)}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{user?.name || "—"}</div>
                          <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{emp?.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="td-muted">{a.assigned_at}</td>
                    <td><StatusBadge value={a.status} /></td>
                    <td style={{ fontWeight: 800, color: a.assignment_score >= 80 ? "var(--green)" : a.assignment_score ? "var(--amber)" : "var(--muted)" }}>
                      {a.assignment_score ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAssign && (
        <AssignTaskModal
          onClose={() => setShowAssign(false)}
          onAssign={handleAssign}
          limitEmpIds={myEmpIds}
        />
      )}
    </div>
  );
}
