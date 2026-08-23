import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  TASK_ASSIGNMENTS, EMPLOYEES, TASKS,
  getEmployeeUser, getTask, initials, avatarColors
} from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import AssignTaskModal from "../components/AssignTaskModal";
import { UserCheck, TrendingUp } from "lucide-react";
import { StaggerContainer, StaggerItem, AnimatedNumber } from "../components/motion/MotionPrimitives";
import { motion } from "framer-motion";

export default function ManagerAssignments() {
  const { managedDept } = useAuth();
  const [assignments, setAssignments] = useState(TASK_ASSIGNMENTS);
  const [showAssign, setShowAssign]   = useState(false);

  const myEmpIds = EMPLOYEES.filter(e => e.department === managedDept).map(e => e.id);
  const myAssignments = assignments.filter(a => myEmpIds.includes(a.employee_id));

  const stats = [
    { label: "Dept Assignments", value: myAssignments.length, trend: `${managedDept} team` },
    { label: "Assigned Queue",   value: myAssignments.filter(a => a.status === "assigned").length, trend: "Ready to start" },
    { label: "In Progress",      value: myAssignments.filter(a => a.status === "in_progress").length, trend: "Active work" },
    { label: "Completed",        value: myAssignments.filter(a => a.status === "completed").length, trend: "Done" },
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
          <div className="page-title">{managedDept} Assignments Registry</div>
          <div className="page-subtitle">{myAssignments.length} total allocations for your managed team</div>
        </div>
        <motion.button
          className="btn btn-primary"
          onClick={() => setShowAssign(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <UserCheck size={16} /> Assign Task to Team
        </motion.button>
      </div>

      {/* Cobalt Stat Cards */}
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
                          <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{emp?.position}</div>
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

      {showAssign && (
        <AssignTaskModal onClose={() => setShowAssign(false)} onAssign={handleAssign} />
      )}
    </div>
  );
}
