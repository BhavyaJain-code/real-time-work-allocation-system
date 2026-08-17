import { getEmployeeUser, getEmployeeSkills, initials, avatarColors } from "../data/mockData";
import StatusBadge from "./StatusBadge";

export default function EmployeeCard({ employee, onClick }) {
  const user   = getEmployeeUser(employee);
  const skills = getEmployeeSkills(employee.id);
  const av     = avatarColors(user?.name || "");

  const workload = employee.workload_percentage;
  const wColor = workload >= 85 ? "var(--red)" : workload >= 60 ? "var(--amber)" : "var(--green)";

  return (
    <div className="emp-card" onClick={onClick}>
      <div className="emp-card-header">
        <div className="avatar avatar-md" style={{ background: av.bg, color: av.color }}>
          {initials(user?.name)}
        </div>
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
          <div
            className="progress-fill"
            style={{ width: `${workload}%`, background: wColor }}
          />
        </div>
      </div>

      {skills.length > 0 && (
        <div className="emp-skills">
          {skills.slice(0, 3).map(s => (
            <span key={s.id} className="skill-tag">{s.name}</span>
          ))}
          {skills.length > 3 && (
            <span className="skill-tag" style={{ background: "var(--border)", color: "var(--text-2)" }}>
              +{skills.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
