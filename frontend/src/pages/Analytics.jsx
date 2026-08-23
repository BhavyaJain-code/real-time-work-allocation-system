import { motion } from "framer-motion";
import { TASKS, EMPLOYEES, TASK_ASSIGNMENTS, SKILLS, EMPLOYEE_SKILLS } from "../data/mockData";
import { StaggerContainer, StaggerItem, FadeIn, AnimatedNumber } from "../components/motion/MotionPrimitives";

function AnimatedBar({ value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="chart-bar-wrap">
      <motion.span
        className="chart-bar-val"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {value}
      </motion.span>
      <motion.div
        className="chart-bar"
        initial={{ height: 0 }}
        animate={{ height: `${pct}%` }}
        transition={{ duration: 0.75, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ background: color, boxShadow: `0 0 14px ${color}44` }}
        whileHover={{ scale: 1.05 }}
      />
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
    { label: "Completion Rate", value: completionRate, suffix: "%", sub: `${completedTasks}/${totalTasks} tasks`, color: "var(--green)" },
    { label: "Avg. Workload",   value: avgWorkload, suffix: "%", sub: `Across ${EMPLOYEES.length} employees`, color: "var(--accent)" },
    { label: "Avg. Score",      value: avgScore || 0, sub: "Completed assignments", color: "var(--primary)" },
    { label: "Overdue Tasks",   value: TASKS.filter(t => t.deadline < new Date().toISOString().split("T")[0] && t.status !== "done").length, sub: "Need attention", color: "var(--secondary)" },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Analytics</div>
      </div>

      {/* Stats row */}
      <StaggerContainer className="stats-grid" staggerDelay={0.07}>
        {statCards.map((s, i) => (
          <StaggerItem key={i}>
            <motion.div
              className="stat-card"
              whileHover={{ y: -3, transition: { type: "spring", stiffness: 450, damping: 22 } }}
            >
              <span className="stat-label">{s.label}</span>
              <div className="stat-value" style={{ color: s.color }}>
                <AnimatedNumber value={s.value} suffix={s.suffix || ""} />
              </div>
              <div className="stat-sub">{s.sub}</div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeIn delay={0.15}>
        <div className="grid-2" style={{ alignItems: "start" }}>
          {/* Task Status Breakdown */}
          <div className="card">
            <div className="card-header"><span className="card-title">Tasks by Status</span></div>
            <div className="card-body">
              <div className="chart-bars">
                <AnimatedBar value={todo}           max={totalTasks} color="var(--muted)" />
                <AnimatedBar value={inProgress}     max={totalTasks} color="var(--accent)" />
                <AnimatedBar value={review}         max={totalTasks} color="var(--primary)" />
                <AnimatedBar value={completedTasks} max={totalTasks} color="var(--green)" />
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 14, justifyContent: "center", flexWrap: "wrap" }}>
                {[
                  { label: "To Do",       val: todo,           color: "var(--muted)" },
                  { label: "In Progress", val: inProgress,     color: "var(--accent)" },
                  { label: "In Review",   val: review,         color: "var(--primary)" },
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

          {/* Priority Breakdown with Berry Wine & Terracotta */}
          <div className="card">
            <div className="card-header"><span className="card-title">Tasks by Priority</span></div>
            <div className="card-body">
              <div className="chart-bars">
                <AnimatedBar value={priorityCounts.critical} max={totalTasks} color="var(--secondary)" />
                <AnimatedBar value={priorityCounts.high}     max={totalTasks} color="var(--accent)" />
                <AnimatedBar value={priorityCounts.medium}   max={totalTasks} color="var(--primary)" />
                <AnimatedBar value={priorityCounts.low}      max={totalTasks} color="var(--muted)" />
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 14, justifyContent: "center", flexWrap: "wrap" }}>
                {[
                  { label: "Critical", val: priorityCounts.critical, color: "var(--secondary)" },
                  { label: "High",     val: priorityCounts.high,     color: "var(--accent)" },
                  { label: "Medium",   val: priorityCounts.medium,   color: "var(--primary)" },
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
                  const color = d.avg >= 85 ? "var(--secondary)" : d.avg >= 60 ? "var(--accent)" : "var(--green)";
                  return (
                    <div key={d.dept}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                        <span style={{ fontWeight: 600 }}>{d.dept}</span>
                        <span style={{ fontWeight: 700, color }}>{d.avg}%</span>
                      </div>
                      <div className="progress-bar" style={{ height: 8 }}>
                        <motion.div
                          className="progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${d.avg}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          style={{ background: color }}
                        />
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
                      <span style={{ fontWeight: 700, color: "var(--accent)" }}>{s.count} emp.</span>
                    </div>
                    <div className="progress-bar" style={{ height: 8 }}>
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${(s.count / EMPLOYEES.length) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ background: "var(--accent)" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
