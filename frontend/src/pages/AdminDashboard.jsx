import { useNavigate } from "react-router-dom";
import { ClipboardList, Users, CheckSquare, TrendingUp, ArrowRight, AlertCircle, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { TASKS, EMPLOYEES, TASK_ASSIGNMENTS, USERS, getEmployeeUser, getTask, initials, avatarColors, getOverdueTasks } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import { StaggerContainer, StaggerItem, AnimatedNumber, FadeIn } from "../components/motion/MotionPrimitives";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const totalTasks      = TASKS.length;
  const activeTasks     = TASKS.filter(t => t.status === "in_progress").length;
  const completedTasks  = TASKS.filter(t => t.status === "done").length;
  const activeEmployees = EMPLOYEES.filter(e => e.availability_status !== "offline").length;
  const completionRate  = Math.round((completedTasks / totalTasks) * 100);
  const overdueTasks    = getOverdueTasks();
  const overdueCount    = overdueTasks.length;

  const recentTasks = TASKS.slice(0, 5);
  const recentAssignments = TASK_ASSIGNMENTS.slice(0, 5);

  const stats = [
    { label: "Total Tasks",      value: totalTasks,      trend: "+40% this month" },
    { label: "Active Team",      value: activeEmployees, trend: `${EMPLOYEES.length} registered` },
    { label: "Tasks In Progress",value: activeTasks,     trend: `${completionRate}% done` },
    { label: "Overdue Alerts",   value: overdueCount,    trend: "Needs attention" },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Executive Dashboard</div>
          <div className="page-subtitle">Real-time Task & Team Workload Allocation</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <motion.button
            className="btn btn-accent"
            onClick={() => navigate("/admin/tasks")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <ClipboardList size={16} /> Manage Tasks
          </motion.button>
          <motion.button
            className="btn btn-primary"
            onClick={() => navigate("/admin/tasks/create")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            + Create Task
          </motion.button>
        </div>
      </div>

      {/* Top Row: Cobalt Stat Cards with Fuchsia Dots & Subtext */}
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

      {/* Middle Layout: Two Column & Sunset Banner */}
      <FadeIn delay={0.15}>
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
                <motion.div
                  key={task.id}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
                  onClick={() => navigate("/admin/tasks")}
                  whileHover={{ backgroundColor: "var(--surface-2)", x: 3, transition: { duration: 0.15 } }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{task.title}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Due {task.deadline} · {task.estimated_hours}h</div>
                  </div>
                  <StatusBadge value={task.priority} type="priority" />
                  <StatusBadge value={task.status} />
                </motion.div>
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
                const wColor = emp.workload_percentage >= 85 ? "#ee27d7" : emp.workload_percentage >= 60 ? "#f5d982" : "#10b981";
                return (
                  <motion.div
                    key={emp.id}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 18px", borderBottom: "1px solid var(--border)" }}
                    whileHover={{ backgroundColor: "var(--surface-2)", transition: { duration: 0.15 } }}
                  >
                    <div className="avatar avatar-sm" style={{ background: av.bg, color: av.color }}>{initials(user?.name)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
                      <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{emp.department}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 120 }}>
                      <div className="progress-bar" style={{ flex: 1 }}>
                        <motion.div
                          className="progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${emp.workload_percentage}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          style={{ background: `linear-gradient(90deg, #f5d982 0%, ${wColor} 100%)` }}
                        />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: wColor, minWidth: 32 }}>{emp.workload_percentage}%</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Recent Assignments Table */}
      <FadeIn delay={0.22}>
        <div className="card" style={{ marginTop: 20 }}>
          <div className="card-header">
            <span className="card-title">Live Assignments Log</span>
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
                  <th>Performance Score</th>
                </tr>
              </thead>
              <tbody>
                {recentAssignments.map(a => {
                  const task = getTask(a.task_id);
                  const emp  = EMPLOYEES.find(e => e.id === a.employee_id);
                  const user = emp ? getEmployeeUser(emp) : null;
                  const av   = avatarColors(user?.name || "");
                  return (
                    <motion.tr
                      key={a.id}
                      whileHover={{ backgroundColor: "var(--surface-2)" }}
                    >
                      <td className="td-bold" style={{ color: "#ffffff" }}>{task?.title}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="avatar avatar-sm" style={{ background: av.bg, color: av.color }}>{initials(user?.name)}</div>
                          <span style={{ fontWeight: 600 }}>{user?.name}</span>
                        </div>
                      </td>
                      <td className="td-muted">{a.assigned_at}</td>
                      <td><StatusBadge value={a.status} /></td>
                      <td style={{ fontWeight: 800, color: a.assignment_score >= 85 ? "#f5d982" : "#ff78ef" }}>
                        {a.assignment_score ? `${a.assignment_score} / 100` : "—"}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>

      {/* Overdue Alert Banner */}
      {overdueCount > 0 && (
        <FadeIn delay={0.28}>
          <div className="card" style={{ marginTop: 20, border: "1.5px solid var(--accent-border)", boxShadow: "0 6px 24px rgba(238, 39, 215, 0.25)" }}>
            <div className="card-header" style={{ background: "linear-gradient(135deg, rgba(238, 39, 215, 0.35) 0%, rgba(140, 15, 120, 0.2) 100%)", borderBottom: "1px solid var(--accent-border)" }}>
              <span className="card-title" style={{ color: "#ff78ef", display: "flex", alignItems: "center", gap: 8 }}>
                <AlertCircle size={18} color="#ff78ef" /> Critical Attention: {overdueCount} Overdue Tasks
              </span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Assigned To</th>
                    <th>Deadline</th>
                    <th>Priority</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueTasks.map(({ task, assignee }) => (
                    <tr key={task.id}>
                      <td className="td-bold" style={{ color: "#ff78ef" }}>{task.title}</td>
                      <td>
                        {assignee ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div className="avatar avatar-sm" style={{ background: avatarColors(assignee.name).bg, color: avatarColors(assignee.name).color }}>{initials(assignee.name)}</div>
                            <span style={{ fontWeight: 600, fontSize: 13 }}>{assignee.name}</span>
                          </div>
                        ) : <span className="td-muted">Unassigned</span>}
                      </td>
                      <td style={{ color: "#ff78ef", fontWeight: 800, fontSize: 13 }}>{task.deadline}</td>
                      <td><StatusBadge value={task.priority} type="priority" /></td>
                      <td><StatusBadge value={task.status} /></td>
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
