import { TASKS, EMPLOYEES, TASK_ASSIGNMENTS, SKILLS, EMPLOYEE_SKILLS } from "../data/mockData";

function Bar({ value, max, color }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="chart-bar-wrap">
      <span className="chart-bar-val">{value}</span>
      <div className="chart-bar" style={{ height: `${pct}%`, background: color }} />
    </div>
  );
}

export default function Analytics() {
  const totalTasks     = TASKS.length;
  const completedTasks = TASKS.filter(t => t.status === "done").length;
  const inProgress     = TASKS.filter(t => t.status === "in_progress").length;
  const review         = TASKS.filter(t => t.status === "review").length;
  const todo           = TASKS.filter(t => t.status === "todo").length;

  const completionRate = Math.round((completedTasks / totalTasks) * 100);
  const avgWorkload    = Math.round(EMPLOYEES.reduce((s, e) => s + e.workload_percentage, 0) / EMPLOYEES.length);

  const completedAssignments = TASK_ASSIGNMENTS.filter(a => a.status === "completed" && a.assignment_score);
  const avgScore = completedAssignments.length
    ? Math.round(completedAssignments.reduce((s, a) => s + a.assignment_score, 0) / completedAssignments.length)
    : 0;

  const priorityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
  TASKS.forEach(t => { if (priorityCounts[t.priority] !== undefined) priorityCounts[t.priority]++; });

  const depts = [...new Set(EMPLOYEES.map(e => e.department))];
  const deptWorkload = depts.map(d => ({
    dept: d,
    avg: Math.round(EMPLOYEES.filter(e => e.department === d).reduce((s, e) => s + e.workload_percentage, 0) / EMPLOYEES.filter(e => e.department === d).length),
  }));

  // Skill coverage: how many employees have each skill
  const skillCoverage = SKILLS.map(s => ({
    name: s.name,
    count: EMPLOYEE_SKILLS.filter(e => e.skill_ids.includes(s.id)).length,
  })).sort((a, b) => b.count - a.count).slice(0, 6);

  const statCards = [
    { label: "Completion Rate", value: `${completionRate}%`, sub: `${completedTasks}/${totalTasks} tasks`, color: "var(--green)" },
    { label: "Avg. Workload",   value: `${avgWorkload}%`,    sub: `Across ${EMPLOYEES.length} employees`, color: "var(--blue)" },
    { label: "Avg. Score",      value: avgScore || "—",       sub: "Completed assignments", color: "var(--primary)" },
    { label: "Overdue Tasks",   value: TASKS.filter(t => t.deadline < new Date().toISOString().split("T")[0] && t.status !== "done").length, sub: "Need attention", color: "var(--red)" },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Analytics</div>
      </div>

      {/* Stats row */}
      <div className="stats-grid">
        {statCards.map((s, i) => (
          <div className="stat-card" key={i}>
            <span className="stat-label">{s.label}</span>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        {/* Task Status Breakdown */}
        <div className="card">
          <div className="card-header"><span className="card-title">Tasks by Status</span></div>
          <div className="card-body">
            <div className="chart-bars">
              <Bar value={todo}           max={totalTasks} color="var(--muted)" />
              <Bar value={inProgress}     max={totalTasks} color="var(--blue)" />
              <Bar value={review}         max={totalTasks} color="var(--purple)" />
              <Bar value={completedTasks} max={totalTasks} color="var(--green)" />
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 14, justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { label: "To Do",       val: todo,           color: "var(--muted)" },
                { label: "In Progress", val: inProgress,     color: "var(--blue)" },
                { label: "In Review",   val: review,         color: "var(--purple)" },
                { label: "Done",        val: completedTasks, color: "var(--green)" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, display: "inline-block" }} />
                  {s.label}: <strong>{s.val}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="card">
          <div className="card-header"><span className="card-title">Tasks by Priority</span></div>
          <div className="card-body">
            <div className="chart-bars">
              <Bar value={priorityCounts.critical} max={totalTasks} color="var(--red)" />
              <Bar value={priorityCounts.high}     max={totalTasks} color="var(--amber)" />
              <Bar value={priorityCounts.medium}   max={totalTasks} color="var(--blue)" />
              <Bar value={priorityCounts.low}      max={totalTasks} color="var(--muted)" />
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 14, justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { label: "Critical", val: priorityCounts.critical, color: "var(--red)" },
                { label: "High",     val: priorityCounts.high,     color: "var(--amber)" },
                { label: "Medium",   val: priorityCounts.medium,   color: "var(--blue)" },
                { label: "Low",      val: priorityCounts.low,      color: "var(--muted)" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, display: "inline-block" }} />
                  {s.label}: <strong>{s.val}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Workload */}
        <div className="card">
          <div className="card-header"><span className="card-title">Avg. Workload by Department</span></div>
          <div className="card-body">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {deptWorkload.map(d => {
                const color = d.avg >= 85 ? "var(--red)" : d.avg >= 60 ? "var(--amber)" : "var(--green)";
                return (
                  <div key={d.dept}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                      <span style={{ fontWeight: 600 }}>{d.dept}</span>
                      <span style={{ fontWeight: 700, color }}>{d.avg}%</span>
                    </div>
                    <div className="progress-bar" style={{ height: 8 }}>
                      <div className="progress-fill" style={{ width: `${d.avg}%`, background: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Skill Coverage */}
        <div className="card">
          <div className="card-header"><span className="card-title">Skill Coverage (Top 6)</span></div>
          <div className="card-body">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {skillCoverage.map(s => (
                <div key={s.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                    <span style={{ fontWeight: 600 }}>{s.name}</span>
                    <span style={{ fontWeight: 700, color: "var(--primary)" }}>{s.count} emp.</span>
                  </div>
                  <div className="progress-bar" style={{ height: 8 }}>
                    <div className="progress-fill" style={{ width: `${(s.count / EMPLOYEES.length) * 100}%`, background: "var(--primary)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
