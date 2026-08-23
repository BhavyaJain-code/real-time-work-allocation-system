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
  const [view,      setView]      = useState("grid");
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
          <div className="page-title">Tasks</div>
          <div className="page-subtitle">{TASKS.length} total tasks</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary" onClick={() => setShowAssign(true)}>
            <UserCheck size={16} /> Assign Task
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/admin/tasks/create")}>
            <Plus size={16} /> Create Task
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <Search size={15} className="search-icon" />
          <input className="search-input" placeholder="Search tasks…" value={search} onChange={e => setSearch(e.target.value)} />
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
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          <button className={`btn btn-sm ${view === "grid"  ? "btn-primary" : "btn-secondary"}`} onClick={() => setView("grid")}>Grid</button>
          <button className={`btn btn-sm ${view === "table" ? "btn-primary" : "btn-secondary"}`} onClick={() => setView("table")}>Table</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {filtered.length === 0 ? (
            <div className="card"><div className="empty-state"><h3>No tasks found</h3><p>Try adjusting your filters.</p></div></div>
          ) : view === "grid" ? (
            <div className="grid-2">
              {filtered.map(t => (
                <div key={t.id} onClick={() => setSelected(s => s?.id === t.id ? null : t)} style={{ cursor: "pointer" }}>
                  <div style={{ border: selected?.id === t.id ? "2px solid var(--primary)" : "2px solid transparent", borderRadius: "var(--radius-lg)" }}>
                    <div style={{ padding: "4px 10px", background: "var(--surface-2)", borderRadius: "var(--radius-lg) var(--radius-lg) 0 0", display: "flex", gap: 6, borderBottom: "1px solid var(--border)" }}>
                      <span className={`badge ${TASK_TYPE_BADGE[t.task_type] || "badge-gray"}`}>{TASK_TYPE_LABEL[t.task_type]}</span>
                    </div>
                    <TaskCard task={t} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Title</th><th>Type</th><th>Priority</th><th>Status</th><th>Deadline</th><th>Est. Hours</th><th>Skills</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map(t => {
                      const skills = getTaskSkills(t.id);
                      return (
                        <tr key={t.id} style={{ cursor: "pointer", background: selected?.id === t.id ? "var(--primary-lt)" : undefined }} onClick={() => setSelected(s => s?.id === t.id ? null : t)}>
                          <td><div className="td-bold">{t.title}</div><div className="td-muted">{t.description.slice(0,50)}…</div></td>
                          <td><span className={`badge ${TASK_TYPE_BADGE[t.task_type]}`}>{TASK_TYPE_LABEL[t.task_type]}</span></td>
                          <td><StatusBadge value={t.priority} type="priority" /></td>
                          <td><StatusBadge value={t.status} /></td>
                          <td className="td-muted">{t.deadline}</td>
                          <td className="td-bold">{t.estimated_hours}h</td>
                          <td><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{skills.map(s => <span key={s.id} className="skill-tag">{s.name}</span>)}</div></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Skill-match side panel */}
        {selected && (
          <div style={{ width: 300, flexShrink: 0 }}>
            <div className="card">
              <div className="card-header">
                <span className="card-title" style={{ display: "flex", alignItems: "center", gap: 7 }}><Users size={15} /> Skill-Matched</span>
                <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}><X size={15} /></button>
              </div>
              <div style={{ padding: "10px 14px", background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{selected.title}</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 6 }}>
                  {getTaskSkills(selected.id).map(s => <span key={s.id} className="skill-tag">{s.name}</span>)}
                </div>
              </div>
              {matched.length === 0 ? (
                <div className="empty-state" style={{ padding: 24 }}><p>No employees match these skills.</p></div>
              ) : matched.map(({ employee, matchCount, totalRequired }) => {
                const user   = getEmployeeUser(employee);
                const skills = getEmployeeSkills(employee.id);
                const av     = avatarColors(user?.name || "");
                const matchPct = Math.round((matchCount / totalRequired) * 100);
                return (
                  <div key={employee.id} style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
                      <div className="avatar avatar-sm" style={{ background: av.bg, color: av.color }}>{initials(user?.name)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
                        <div style={{ fontSize: 11.5, color: "var(--text-2)" }}>{employee.department}</div>
                      </div>
                      <StatusBadge value={employee.availability_status} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <div className="progress-bar" style={{ flex: 1 }}>
                        <div className="progress-fill" style={{ width: `${matchPct}%`, background: matchPct === 100 ? "var(--green)" : "var(--amber)" }} />
                      </div>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: matchPct === 100 ? "var(--green)" : "var(--amber)" }}>{matchCount}/{totalRequired}</span>
                    </div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {skills.map(s => {
                        const required = selected.required_skill_ids.includes(s.id);
                        return (
                          <span key={s.id} className="skill-tag" style={{ background: required ? "var(--green-lt)" : "var(--primary-lt)", color: required ? "#065f46" : "var(--primary-dk)", fontWeight: required ? 700 : 500 }}>
                            {s.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      </div>

      {showAssign && (
        <AssignTaskModal
          onClose={() => setShowAssign(false)}
          onAssign={handleAssign}
        />
      )}
    </>
  );
}
