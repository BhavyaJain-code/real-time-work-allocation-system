import { getEmployeeUser, getEmployeeSkills, initials, avatarColors } from "../data/mockData";
import StatusBadge from "./StatusBadge";

export default function EmployeeCard({ employee, onClick }) {
  const user   = getEmployeeUser(employee);
  const skills = getEmployeeSkills(employee.id);
  const av     = avatarColors(user?.name || "");

  const workload = employee.workload_percentage;
  const wColor = workload >= 85 ? "#dc3545" : workload >= 60 ? "#0d6efd" : "#198754";

  return (
    <div
      className="emp-card"
      onClick={onClick}
    >
      <div className="emp-card-header">
        <div
          className="avatar avatar-md"
          style={{ background: "#e9ecef", color: "#495057" }}
        >
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
          <span>Workload Capacity</span>
          <span style={{ fontWeight: 600, color: wColor }}>{workload}%</span>
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
            <span key={s.id} className="skill-tag">
              {s.name}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="skill-tag" style={{ background: "#f8f9fa", color: "#6c757d", border: "1px solid #ced4da" }}>
              +{skills.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
