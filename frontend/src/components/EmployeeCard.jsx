import { getEmployeeUser, getEmployeeSkills, initials } from "../data/mockData";
import StatusBadge from "./StatusBadge";

export default function EmployeeCard({ employee, onClick }) {
  const user   = getEmployeeUser(employee);
  const skills = getEmployeeSkills(employee.id);

  const workload = employee.workload_percentage;
  const wColor = workload >= 85 ? "#ef4444" : workload >= 60 ? "#f59e0b" : "#10b981";

  return (
    <div
      className="emp-card"
      onClick={onClick}
      style={{ cursor: "pointer", background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <div
            style={{
              width: 36, height: 36, borderRadius: "50%", background: "#e0f2fe", color: "#0369a1",
              display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 13
            }}
          >
            {initials(user?.name)}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{user?.name}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{employee.position} · {employee.department}</div>
          </div>
        </div>
        <StatusBadge value={employee.remote_status || employee.availability_status} />
      </div>

      {/* Remote telemetry info (WorkTime style) */}
      <div style={{ background: "#f9fafb", borderRadius: 6, padding: "8px 10px", fontSize: 12, marginBottom: 12, border: "1px solid #f3f4f6" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ color: "#6b7280" }}>Active Time Today:</span>
          <strong style={{ color: "#15803d" }}>{employee.active_time || "—"}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ color: "#6b7280" }}>Productivity Rating:</span>
          <strong style={{ color: employee.productivity_score >= 90 ? "#10b981" : "#2563eb" }}>
            {employee.productivity_score ? `${employee.productivity_score}%` : "—"}
          </strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#6b7280" }}>Focus:</span>
          <span style={{ color: "#1f2937", maxWidth: 140, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {employee.current_activity || "Offline"}
          </span>
        </div>
      </div>

      {/* Workload */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
          <span style={{ color: "#6b7280" }}>Workload Capacity</span>
          <strong style={{ color: wColor }}>{workload}%</strong>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${workload}%`, background: wColor }}
          />
        </div>
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
          {skills.slice(0, 3).map(s => (
            <span key={s.id} className="skill-tag">
              {s.name}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="skill-tag" style={{ background: "#f3f4f6", color: "#6b7280" }}>
              +{skills.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
