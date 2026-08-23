import { useNavigate } from "react-router-dom";
import { ClipboardList, CheckSquare, Bell, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  TASKS, TASK_ASSIGNMENTS, NOTIFICATIONS, getTask, getEmployeeNotifications, getEmployeeAssignments
} from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import NotificationItem from "../components/Notification";
import { StaggerContainer, StaggerItem, AnimatedNumber, FadeIn } from "../components/motion/MotionPrimitives";
import { useState } from "react";

export default function EmployeeDashboard() {
  const { employee, user } = useAuth();
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState(
    employee ? getEmployeeNotifications(employee.id) : []
  );

  if (!employee) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><ClipboardList size={24} color="var(--muted)" /></div>
        <h3>No employee profile</h3>
        <p>Your account is not linked to an employee record yet.</p>
      </div>
    );
  }

  const assignments = getEmployeeAssignments(employee.id);
  const activeAssignments = assignments.filter(a => a.status === "in_progress" || a.status === "assigned");
  const completedCount    = assignments.filter(a => a.status === "completed").length;
  const unreadNotifs      = notifs.filter(n => !n.is_read).length;

  const wColor = employee.workload_percentage >= 85 ? "var(--red)" : employee.workload_percentage >= 60 ? "var(--amber)" : "var(--green)";

  const stats = [
    { label: "Active Tasks",    value: activeAssignments.length, icon: <ClipboardList size={18} />, bg: "var(--primary-lt)", color: "var(--primary)" },
    { label: "Completed",       value: completedCount,           icon: <CheckSquare size={18} />,   bg: "var(--green-lt)",   color: "var(--green)" },
    { label: "Notifications",   value: unreadNotifs,             icon: <Bell size={18} />,           bg: "var(--amber-lt)",   color: "var(--amber)" },
    { label: "Workload",        value: employee.workload_percentage, suffix: "%", icon: <Clock size={18} />, bg: "var(--blue-lt)", color: "var(--blue)" },
  ];

  const markRead = (id) => setNotifs(n => n.map(x => x.id === id ? { ...x, is_read: true } : x));

  return (
    <div>
      {/* Stats */}
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
                <AnimatedNumber value={s.value} suffix={s.suffix || ""} />
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Workload bar */}
      <FadeIn delay={0.12}>
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-body">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Your Workload</div>
                <div style={{ fontSize: 12.5, color: "var(--text-2)" }}>{employee.department} · {employee.position}</div>
              </div>
              <span style={{ fontWeight: 800, fontSize: 22, color: wColor }}>{employee.workload_percentage}%</span>
            </div>
            <div className="progress-bar" style={{ height: 10 }}>
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${employee.workload_percentage}%` }}
                transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ background: wColor }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12, color: "var(--muted)" }}>
              <span>0%</span>
              <StatusBadge value={employee.availability_status} />
              <span>100%</span>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.18}>
        <div className="grid-2" style={{ alignItems: "start" }}>
          {/* Active Tasks */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Active Tasks</span>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate("/employee/tasks")}>
                View all <ArrowRight size={14} />
              </button>
            </div>
            {activeAssignments.length === 0 ? (
              <div className="empty-state" style={{ padding: 32 }}>
                <p>No active tasks assigned.</p>
              </div>
            ) : (
              activeAssignments.map(a => {
                const task = getTask(a.task_id);
                if (!task) return null;
                return (
                  <motion.div
                    key={a.id}
                    style={{ padding: "13px 18px", borderBottom: "1px solid var(--border)", display: "flex", gap: 12, alignItems: "flex-start" }}
                    whileHover={{ backgroundColor: "var(--surface-2)" }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{task.title}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Due {task.deadline} · {task.estimated_hours}h</div>
                    </div>
                    <StatusBadge value={task.priority} type="priority" />
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Notifications */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Notifications</span>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate("/employee/notifications")}>
                View all <ArrowRight size={14} />
              </button>
            </div>
            {notifs.slice(0, 4).map(n => (
              <NotificationItem key={n.id} notif={n} onRead={markRead} />
            ))}
            {notifs.length === 0 && (
              <div className="empty-state" style={{ padding: 32 }}><p>No notifications.</p></div>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
