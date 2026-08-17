import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { TASKS, getTaskSkills } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import TaskCard from "../components/TaskCard";

export default function Tasks() {
  const navigate = useNavigate();
  const [search, setSearch]     = useState("");
  const [statusF, setStatusF]   = useState("all");
  const [priorityF, setPriorityF] = useState("all");
  const [view, setView]         = useState("grid"); // "grid" | "table"

  const filtered = TASKS.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    const matchStatus = statusF   === "all" || t.status   === statusF;
    const matchPriority = priorityF === "all" || t.priority === priorityF;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tasks</div>
          <div className="page-subtitle">{TASKS.length} total tasks</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/admin/tasks/create")}>
          <Plus size={16} /> Create Task
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <Search size={15} className="search-icon" />
          <input
            className="search-input"
            placeholder="Search tasks…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
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

        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          <button className={`btn btn-sm ${view === "grid" ? "btn-primary" : "btn-secondary"}`} onClick={() => setView("grid")}>Grid</button>
          <button className={`btn btn-sm ${view === "table" ? "btn-primary" : "btn-secondary"}`} onClick={() => setView("table")}>Table</button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card"><div className="empty-state"><h3>No tasks found</h3><p>Try adjusting your filters.</p></div></div>
      ) : view === "grid" ? (
        <div className="grid-2">
          {filtered.map(t => <TaskCard key={t.id} task={t} />)}
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Est. Hours</th>
                  <th>Required Skills</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const skills = getTaskSkills(t.id);
                  return (
                    <tr key={t.id}>
                      <td>
                        <div className="td-bold">{t.title}</div>
                        <div className="td-muted">{t.description.slice(0, 50)}…</div>
                      </td>
                      <td><StatusBadge value={t.priority} type="priority" /></td>
                      <td><StatusBadge value={t.status} /></td>
                      <td className="td-muted">{t.deadline}</td>
                      <td className="td-bold">{t.estimated_hours}h</td>
                      <td>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {skills.map(s => <span key={s.id} className="skill-tag">{s.name}</span>)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
