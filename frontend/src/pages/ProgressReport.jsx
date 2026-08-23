import { useState } from "react";
import { Printer, ChevronDown, ChevronUp, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  EMPLOYEES, TASKS, TASK_ASSIGNMENTS,
  getEmployeeUser, getEmployeeSkills, getEmployeeProgress,
  getEmployeeFeedback, getTask, getUser,
  initials, avatarColors, getManagerEmployees
} from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import { motion } from "framer-motion";

function StarRating({ rating }) {
  return (
    <span style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={13} fill={i <= rating ? "#f5d982" : "none"} color={i <= rating ? "#f5d982" : "var(--border)"} />
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
  const wColor   = employee.workload_percentage >= 85 ? "#ee27d7" : employee.workload_percentage >= 60 ? "#f5d982" : "#10b981";

  return (
    <div className="card" style={{ pageBreakInside: "avoid" }}>
      {/* Header row */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", cursor: "pointer", borderBottom: expanded ? "1px solid var(--border)" : "none" }}
        onClick={onToggle}
      >
        <div className="avatar avatar-md" style={{ background: av.bg, color: av.color }}>{initials(user?.name)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14.5, color: "var(--text)" }}>{user?.name}</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{employee.position} · {employee.department}</div>
        </div>
        {/* Quick stats */}
        <div style={{ display: "flex", gap: 24 }}>
          {[
            { label: "Completed", value: progress.completed, color: "#10b981" },
            { label: "In Progress", value: progress.inProgress, color: "#ee27d7" },
            { label: "Avg Score", value: progress.avgScore ?? "—", color: "#f5d982" },
            { label: "On-Time", value: `${progress.onTimeRate}%`, color: "#4d5cf8" },
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
        <div style={{ padding: "20px", background: "var(--surface-2)", display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Progress Metrics Bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
              <span style={{ fontWeight: 700, color: "var(--text)" }}>Task Completion Rate</span>
              <span style={{ fontWeight: 800, color: "#f5d982" }}>{progress.completionRate}%</span>
            </div>
            <div className="progress-bar" style={{ height: 8 }}>
              <div className="progress-fill" style={{ width: `${progress.completionRate}%`, background: "linear-gradient(90deg, #f5d982 0%, #ee27d7 100%)" }} />
            </div>
          </div>

          {/* Workload Bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
              <span style={{ fontWeight: 700, color: "var(--text)" }}>Current Workload Capacity</span>
              <span style={{ fontWeight: 800, color: wColor }}>{employee.workload_percentage}%</span>
            </div>
            <div className="progress-bar" style={{ height: 8 }}>
              <div className="progress-fill" style={{ width: `${employee.workload_percentage}%`, background: `linear-gradient(90deg, #f5d982 0%, ${wColor} 100%)` }} />
            </div>
          </div>

          {/* Skills list */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>Validated Skills</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {skills.map(s => <span key={s.id} className="skill-tag">{s.name}</span>)}
            </div>
          </div>

          {/* Task History */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Assigned Tasks ({assignments.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {assignments.map(a => {
                const t = getTask(a.task_id);
                return (
                  <div key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "var(--surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{t?.title}</span>
                      <span style={{ fontSize: 11.5, color: "var(--muted)", marginLeft: 8 }}>Due {t?.deadline} · {t?.estimated_hours}h</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <StatusBadge value={a.status} />
                      {a.assignment_score && (
                        <span style={{ fontSize: 12, fontWeight: 800, color: "#f5d982" }}>{a.assignment_score}/100</span>
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
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Received Feedback ({feedback.length})</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {feedback.map(f => {
                  const author = getUser(f.from_user_id);
                  const t = getTask(f.task_id);
                  return (
                    <div key={f.id} style={{ padding: "10px 14px", background: "var(--surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 12.5, color: "var(--text)" }}>{author?.name} ({author?.role})</span>
                        <StarRating rating={f.rating} />
                      </div>
                      <p style={{ fontSize: 12.5, color: "var(--text-2)", margin: 0 }}>"{f.comment}"</p>
                      {t && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>Task: {t.title}</div>}
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
          <div className="page-subtitle">Performance evaluations, completion metrics and feedback logs</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary" onClick={expandAll}>Expand All</button>
          <button className="btn btn-secondary" onClick={collapseAll}>Collapse All</button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={15} /> Print / Export PDF
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
          Showing {filtered.length} report{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Reports List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
