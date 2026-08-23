import { useState } from "react";
import { Printer, Download, ChevronDown, ChevronUp, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  EMPLOYEES, TASKS, TASK_ASSIGNMENTS,
  getEmployeeUser, getEmployeeSkills, getEmployeeProgress,
  getEmployeeFeedback, getTask, getUser,
  initials, avatarColors, getManagerEmployees
} from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

function StarRating({ rating }) {
  return (
    <span style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={13} fill={i <= rating ? "var(--amber)" : "none"} color={i <= rating ? "var(--amber)" : "var(--border)"} />
      ))}
    </span>
  );
}

function EmployeeReportCard({ employee, expanded, onToggle, printMode }) {
  const user     = getEmployeeUser(employee);
  const skills   = getEmployeeSkills(employee.id);
  const progress = getEmployeeProgress(employee.id);
  const feedback = getEmployeeFeedback(employee.id);
  const assignments = TASK_ASSIGNMENTS.filter(a => a.employee_id === employee.id);
  const av       = avatarColors(user?.name || "");
  const wColor   = employee.workload_percentage >= 85 ? "var(--red)" : employee.workload_percentage >= 60 ? "var(--amber)" : "var(--green)";

  return (
    <div className="card" style={{ pageBreakInside: "avoid" }}>
      {/* Header row */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", cursor: "pointer", borderBottom: expanded ? "1px solid var(--border)" : "none" }}
        onClick={onToggle}
      >
        <div className="avatar avatar-md" style={{ background: av.bg, color: av.color }}>{initials(user?.name)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14.5 }}>{user?.name}</div>
          <div style={{ fontSize: 12.5, color: "var(--text-2)" }}>{employee.position} · {employee.department}</div>
        </div>
        {/* Quick stats */}
        <div style={{ display: "flex", gap: 24 }}>
          {[
            { label: "Completed", value: progress.completed, color: "var(--green)" },
            { label: "In Progress", value: progress.inProgress, color: "var(--blue)" },
            { label: "Avg Score", value: progress.avgScore ?? "—", color: "var(--primary)" },
            { label: "On-Time", value: `${progress.onTimeRate}%`, color: "var(--amber)" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
        {!printMode && (expanded ? <ChevronUp size={16} color="var(--muted)" /> : <ChevronDown size={16} color="var(--muted)" />)}
      </div>

      {(expanded || printMode) && (
        <div>
          {/* Progress bars */}
          <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, borderBottom: "1px solid var(--border)" }}>
            {[
              { label: "Completion Rate", value: progress.completionRate, color: "var(--green)" },
              { label: "Workload",        value: employee.workload_percentage, color: wColor },
            ].map(b => (
              <div key={b.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
                  <span style={{ fontWeight: 600 }}>{b.label}</span>
                  <span style={{ fontWeight: 700, color: b.color }}>{b.value}%</span>
                </div>
                <div className="progress-bar" style={{ height: 7 }}>
                  <div className="progress-fill" style={{ width: `${b.value}%`, background: b.color }} />
                </div>
              </div>
            ))}
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>Total Hours Delivered</div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "var(--primary)" }}>{progress.totalHours}h</div>
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Skills</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {skills.map(s => <span key={s.id} className="skill-tag">{s.name}</span>)}
              </div>
            </div>
          </div>

          {/* Assignment history */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Task History</div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Task</th><th>Type</th><th>Status</th><th>Deadline</th><th>Completed</th><th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(a => {
                    const task = getTask(a.task_id);
                    return task ? (
                      <tr key={a.id}>
                        <td className="td-bold">{task.title}</td>
                        <td><span className="badge badge-gray">{task.task_type}</span></td>
                        <td><StatusBadge value={a.status} /></td>
                        <td className="td-muted">{task.deadline}</td>
                        <td className="td-muted">{a.completed_at || "—"}</td>
                        <td style={{ fontWeight: 800, color: a.assignment_score >= 80 ? "var(--green)" : a.assignment_score ? "var(--amber)" : "var(--muted)" }}>
                          {a.assignment_score ?? "—"}
                        </td>
                      </tr>
                    ) : null;
                  })}
                  {assignments.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--muted)", padding: 20 }}>No assignments yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Feedback */}
          {feedback.length > 0 && (
            <div style={{ padding: "14px 20px" }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Feedback Received</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {feedback.map(f => {
                  const giver = getUser(f.from_user_id);
                  const task  = getTask(f.task_id);
                  return (
                    <div key={f.id} style={{ padding: "12px 14px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontWeight: 600, fontSize: 13 }}>{giver?.name}</span>
                          <span className="badge badge-gray">{giver?.role}</span>
                          {task && <span style={{ fontSize: 12, color: "var(--muted)" }}>re: {task.title}</span>}
                        </div>
                        <StarRating rating={f.rating} />
                      </div>
                      <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.5 }}>{f.comment}</p>
                      <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4 }}>{new Date(f.created_at).toLocaleDateString()}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProgressReport() {
  const { user, managedDept } = useAuth();
  const [deptF, setDeptF]   = useState(managedDept || "all");
  const [expanded, setExpanded] = useState({});
  const [selected, setSelected] = useState("all"); // "all" or employee id for single report
  const [printMode, setPrintMode] = useState(false);

  const allDepts = [...new Set(EMPLOYEES.map(e => e.department))];

  const visibleEmps = EMPLOYEES.filter(emp => {
    if (managedDept) return emp.department === managedDept;
    if (deptF !== "all") return emp.department === deptF;
    return true;
  });

  const displayEmps = selected === "all" ? visibleEmps : visibleEmps.filter(e => e.id === Number(selected));

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => { window.print(); setPrintMode(false); }, 200);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Progress Reports</div>
          <div className="page-subtitle">{displayEmps.length} employee{displayEmps.length !== 1 ? "s" : ""}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary" onClick={handlePrint}><Printer size={15} /> Print</button>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        {!managedDept && (
          <select className="filter-select" value={deptF} onChange={e => setDeptF(e.target.value)}>
            <option value="all">All Departments</option>
            {allDepts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        )}
        <select className="filter-select" value={selected} onChange={e => setSelected(e.target.value)}>
          <option value="all">All Employees</option>
          {visibleEmps.map(emp => {
            const u = getEmployeeUser(emp);
            return <option key={emp.id} value={emp.id}>{u?.name}</option>;
          })}
        </select>
        <button className="btn btn-secondary btn-sm" onClick={() => setExpanded(Object.fromEntries(visibleEmps.map(e => [e.id, true])))}>
          Expand All
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => setExpanded({})}>Collapse All</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {displayEmps.map(emp => (
          <EmployeeReportCard
            key={emp.id}
            employee={emp}
            expanded={!!expanded[emp.id] || printMode}
            onToggle={() => toggle(emp.id)}
            printMode={printMode}
          />
        ))}
        {displayEmps.length === 0 && (
          <div className="card"><div className="empty-state"><h3>No employees found</h3></div></div>
        )}
      </div>
    </div>
  );
}
