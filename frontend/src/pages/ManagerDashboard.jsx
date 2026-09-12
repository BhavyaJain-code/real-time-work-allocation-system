import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TASKS, EMPLOYEES, TASK_ASSIGNMENTS, getEmployeeUser } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function ManagerDashboard() {
  const { user, managedDept } = useAuth();
  const navigate = useNavigate();

  const myEmployees = EMPLOYEES.filter(e => e.department === managedDept);
  const myEmpIds    = myEmployees.map(e => e.id);
  const deptAssignments = TASK_ASSIGNMENTS.filter(a => myEmpIds.includes(a.employee_id));

  const features = [
    { title: "Task Assignment", desc: `Assign ${managedDept} department tasks to team members.`, colorClass: "card-green-1", link: "/manager/tasks" },
    { title: "Staff Allocation", desc: "Allocate team resources based on skills and availability.", colorClass: "card-peach", link: "/manager/assignments" },
    { title: "Workload Tracking", desc: "Monitor active workloads and prevent department bottlenecks.", colorClass: "card-blue", link: "/manager/employees" },
    { title: "Performance Reports", desc: "View task completion statistics and appraisal feedback.", colorClass: "card-pink", link: "/manager/progress" },
  ];

  return (
    <div>
      <div className="hero-section">
        <h1 className="hero-title">{managedDept || "Department"} Work Allocation</h1>
        <p className="hero-subtitle">
          Manage task assignments, track staff capacity, and oversee department operations in real time.
        </p>
      </div>

      <div style={{ marginBottom: 36 }}>
        <h2 className="section-heading">Department Features</h2>
        <div className="features-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {features.map((f, i) => (
            <div key={i} className={`feature-card ${f.colorClass}`} onClick={() => navigate(f.link)}>
              <h3 className="feature-card-title">{f.title}</h3>
              <p className="feature-card-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        {/* Team Members */}
        <div className="content-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">{managedDept} Team Members ({myEmployees.length})</h3>
              <div className="panel-subtitle">Current workload distribution</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {myEmployees.map(emp => {
              const u = getEmployeeUser(emp);
              const wColor = emp.workload_percentage >= 85 ? "#ef4444" : emp.workload_percentage >= 60 ? "#f59e0b" : "#10b981";
              return (
                <div key={emp.id} style={{ padding: "10px 12px", background: "#f9fafb", borderRadius: 8, border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontWeight: 600 }}>{u?.name} ({emp.position})</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: wColor }}>{emp.workload_percentage}% Workload</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${emp.workload_percentage}%`, background: wColor }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Department Assignments */}
        <div className="content-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Active Department Assignments</h3>
              <div className="panel-subtitle">{deptAssignments.length} total tasks assigned</div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/manager/tasks")}>
              Allocate Task
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Assigned Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {deptAssignments.slice(0, 5).map(a => {
                  const task = TASKS.find(t => t.id === a.task_id);
                  return (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 600 }}>{task?.title}</td>
                      <td style={{ color: "#6b7280" }}>{a.assigned_at}</td>
                      <td><StatusBadge value={a.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
