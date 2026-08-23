import { useState } from "react";
import { UserPlus, Eye, EyeOff, X, ToggleLeft, ToggleRight, RefreshCw } from "lucide-react";
import { USERS, EMPLOYEES, initials, avatarColors } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

function genPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function UserManagement() {
  const [users, setUsers] = useState(USERS.filter(u => u.role !== "admin"));
  const [showModal, setShowModal] = useState(false);
  const [showPass, setShowPass] = useState({});
  const [form, setForm] = useState({ name: "", email: "", role: "employee", department: "", position: "", password: genPassword() });
  const [search, setSearch] = useState("");
  const [roleF, setRoleF] = useState("all");

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (roleF === "all" || u.role === roleF);
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const newUser = {
      id: Date.now(), name: form.name, email: form.email, role: form.role,
      is_active: true, created_at: new Date().toISOString().split("T")[0],
      temp_password: form.password, created_by: 1,
    };
    setUsers(u => [...u, newUser]);
    setForm({ name: "", email: "", role: "employee", department: "", position: "", password: genPassword() });
    setShowModal(false);
  };

  const toggleActive = (id) => {
    setUsers(u => u.map(x => x.id === id ? { ...x, is_active: !x.is_active } : x));
  };

  const emp = (userId) => EMPLOYEES.find(e => e.user_id === userId);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">User Management</div>
          <div className="page-subtitle">Admin-only · {users.length} accounts</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <UserPlus size={16} /> Create Account
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <input className="search-input" placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 12 }} />
        </div>
        <select className="filter-select" value={roleF} onChange={e => setRoleF(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="manager">Manager</option>
          <option value="employee">Employee</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Temp Password</th>
                <th>Created</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const e = emp(u.id);
                const av = avatarColors(u.name);
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <div className="avatar avatar-sm" style={{ background: av.bg, color: av.color }}>{initials(u.name)}</div>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</span>
                      </div>
                    </td>
                    <td className="td-muted">{u.email}</td>
                    <td><span className={`badge ${u.role === "manager" ? "badge-purple" : "badge-blue"}`}>{u.role}</span></td>
                    <td className="td-muted">{e?.department || "—"}</td>
                    <td>
                      {u.temp_password ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <code style={{ fontSize: 12, background: "var(--surface-2)", padding: "2px 7px", borderRadius: 5, border: "1px solid var(--border)", letterSpacing: 1 }}>
                            {showPass[u.id] ? u.temp_password : "••••••••"}
                          </code>
                          <button className="btn btn-ghost btn-sm" onClick={() => setShowPass(p => ({ ...p, [u.id]: !p[u.id] }))}>
                            {showPass[u.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        </div>
                      ) : <span className="td-muted">—</span>}
                    </td>
                    <td className="td-muted">{u.created_at}</td>
                    <td><StatusBadge value={u.is_active ? "available" : "offline"} /></td>
                    <td>
                      <button className="btn btn-ghost btn-sm" title={u.is_active ? "Deactivate" : "Activate"}
                        onClick={() => toggleActive(u.id)} style={{ color: u.is_active ? "var(--red)" : "var(--green)" }}>
                        {u.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Create Account</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="form-grid">
                <div className="field">
                  <label>Full Name *</label>
                  <input className="field-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Full name" />
                </div>
                <div className="field">
                  <label>Email *</label>
                  <input className="field-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="user@workflow.io" />
                </div>
                <div className="field">
                  <label>Role *</label>
                  <select className="field-select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
                <div className="field">
                  <label>Department</label>
                  <select className="field-select" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                    <option value="">Select department</option>
                    {["Engineering","Design","Data","Product","QA"].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="field form-grid-full">
                  <label>Position</label>
                  <input className="field-input" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} placeholder="e.g. Senior Developer" />
                </div>
                <div className="field form-grid-full">
                  <label>Temporary Password</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input className="field-input" style={{ flex: 1 }} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setForm(f => ({ ...f, password: genPassword() }))}>
                      <RefreshCw size={14} /> Regenerate
                    </button>
                  </div>
                  <span style={{ fontSize: 11.5, color: "var(--muted)" }}>This password will be given to the user. They should change it on first login.</span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary"><UserPlus size={14} /> Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
