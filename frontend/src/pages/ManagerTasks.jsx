import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserCheck, Plus, X, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  TASKS, EMPLOYEES, TASK_ASSIGNMENTS,
  getTaskSkills, getMatchedEmployees, getEmployeeUser,
  initials, avatarColors, TASK_TYPE_LABEL, TASK_TYPE_BADGE
} from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import TaskCard from "../components/TaskCard";
import AssignTaskModal from "../components/AssignTaskModal";

export default function ManagerTasks() {
  const { user, managedDept } = useAuth();
  const navigate  = useNavigate();

  const [search,      setSearch]      = useState("");
  const [statusF,     setStatusF]     = useState("all");
  const [priorityF,   setPriorityF]   = useState("all");
  const [typeF,       setTypeF]       = useState("all");
  const [view,        setView]        = useState("table");
  const [selected,    setSelected]    = useState(null);   // task for skill panel
  const [showAssign,  setShowAssign]  = useState(false);
  const [assignTaskId,setAssignTaskId]= useState(null);   // pre-selected task for assign modal
  const [assignments, setAssignments] = useState(TASK_ASSIGNMENTS);

  const myEmpIds = managedDept ? EMPLOYEES.filter(e => e.department === managedDept).map(e => e.id) : EMPLOYEES.map(e => e.id);

  const filtered = TASKS.filter(t => {
    const q = search.toLowerCase();
    return (t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
      && (statusF   === "all" || t.status   === statusF)
      && (priorityF === "all" || t.priority === priorityF)
      && (typeF     === "all" || t.task_type === typeF);
  });

  const isAssigned = (taskId) => assignments.some(a => a.task_id === taskId);

  const handleAssign = (taskId, empId) => {
    const newA = {
      id: Date.now(), task_id: taskId, employee_id: empId,
      assigned_at: new Date().toISOString().split("T")[0],
      started_at: null, completed_at: null, assignment_score: null, status: "assigned",
    };
    setAssignments(a => [...a, newA]);
    alert(`Task assigned successfully!`);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tasks</div>
          <div className="page-subtitle">{managedDept ? `Managing for ${managedDept}` : ""} · {TASKS.length} total</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setAssignTaskId(null); setShowAssign(true); }}>
          <UserCheck size={16} /> Assign Task
        </button>
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
          <button className={`btn btn-sm ${view === "table" ? "btn-primary" : "btn-secondary"}`} onClick={() => setView("table")}>Table</button>
          <button className={`btn btn-sm ${view === "grid"  ? "btn-primary" : "btn-secondary"}`} onClick={() => setView("grid")}>Grid</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {filtered.length === 0 ? (
            <div className="card"><div className="empty-state"><h3>No tasks found</h3></div></div>
          ) : view === "table" ? (
            <div className="card">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Title</th><th>Type</th><th>Priority</th><th>Status</th><th>Deadline</th><th>Assigned</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map(t => {
                      const skills  = getTaskSkills(t.id);
                      const assigned = isAssigned(t.id);
                      return (
                        <tr key={t.id}
                          style={{ background: selected?.id === t.id ? "var(--primary-lt)" : undefined, cursor: "pointer" }}
                          onClick={() => setSelected(s => s?.id === t.id ? null : t)}>
                          <td>
                            <div className="td-bold">{t.title}</div>
                            <div style={{ display: "flex", gap: 4, marginTop: 3, flexWrap: "wrap" }}>
                              {skills.map(s => <span key={s.id} className="skill-tag">{s.name}</span>)}
                            </div>
                          </td>
                          <td><span className={`badge ${TASK_TYPE_BADGE[t.task_type]}`}>{TASK_TYPE_LABEL[t.task_type]}</span></td>
                          <td><StatusBadge value={t.priority} type="priority" /></td>
                          <td><StatusBadge value={t.status} /></td>
                          <td className="td-muted">{t.deadline}</td>
                          <td>
                            {assigned
                              ? <span className="badge badge-green">Assigned</span>
                              : <span className="badge badge-gray">Unassigned</span>}
                          </td>
                          <td onClick={e => e.stopPropagation()}>
                            {!assigned && t.status !== "done" && (
                              <button className="btn btn-primary btn-sm"
                                onClick={() => { setAssignTaskId(t.id); setShowAssign(true); }}>
                                <UserCheck size={13} /> Assign
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid-2">
              {filtered.map(t => {
                const assigned = isAssigned(t.id);
                return (
                  <div key={t.id} style={{ position: "relative" }}>
                    <div style={{
                      border: selected?.id === t.id ? "2px solid var(--primary)" : "2px solid transparent",
                      borderRadius: "var(--radius-lg)",
                    }} onClick={() => setSelected(s => s?.id === t.id ? null : t)}>
                      <div style={{ padding: "4px 10px", display: "flex", gap: 6, justifyContent: "space-between", background: "var(--surface-2)", borderRadius: "var(--radius-lg) var(--radius-lg) 0 0", borderBottom: "1px solid var(--border)" }}>
                        <span className={`badge ${TASK_TYPE_BADGE[t.task_type]}`}>{TASK_TYPE_LABEL[t.task_type]}</span>
                        {!assigned && t.status !== "done" && (
                          <button className="btn btn-primary btn-sm" style={{ padding: "2px 10px" }}
                            onClick={e => { e.stopPropagation(); setAssignTaskId(t.id); setShowAssign(true); }}>
                            <UserCheck size={12} /> Assign
                          </button>
                        )}
                      </div>
                      <TaskCard task={t} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Skill-match panel */}
        {selected && (
          <div style={{ width: 280, flexShrink: 0 }}>
            <div className="card">
              <div className="card-header">
                <span className="card-title" style={{ display: "flex", gap: 6, alignItems: "center" }}><Users size={14} /> Matched</span>
                <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}><X size={14} /></button>
              </div>
              {getMatchedEmployees(selected.id)
                .filter(m => myEmpIds.includes(m.employee.id))
                .map(({ employee, matchCount, totalRequired }) => {
                  const u  = getEmployeeUser(employee);
                  const av = avatarColors(u?.name || "");
                  return (
                    <div key={employee.id} style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
                        <div className="avatar avatar-sm" style={{ background: av.bg, color: av.color }}>{initials(u?.name)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{u?.name}</div>
                          <div style={{ fontSize: 11, color: "var(--muted)" }}>{matchCount}/{totalRequired} skills match</div>
                        </div>
                        <StatusBadge value={employee.availability_status} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {showAssign && (
        <AssignTaskModal
          onClose={() => { setShowAssign(false); setAssignTaskId(null); }}
          onAssign={handleAssign}
          limitEmpIds={myEmpIds}
          initialTaskId={assignTaskId}
        />
      )}
    </div>
  );
}
