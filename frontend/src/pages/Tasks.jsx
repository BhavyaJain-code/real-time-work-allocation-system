import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Users, X, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
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
            <div className="page-title">Tasks Management</div>
            <div className="page-subtitle">{TASKS.length} total tasks across all priority tiers</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <motion.button
              className="btn btn-secondary"
              onClick={() => setShowAssign(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <UserCheck size={16} color="#ee27d7" /> Assign Task
            </motion.button>
            <motion.button
              className="btn btn-primary"
              onClick={() => navigate("/admin/tasks/create")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Plus size={16} /> Create Task
            </motion.button>
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
          <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", marginLeft: "auto" }}>
            <button
              className={`btn btn-sm ${view === "grid" ? "btn-primary" : "btn-ghost"}`}
              style={{ borderRadius: 0 }}
              onClick={() => setView("grid")}
            >Grid</button>
            <button
              className={`btn btn-sm ${view === "kanban" ? "btn-primary" : "btn-ghost"}`}
              style={{ borderRadius: 0 }}
              onClick={() => setView("kanban")}
            >Kanban</button>
          </div>
        </div>

        {view === "grid" ? (
          filtered.length === 0 ? (
            <div className="card"><div className="empty-state"><h3>No tasks found</h3><p>Try adjusting your search filters.</p></div></div>
          ) : (
            <div className="grid-3">
              {filtered.map(task => (
                <div key={task.id} style={{ display: "flex", flexDirection: "column" }}>
                  <TaskCard task={task} />
                  <motion.button
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: 8, width: "100%", borderColor: "var(--border)" }}
                    onClick={() => setSelected(selected?.id === task.id ? null : task)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Users size={13} color="#ee27d7" /> {selected?.id === task.id ? "Hide Matches" : "Match Employees"}
                  </motion.button>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="kanban">
            {["todo", "in_progress", "done"].map(col => {
              const colTasks = filtered.filter(t => t.status === col);
              const labels = { todo: "To Do", in_progress: "In Progress", done: "Done" };
              return (
                <div key={col} className="kanban-col">
                  <div className="kanban-col-header">
                    <span>{labels[col]}</span>
                    <span className="kanban-col-count">{colTasks.length}</span>
                  </div>
                  <div className="kanban-col-body">
                    {colTasks.map(task => <TaskCard key={task.id} task={task} />)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Skill Matching Slide-in / Modal panel */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Matched Employees</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{selected.title}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}><X size={16} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {matched.length === 0 ? (
                <p style={{ color: "var(--muted)", fontSize: 13 }}>No employees currently match the required skills.</p>
              ) : (
                matched.map(({ employee, matchCount, totalRequired }) => {
                  const u = getEmployeeUser(employee);
                  const av = avatarColors(u?.name || "");
                  const skills = getEmployeeSkills(employee.id);
                  const isAssigned = assignments.some(a => a.task_id === selected.id && a.employee_id === employee.id);
                  return (
                    <div key={employee.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--surface-2)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                      <div className="avatar avatar-sm" style={{ background: av.bg, color: av.color }}>{initials(u?.name)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--text)" }}>{u?.name}</div>
                        <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{employee.department} · {employee.workload_percentage}% workload</div>
                        <div style={{ display: "flex", gap: 4, marginTop: 5, flexWrap: "wrap" }}>
                          {skills.map(s => <span key={s.id} className="skill-tag" style={{ fontSize: 10 }}>{s.name}</span>)}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                        <span className="badge badge-accent">{matchCount}/{totalRequired} skills</span>
                        {isAssigned ? (
                          <span style={{ fontSize: 11, color: "var(--green)", fontWeight: 700 }}>✓ Assigned</span>
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
