import { useState } from "react";
import { UserPlus, Eye, EyeOff, X, RefreshCw } from "lucide-react";
import { USERS, EMPLOYEES, initials } from "../data/mockData";

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
          <div className="page-title">User Accounts & Access Control</div>
          <div className="page-subtitle">Manage login credentials and system roles ({users.length} accounts)</div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <UserPlus size={15} /> Add User Account
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <input className="search-input" placeholder="Search users by name or email…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 12 }} />
        </div>
        <select className="filter-select" value={roleF} onChange={e => setRoleF(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="manager">Department Managers</option>
          <option value="employee">Employees</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role & Department</th>
                <th>Status</th>
                <th>Temporary Password</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const employeeRecord = emp(u.id);
                const isPassVisible = showPass[u.id];
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="avatar avatar-sm" style={{ background: "#e9ecef", color: "#495057" }}>{initials(u.name)}</div>
                        <div>
                          <div className="td-bold">{u.name}</div>
                          <div className="td-muted">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${u.role === "manager" ? "badge-amber" : "badge-blue"}`} style={{ textTransform: "capitalize" }}>
                        {u.role}
                      </span>
                      {employeeRecord && (
                        <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>
                          {employeeRecord.department} · {employeeRecord.position}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${u.is_active ? "badge-green" : "badge-gray"}`}>
                        {u.is_active ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td>
                      {u.temp_password ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontFamily: "monospace", fontSize: 12.5, background: "#f8f9fa", border: "1px solid #dee2e6", padding: "2px 6px", borderRadius: 3 }}>
                            {isPassVisible ? u.temp_password : "••••••••"}
                          </span>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ padding: 2 }}
                            onClick={() => setShowPass(p => ({ ...p, [u.id]: !p[u.id] }))}
                          >
                            {isPassVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        </div>
                      ) : (
                        <span className="td-muted">Managed by user</span>
                      )}
                    </td>
                    <td className="td-muted">{u.created_at}</td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: u.is_active ? "#dc3545" : "#198754" }}
                        onClick={() => toggleActive(u.id)}
                      >
                        {u.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Account Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Create New User Account</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={15} /></button>
            </div>
            <form onSubmit={handleCreate} className="form-grid">
              <div className="field form-grid-full">
                <label>Full Name</label>
                <input className="field-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Alex Morgan" />
              </div>
              <div className="field form-grid-full">
                <label>Email Address</label>
                <input className="field-input" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="alex@workflow.io" />
              </div>
              <div className="field">
                <label>Role</label>
                <select className="field-select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="employee">Employee</option>
                  <option value="manager">Department Manager</option>
                </select>
              </div>
              <div className="field">
                <label>Department</label>
                <select className="field-select" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Data">Data</option>
                </select>
              </div>
              <div className="field form-grid-full">
                <label>Temporary Password</label>
                <div style={{ display: "flex", gap: 6 }}>
                  <input className="field-input" readOnly value={form.password} style={{ fontFamily: "monospace" }} />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setForm(f => ({ ...f, password: genPassword() }))}>
                    <RefreshCw size={13} />
                  </button>
                </div>
              </div>
              <div className="modal-footer form-grid-full">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
