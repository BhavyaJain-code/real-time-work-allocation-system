import { useNavigate } from "react-router-dom";
import { ClipboardList, CheckSquare, Bell, Clock, ArrowRight, TrendingUp } from "lucide-react";
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

  const stats = [
    { label: "Active Tasks",    value: activeAssignments.length, trend: "In progress" },
    { label: "Completed Tasks", value: completedCount,           trend: "100% on-time" },
    { label: "Notifications",   value: unreadNotifs,             trend: "Action items" },
    { label: "Current Workload",value: employee.workload_percentage, suffix: "%", trend: `${employee.availability_status}` },
  ];

  const markRead = (id) => setNotifs(n => n.map(x => x.id === id ? { ...x, is_read: true } : x));

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Welcome back, {user?.name?.split(" ")[0]}!</div>
          <div className="page-subtitle">{employee.department} · {employee.position}</div>
        </div>
        <motion.button
          className="btn btn-primary"
          onClick={() => navigate("/employee/tasks")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <ClipboardList size={15} /> View My Tasks
        </motion.button>
      </div>

      {/* Top Cobalt Stat Cards with Fuchsia Dots & Subtext */}
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
                <AnimatedNumber value={s.value} suffix={s.suffix || ""} />
              </div>
              <div className="stat-sub">
                <TrendingUp size={14} color="#ee27d7" /> {s.trend}
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Workload Progress with Gradient */}
      <FadeIn delay={0.12}>
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-body">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Personal Workload Allocation</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>{employee.department} · Capacity Max: {employee.max_workload || 100}%</div>
              </div>
              <span style={{ fontWeight: 800, fontSize: 24, color: "#f5d982" }}>{employee.workload_percentage}%</span>
            </div>
            <div className="progress-bar" style={{ height: 10 }}>
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${employee.workload_percentage}%` }}
                transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ background: "linear-gradient(90deg, #f5d982 0%, #ee27d7 100%)" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "var(--muted)" }}>
              <span>0% (Available)</span>
              <StatusBadge value={employee.availability_status} />
              <span>100% (Full Cap)</span>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.18}>
        <div className="grid-2" style={{ alignItems: "start" }}>
          {/* Active Tasks */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">My Assigned Tasks</span>
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
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--text)" }}>{task.title}</div>
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
              <span className="card-title">Recent Alerts & Updates</span>
            </div>
            {notifs.length === 0 ? (
              <div className="empty-state" style={{ padding: 32 }}>
                <p>No notifications yet.</p>
              </div>
            ) : (
              notifs.slice(0, 4).map(n => (
                <NotificationItem key={n.id} notif={n} onMarkRead={markRead} />
              ))
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
