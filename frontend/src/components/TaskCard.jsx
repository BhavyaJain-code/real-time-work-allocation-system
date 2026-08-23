import { Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import { getTaskSkills, getAssignmentEmployee, getEmployeeUser, TASK_ASSIGNMENTS, initials, avatarColors } from "../data/mockData";

export default function TaskCard({ task, onClick }) {
  const skills     = getTaskSkills(task.id);
  const assignment = TASK_ASSIGNMENTS.find(a => a.task_id === task.id);
  const assignee   = assignment ? getAssignmentEmployee(assignment) : null;
  const assigneeUser = assignee ? getEmployeeUser(assignee) : null;
  const av = assigneeUser ? avatarColors(assigneeUser.name) : null;

  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== "done";

  return (
    <motion.div
      className="task-card"
      onClick={onClick}
      whileHover={{ y: -3, transition: { type: "spring", stiffness: 400, damping: 22 } }}
      whileTap={{ scale: 0.985, transition: { type: "spring", stiffness: 500, damping: 25 } }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{ cursor: onClick ? "pointer" : "default", willChange: "transform" }}
    >
      <div className="task-card-head">
        <div>
          <div className="task-card-title">{task.title}</div>
          <div className="task-card-desc" style={{ marginTop: 4 }}>{task.description}</div>
        </div>
        <StatusBadge value={task.priority} type="priority" />
      </div>

      {skills.length > 0 && (
        <div className="emp-skills">
          {skills.map(s => (
            <motion.span
              key={s.id}
              className="skill-tag"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
            >
              {s.name}
            </motion.span>
          ))}
        </div>
      )}

      <div className="task-card-foot">
        <div className="flex items-center gap-2">
          <Calendar size={13} color="var(--muted)" />
          <span
            className="text-sm"
            style={{ color: isOverdue ? "var(--red)" : "var(--muted)", fontWeight: isOverdue ? 700 : 400 }}
          >
            {task.deadline}
          </span>
          <Clock size={13} color="var(--muted)" />
          <span className="text-sm text-muted">{task.estimated_hours}h</span>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge value={task.status} />
          {assigneeUser && (
            <motion.div
              className="avatar avatar-sm"
              title={assigneeUser.name}
              style={{ background: av.bg, color: av.color }}
              whileHover={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {initials(assigneeUser.name)}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
