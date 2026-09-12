import { TASKS, EMPLOYEES, TASK_ASSIGNMENTS, SKILLS } from "../data/mockData";

export default function Analytics() {
  const totalTasks     = TASKS.length;
  const completedTasks = TASKS.filter(t => t.status === "done").length;
  const inProgress     = TASKS.filter(t => t.status === "in_progress").length;
  const todoTasks      = TASKS.filter(t => t.status === "todo").length;
  const reviewTasks    = TASKS.filter(t => t.status === "review").length;
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  const departments = [...new Set(EMPLOYEES.map(e => e.department))];

  const deptStats = departments.map(dept => {
    const emps = EMPLOYEES.filter(e => e.department === dept);
    const avgWorkload = Math.round(emps.reduce((acc, curr) => acc + curr.workload_percentage, 0) / emps.length);
    return {
      department: dept,
      employeesCount: emps.length,
      avgWorkload,
      availableCount: emps.filter(e => e.availability_status === "available").length,
    };
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">System Analytics & Reports</div>
          <div className="page-subtitle">Summary statistics and workload distribution across departments</div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Registered Tasks</span>
          <div className="stat-value">{totalTasks}</div>
          <div className="stat-sub">Across all categories</div>
        </div>
        <div className="stat-card">
          <span className="stat-label">Tasks Completed</span>
          <div className="stat-value" style={{ color: "#198754" }}>{completedTasks}</div>
          <div className="stat-sub">{completionRate}% Completion Rate</div>
        </div>
        <div className="stat-card">
          <span className="stat-label">Tasks In Progress</span>
          <div className="stat-value" style={{ color: "#0d6efd" }}>{inProgress}</div>
          <div className="stat-sub">Active assignments</div>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Skills Indexed</span>
          <div className="stat-value">{SKILLS.length}</div>
          <div className="stat-sub">In database registry</div>
        </div>
      </div>

      {/* Status Breakdown & Priority Grid */}
      <div className="grid-2" style={{ alignItems: "start" }}>
        {/* Task Status Breakdown */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Task Status Breakdown</span>
          </div>
          <div className="card-body">
            {[
              { label: "Completed (Done)", count: completedTasks, color: "#198754" },
              { label: "In Progress",       count: inProgress,     color: "#0d6efd" },
              { label: "Under Review",      count: reviewTasks,    color: "#6f42c1" },
              { label: "To Do (Pending)",   count: todoTasks,      color: "#6c757d" },
            ].map(item => {
              const pct = Math.round((item.count / totalTasks) * 100);
              return (
                <div key={item.label} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span>{item.label}</span>
                    <strong>{item.count} tasks ({pct}%)</strong>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: item.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Task Priority Distribution</span>
          </div>
          <div className="card-body">
            {["critical", "high", "medium", "low"].map(p => {
              const count = TASKS.filter(t => t.priority === p).length;
              const pct = Math.round((count / totalTasks) * 100);
              const color = p === "critical" ? "#dc3545" : p === "high" ? "#fd7e14" : p === "medium" ? "#0d6efd" : "#6c757d";
              return (
                <div key={p} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4, textTransform: "capitalize" }}>
                    <span>{p} Priority</span>
                    <strong>{count} tasks ({pct}%)</strong>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Department Summary Table */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header">
          <span className="card-title">Department Workload & Availability Summary</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Department</th>
                <th>Total Team Members</th>
                <th>Available Members</th>
                <th>Average Workload</th>
                <th>Capacity Status</th>
              </tr>
            </thead>
            <tbody>
              {deptStats.map(d => (
                <tr key={d.department}>
                  <td className="td-bold">{d.department}</td>
                  <td>{d.employeesCount} employees</td>
                  <td><span className="badge badge-green">{d.availableCount} available</span></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, maxWidth: 160 }}>
                      <div className="progress-bar" style={{ flex: 1 }}>
                        <div className="progress-fill" style={{ width: `${d.avgWorkload}%` }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{d.avgWorkload}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${d.avgWorkload >= 80 ? "badge-red" : d.avgWorkload >= 50 ? "badge-blue" : "badge-green"}`}>
                      {d.avgWorkload >= 80 ? "High Load" : d.avgWorkload >= 50 ? "Balanced" : "Optimal"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
