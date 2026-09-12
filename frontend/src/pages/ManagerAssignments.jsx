import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  TASK_ASSIGNMENTS, EMPLOYEES, TASKS,
  getEmployeeUser, getTask, initials
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
          <div className="page-subtitle">{myAssignments.length} total allocations for your managed team</div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAssign(true)}
        >
          <UserCheck size={15} /> Assign Task to Team
        </button>
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
              {myAssignments.length === 0 ? (
                <tr><td colSpan={7} className="empty-state">No assignments recorded for your department yet.</td></tr>
              ) : myAssignments.map(a => {
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
                          <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{emp?.position}</div>
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

      {showAssign && (
        <AssignTaskModal onClose={() => setShowAssign(false)} onAssign={handleAssign} />
      )}
    </div>
  );
}
