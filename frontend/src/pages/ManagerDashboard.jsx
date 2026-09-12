import { useNavigate } from "react-router-dom";
import { ClipboardList, Users, UserCheck, Plus, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  TASKS, EMPLOYEES, TASK_ASSIGNMENTS,
  getEmployeeUser, getTask, getOverdueTasks
} from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function ManagerDashboard() {
  const { user, managedDept } = useAuth();
  const navigate = useNavigate();

  const myEmployees = EMPLOYEES.filter(e => e.department === managedDept);
  const myEmpIds    = myEmployees.map(e => e.id);

  const deptAssignments = TASK_ASSIGNMENTS.filter(a => myEmpIds.includes(a.employee_id));
  const activeTasks     = deptAssignments.filter(a => a.status === "in_progress").length;
  const completedTasks  = deptAssignments.filter(a => a.status === "completed").length;
  const availableEmps   = myEmployees.filter(e => e.availability_status === "available").length;

  const stats = [
    { label: "Team Members",     value: myEmployees.length, sub: `${managedDept} Department` },
    { label: "Active Tasks",     value: activeTasks,        sub: "Currently in progress" },
    { label: "Completed Tasks",  value: completedTasks,     sub: "Finished by team" },
    { label: "Available Now",    value: availableEmps,      sub: "Ready for tasks" },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{managedDept} Department Dashboard</div>
          <div className="page-subtitle">Manager view for task allocation and team status</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary" onClick={() => navigate("/manager/tasks")}>
            <ClipboardList size={15} /> Department Tasks
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/manager/tasks")}>
            <UserCheck size={15} /> Assign Task
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

      {/* Grid: Team Workload & Active Assignments */}
      <div className="grid-2" style={{ alignItems: "start" }}>
        {/* Team Members */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Team Workload ({myEmployees.length})</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/manager/employees")}>
              View All <ArrowRight size={13} />
            </button>
          </div>
          <div>
            {myEmployees.map(emp => {
              const u = getEmployeeUser(emp);
              const wColor = emp.workload_percentage >= 85 ? "#dc3545" : emp.workload_percentage >= 60 ? "#0d6efd" : "#198754";
              return (
                <div key={emp.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{u?.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{emp.position} · {emp.availability_status}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 120 }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className="progress-fill" style={{ width: `${emp.workload_percentage}%`, background: wColor }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: wColor, minWidth: 32 }}>{emp.workload_percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Assignments */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Current Assignments</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/manager/assignments")}>
              View All <ArrowRight size={13} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {deptAssignments.slice(0, 5).map(a => {
              const task = getTask(a.task_id);
              const emp  = EMPLOYEES.find(e => e.id === a.employee_id);
              const u    = emp ? getEmployeeUser(emp) : null;
              return (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{task?.title}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>Assigned to: {u?.name} ({a.assigned_at})</div>
                  </div>
                  <StatusBadge value={a.status} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
