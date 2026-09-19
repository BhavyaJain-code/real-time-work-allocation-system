import { useState } from "react";
import { EMPLOYEES, SKILLS, EMPLOYEE_SKILLS, getEmployeeUser } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

export default function ManagerEmployees() {
  const { managedDept } = useAuth();
  const departmentName = managedDept || "Engineering";
  const myEmployees = EMPLOYEES.filter(e => e.department === departmentName);

  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");
  const [selectedEmpPopup, setSelectedEmpPopup] = useState(null);

  const getEmpSkills = (empId) => {
    const skillIds = EMPLOYEE_SKILLS.filter(es => es.employee_id === empId).map(es => es.skill_id);
    return SKILLS.filter(s => skillIds.includes(s.id));
  };

  const filteredEmployees = myEmployees.filter(emp => {
    const u = getEmployeeUser(emp);
    const empSkills = getEmpSkills(emp.id);

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      if (!u?.name?.toLowerCase().includes(q) && !emp.position?.toLowerCase().includes(q)) return false;
    }

    if (skillFilter !== "all") {
      const hasSkill = empSkills.some(s => s.name.toLowerCase().includes(skillFilter.toLowerCase()));
      if (!hasSkill) return false;
    }

    return true;
  });

  return (
    <div>
      {/* Top Banner */}
      <div style={{ border: "1px solid #000000", padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: "bold", margin: 0 }}>
            {departmentName} Team Staff Directory
          </h2>
          <div style={{ fontSize: 13, color: "#444444", marginTop: 2 }}>
            Team members under your direct supervision, skill competencies, and live activity.
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ border: "1px solid #000000", padding: "12px", marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: "bold", display: "block" }}>Search Staff:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search team member..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ minWidth: 200 }}
          />
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

        {(searchTerm || skillFilter !== "all") && (
          <button 
            className="btn btn-secondary btn-sm" 
            style={{ alignSelf: "flex-end" }}
            onClick={() => { setSearchTerm(""); setSkillFilter("all"); }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="wt-card">
        <div className="wt-card-header">
          <h2 className="wt-card-title">Staff Members ({filteredEmployees.length} staff)</h2>
        </div>
        <table className="wt-table">
          <thead>
            <tr>
              <th>Staff Member</th>
              <th>Designation</th>
              <th>Skills</th>
              <th>Active Hours</th>
              <th>Productivity</th>
              <th>Status</th>
              <th>Profile</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(emp => {
              const u = getEmployeeUser(emp);
              const skills = getEmpSkills(emp.id);
              return (
                <tr key={emp.id} style={{ cursor: "pointer" }} onClick={() => setSelectedEmpPopup(emp)}>
                  <td>
                    <strong>{u?.name}</strong>
                    <div style={{ fontSize: 11, color: "#444444" }}>{u?.email}</div>
                  </td>
                  <td>{emp.position}</td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {skills.map(s => (
                        <span key={s.id} style={{ fontSize: 11,  }}>
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td><strong>{emp.active_time}</strong></td>
                  <td><strong>{emp.productivity_score}%</strong></td>
                  <td><StatusBadge value={emp.remote_status} /></td>
                  <td>
                    <button className="btn btn-sm" onClick={() => setSelectedEmpPopup(emp)}>
                      View Profile
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* POPUP MODAL */}
      {selectedEmpPopup && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: 16, textTransform: "uppercase" }}>
                Staff Profile: {getEmployeeUser(selectedEmpPopup)?.name}
              </h3>
              <button className="btn btn-sm" onClick={() => setSelectedEmpPopup(null)}>
                Close
              </button>
            </div>
            <div className="modal-body">
              <table className="wt-table" style={{ marginBottom: 12 }}>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Department:</td>
                    <td>{selectedEmpPopup.department}</td>
                    <td style={{ fontWeight: "bold" }}>Designation:</td>
                    <td>{selectedEmpPopup.position}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Status:</td>
                    <td><StatusBadge value={selectedEmpPopup.remote_status} /></td>
                    <td style={{ fontWeight: "bold" }}>Productivity:</td>
                    <td><strong>{selectedEmpPopup.productivity_score}%</strong></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Active Working:</td>
                    <td>{selectedEmpPopup.active_time}</td>
                    <td style={{ fontWeight: "bold" }}>Idle Time:</td>
                    <td>{selectedEmpPopup.idle_time}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>Workload Capacity:</td>
                    <td><strong>{selectedEmpPopup.workload_percentage}%</strong></td>
                    <td style={{ fontWeight: "bold" }}>Burnout Risk:</td>
                    <td>{selectedEmpPopup.burnout_risk || "Low"}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ fontWeight: "bold", fontSize: 12, marginBottom: 4 }}>Skills:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {getEmpSkills(selectedEmpPopup.id).map(s => (
                  <span key={s.id} style={{ fontSize: 11 }}>
                    {s.name} ({s.category})
                  </span>
                ))}
              </div>

              <div style={{ border: "1px solid #000000", padding: "8px 10px" }}>
                <div style={{ fontWeight: "bold", fontSize: 11 }}>ACTIVE APPLICATION FOCUS:</div>
                <div style={{ fontSize: 13, marginTop: 2 }}>{selectedEmpPopup.current_activity}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setSelectedEmpPopup(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
