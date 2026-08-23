import { useNavigate } from "react-router-dom";
import { ClipboardList, Users, CheckSquare, TrendingUp, ArrowRight, AlertCircle, ArrowUpRight } from "lucide-react";
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
    { label: "Team Members",    value: myEmployees.length,  trend: `${managedDept} Dept` },
    { label: "Active Tasks",    value: active.length,       trend: "+28% velocity" },
    { label: "Completed Tasks", value: completed.length,    trend: "100% on schedule" },
    { label: "Overdue Alerts",  value: overdue.length,      trend: "Requires review" },
  ];

  const wColor = (pct) => pct >= 85 ? "#ee27d7" : pct >= 60 ? "#f5d982" : "#10b981";

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{managedDept} Department Overview</div>
          <div className="page-subtitle">Manager Portal · {user?.name}</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <motion.button
            className="btn btn-accent"
            onClick={() => navigate("/manager/tasks")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <ClipboardList size={15} /> Department Tasks
          </motion.button>
          <motion.button
            className="btn btn-primary"
            onClick={() => navigate("/manager/assignments")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Assign Tasks
          </motion.button>
        </div>
      </div>

      {/* Top Cobalt Stat Cards */}
      <StaggerContainer className="stats-grid" staggerDelay={0.07}>
        {stats.map((s, i) => (
          <StaggerItem key={i}>
            <motion.div
              className="stat-card"
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 450, damping: 22 } }}
            >
              <div className="stat-card-header">
                <span className="stat-label">{s.label}</span>
                <span className="stat-dots">•••</span>
              </div>
              <div className="stat-value">
                <AnimatedNumber value={s.value} />
              </div>
              <div className="stat-sub">
                <TrendingUp size={14} color="#ee27d7" /> {s.trend}
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeIn delay={0.15}>
        <div className="grid-2" style={{ alignItems: "start" }}>
          {/* My Team Members */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">My Department Team</span>
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
                    <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)" }}>{u?.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{emp.position}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 120 }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${emp.workload_percentage}%` }}
                        transition={{ duration: 0.85, ease: "easeOut" }}
                        style={{ background: `linear-gradient(90deg, #f5d982 0%, ${wc} 100%)` }}
                      />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: wc, minWidth: 32 }}>{emp.workload_percentage}%</span>
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
            ) : myAssignments.slice(0, 5).map(a => {
              const task = getTask(a.task_id);
              const emp  = EMPLOYEES.find(e => e.id === a.employee_id);
              const u    = emp ? getEmployeeUser(emp) : null;
              return (
                <motion.div
                  key={a.id}
                  style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}
                  whileHover={{ backgroundColor: "var(--surface-2)" }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--text)" }}>{task?.title}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{u?.name} · Score: <span style={{ color: "#f5d982", fontWeight: 700 }}>{a.assignment_score ?? "—"}</span></div>
                  </div>
                  <StatusBadge value={a.status} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </FadeIn>

      {/* Overdue in dept banner */}
      {overdue.length > 0 && (
        <FadeIn delay={0.25}>
          <div className="card" style={{ marginTop: 20, border: "1.5px solid var(--accent-border)", boxShadow: "0 6px 24px rgba(238, 39, 215, 0.25)" }}>
            <div className="card-header" style={{ background: "linear-gradient(135deg, rgba(238, 39, 215, 0.35) 0%, rgba(140, 15, 120, 0.2) 100%)", borderBottom: "1px solid var(--accent-border)" }}>
              <span className="card-title" style={{ color: "#ff78ef", display: "flex", alignItems: "center", gap: 8 }}>
                <AlertCircle size={18} color="#ff78ef" /> Overdue in {managedDept} ({overdue.length})
              </span>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Task</th><th>Assigned To</th><th>Deadline</th><th>Priority</th></tr></thead>
                <tbody>
                  {overdue.map(({ task, assignee }) => (
                    <tr key={task.id}>
                      <td className="td-bold" style={{ color: "#ff78ef" }}>{task.title}</td>
                      <td style={{ fontWeight: 600, fontSize: 13 }}>{assignee?.name || "Unassigned"}</td>
                      <td style={{ color: "#ff78ef", fontWeight: 800, fontSize: 13 }}>{task.deadline}</td>
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
