import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { EMPLOYEES, USERS, getEmployeeUser, getEmployeeSkills, getEmployeeAvailability, initials, avatarColors, getDepartmentManager, DEPARTMENT_MANAGERS } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import { User, Mail, Briefcase, Building, Edit2, Check, X } from "lucide-react";

export default function Profile() {
  const { user, employee, managedDept } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name:       user?.name       || "",
    email:      user?.email      || "",
    position:   employee?.position   || "",
    department: employee?.department || "",
  });
  const [saved, setSaved] = useState({ ...form });

  if (!user) return null;

  const av      = avatarColors(user.name);
  const skills  = employee ? getEmployeeSkills(employee.id) : [];
  const avail   = employee ? getEmployeeAvailability(employee.id) : [];

  const handleSave = () => { setSaved({ ...form }); setEditing(false); };
  const handleCancel = () => { setForm({ ...saved }); setEditing(false); };

  const wColor = employee ? (employee.workload_percentage >= 85 ? "var(--red)" : employee.workload_percentage >= 60 ? "var(--amber)" : "var(--green)") : null;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">My Profile</div>
        {!editing && (
          <button className="btn btn-secondary" onClick={() => setEditing(true)}>
            <Edit2 size={15} /> Edit Profile
          </button>
        )}
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        {/* Main profile card */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="card">
            <div className="profile-header">
              <div className="avatar avatar-xl" style={{ background: av.bg, color: av.color }}>
                {initials(saved.name)}
              </div>
              <div className="profile-info">
                <h2>{saved.name}</h2>
                <p style={{ textTransform: "capitalize" }}>{user.role}{saved.department ? ` · ${saved.department}` : ""}</p>
                {user.role === "manager" && managedDept && (
                  <div className="profile-meta">
                    <span className="badge badge-indigo"><Building size={11} /> Manages {managedDept}</span>
                  </div>
                )}
                <div className="profile-meta" style={{ marginTop: 6 }}>
                  <span className={`badge ${user.is_active ? "badge-green" : "badge-red"}`}>
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                  <span className="badge badge-gray">Member since {user.created_at}</span>
                </div>
              </div>
            </div>

            <div className="card-body">
              {editing ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { label: "Full Name",  key: "name",       type: "text" },
                    { label: "Email",      key: "email",      type: "email" },
                    ...(employee ? [
                      { label: "Position",   key: "position",   type: "text" },
                      { label: "Department", key: "department", type: "text" },
                    ] : []),
                  ].map(f => (
                    <div className="field" key={f.key}>
                      <label>{f.label}</label>
                      <input
                        className="field-input"
                        type={f.type}
                        value={form[f.key]}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      />
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button className="btn btn-secondary" onClick={handleCancel}><X size={14} /> Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave}><Check size={14} /> Save Changes</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    ["Full Name",    saved.name,       <User size={13} />],
                    ["Email",        saved.email,       <Mail size={13} />],
                    ["Role",         user.role,         <Briefcase size={13} />],
                    ...(employee ? [
                      ["Position",   saved.position,   <Briefcase size={13} />],
                      ["Department", saved.department,  <Building size={13} />],
                      ["Max Load",   `${employee.max_workload}%`, null],
                    ] : []),
                    ...(user.role === "manager" ? [
                      ["Manages",    managedDept || "—", <Building size={13} />],
                    ] : []),
                  ].map(([k, v, icon]) => (
                    <div key={k} style={{ padding: "10px 12px", background: "var(--surface-2)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{k}</div>
                      <div style={{ fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>{icon}{v}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Workload (employee only) */}
          {employee && (
            <div className="card">
              <div className="card-header"><span className="card-title">Workload & Availability</span></div>
              <div className="card-body">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span style={{ fontWeight: 600 }}>Current Workload</span>
                  <span style={{ fontWeight: 700, color: wColor }}>{employee.workload_percentage}%</span>
                </div>
                <div className="progress-bar" style={{ height: 8 }}>
                  <div className="progress-fill" style={{ width: `${employee.workload_percentage}%`, background: wColor }} />
                </div>
                <div style={{ marginTop: 12 }}>
                  <StatusBadge value={employee.availability_status} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Skills + credentials panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {skills.length > 0 && (
            <div className="card">
              <div className="card-header"><span className="card-title">My Skills</span></div>
              <div className="card-body">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {skills.map(s => (
                    <span key={s.id} className="skill-tag" style={{ padding: "5px 14px", fontSize: 13 }}>{s.name}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {user.temp_password && (
            <div className="card" style={{ border: "1px solid var(--amber-lt)" }}>
              <div className="card-header" style={{ background: "var(--amber-lt)" }}>
                <span className="card-title" style={{ color: "#92400e" }}>⚠ Temporary Password</span>
              </div>
              <div className="card-body">
                <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 10 }}>Your account was created by an admin. Please change your password after first login.</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#fff", borderRadius: "var(--radius)", border: "1px solid var(--amber-lt)" }}>
                  <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: 2 }}>{user.temp_password}</span>
                </div>
              </div>
            </div>
          )}

          {avail.length > 0 && (
            <div className="card">
              <div className="card-header"><span className="card-title">Recent Availability</span></div>
              <div style={{ padding: "4px 0" }}>
                {avail.slice(0, 5).map(a => (
                  <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 18px", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{a.date}</span>
                    <StatusBadge value={a.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
