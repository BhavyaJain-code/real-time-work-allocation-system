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
import { motion } from "framer-motion";

export default function ManagerTasks() {
  const { user, managedDept } = useAuth();
  const navigate  = useNavigate();

  const [search,      setSearch]      = useState("");
  const [statusF,     setStatusF]     = useState("all");
  const [priorityF,   setPriorityF]   = useState("all");
  const [typeF,       setTypeF]       = useState("all");
  const [view,        setView]        = useState("table");
  const [selected,    setSelected]    = useState(null);
  const [showAssign,  setShowAssign]  = useState(false);
  const [assignTaskId,setAssignTaskId]= useState(null);
  const [assignments, setAssignments] = useState(TASK_ASSIGNMENTS);

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
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Department Tasks</div>
          <div className="page-subtitle">{managedDept ? `Managing for ${managedDept}` : ""} · {TASKS.length} total tasks in pool</div>
        </div>
        <motion.button
          className="btn btn-primary"
          onClick={() => { setAssignTaskId(null); setShowAssign(true); }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <UserCheck size={16} /> Assign Task to Team
        </motion.button>
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
        <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", marginLeft: "auto" }}>
          <button className={`btn btn-sm ${view === "table" ? "btn-primary" : "btn-ghost"}`} style={{ borderRadius: 0 }} onClick={() => setView("table")}>Table</button>
          <button className={`btn btn-sm ${view === "grid"  ? "btn-primary" : "btn-ghost"}`} style={{ borderRadius: 0 }} onClick={() => setView("grid")}>Grid</button>
        </div>
      </div>

      {view === "table" ? (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Est. Hours</th>
                  <th>Required Skills</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(task => {
                  const skills = getTaskSkills(task.id);
                  const assigned = isAssigned(task.id);
                  return (
                    <tr key={task.id}>
                      <td>
                        <div className="td-bold" style={{ color: "var(--text)" }}>{task.title}</div>
                        <div className="td-muted" style={{ maxWidth: 280, fontSize: 12 }}>{task.description}</div>
                      </td>
                      <td>
                        <span className={`badge ${TASK_TYPE_BADGE[task.task_type] || "badge-gray"}`}>
                          {TASK_TYPE_LABEL[task.task_type] || task.task_type}
                        </span>
                      </td>
                      <td><StatusBadge value={task.priority} type="priority" /></td>
                      <td><StatusBadge value={task.status} /></td>
                      <td className="td-muted">{task.deadline}</td>
                      <td><strong>{task.estimated_hours}h</strong></td>
                      <td>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {skills.map(s => <span key={s.id} className="skill-tag" style={{ fontSize: 11 }}>{s.name}</span>)}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setSelected(selected?.id === task.id ? null : task)}
                          >
                            <Users size={13} color="#ee27d7" /> Matches
                          </button>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => { setAssignTaskId(task.id); setShowAssign(true); }}
                          >
                            Assign
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map(task => (
            <div key={task.id} style={{ display: "flex", flexDirection: "column" }}>
              <TaskCard task={task} />
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => setSelected(selected?.id === task.id ? null : task)}>
                  <Users size={13} color="#ee27d7" /> Matches
                </button>
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => { setAssignTaskId(task.id); setShowAssign(true); }}>
                  Assign
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skill Match Slide-in modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Matched Employees ({managedDept})</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{selected.title}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}><X size={16} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {getMatchedEmployees(selected.id).map(({ employee, matchCount, totalRequired }) => {
                const u = getEmployeeUser(employee);
                const av = avatarColors(u?.name || "");
                return (
                  <div key={employee.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "var(--surface-2)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                    <div className="avatar avatar-sm" style={{ background: av.bg, color: av.color }}>{initials(u?.name)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--text)" }}>{u?.name}</div>
                      <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{employee.department} · {employee.workload_percentage}% workload</div>
                    </div>
                    <span className="badge badge-accent">{matchCount}/{totalRequired} skills</span>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => { handleAssign(selected.id, employee.id); setSelected(null); }}
                    >
                      Assign
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showAssign && (
        <AssignTaskModal
          preselectedTaskId={assignTaskId}
          onClose={() => setShowAssign(false)}
          onAssign={handleAssign}
        />
      )}
    </div>
  );
}
