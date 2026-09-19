import { useState } from "react";
import { EMPLOYEES, USERS, SKILLS, EMPLOYEE_SKILLS, getEmployeeUser } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

export default function Employees() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [roleFilter, setRoleFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmpPopup, setSelectedEmpPopup] = useState(null);
  const [editRoleModal, setEditRoleModal] = useState(null);
  const [newPosition, setNewPosition] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newDept, setNewDept] = useState("");

  // Get skills for an employee
  const getEmpSkills = (empId) => {
    const skillIds = EMPLOYEE_SKILLS.filter(es => es.employee_id === empId).map(es => es.skill_id);
    return SKILLS.filter(s => skillIds.includes(s.id));
  };

  // Filter employees
  const filteredEmployees = EMPLOYEES.filter(emp => {
    const u = getEmployeeUser(emp);
    const empSkills = getEmpSkills(emp.id);

    // Search filter
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = u?.name?.toLowerCase().includes(q);
      const matchPos = emp.position?.toLowerCase().includes(q);
      const matchDept = emp.department?.toLowerCase().includes(q);
      if (!matchName && !matchPos && !matchDept) return false;
    }

    // Role / Position filter
    if (roleFilter !== "all") {
      if (roleFilter === "lead" && !emp.position.toLowerCase().includes("lead") && !emp.position.toLowerCase().includes("senior")) return false;
      if (roleFilter === "junior" && !emp.position.toLowerCase().includes("junior") && !emp.position.toLowerCase().includes("associate")) return false;
    }

    // Department filter
    if (deptFilter !== "all" && emp.department !== deptFilter) return false;

    // Skill filter
    if (skillFilter !== "all") {
      const hasSkill = empSkills.some(s => s.name.toLowerCase().includes(skillFilter.toLowerCase()));
      if (!hasSkill) return false;
    }

    return true;
  });

  const handleOpenEdit = (emp) => {
    const u = getEmployeeUser(emp);
    setEditRoleModal({ emp, u });
    setNewPosition(emp.position);
    setNewRole(u?.role || "employee");
    setNewDept(emp.department);
  };

  const handleSaveRole = (e) => {
    e.preventDefault();
    if (!editRoleModal) return;

    // Update in memory
    editRoleModal.emp.position = newPosition;
    editRoleModal.emp.department = newDept;
    if (editRoleModal.u) {
      editRoleModal.u.role = newRole;
    }

    setEditRoleModal(null);
  };

  return (
    <div>
      {/* Top Banner */}
      <div style={{ border: "1px solid #000000", padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: "bold", margin: 0 }}>
            Staff Directory &amp; Talent Registry
          </h2>
          <div style={{ fontSize: 13, color: "#444444", marginTop: 2 }}>
            Complete directory of employees and managers with skill profiles and position governance.
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{ border: "1px solid #000000", padding: "12px", marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: "bold", display: "block" }}>Search Staff:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, position..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ minWidth: 200 }}
          />
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: "bold", display: "block" }}>Department:</label>
          <select 
            className="form-control"
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Data">Data</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: "bold", display: "block" }}>Level / Role:</label>
          <select 
            className="form-control"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="all">All Levels</option>
            <option value="lead">Senior / Lead Staff</option>
            <option value="junior">Junior / Associate Staff</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: "bold", display: "block" }}>Filter by Skill:</label>
          <select 
            className="form-control"
            value={skillFilter}
            onChange={e => setSkillFilter(e.target.value)}
          >
            <option value="all">All Skills</option>
            {SKILLS.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>

        {(searchTerm || deptFilter !== "all" || roleFilter !== "all" || skillFilter !== "all") && (
          <button 
            className="btn btn-secondary btn-sm" 
            style={{ alignSelf: "flex-end" }}
            onClick={() => { setSearchTerm(""); setDeptFilter("all"); setRoleFilter("all"); setSkillFilter("all"); }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Employees Table */}
      <div className="wt-card">
        <div className="wt-card-header">
          <div>
            <h2 className="wt-card-title">Employee Directory ({filteredEmployees.length} matching staff)</h2>
            <div className="wt-card-subtitle">Click anywhere on a staff row to open the detailed profile popup</div>
          </div>
        </div>

        <table className="wt-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Position / Designation</th>
              <th>Key Skills</th>
              <th>Workload %</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(emp => {
              const u = getEmployeeUser(emp);
              const skills = getEmpSkills(emp.id);
              return (
                <tr 
                  key={emp.id} 
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedEmpPopup(emp)}
                >
                  <td>
                    <strong>{u?.name}</strong>
                    <div style={{ fontSize: 11, color: "#444444" }}>{u?.email}</div>
                  </td>
                  <td>{emp.department}</td>
                  <td><strong>{emp.position}</strong></td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {skills.slice(0, 3).map(s => (
                        <span key={s.id} style={{ fontSize: 11, border: "1px solid #000000", padding: "1px 4px" }}>
                          {s.name}
                        </span>
                      ))}
                      {skills.length > 3 && <span style={{ fontSize: 11 }}>+{skills.length - 3}</span>}
                    </div>
                  </td>
                  <td><strong>{emp.workload_percentage}%</strong></td>
                  <td><StatusBadge value={emp.remote_status} /></td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button 
                        className="btn btn-sm"
                        onClick={() => setSelectedEmpPopup(emp)}
                      >
                        Profile
                      </button>
                      {isAdmin && (
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenEdit(emp)}
                          title="Admin Edit Position / Role"
                        >
                          Edit Role
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* EMPLOYEE DETAILED PROFILE POPUP */}
      {selectedEmpPopup && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: 650 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: 16, textTransform: "uppercase" }}>
                Staff Profile: {getEmployeeUser(selectedEmpPopup)?.name}
              </h3>
              <button 
                className="btn btn-sm" 
                onClick={() => setSelectedEmpPopup(null)}
                style={{ fontWeight: "bold" }}
              >
                [X] Close
              </button>
            </div>
            <div className="modal-body">
              <table className="wt-table" style={{ marginBottom: 14 }}>
                <tbody>
                  <tr>
                    <td style={{ width: "25%", fontWeight: "bold" }}>Full Name:</td>
                    <td style={{ width: "25%" }}>{getEmployeeUser(selectedEmpPopup)?.name}</td>
                    <td style={{ width: "25%", fontWeight: "bold" }}>Email Address:</td>
                    <td style={{ width: "25%" }}>{getEmployeeUser(selectedEmpPopup)?.email}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Department:</td>
                    <td>{selectedEmpPopup.department}</td>
                    <td style={{ fontWeight: "bold" }}>Designation:</td>
                    <td><strong>{selectedEmpPopup.position}</strong></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Current Status:</td>
                    <td><StatusBadge value={selectedEmpPopup.remote_status} /></td>
                    <td style={{ fontWeight: "bold" }}>Productivity:</td>
                    <td><strong>{selectedEmpPopup.productivity_score}%</strong></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Active Working:</td>
                    <td>{selectedEmpPopup.active_time}</td>
                    <td style={{ fontWeight: "bold" }}>Idle / Breaks:</td>
                    <td>{selectedEmpPopup.idle_time}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Shift Started:</td>
                    <td>{selectedEmpPopup.login_time}</td>
                    <td style={{ fontWeight: "bold" }}>Burnout Risk:</td>
                    <td>{selectedEmpPopup.burnout_risk || "Low"}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 6 }}>
                Technical &amp; Domain Skills:
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                {getEmpSkills(selectedEmpPopup.id).map(s => (
                  <span key={s.id} style={{ border: "1px solid #000000", padding: "3px 8px", fontSize: 12 }}>
                    {s.name} ({s.category})
                  </span>
                ))}
              </div>

              <div style={{ border: "1px solid #000000", padding: "10px" }}>
                <div style={{ fontWeight: "bold", fontSize: 12, marginBottom: 4 }}>CURRENT ACTIVE APPLICATION / FOCUS:</div>
                <div style={{ fontSize: 13 }}>{selectedEmpPopup.current_activity}</div>
              </div>
            </div>
            <div className="modal-footer">
              {isAdmin && (
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    const emp = selectedEmpPopup;
                    setSelectedEmpPopup(null);
                    handleOpenEdit(emp);
                  }}
                >
                  Change Position / Role
                </button>
              )}
              <button 
                className="btn btn-primary" 
                onClick={() => setSelectedEmpPopup(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN EDIT POSITION / ROLE MODAL */}
      {editRoleModal && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: 16, textTransform: "uppercase" }}>
                Admin Governance: Edit Position &amp; Role
              </h3>
              <button 
                className="btn btn-sm" 
                onClick={() => setEditRoleModal(null)}
              >
                [X] Close
              </button>
            </div>
            <form onSubmit={handleSaveRole}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>
                    Staff Member:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={editRoleModal.u?.name || ""}
                    disabled
                    style={{ width: "100%", backgroundColor: "#f0f0f0" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>
                    System Access Role:
                  </label>
                  <select
                    className="form-control"
                    style={{ width: "100%" }}
                    value={newRole}
                    onChange={e => setNewRole(e.target.value)}
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Department Manager</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>
                    Designation / Position Title:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ width: "100%" }}
                    value={newPosition}
                    onChange={e => setNewPosition(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>
                    Department:
                  </label>
                  <select
                    className="form-control"
                    style={{ width: "100%" }}
                    value={newDept}
                    onChange={e => setNewDept(e.target.value)}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Data">Data</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setEditRoleModal(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
