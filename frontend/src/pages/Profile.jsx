import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { EMPLOYEES, USERS, getEmployeeUser, getEmployeeSkills, getEmployeeAvailability, initials, avatarColors, getDepartmentManager, DEPARTMENT_MANAGERS } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import { User, Mail, Briefcase, Building, Edit2, Check, X, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

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

  const wColor = employee ? (employee.workload_percentage >= 85 ? "#ee27d7" : employee.workload_percentage >= 60 ? "#f5d982" : "#10b981") : null;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Personal Profile & Identity</div>
          <div className="page-subtitle">Manage credentials, department association, and competency details</div>
        </div>
        {!editing && (
          <motion.button
            className="btn btn-secondary"
            onClick={() => setEditing(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Edit2 size={15} color="#ee27d7" /> Edit Profile
          </motion.button>
        )}
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        {/* Main profile card */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="card">
            <div className="profile-header">
              <div
                className="avatar avatar-xl"
                style={{
                  background: "linear-gradient(135deg, #f5d982 0%, #ee27d7 100%)",
                  color: "#0d0a01",
                  boxShadow: "0 6px 20px rgba(238, 39, 215, 0.4)",
                  fontSize: 24,
                  fontWeight: 900
                }}
              >
                {initials(saved.name)}
              </div>
              <div className="profile-info">
                <h2>{saved.name}</h2>
                <p style={{ textTransform: "capitalize", color: "#f5d982", fontWeight: 700 }}>
                  {user.role}{saved.department ? ` · ${saved.department}` : ""}
                </p>
                {user.role === "manager" && managedDept && (
                  <div className="profile-meta">
                    <span className="badge badge-pink"><Building size={12} /> Manages {managedDept}</span>
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
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="form-grid">
                  <div className="field form-grid-full">
                    <label>Full Name</label>
                    <input className="field-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div className="field form-grid-full">
                    <label>Email Address</label>
                    <input className="field-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                  </div>
                  {employee && (
                    <>
                      <div className="field">
                        <label>Position / Title</label>
                        <input className="field-input" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} />
                      </div>
                      <div className="field">
                        <label>Department</label>
                        <select className="field-select" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                          <option value="Engineering">Engineering</option>
                          <option value="Design">Design</option>
                          <option value="Data">Data</option>
                        </select>
                      </div>
                    </>
                  )}
                  <div className="form-grid-full" style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
                    <button type="button" className="btn btn-ghost" onClick={handleCancel}><X size={15} /> Cancel</button>
                    <button type="submit" className="btn btn-primary"><Check size={15} /> Save Changes</button>
                  </div>
                </form>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5 }}>
                    <Mail size={16} color="#ee27d7" />
                    <span style={{ color: "var(--muted)" }}>Email:</span>
                    <strong style={{ color: "var(--text)" }}>{saved.email}</strong>
                  </div>
                  {saved.position && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5 }}>
                      <Briefcase size={16} color="#ee27d7" />
                      <span style={{ color: "var(--muted)" }}>Position:</span>
                      <strong style={{ color: "var(--text)" }}>{saved.position}</strong>
                    </div>
                  )}
                  {saved.department && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5 }}>
                      <Building size={16} color="#ee27d7" />
                      <span style={{ color: "var(--muted)" }}>Department:</span>
                      <strong style={{ color: "var(--text)" }}>{saved.department}</strong>
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5 }}>
                    <Shield size={16} color="#ee27d7" />
                    <span style={{ color: "var(--muted)" }}>Access Level:</span>
                    <span className="badge badge-accent" style={{ textTransform: "capitalize" }}>{user.role}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Workload card (if employee) */}
          {employee && (
            <div className="card">
              <div className="card-header"><span className="card-title">Live Workload Capacity</span></div>
              <div className="card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontWeight: 700 }}>Allocated Load</span>
                  <span style={{ fontWeight: 800, fontSize: 20, color: wColor }}>{employee.workload_percentage}%</span>
                </div>
                <div className="progress-bar" style={{ height: 10 }}>
                  <div className="progress-fill" style={{ width: `${employee.workload_percentage}%`, background: `linear-gradient(90deg, #f5d982 0%, ${wColor} 100%)` }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "var(--muted)" }}>
                  <span>Max Capacity: {employee.max_workload || 100}%</span>
                  <StatusBadge value={employee.availability_status} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right side: Skills & Availability */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {employee && (
            <div className="card">
              <div className="card-header"><span className="card-title">Registered Competencies</span></div>
              <div className="card-body">
                {skills.length === 0 ? (
                  <p style={{ color: "var(--muted)", fontSize: 13 }}>No skills recorded.</p>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {skills.map(s => (
                      <span key={s.id} className="skill-tag" style={{ fontSize: 12.5, padding: "5px 10px" }}>
                        <Zap size={12} color="#f5d982" /> {s.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {employee && (
            <div className="card">
              <div className="card-header"><span className="card-title">Recent Weekly Schedule</span></div>
              <div className="card-body" style={{ padding: 0 }}>
                {avail.length === 0 ? (
                  <p style={{ color: "var(--muted)", fontSize: 13, padding: 18 }}>No schedule set.</p>
                ) : avail.slice(0, 5).map(r => (
                  <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text)" }}>{r.date}</span>
                      <span style={{ fontSize: 11.5, color: "var(--muted)", marginLeft: 8 }}>{r.start_time} - {r.end_time}</span>
                    </div>
                    <StatusBadge value={r.status} />
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
