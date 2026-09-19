import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { EMPLOYEES, USERS } from "../data/mockData";

export default function Profile() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [notification, setNotification] = useState("");
  const [name, setName] = useState(user?.name || "Administrator");
  const [email, setEmail] = useState(user?.email || "alex@workflow.io");

  // Admin position governance state
  const [selectedUserToEdit, setSelectedUserToEdit] = useState(USERS[0]?.id || 1);
  const [editPosition, setEditPosition] = useState("Senior Lead");
  const [editRole, setEditRole] = useState("manager");
  const [editDept, setEditDept] = useState("Engineering");

  const handleUpdateSelf = (e) => {
    e.preventDefault();
    setNotification("Profile details updated successfully.");
    setTimeout(() => setNotification(""), 3000);
  };

  const handleAdminGovernanceChange = (e) => {
    e.preventDefault();
    const targetUser = USERS.find(u => u.id === Number(selectedUserToEdit));
    const targetEmp = EMPLOYEES.find(emp => emp.user_id === Number(selectedUserToEdit));

    if (targetUser) targetUser.role = editRole;
    if (targetEmp) {
      targetEmp.position = editPosition;
      targetEmp.department = editDept;
    }

    setNotification("Admin governance: Successfully updated position and role for " + (targetUser?.name || "user") + ".");
    setTimeout(() => setNotification(""), 4000);
  };

  return (
    <div>
      {/* Top Banner */}
      <div style={{ border: "1px solid #000000", padding: "12px 16px", marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: "bold", margin: 0 }}>
          User Profile &amp; Account Settings
        </h2>
        <div style={{ fontSize: 13, color: "#444444", marginTop: 2 }}>
          Manage personal credentials, account preferences, and administrative organizational governance.
        </div>
      </div>

      {notification && (
        <div style={{ border: "1px solid #000000", padding: "8px 12px", marginBottom: 16, fontWeight: "bold" }}>
          Notice: {notification}
        </div>
      )}

      <div className="wt-grid-2x2">
        {/* Personal Account Information */}
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Personal Account Information</h2>
          </div>
          <form onSubmit={handleUpdateSelf} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Full Name:</label>
              <input 
                type="text" 
                className="form-control" 
                style={{ width: "100%" }}
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Email Address:</label>
              <input 
                type="email" 
                className="form-control" 
                style={{ width: "100%" }}
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>System Role:</label>
              <input 
                type="text" 
                className="form-control" 
                style={{ width: "100%", backgroundColor: "#f0f0f0" }}
                value={user?.role?.toUpperCase() || "ADMIN"} 
                disabled 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: 4 }}>
              Save Account Details
            </button>
          </form>
        </div>

        {/* Security & Password */}
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Security &amp; Password</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Current Password:</label>
              <input type="password" className="form-control" style={{ width: "100%" }} placeholder="••••••••" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>New Password:</label>
              <input type="password" className="form-control" style={{ width: "100%" }} placeholder="Minimum 6 characters" />
            </div>
            <button className="btn btn-secondary" onClick={() => { setNotification("Password updated."); setTimeout(() => setNotification(""), 3000); }}>
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* ADMIN GOVERNANCE SECTION */}
      {isAdmin && (
        <div className="wt-card" style={{ marginTop: 16 }}>
          <div className="wt-card-header">
            <div>
              <h2 className="wt-card-title">Admin Governance: Modify Positions &amp; Roles of Managers and Employees</h2>
              <div className="wt-card-subtitle">Administrator rights to reassign designation, department, and role access across the organization</div>
            </div>
          </div>
          <form onSubmit={handleAdminGovernanceChange} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr auto", gap: 12, alignItems: "flex-end" }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Select User / Staff:</label>
              <select 
                className="form-control" 
                style={{ width: "100%" }}
                value={selectedUserToEdit}
                onChange={e => {
                  const uid = Number(e.target.value);
                  setSelectedUserToEdit(uid);
                  const u = USERS.find(x => x.id === uid);
                  const emp = EMPLOYEES.find(x => x.user_id === uid);
                  if (u) setEditRole(u.role);
                  if (emp) {
                    setEditPosition(emp.position);
                    setEditDept(emp.department);
                  }
                }}
              >
                {USERS.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role} - {u.email})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>System Access Role:</label>
              <select 
                className="form-control" 
                style={{ width: "100%" }}
                value={editRole}
                onChange={e => setEditRole(e.target.value)}
              >
                <option value="employee">Employee</option>
                <option value="manager">Department Manager</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Designation / Position:</label>
              <input 
                type="text" 
                className="form-control" 
                style={{ width: "100%" }}
                value={editPosition}
                onChange={e => setEditPosition(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Department:</label>
              <select 
                className="form-control" 
                style={{ width: "100%" }}
                value={editDept}
                onChange={e => setEditDept(e.target.value)}
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Data">Data</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: "8px 16px" }}>
              Apply Position Change
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
