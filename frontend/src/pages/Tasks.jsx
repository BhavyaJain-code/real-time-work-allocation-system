import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Users, X, UserCheck } from "lucide-react";
import { TASKS, EMPLOYEES, TASK_ASSIGNMENTS, getTaskSkills, getMatchedEmployees, getEmployeeUser, getEmployeeSkills, initials, avatarColors, TASK_TYPE_LABEL, TASK_TYPE_BADGE } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import TaskCard from "../components/TaskCard";
import AssignTaskModal from "../components/AssignTaskModal";

export default function Tasks() {
  const navigate  = useNavigate();
  const [search,    setSearch]    = useState("");
  const [statusF,   setStatusF]   = useState("all");
  const [priorityF, setPriorityF] = useState("all");
  const [typeF,     setTypeF]     = useState("all");
  const [view,      setView]      = useState("table");
  const [selected,  setSelected]  = useState(null); // task for skill-match panel
  const [showAssign, setShowAssign] = useState(false);
  const [assignments, setAssignments] = useState(TASK_ASSIGNMENTS);

  const handleAssign = (taskId, empId) => {
    setAssignments(a => [...a, {
      id: Date.now(), task_id: taskId, employee_id: empId,
      assigned_at: new Date().toISOString().split("T")[0],
      started_at: null, completed_at: null, assignment_score: null, status: "assigned",
    }]);
  };

  const filtered = TASKS.filter(t => {
    const q = search.toLowerCase();
    return (t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
      && (statusF   === "all" || t.status   === statusF)
      && (priorityF === "all" || t.priority === priorityF)
      && (typeF     === "all" || t.task_type === typeF);
  });

  const matched = selected ? getMatchedEmployees(selected.id) : [];

  return (
    <>
      <div>
        <div className="page-header">
          <div>
            <div className="page-title">Tasks Management</div>
            <div className="page-subtitle">{TASKS.length} total tasks in system</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-secondary"
              onClick={() => setShowAssign(true)}
            >
              <UserCheck size={15} /> Assign Task
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/admin/tasks/create")}
            >
              <Plus size={15} /> Add Task
            </button>
          </div>
        </div>

        <div className="filter-bar">
          <div className="search-wrap">
            <Search size={14} className="search-icon" />
            <input className="search-input" placeholder="Search tasks by title or description…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="filter-select" value={statusF} onChange={e => setStatusF(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">In Review</option>
            <option value="done">Done</option>
          </select>
          <select className="filter-select" value={priorityF} onChange={e => setPriorityF(e.target.value)}>
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select className="filter-select" value={typeF} onChange={e => setTypeF(e.target.value)}>
            <option value="all">All Types</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", marginLeft: "auto" }}>
            <button
              className={`btn btn-sm ${view === "table" ? "btn-primary" : "btn-secondary"}`}
              style={{ borderRadius: 0 }}
              onClick={() => setView("table")}
            >Table</button>
            <button
              className={`btn btn-sm ${view === "grid" ? "btn-primary" : "btn-secondary"}`}
              style={{ borderRadius: 0 }}
              onClick={() => setView("grid")}
            >Grid</button>
          </div>
        </div>

        {view === "table" ? (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Task Title</th>
                    <th>Type</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Deadline</th>
                    <th>Hours</th>
                    <th>Required Skills</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={9} style={{ textAlign: "center", padding: 24, color: "var(--muted)" }}>No tasks found matching your filters.</td></tr>
                  ) : filtered.map(t => {
                    const skills = getTaskSkills(t.id);
                    return (
                      <tr key={t.id}>
                        <td className="td-muted">#{t.id}</td>
                        <td>
                          <div className="td-bold">{t.title}</div>
                          <div className="td-muted" style={{ maxWidth: 320 }}>{t.description}</div>
                        </td>
                        <td>
                          <span className={`badge ${TASK_TYPE_BADGE[t.task_type] || "badge-gray"}`}>
                            {TASK_TYPE_LABEL[t.task_type] || t.task_type}
                          </span>
                        </td>
                        <td><StatusBadge value={t.priority} type="priority" /></td>
                        <td><StatusBadge value={t.status} /></td>
                        <td className="td-muted">{t.deadline}</td>
                        <td><strong>{t.estimated_hours}h</strong></td>
                        <td>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                            {skills.map(s => <span key={s.id} className="skill-tag">{s.name}</span>)}
                          </div>
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setSelected(selected?.id === t.id ? null : t)}
                          >
                            <Users size={12} /> Match
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          filtered.length === 0 ? (
            <div className="card"><div className="empty-state"><h3>No tasks found</h3><p>Try adjusting your search filters.</p></div></div>
          ) : (
            <div className="grid-3">
              {filtered.map(task => (
                <div key={task.id} style={{ display: "flex", flexDirection: "column" }}>
                  <TaskCard task={task} />
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: 6, width: "100%" }}
                    onClick={() => setSelected(selected?.id === task.id ? null : task)}
                  >
                    <Users size={12} /> {selected?.id === task.id ? "Hide Matches" : "Find Matching Employees"}
                  </button>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Skill Matching Slide-in / Modal panel */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Matched Employees for Task</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{selected.title}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}><X size={15} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {matched.length === 0 ? (
                <p style={{ color: "var(--muted)", fontSize: 13, padding: 12 }}>No employees currently match the required skills.</p>
              ) : (
                matched.map(({ employee, matchCount, totalRequired }) => {
                  const u = getEmployeeUser(employee);
                  const av = avatarColors(u?.name || "");
                  const skills = getEmployeeSkills(employee.id);
                  const isAssigned = assignments.some(a => a.task_id === selected.id && a.employee_id === employee.id);
                  return (
                    <div key={employee.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#f8f9fa", borderRadius: 4, border: "1px solid var(--border)" }}>
                      <div className="avatar avatar-sm" style={{ background: "#0d6efd", color: "#fff" }}>{initials(u?.name)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{u?.name}</div>
                        <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{employee.department} · {employee.workload_percentage}% workload</div>
                        <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>
                          {skills.map(s => <span key={s.id} className="skill-tag" style={{ fontSize: 10 }}>{s.name}</span>)}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                        <span className="badge badge-blue">{matchCount}/{totalRequired} skills</span>
                        {isAssigned ? (
                          <span style={{ fontSize: 11, color: "var(--green)", fontWeight: 600 }}>✓ Assigned</span>
                        ) : (
                          <button className="btn btn-primary btn-sm" onClick={() => handleAssign(selected.id, employee.id)}>
                            Assign
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {showAssign && <AssignTaskModal onClose={() => setShowAssign(false)} onAssign={handleAssign} />}
    </>
  );
}
