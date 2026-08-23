import { useState } from "react";
import { Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ACTIVITY_LOG, EMPLOYEES, TASKS, getEmployeeUser, getTask } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

const ACTION_META = {
  assigned:  { label: "Assigned",  cls: "badge-indigo" },
  started:   { label: "Started",   cls: "badge-blue"   },
  completed: { label: "Completed", cls: "badge-green"  },
  updated:   { label: "Updated",   cls: "badge-purple" },
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
          <div className="page-title">Activity Log</div>
          <div className="page-subtitle">{logs.length} entries</div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <Search size={15} className="search-icon" />
          <input className="search-input" placeholder="Search log…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={empF} onChange={e => setEmpF(e.target.value)}>
          <option value="all">All Employees</option>
          {EMPLOYEES.filter(e => visibleEmpIds.includes(e.id)).map(emp => {
            const u = getEmployeeUser(emp);
            return <option key={emp.id} value={emp.id}>{u?.name}</option>;
          })}
        </select>
        <select className="filter-select" value={actionF} onChange={e => setActionF(e.target.value)}>
          <option value="all">All Actions</option>
          <option value="assigned">Assigned</option>
          <option value="started">Started</option>
          <option value="completed">Completed</option>
          <option value="updated">Updated</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Employee</th>
                <th>Action</th>
                <th>Task</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--muted)", padding: 28 }}>No log entries found.</td></tr>
              ) : logs.map(l => {
                const emp  = EMPLOYEES.find(e => e.id === l.employee_id);
                const user = emp ? getEmployeeUser(emp) : null;
                const task = getTask(l.task_id);
                const meta = ACTION_META[l.action] || { label: l.action, cls: "badge-gray" };
                return (
                  <tr key={l.id}>
                    <td style={{ whiteSpace: "nowrap", fontSize: 12.5, color: "var(--text-2)" }}>{timeStr(l.timestamp)}</td>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{user?.name}</td>
                    <td><span className={`badge ${meta.cls}`}>{meta.label}</span></td>
                    <td style={{ fontWeight: 500, fontSize: 13, maxWidth: 180 }}>{task?.title || "—"}</td>
                    <td style={{ fontSize: 13, color: "var(--text-2)", maxWidth: 280 }}>{l.description}</td>
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
