import { useState } from "react";
import { Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ACTIVITY_LOG, EMPLOYEES, TASKS, getEmployeeUser, getTask } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

const ACTION_META = {
  assigned:  { label: "Assigned",  cls: "badge-blue"   },
  started:   { label: "Started",   cls: "badge-accent" },
  completed: { label: "Completed", cls: "badge-green"  },
  updated:   { label: "Updated",   cls: "badge-pink"   },
};

function timeStr(ts) {
  return new Date(ts).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function ActivityLog() {
  const { managedDept } = useAuth();
  const [empF,    setEmpF]    = useState("all");
  const [actionF, setActionF] = useState("all");
  const [search,  setSearch]  = useState("");

  const visibleEmpIds = managedDept
    ? EMPLOYEES.filter(e => e.department === managedDept).map(e => e.id)
    : EMPLOYEES.map(e => e.id);

  const logs = ACTIVITY_LOG
    .filter(l => visibleEmpIds.includes(l.employee_id))
    .filter(l => empF    === "all" || l.employee_id === Number(empF))
    .filter(l => actionF === "all" || l.action === actionF)
    .filter(l => {
      const q = search.toLowerCase();
      const task = getTask(l.task_id);
      return !q || l.description.toLowerCase().includes(q) || task?.title.toLowerCase().includes(q);
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Activity & Audit Register</div>
          <div className="page-subtitle">{logs.length} logged actions across team allocations</div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <Search size={15} className="search-icon" />
          <input className="search-input" placeholder="Search log description or task title…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={empF} onChange={e => setEmpF(e.target.value)}>
          <option value="all">All Employees</option>
          {EMPLOYEES.filter(e => visibleEmpIds.includes(e.id)).map(emp => {
            const u = getEmployeeUser(emp);
            return <option key={emp.id} value={emp.id}>{u?.name}</option>;
          })}
        </select>
        <select className="filter-select" value={actionF} onChange={e => setActionF(e.target.value)}>
          <option value="all">All Action Types</option>
          <option value="assigned">Assigned</option>
          <option value="started">Started</option>
          <option value="updated">Updated</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Employee</th>
                <th>Action Type</th>
                <th>Description</th>
                <th>Associated Task</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan={5} className="empty-state">No activity records match your criteria.</td></tr>
              ) : logs.map(l => {
                const emp  = EMPLOYEES.find(e => e.id === l.employee_id);
                const user = emp ? getEmployeeUser(emp) : null;
                const task = getTask(l.task_id);
                const meta = ACTION_META[l.action] || { label: l.action, cls: "badge-gray" };
                return (
                  <tr key={l.id}>
                    <td className="td-muted" style={{ whiteSpace: "nowrap", fontFamily: "monospace", color: "#d9c89a" }}>{timeStr(l.timestamp)}</td>
                    <td className="td-bold" style={{ color: "var(--text)" }}>{user?.name || "—"}</td>
                    <td>
                      <span className={`badge ${meta.cls}`} style={{ textTransform: "capitalize" }}>
                        {meta.label}
                      </span>
                    </td>
                    <td style={{ color: "var(--text)" }}>{l.description}</td>
                    <td>
                      {task ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontWeight: 700, color: "#f5d982", fontSize: 13 }}>{task.title}</span>
                          <StatusBadge value={task.priority} type="priority" />
                        </div>
                      ) : <span className="td-muted">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
