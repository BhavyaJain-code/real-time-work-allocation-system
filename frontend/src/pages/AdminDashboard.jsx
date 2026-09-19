import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TASKS, EMPLOYEES, getEmployeeUser } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedDeptModal, setSelectedDeptModal] = useState(null);

  const totalTasks = TASKS.length;
  const inProgressTasks = TASKS.filter(t => t.status === "in_progress").length;
  const completedTasks = TASKS.filter(t => t.status === "done").length;
  const activeNow = EMPLOYEES.filter(e => e.remote_status === "active").length;

  const hourlyData = [
    { hour: "12am", active: 0, idle: 0 },
    { hour: "2am", active: 0, idle: 0 },
    { hour: "4am", active: 0, idle: 0 },
    { hour: "6am", active: 2, idle: 2 },
    { hour: "8am", active: 16, idle: 4 },
    { hour: "9am", active: 48, idle: 4 },
    { hour: "10am", active: 52, idle: 3 },
    { hour: "11am", active: 38, idle: 5 },
    { hour: "12pm", active: 37, idle: 6 },
    { hour: "1pm", active: 14, idle: 4 },
    { hour: "2pm", active: 16, idle: 3 },
    { hour: "3pm", active: 12, idle: 4 },
    { hour: "4pm", active: 8, idle: 3 },
    { hour: "5pm", active: 4, idle: 2 },
    { hour: "6pm", active: 3, idle: 2 },
    { hour: "8pm", active: 1, idle: 1 },
    { hour: "10pm", active: 0, idle: 0 },
  ];

  const departmentsData = [
    {
      name: "Engineering",
      head: "Ravi Kapoor",
      totalStaff: EMPLOYEES.filter(e => e.department === "Engineering").length,
      activeStaff: EMPLOYEES.filter(e => e.department === "Engineering" && e.remote_status === "active").length,
      avgProductivity: 92,
      activeTasks: TASKS.filter(t => t.task_type?.toLowerCase().includes("backend") || t.task_type?.toLowerCase().includes("dev") || t.task_type?.toLowerCase().includes("api")).length,
      description: "Core software engineering, full-stack architecture, backend systems, and API development."
    },
    {
      name: "Design",
      head: "Nina Torres",
      totalStaff: EMPLOYEES.filter(e => e.department === "Design").length,
      activeStaff: EMPLOYEES.filter(e => e.department === "Design" && e.remote_status === "active").length,
      avgProductivity: 88,
      activeTasks: TASKS.filter(t => t.task_type?.toLowerCase().includes("design") || t.task_type?.toLowerCase().includes("ui")).length,
      description: "User experience research, UI systems, product wireframes, and brand aesthetics."
    },
    {
      name: "Data",
      head: "Sam Osei",
      totalStaff: EMPLOYEES.filter(e => e.department === "Data").length,
      activeStaff: EMPLOYEES.filter(e => e.department === "Data" && e.remote_status === "active").length,
      avgProductivity: 91,
      activeTasks: TASKS.filter(t => t.task_type?.toLowerCase().includes("data") || t.task_type?.toLowerCase().includes("model")).length,
      description: "Telemetry data pipelines, business intelligence, machine learning analytics, and reporting."
    }
  ];

  return (
    <div>
      {/* 2x2 Telemetry & Active Status Grid */}
      <div className="wt-grid-2x2">
        {/* Card 1: Active/Idle */}
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Active/Idle</h2>
          </div>
          <div>
            <div className="wt-count-callout">
              Total active staff: <strong>{activeNow}</strong> of <strong>{EMPLOYEES.length}</strong>
            </div>
            <table className="wt-table" style={{ marginBottom: 8 }}>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Total Hours</th>
                  <th>Per Empl / Day</th>
                  <th>Ratio</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Active Work</td>
                  <td>102h 09m</td>
                  <td>06h 48m</td>
                  <td><strong>85%</strong></td>
                </tr>
                <tr>
                  <td>Idle / Breaks</td>
                  <td>25h 42m</td>
                  <td>01h 42m</td>
                  <td>21%</td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td>Total Logged</td>
                  <td>127h 51m</td>
                  <td>08h 31m</td>
                  <td>107%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="wt-card-footer-link">
            <span className="wt-table-link" onClick={() => navigate("/admin/monitoring")}>More info</span>
          </div>
        </div>

        {/* Card 2: Attendance */}
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Attendance</h2>
          </div>
          <table className="wt-table" style={{ marginBottom: 8 }}>
            <thead>
              <tr>
                <th>Check-in Status</th>
                <th>Staff Count</th>
                <th>Percentage</th>
                <th>Compliance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Early Arrival</td>
                <td>4</td>
                <td>27%</td>
                <td>Optimal</td>
              </tr>
              <tr>
                <td>On-time (09:00 AM)</td>
                <td>8</td>
                <td><strong>53%</strong></td>
                <td>Compliant</td>
              </tr>
              <tr>
                <td>Late Arrival</td>
                <td>3</td>
                <td>20%</td>
                <td>Follow-up Sent</td>
              </tr>
              <tr style={{ fontWeight: "bold" }}>
                <td>Total Checked In</td>
                <td>15 / 15</td>
                <td>100%</td>
                <td>Full Attendance</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Hourly Activity Graph */}
      <div className="wt-card" style={{ marginBottom: 16 }}>
        <div className="wt-card-header">
          <div>
            <h2 className="wt-card-title">Hourly Activity (24 Hours)</h2>
            <div className="wt-card-subtitle">Real-time organizational telemetry: Active work vs. Idle intervals across all monitored hours</div>
          </div>
          <span className="wt-table-link" onClick={() => navigate("/admin/monitoring")}>Detailed Logs</span>
        </div>
        <div className="wt-hourly-chart">
          <div className="wt-hourly-bars">
            {hourlyData.map((d, i) => (
              <div key={i} className="wt-hourly-col" title={d.hour + ": " + d.active + "m active, " + d.idle + "m idle"}>
                <div className="wt-bar-idle" style={{ height: (d.idle / 60 * 100) + "%" }} />
                <div className="wt-bar-active" style={{ height: (d.active / 60 * 100) + "%" }} />
              </div>
            ))}
          </div>
          <div className="wt-hourly-labels">
            <span>12:00 am</span>
            <span>6:00 am</span>
            <span>12:00 pm</span>
            <span>6:00 pm</span>
            <span>10:00 pm</span>
          </div>
          <div className="wt-hourly-legend">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ display: "inline-block", width: 12, height: 12, backgroundColor: "var(--header)" }}></span>
              Active Work
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ display: "inline-block", width: 12, height: 12, backgroundColor: "var(--accent)" }}></span>
              Idle / Breaks
            </span>
          </div>
        </div>
      </div>

      {/* Department Performance Table (With Pop-up Modal) */}
      <div className="wt-card" style={{ marginBottom: 16 }}>
        <div className="wt-card-header">
          <div>
            <h2 className="wt-card-title">Department Performance</h2>
            <div className="wt-card-subtitle">Click on any department row to view detailed statistics and staff pop-up</div>
          </div>
        </div>
        <table className="wt-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Department Head</th>
              <th>Total Staff</th>
              <th>Active Now</th>
              <th>Avg Productivity</th>
              <th>Active Tasks</th>
            </tr>
          </thead>
          <tbody>
            {departmentsData.map(dept => (
              <tr 
                key={dept.name} 
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedDeptModal(dept)}
              >
                <td><strong>{dept.name}</strong></td>
                <td>{dept.head}</td>
                <td>{dept.totalStaff} staff</td>
                <td>{dept.activeStaff} staff</td>
                <td><strong>{dept.avgProductivity}%</strong></td>
                <td>{dept.activeTasks} tasks</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Workload Queue */}
      <div className="wt-card">
        <div className="wt-card-header">
          <div>
            <h2 className="wt-card-title">Workload Queue</h2>
            <div className="wt-card-subtitle">{totalTasks} tasks ({inProgressTasks} in progress, {completedTasks} completed)</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("/admin/tasks")}>
            Manage Tasks
          </button>
        </div>

        <table className="wt-table">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Type / Scope</th>
              <th>Estimated Hours</th>
              <th>Deadline</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {TASKS.slice(0, 5).map(task => (
              <tr key={task.id} style={{ cursor: "pointer" }} onClick={() => navigate("/admin/tasks")}>
                <td><strong>{task.title}</strong></td>
                <td>{task.task_type}</td>
                <td>{task.estimated_hours} hrs</td>
                <td>{task.deadline}</td>
                <td><StatusBadge value={task.priority} type="priority" /></td>
                <td><StatusBadge value={task.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DEPARTMENT POPUP MODAL */}
      {selectedDeptModal && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: 650 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: 16, textTransform: "uppercase" }}>
                Department Details: {selectedDeptModal.name}
              </h3>
              <button 
                className="btn btn-sm" 
                onClick={() => setSelectedDeptModal(null)}
                style={{ fontWeight: "bold" }}
              >
                Close
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: 12 }}>
                <p style={{ margin: "0 0 8px 0", fontSize: 13 }}>{selectedDeptModal.description}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, border: "1px solid var(--border)", padding: 10 }}>
                  <div><strong>Department Lead:</strong> {selectedDeptModal.head}</div>
                  <div><strong>Total Monitored Staff:</strong> {selectedDeptModal.totalStaff}</div>
                  <div><strong>Active Staff Right Now:</strong> {selectedDeptModal.activeStaff}</div>
                  <div><strong>Productivity Rating:</strong> {selectedDeptModal.avgProductivity}%</div>
                  <div><strong>Active Deliverables:</strong> {selectedDeptModal.activeTasks}</div>
                  <div><strong>Work Mode:</strong> 100% Remote / Hybrid</div>
                </div>
              </div>

              <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 6 }}>
                Staff Assigned to {selectedDeptModal.name}:
              </div>
              <table className="wt-table">
                <thead>
                  <tr>
                    <th>Staff Name</th>
                    <th>Position</th>
                    <th>Status</th>
                    <th>Daily Focus Task</th>
                  </tr>
                </thead>
                <tbody>
                  {EMPLOYEES.filter(e => e.department === selectedDeptModal.name).map(emp => {
                    const u = getEmployeeUser(emp);
                    return (
                      <tr key={emp.id}>
                        <td><strong>{u?.name}</strong></td>
                        <td>{emp.position}</td>
                        <td><StatusBadge value={emp.remote_status} /></td>
                        <td>{emp.current_activity}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-primary"
                onClick={() => { setSelectedDeptModal(null); navigate("/admin/employees"); }}
              >
                View Staff in Directory
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setSelectedDeptModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
