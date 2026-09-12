import { useState } from "react";
import { Printer, ChevronDown, ChevronUp, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  EMPLOYEES, TASKS, TASK_ASSIGNMENTS,
  getEmployeeUser, getEmployeeSkills, getEmployeeProgress,
  getEmployeeFeedback, getTask, getUser,
  initials, getManagerEmployees
} from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

function StarRating({ rating }) {
  return (
    <span style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={13} fill={i <= rating ? "#ffc107" : "none"} color={i <= rating ? "#ffc107" : "#dee2e6"} />
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
  const wColor   = employee.workload_percentage >= 85 ? "#dc3545" : employee.workload_percentage >= 60 ? "#0d6efd" : "#198754";

  return (
    <div className="card" style={{ pageBreakInside: "avoid" }}>
      {/* Header row */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", cursor: "pointer", borderBottom: expanded ? "1px solid var(--border)" : "none", background: "#ffffff" }}
        onClick={onToggle}
      >
        <div className="avatar avatar-md" style={{ background: "#e9ecef", color: "#495057" }}>{initials(user?.name)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{user?.name}</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>{employee.position} · {employee.department}</div>
        </div>
        {/* Quick stats */}
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { label: "Completed", value: progress.completed, color: "#198754" },
            { label: "In Progress", value: progress.inProgress, color: "#0d6efd" },
            { label: "Avg Score", value: progress.avgScore ?? "—", color: "#495057" },
            { label: "On-Time", value: `${progress.onTimeRate}%`, color: "#0d6efd" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
        {!printMode && (expanded ? <ChevronUp size={16} color="var(--muted)" /> : <ChevronDown size={16} color="var(--muted)" />)}
      </div>

      {(expanded || printMode) && (
        <div style={{ padding: "16px 18px", background: "#f8f9fa", display: "flex", flexDirection: "column", gap: 14, borderTop: "1px solid var(--border)" }}>
          {/* Progress Metrics Bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
              <span>Completion Rate</span>
              <strong>{progress.completionRate}%</strong>
            </div>
            <div className="progress-bar" style={{ height: 6 }}>
              <div className="progress-fill" style={{ width: `${progress.completionRate}%`, background: "#198754" }} />
            </div>
          </div>

          {/* Workload Bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
              <span>Workload Capacity</span>
              <strong style={{ color: wColor }}>{employee.workload_percentage}%</strong>
            </div>
            <div className="progress-bar" style={{ height: 6 }}>
              <div className="progress-fill" style={{ width: `${employee.workload_percentage}%`, background: wColor }} />
            </div>
          </div>

          {/* Skills list */}
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>Validated Skills</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {skills.map(s => <span key={s.id} className="skill-tag">{s.name}</span>)}
            </div>
          </div>

          {/* Task History */}
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>Assigned Tasks ({assignments.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {assignments.map(a => {
                const t = getTask(a.task_id);
                return (
                  <div key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", background: "#ffffff", borderRadius: 4, border: "1px solid var(--border)" }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 12.5 }}>{t?.title}</span>
                      <span style={{ fontSize: 11.5, color: "var(--muted)", marginLeft: 6 }}>Due: {t?.deadline} · {t?.estimated_hours}h</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <StatusBadge value={a.status} />
                      {a.assignment_score && (
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#0d6efd" }}>{a.assignment_score}/100</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feedback Received */}
          {feedback.length > 0 && (
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>Feedback Records ({feedback.length})</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {feedback.map(f => {
                  const author = getUser(f.from_user_id);
                  const t = getTask(f.task_id);
                  return (
                    <div key={f.id} style={{ padding: "8px 12px", background: "#ffffff", borderRadius: 4, border: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: 12 }}>{author?.name} ({author?.role})</span>
                        <StarRating rating={f.rating} />
                      </div>
                      <p style={{ fontSize: 12, color: "var(--text-2)", margin: 0 }}>"{f.comment}"</p>
                      {t && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Task: {t.title}</div>}
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
  const { user } = useAuth();
  const [expanded, setExpanded] = useState({});
  const [deptF, setDeptF] = useState("all");
  const [selectedEmp, setSelectedEmp] = useState("all");

  const isManager = user?.role === "manager";
  const allEmployees = isManager ? getManagerEmployees(user.id) : EMPLOYEES;
  const departments = [...new Set(allEmployees.map(e => e.department))];

  const filtered = allEmployees.filter(e => {
    const matchDept = deptF === "all" || e.department === deptF;
    const matchEmp  = selectedEmp === "all" || e.id === Number(selectedEmp);
    return matchDept && matchEmp;
  });

  const toggleExpand = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));
  const expandAll = () => {
    const all = {};
    filtered.forEach(e => { all[e.id] = true; });
    setExpanded(all);
  };
  const collapseAll = () => setExpanded({});

  const handlePrint = () => window.print();

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Employee Progress Reports</div>
          <div className="page-subtitle">Performance reviews, task metrics and appraisal logs</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="btn btn-secondary btn-sm" onClick={expandAll}>Expand All</button>
          <button className="btn btn-secondary btn-sm" onClick={collapseAll}>Collapse All</button>
          <button className="btn btn-primary btn-sm" onClick={handlePrint}>
            <Printer size={14} /> Print Report
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        {!isManager && (
          <select className="filter-select" value={deptF} onChange={e => { setDeptF(e.target.value); setSelectedEmp("all"); }}>
            <option value="all">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        )}
        <select className="filter-select" value={selectedEmp} onChange={e => setSelectedEmp(e.target.value)}>
          <option value="all">All Employees</option>
          {allEmployees
            .filter(e => deptF === "all" || e.department === deptF)
            .map(e => {
              const u = getEmployeeUser(e);
              return <option key={e.id} value={e.id}>{u?.name}</option>;
            })}
        </select>
        <span style={{ fontSize: 13, color: "var(--muted)", marginLeft: "auto" }}>
          Showing {filtered.length} employee report{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Reports List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(emp => (
          <EmployeeReportCard
            key={emp.id}
            employee={emp}
            expanded={!!expanded[emp.id]}
            onToggle={() => toggleExpand(emp.id)}
          />
        ))}
      </div>
    </div>
  );
}
