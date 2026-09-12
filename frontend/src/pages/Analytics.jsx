import { TASKS, EMPLOYEES, TASK_ASSIGNMENTS, SKILLS, getEmployeeUser } from "../data/mockData";
import { MonitorCheck, Clock, Award, AlertTriangle, ShieldCheck } from "lucide-react";

export default function Analytics() {
  const totalTasks     = TASKS.length;
  const completedTasks = TASKS.filter(t => t.status === "done").length;
  const inProgress     = TASKS.filter(t => t.status === "in_progress").length;
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  const activeStaffCount = EMPLOYEES.filter(e => e.remote_status === "active").length;
  const avgProductivity  = Math.round(EMPLOYEES.reduce((acc, curr) => acc + (curr.productivity_score || 0), 0) / EMPLOYEES.length);

  const departments = [...new Set(EMPLOYEES.map(e => e.department))];

  const deptStats = departments.map(dept => {
    const emps = EMPLOYEES.filter(e => e.department === dept);
    const avgWorkload = Math.round(emps.reduce((acc, curr) => acc + curr.workload_percentage, 0) / emps.length);
    const avgScore = Math.round(emps.reduce((acc, curr) => acc + (curr.productivity_score || 0), 0) / emps.length);
    return {
      department: dept,
      employeesCount: emps.length,
      avgWorkload,
      avgScore,
      activeCount: emps.filter(e => e.remote_status === "active").length,
    };
  });

  return (
    <div>
      <div className="hero-section" style={{ marginBottom: 28 }}>
        <h1 className="hero-title" style={{ fontSize: 32 }}>Remote Workload & Productivity Analytics</h1>
        <p className="hero-subtitle">
          Real-time telemetry on remote staff productivity, active vs idle duration, and department workload distribution.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="features-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 32 }}>
        <div className="feature-card card-green-1">
          <h3 className="feature-card-title">{activeStaffCount} Active Staff</h3>
          <p className="feature-card-desc">Remotely logged in and actively working today.</p>
        </div>
        <div className="feature-card card-yellow">
          <h3 className="feature-card-title">{avgProductivity}% Productivity</h3>
          <p className="feature-card-desc">Average focused active time vs idle hours across teams.</p>
        </div>
        <div className="feature-card card-blue">
          <h3 className="feature-card-title">{completionRate}% Task Completion</h3>
          <p className="feature-card-desc">{completedTasks} of {totalTasks} allocated deliverables finished.</p>
        </div>
        <div className="feature-card card-peach">
          <h3 className="feature-card-title">0 Overtime Alerts</h3>
          <p className="feature-card-desc">Workloads balanced to prevent employee burnout.</p>
        </div>
      </div>

      {/* Remote Employee Productivity Leaderboard & Telemetry Table */}
      <div className="content-panel" style={{ marginBottom: 28 }}>
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Staff Productivity & Active Time Summary (WorkTime Metric)</h3>
            <div className="panel-subtitle">Non-invasive productivity and focused work telemetry</div>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Status</th>
                <th>Active Time</th>
                <th>Idle Time</th>
                <th>Productivity Score</th>
                <th>Burnout Risk</th>
              </tr>
            </thead>
            <tbody>
              {EMPLOYEES.map(emp => {
                const u = getEmployeeUser(emp);
                const pColor = emp.productivity_score >= 90 ? "#10b981" : emp.productivity_score >= 80 ? "#2563eb" : "#f59e0b";
                return (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{u?.name}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{emp.position}</div>
                    </td>
                    <td>{emp.department}</td>
                    <td>
                      <span className={`badge ${emp.remote_status === "active" ? "badge-green" : emp.remote_status === "in_meeting" ? "badge-purple" : emp.remote_status === "idle" ? "badge-amber" : "badge-gray"}`}>
                        {emp.remote_status || "offline"}
                      </span>
                    </td>
                    <td><strong style={{ color: "#15803d" }}>{emp.active_time || "0h"}</strong></td>
                    <td style={{ color: "#b45309" }}>{emp.idle_time || "0m"}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontWeight: 700, color: pColor }}>{emp.productivity_score}%</span>
                        <div className="progress-bar" style={{ width: 80 }}>
                          <div className="progress-fill" style={{ width: `${emp.productivity_score}%`, background: pColor }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${emp.burnout_risk === "High" ? "badge-red" : emp.burnout_risk === "Moderate" ? "badge-amber" : "badge-green"}`}>
                        {emp.burnout_risk}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Workload Summary */}
      <div className="content-panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Department Workload Distribution</h3>
            <div className="panel-subtitle">Capacity allocation across functional teams</div>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Department</th>
                <th>Total Team</th>
                <th>Active Remotely</th>
                <th>Average Productivity</th>
                <th>Average Capacity Load</th>
              </tr>
            </thead>
            <tbody>
              {deptStats.map(d => (
                <tr key={d.department}>
                  <td style={{ fontWeight: 600 }}>{d.department}</td>
                  <td>{d.employeesCount} staff</td>
                  <td><span className="badge badge-green">{d.activeCount} active</span></td>
                  <td><strong style={{ color: "#2563eb" }}>{d.avgScore}%</strong></td>
                  <td style={{ minWidth: 160 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                      <span>{d.avgWorkload}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${d.avgWorkload}%` }} />
                    </div>
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
