import { Calendar, Clock } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { getTaskSkills, getAssignmentEmployee, getEmployeeUser, TASK_ASSIGNMENTS, initials } from "../data/mockData";

export default function TaskCard({ task, onClick }) {
  const skills     = getTaskSkills(task.id);
  const assignment = TASK_ASSIGNMENTS.find(a => a.task_id === task.id);
  const assignee   = assignment ? getAssignmentEmployee(assignment) : null;
  const assigneeUser = assignee ? getEmployeeUser(assignee) : null;

  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== "done";

  return (
    <div
      className="task-card"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="task-card-head">
        <div>
          <div className="task-card-title">{task.title}</div>
          <div className="task-card-desc" style={{ marginTop: 3 }}>{task.description}</div>
        </div>
        <StatusBadge value={task.priority} type="priority" />
      </div>

      {skills.length > 0 && (
        <div className="emp-skills">
          {skills.map(s => (
            <span key={s.id} className="skill-tag">
              {s.name}
            </span>
          ))}
        </div>
      )}

      <div className="task-card-foot">
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Calendar size={12} color="var(--muted)" />
          <span
            style={{ color: isOverdue ? "#dc3545" : "var(--muted)", fontWeight: isOverdue ? 600 : 400 }}
          >
            {task.deadline}
          </span>
          <span style={{ color: "var(--muted)" }}>•</span>
          <Clock size={12} color="var(--muted)" />
          <span>{task.estimated_hours}h</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <StatusBadge value={task.status} />
          {assigneeUser && (
            <div
              className="avatar avatar-sm"
              title={assigneeUser.name}
              style={{ background: "#e9ecef", color: "#495057" }}
            >
              {initials(assigneeUser.name)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
