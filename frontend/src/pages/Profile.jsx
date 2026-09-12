import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { EMPLOYEES, USERS, getEmployeeUser, getEmployeeSkills, getEmployeeAvailability, initials, avatarColors } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import { User, Mail, Briefcase, Building, Edit2, Check, X, Shield, Zap } from "lucide-react";

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

  const skills  = employee ? getEmployeeSkills(employee.id) : [];
  const avail   = employee ? getEmployeeAvailability(employee.id) : [];

  const handleSave = () => { setSaved({ ...form }); setEditing(false); };
  const handleCancel = () => { setForm({ ...saved }); setEditing(false); };

  const wColor = employee ? (employee.workload_percentage >= 85 ? "#dc3545" : employee.workload_percentage >= 60 ? "#0d6efd" : "#198754") : null;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">User Profile</div>
          <div className="page-subtitle">View and update account information</div>
        </div>
        {!editing && (
          <button
            className="btn btn-secondary"
            onClick={() => setEditing(true)}
          >
            <Edit2 size={14} /> Edit Profile
          </button>
        )}
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        {/* Main profile card */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card">
            <div className="profile-header">
              <div
                className="avatar avatar-xl"
                style={{
                  background: "#0d6efd",
                  color: "#ffffff",
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                {initials(saved.name)}
              </div>
              <div className="profile-info">
                <h2>{saved.name}</h2>
                <p>{saved.email}</p>
                <div className="profile-meta">
                  <span className="badge badge-blue">{user.role.toUpperCase()}</span>
                  {saved.department && <span className="badge badge-gray">{saved.department}</span>}
                  {employee?.availability_status && (
                    <StatusBadge value={employee.availability_status} />
                  )}
                </div>
              </div>
            </div>

            <div className="card-body">
              {editing ? (
                <div className="form-grid">
                  <div className="field">
                    <label>Full Name</label>
                    <input
                      className="field-input"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                  <div className="field">
                    <label>Email Address</label>
                    <input
                      className="field-input"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                  {employee && (
                    <>
                      <div className="field">
                        <label>Job Position</label>
                        <input
                          className="field-input"
                          value={form.position}
                          onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                        />
                      </div>
                      <div className="field">
                        <label>Department</label>
                        <input
                          className="field-input"
                          value={form.department}
                          onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                        />
                      </div>
                    </>
                  )}
                  <div className="form-grid-full" style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button className="btn btn-secondary" onClick={handleCancel}>
                      <X size={14} /> Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                      <Check size={14} /> Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <User size={15} color="var(--muted)" />
                    <span style={{ color: "var(--muted)", width: 100, fontSize: 13 }}>Full Name:</span>
                    <strong style={{ fontSize: 13.5 }}>{saved.name}</strong>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Mail size={15} color="var(--muted)" />
                    <span style={{ color: "var(--muted)", width: 100, fontSize: 13 }}>Email:</span>
                    <strong style={{ fontSize: 13.5 }}>{saved.email}</strong>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Shield size={15} color="var(--muted)" />
                    <span style={{ color: "var(--muted)", width: 100, fontSize: 13 }}>System Role:</span>
                    <span className="badge badge-blue">{user.role}</span>
                  </div>
                  {saved.position && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Briefcase size={15} color="var(--muted)" />
                      <span style={{ color: "var(--muted)", width: 100, fontSize: 13 }}>Position:</span>
                      <strong style={{ fontSize: 13.5 }}>{saved.position}</strong>
                    </div>
                  )}
                  {saved.department && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Building size={15} color="var(--muted)" />
                      <span style={{ color: "var(--muted)", width: 100, fontSize: 13 }}>Department:</span>
                      <strong style={{ fontSize: 13.5 }}>{saved.department}</strong>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Workload card if employee */}
          {employee && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">Workload & Capacity Status</span>
              </div>
              <div className="card-body">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span>Current Workload: <strong>{employee.workload_percentage}%</strong></span>
                  <span style={{ color: wColor, fontWeight: 600 }}>{employee.availability_status.toUpperCase()}</span>
                </div>
                <div className="progress-bar" style={{ height: 8 }}>
                  <div className="progress-fill" style={{ width: `${employee.workload_percentage}%`, background: wColor }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right side: Skills & Shifts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {employee && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">Registered Skills</span>
              </div>
              <div className="card-body">
                {skills.length === 0 ? (
                  <span className="text-muted">No skills assigned yet.</span>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {skills.map(s => (
                      <span key={s.id} className="skill-tag">
                        {s.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {employee && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">Weekly Schedule Slots</span>
              </div>
              <div className="card-body">
                {avail.length === 0 ? (
                  <span className="text-muted">No schedule records.</span>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {avail.map(a => (
                      <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: "#f8f9fa", borderRadius: 4, border: "1px solid var(--border)" }}>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{a.date}</span>
                        <span style={{ fontSize: 12, color: "var(--muted)" }}>{a.start_time} - {a.end_time}</span>
                        <StatusBadge value={a.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
