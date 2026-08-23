import { useNavigate } from "react-router-dom";
import { ClipboardList, Users, CheckSquare, Bell, ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  EMPLOYEES, TASKS, TASK_ASSIGNMENTS,
  getEmployeeUser, getTask, initials, avatarColors,
  getManagerEmployees, getOverdueTasks
} from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import { StaggerContainer, StaggerItem, AnimatedNumber, FadeIn } from "../components/motion/MotionPrimitives";

export default function ManagerDashboard() {
  const { user, managedDept } = useAuth();
  const navigate = useNavigate();

  // Only this dept's employees
  const myEmployees  = managedDept ? EMPLOYEES.filter(e => e.department === managedDept) : [];
  const myEmpIds     = myEmployees.map(e => e.id);

  // Assignments for my employees
  const myAssignments = TASK_ASSIGNMENTS.filter(a => myEmpIds.includes(a.employee_id));
  const active        = myAssignments.filter(a => a.status === "in_progress" || a.status === "assigned");
  const completed     = myAssignments.filter(a => a.status === "completed");
  const overdue       = getOverdueTasks().filter(({ task }) => {
    const assignment = TASK_ASSIGNMENTS.find(a => a.task_id === task.id);
    return assignment && myEmpIds.includes(assignment.employee_id);
  });

  const stats = [
    { label: "Dept Employees",  value: myEmployees.length,  bg: "var(--primary-lt)",   color: "var(--primary)",   icon: <Users size={18} /> },
    { label: "Active Tasks",    value: active.length,       bg: "var(--accent-lt)",    color: "var(--accent)",    icon: <ClipboardList size={18} /> },
    { label: "Completed",       value: completed.length,    bg: "var(--green-lt)",     color: "var(--green)",     icon: <CheckSquare size={18} /> },
    { label: "Overdue",         value: overdue.length,      bg: "var(--secondary-lt)", color: "var(--secondary-vibrant, #ff6584)", icon: <AlertCircle size={18} /> },
  ];

  const wColor = (pct) => pct >= 85 ? "var(--secondary)" : pct >= 60 ? "var(--accent)" : "var(--green)";

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{managedDept} Department</div>
          <div className="page-subtitle">Manager Dashboard · {user?.name}</div>
        </div>
        <motion.button
          className="btn btn-primary"
          onClick={() => navigate("/manager/tasks")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <ClipboardList size={15} /> Manage Tasks
        </motion.button>
      </div>

      <StaggerContainer className="stats-grid" staggerDelay={0.07}>
        {stats.map((s, i) => (
          <StaggerItem key={i}>
            <motion.div
              className="stat-card"
              whileHover={{ y: -3, transition: { type: "spring", stiffness: 450, damping: 22 } }}
            >
              <div className="stat-card-header">
                <span className="stat-label">{s.label}</span>
                <motion.div
                  className="stat-icon"
                  style={{ background: s.bg, color: s.color }}
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {s.icon}
                </motion.div>
              </div>
              <div className="stat-value">
                <AnimatedNumber value={s.value} />
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeIn delay={0.15}>
        <div className="grid-2" style={{ alignItems: "start" }}>
          {/* My Employees */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">My Team</span>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate("/manager/employees")}>
                View all <ArrowRight size={14} />
              </button>
            </div>
            {myEmployees.length === 0 ? (
              <div className="empty-state" style={{ padding: 32 }}><p>No employees in this department.</p></div>
            ) : myEmployees.map(emp => {
              const u  = getEmployeeUser(emp);
              const av = avatarColors(u?.name || "");
              const wc = wColor(emp.workload_percentage);
              return (
                <motion.div
                  key={emp.id}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderBottom: "1px solid var(--border)" }}
                  whileHover={{ backgroundColor: "var(--surface-2)", transition: { duration: 0.15 } }}
                >
                  <div className="avatar avatar-sm" style={{ background: av.bg, color: av.color }}>{initials(u?.name)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{u?.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{emp.position}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 110 }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${emp.workload_percentage}%` }}
                        transition={{ duration: 0.85, ease: "easeOut" }}
                        style={{ background: wc }}
                      />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: wc, minWidth: 30 }}>{emp.workload_percentage}%</span>
                  </div>
                  <StatusBadge value={emp.availability_status} />
                </motion.div>
              );
            })}
          </div>

          {/* Recent assignments in my dept */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Recent Assignments</span>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate("/manager/assignments")}>
                View all <ArrowRight size={14} />
              </button>
            </div>
            {myAssignments.length === 0 ? (
              <div className="empty-state" style={{ padding: 32 }}><p>No assignments yet.</p></div>
            ) : myAssignments.slice(0, 6).map(a => {
              const task = getTask(a.task_id);
              const emp  = EMPLOYEES.find(e => e.id === a.employee_id);
              const u    = emp ? getEmployeeUser(emp) : null;
              return (
                <motion.div
                  key={a.id}
                  style={{ padding: "11px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}
                  whileHover={{ backgroundColor: "var(--surface-2)" }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{task?.title}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{u?.name}</div>
                  </div>
                  <StatusBadge value={a.status} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </FadeIn>

      {/* Overdue in dept */}
      {overdue.length > 0 && (
        <FadeIn delay={0.25}>
          <div className="card" style={{ marginTop: 20, border: "1px solid rgba(185, 55, 90, 0.45)", boxShadow: "0 4px 20px rgba(118, 40, 61, 0.25)" }}>
            <div className="card-header" style={{ background: "linear-gradient(135deg, rgba(118, 40, 61, 0.4) 0%, rgba(185, 55, 90, 0.2) 100%)", borderBottom: "1px solid rgba(185, 55, 90, 0.35)" }}>
              <span className="card-title" style={{ color: "#ff7597", display: "flex", alignItems: "center", gap: 8 }}>
                <AlertCircle size={18} color="#ff7597" /> Overdue in {managedDept} ({overdue.length})
              </span>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Task</th><th>Assigned To</th><th>Deadline</th><th>Priority</th></tr></thead>
                <tbody>
                  {overdue.map(({ task, assignee }) => (
                    <tr key={task.id}>
                      <td className="td-bold" style={{ color: "#ff8da8" }}>{task.title}</td>
                      <td style={{ fontWeight: 600, fontSize: 13 }}>{assignee?.name || "Unassigned"}</td>
                      <td style={{ color: "#ff7597", fontWeight: 700, fontSize: 13 }}>{task.deadline}</td>
                      <td><StatusBadge value={task.priority} type="priority" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
