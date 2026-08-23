import { motion } from "framer-motion";
import { getEmployeeUser, getEmployeeSkills, initials, avatarColors } from "../data/mockData";
import StatusBadge from "./StatusBadge";

export default function EmployeeCard({ employee, onClick }) {
  const user   = getEmployeeUser(employee);
  const skills = getEmployeeSkills(employee.id);
  const av     = avatarColors(user?.name || "");

  const workload = employee.workload_percentage;
  const wColor = workload >= 85 ? "var(--red)" : workload >= 60 ? "var(--amber)" : "var(--green)";

  return (
    <motion.div
      className="emp-card"
      onClick={onClick}
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 420, damping: 20 } }}
      whileTap={{ scale: 0.985, transition: { type: "spring", stiffness: 500, damping: 25 } }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.28 }}
      style={{ willChange: "transform" }}
    >
      <div className="emp-card-header">
        <motion.div
          className="avatar avatar-md"
          style={{ background: av.bg, color: av.color }}
          whileHover={{ rotate: [0, -6, 6, 0] }}
          transition={{ duration: 0.3 }}
        >
          {initials(user?.name)}
        </motion.div>
        <div className="emp-info">
          <div className="emp-name">{user?.name}</div>
          <div className="emp-position">{employee.position}</div>
          <div className="emp-department">{employee.department}</div>
        </div>
        <StatusBadge value={employee.availability_status} />
      </div>

      <div>
        <div className="emp-stats">
          <span>Workload</span>
          <span style={{ fontWeight: 700, color: wColor }}>{workload}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${workload}%` }}
            transition={{ duration: 0.85, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ background: wColor }}
          />
        </div>
      </div>

      {skills.length > 0 && (
        <div className="emp-skills">
          {skills.slice(0, 3).map(s => (
            <motion.span
              key={s.id}
              className="skill-tag"
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {s.name}
            </motion.span>
          ))}
          {skills.length > 3 && (
            <span className="skill-tag" style={{ background: "var(--border)", color: "var(--text-2)" }}>
              +{skills.length - 3}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
