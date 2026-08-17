import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Briefcase, Building } from "lucide-react";
import {
  EMPLOYEES, USERS, AVAILABILITY,
  getEmployeeUser, getEmployeeSkills, getEmployeeAssignments,
  getTask, initials, avatarColors, STATUS_LABEL
} from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const emp  = EMPLOYEES.find(e => e.id === Number(id));
  const user = emp ? getEmployeeUser(emp) : null;

  if (!emp || !user) {
    return (
      <div className="card"><div className="empty-state"><h3>Employee not found</h3></div></div>
    );
  }

  const skills      = getEmployeeSkills(emp.id);
  const assignments = getEmployeeAssignments(emp.id);
  const availability = AVAILABILITY.filter(a => a.employee_id === emp.id);
  const av = avatarColors(user.name);
  const wColor = emp.workload_percentage >= 85 ? "var(--red)" : emp.workload_percentage >= 60 ? "var(--amber)" : "var(--green)";

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("/admin/employees")}>
          <ArrowLeft size={14} /> Back to Employees
        </button>
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        {/* Profile card */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="card">
            <div className="profile-header">
              <div className="avatar avatar-xl" style={{ background: av.bg, color: av.color }}>
                {initials(user.name)}
              </div>
              <div className="profile-info">
                <h2>{user.name}</h2>
                <p>{emp.position} · {emp.department}</p>
                <div className="profile-meta">
                  <StatusBadge value={emp.availability_status} />
                  <span className="badge badge-gray">
                    <Mail size={11} /> {user.email}
                  </span>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span style={{ fontWeight: 600 }}>Workload</span>
                  <span style={{ fontWeight: 700, color: wColor }}>{emp.workload_percentage}%</span>
                </div>
                <div className="progress-bar" style={{ height: 8 }}>
                  <div className="progress-fill" style={{ width: `${emp.workload_percentage}%`, background: wColor }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  ["Department",   emp.department,    <Building size={14} />],
                  ["Position",     emp.position,      <Briefcase size={14} />],
                  ["Max Workload", `${emp.max_workload}%`, null],
                  ["Member Since", user.created_at,   null],
                ].map(([k, v, icon]) => (
                  <div key={k} style={{ padding: "10px 12px", background: "var(--surface-2)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{k}</div>
                    <div style={{ fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>{icon}{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <div className="card-header"><span className="card-title">Skills</span></div>
            <div className="card-body">
              {skills.length === 0 ? (
                <p style={{ color: "var(--muted)", fontSize: 13 }}>No skills listed.</p>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {skills.map(s => (
                    <span key={s.id} className="skill-tag" style={{ padding: "5px 14px", fontSize: 13 }}>{s.name}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="card">
            <div className="card-header"><span className="card-title">Availability (This Week)</span></div>
            <div className="card-body">
              {availability.length === 0 ? (
                <p style={{ color: "var(--muted)", fontSize: 13 }}>No availability records.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {availability.map(a => (
                    <div key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--surface-2)" }}>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{a.date}</span>
                      <span style={{ fontSize: 13, color: "var(--text-2)" }}>
                        {a.status === "off" ? "Day Off" : `${a.start_time} – ${a.end_time}`}
                      </span>
                      <StatusBadge value={a.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Assignments */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Assignment History</span>
            <span className="badge badge-gray">{assignments.length} total</span>
          </div>
          {assignments.length === 0 ? (
            <div className="empty-state" style={{ padding: 32 }}><p>No assignments yet.</p></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Status</th>
                    <th>Assigned</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(a => {
                    const task = getTask(a.task_id);
                    return (
                      <tr key={a.id}>
                        <td className="td-bold">{task?.title || "—"}</td>
                        <td><StatusBadge value={a.status} /></td>
                        <td className="td-muted">{a.assigned_at}</td>
                        <td className="td-bold">{a.assignment_score ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
