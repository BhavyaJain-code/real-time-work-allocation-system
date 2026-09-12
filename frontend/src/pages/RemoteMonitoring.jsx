import { useState, useEffect } from "react";
import { 
  MonitorCheck, Clock, Users, Activity, AlertTriangle, ShieldCheck, 
  Search, Filter, Play, Pause, RefreshCw, Download, CheckCircle2, 
  Flame, Coffee, Video, Laptop, TrendingUp, Eye, FileSpreadsheet
} from "lucide-react";
import { EMPLOYEES, getEmployeeUser, STATUS_BADGE, STATUS_LABEL } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function RemoteMonitoring() {
  const [employeesList, setEmployeesList] = useState(EMPLOYEES);
  const [activeTab, setActiveTab] = useState("whats_now"); // 'whats_now' | 'attendance' | 'active_idle' | 'productivity' | 'burnout'
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSimulating, setIsSimulating] = useState(true);

  // Auto-tick simulation for active time
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setEmployeesList(prev => prev.map(emp => {
        if (emp.remote_status === "active") {
          return {
            ...emp,
            last_ping: "Just now"
          };
        }
        return emp;
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, [isSimulating]);

  // Filtering
  const filtered = employeesList.filter(emp => {
    const u = getEmployeeUser(emp);
    const matchesStatus = statusFilter === "all" || emp.remote_status === statusFilter;
    const matchesDept = deptFilter === "all" || emp.department === deptFilter;
    const matchesSearch = !searchTerm || 
      u?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.current_activity.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesDept && matchesSearch;
  });

  const activeCount = employeesList.filter(e => e.remote_status === "active").length;
  const idleCount = employeesList.filter(e => e.remote_status === "idle").length;
  const meetingCount = employeesList.filter(e => e.remote_status === "in_meeting").length;
  const offlineCount = employeesList.filter(e => e.remote_status === "offline").length;
  const avgProd = Math.round(employeesList.reduce((a, b) => a + (b.productivity_score || 0), 0) / employeesList.length);
  const overtimeCount = employeesList.filter(e => e.burnout_risk === "High").length;

  // Toggle status for simulation
  const handleStatusChange = (empId, newStatus) => {
    setEmployeesList(prev => prev.map(e => {
      if (e.id === empId) {
        return {
          ...e,
          remote_status: newStatus,
          current_activity: newStatus === "active" ? "VS Code · Active Development" :
                            newStatus === "in_meeting" ? "Zoom · Team Sync" :
                            newStatus === "idle" ? "Idle / Away from keyboard" : "Logged Off"
        };
      }
      return e;
    }));
  };

  // Export WorkTime report to CSV
  const exportCSV = () => {
    const headers = "Employee Name,Department,Position,Status,Login Time,Active Time,Idle Time,Productivity Score,Burnout Risk,Current Activity\n";
    const rows = employeesList.map(e => {
      const u = getEmployeeUser(e);
      return `"${u?.name}","${e.department}","${e.position}","${e.remote_status}","${e.login_time}","${e.active_time}","${e.idle_time}","${e.productivity_score}%","${e.burnout_risk}","${e.current_activity}"`;
    });
    const blob = new Blob([headers + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `WorkTime_Remote_Monitoring_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-section" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 className="hero-title" style={{ fontSize: 28, display: "flex", alignItems: "center", gap: 10 }}>
              <MonitorCheck size={28} color="#2563eb" /> WorkTime Remote Monitoring
            </h1>
            <p className="hero-subtitle">
              Live tracking of "What's going on in the company right now", active vs. idle hours, attendance logs, and non-invasive productivity metrics.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button 
              className={`btn btn-sm ${isSimulating ? "btn-secondary" : "btn-primary"}`} 
              onClick={() => setIsSimulating(!isSimulating)}
              title="Live Telemetry Heartbeat"
            >
              {isSimulating ? <Pause size={14} /> : <Play size={14} />}
              {isSimulating ? "Live Telemetry ON" : "Telemetry Paused"}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={exportCSV}>
              <Download size={14} /> Export Report (CSV)
            </button>
          </div>
        </div>
      </div>

      {/* Top 6 WorkTime Metric Cards */}
      <div className="features-grid" style={{ gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 24 }}>
        <div className="feature-card card-green-1" style={{ padding: 14 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#166534" }}>{activeCount}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#166534" }}>Active Working</div>
          <div style={{ fontSize: 11, color: "#15803d" }}>Currently at desk</div>
        </div>

        <div className="feature-card card-yellow" style={{ padding: 14 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#92400e" }}>{idleCount}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#92400e" }}>Idle / Break</div>
          <div style={{ fontSize: 11, color: "#b45309" }}>Away from desk</div>
        </div>

        <div className="feature-card card-peach" style={{ padding: 14 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#9a3412" }}>{meetingCount}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#9a3412" }}>In Meeting</div>
          <div style={{ fontSize: 11, color: "#c2410c" }}>Video / Voice call</div>
        </div>

        <div className="feature-card card-pink" style={{ padding: 14 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#9d174d" }}>{offlineCount}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#9d174d" }}>Offline</div>
          <div style={{ fontSize: 11, color: "#be185d" }}>Logged out</div>
        </div>

        <div className="feature-card card-blue" style={{ padding: 14 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#1e40af" }}>{avgProd}%</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#1e40af" }}>Avg Productivity</div>
          <div style={{ fontSize: 11, color: "#2563eb" }}>WorkTime Index</div>
        </div>

        <div className="feature-card card-green-2" style={{ padding: 14 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: overtimeCount > 0 ? "#b91c1c" : "#166534" }}>
            {overtimeCount}
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#1f2937" }}>Overtime Alert</div>
          <div style={{ fontSize: 11, color: overtimeCount > 0 ? "#b91c1c" : "#166534" }}>
            {overtimeCount > 0 ? "High burnout risk" : "All healthy"}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: 8, borderBottom: "2px solid #e5e7eb", marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab("whats_now")}
          style={{
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 600,
            border: "none",
            background: "none",
            cursor: "pointer",
            borderBottom: activeTab === "whats_now" ? "3px solid #2563eb" : "3px solid transparent",
            color: activeTab === "whats_now" ? "#2563eb" : "#4b5563"
          }}
        >
          🟢 "What&apos;s Now" Live Feed
        </button>

        <button
          onClick={() => setActiveTab("attendance")}
          style={{
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 600,
            border: "none",
            background: "none",
            cursor: "pointer",
            borderBottom: activeTab === "attendance" ? "3px solid #2563eb" : "3px solid transparent",
            color: activeTab === "attendance" ? "#2563eb" : "#4b5563"
          }}
        >
          📋 Attendance &amp; Shift Logs
        </button>

        <button
          onClick={() => setActiveTab("active_idle")}
          style={{
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 600,
            border: "none",
            background: "none",
            cursor: "pointer",
            borderBottom: activeTab === "active_idle" ? "3px solid #2563eb" : "3px solid transparent",
            color: activeTab === "active_idle" ? "#2563eb" : "#4b5563"
          }}
        >
          ⏱️ Active vs. Idle Timeline
        </button>

        <button
          onClick={() => setActiveTab("productivity")}
          style={{
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 600,
            border: "none",
            background: "none",
            cursor: "pointer",
            borderBottom: activeTab === "productivity" ? "3px solid #2563eb" : "3px solid transparent",
            color: activeTab === "productivity" ? "#2563eb" : "#4b5563"
          }}
        >
          🎯 Productivity &amp; Distraction Scoring
        </button>

        <button
          onClick={() => setActiveTab("burnout")}
          style={{
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 600,
            border: "none",
            background: "none",
            cursor: "pointer",
            borderBottom: activeTab === "burnout" ? "3px solid #2563eb" : "3px solid transparent",
            color: activeTab === "burnout" ? "#2563eb" : "#4b5563"
          }}
        >
          ⚠️ Burnout &amp; Overtime Risk
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="filter-toolbar" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", flex: 1 }}>
          <div style={{ position: "relative", minWidth: 240 }}>
            <input 
              type="text" 
              placeholder="Search staff, app, or position..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ paddingLeft: 32 }}
            />
            <Search size={14} style={{ position: "absolute", left: 10, top: 12, color: "#9ca3af" }} />
          </div>

          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="form-control"
            style={{ width: "auto" }}
          >
            <option value="all">All Remote Statuses</option>
            <option value="active">🟢 Active Now</option>
            <option value="idle">🟡 Idle / Break</option>
            <option value="in_meeting">🟣 In Meeting</option>
            <option value="offline">⚪ Offline</option>
          </select>

          <select 
            value={deptFilter} 
            onChange={e => setDeptFilter(e.target.value)}
            className="form-control"
            style={{ width: "auto" }}
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Data">Data</option>
          </select>
        </div>

        <div style={{ fontSize: 13, color: "#6b7280" }}>
          Showing <strong>{filtered.length}</strong> of <strong>{employeesList.length}</strong> remote staff
        </div>
      </div>

      {/* TAB 1: WHAT'S GOING ON IN THE COMPANY RIGHT NOW */}
      {activeTab === "whats_now" && (
        <div className="content-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">What&apos;s Going On In The Company Right Now</h3>
              <div className="panel-subtitle">Real-time status indicators, active focus applications, and live timers</div>
            </div>
            <span className="badge badge-green">Live Monitoring Active</span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>Current Status</th>
                  <th>Active Focus Window / App</th>
                  <th>Active Today</th>
                  <th>Idle Today</th>
                  <th>Productivity Index</th>
                  <th>Simulate Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(emp => {
                  const u = getEmployeeUser(emp);
                  const pColor = emp.productivity_score >= 90 ? "#10b981" : emp.productivity_score >= 80 ? "#2563eb" : "#f59e0b";
                  return (
                    <tr key={emp.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: "#111827" }}>{u?.name}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{emp.position} · {emp.department}</div>
                      </td>
                      <td>
                        <StatusBadge value={emp.remote_status} />
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {emp.remote_status === "in_meeting" ? <Video size={14} color="#7c3aed" /> :
                           emp.remote_status === "idle" ? <Coffee size={14} color="#d97706" /> :
                           emp.remote_status === "active" ? <Laptop size={14} color="#2563eb" /> : null}
                          <span style={{ fontSize: 13, color: "#1f2937", fontWeight: 500 }}>
                            {emp.current_activity}
                          </span>
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: "#15803d" }}>{emp.active_time}</strong>
                      </td>
                      <td style={{ color: "#b45309" }}>{emp.idle_time}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontWeight: 700, color: pColor }}>{emp.productivity_score}%</span>
                          <div className="progress-bar" style={{ width: 60 }}>
                            <div className="progress-fill" style={{ width: `${emp.productivity_score}%`, background: pColor }} />
                          </div>
                        </div>
                      </td>
                      <td>
                        <select
                          className="form-control"
                          style={{ fontSize: 11, padding: "4px 8px", width: "auto" }}
                          value={emp.remote_status}
                          onChange={(e) => handleStatusChange(emp.id, e.target.value)}
                        >
                          <option value="active">Active</option>
                          <option value="idle">Idle / Break</option>
                          <option value="in_meeting">In Meeting</option>
                          <option value="offline">Offline</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE & SHIFT TRACKER */}
      {activeTab === "attendance" && (
        <div className="content-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Remote Attendance &amp; Shift Registry</h3>
              <div className="panel-subtitle">Login punctuality, active shift hours, and remote check-ins</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={exportCSV}>
              <Download size={14} /> Download Attendance
            </button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Shift Login Time</th>
                  <th>Punctuality</th>
                  <th>Total Active Time</th>
                  <th>Total Idle/Breaks</th>
                  <th>Total Shift Logged</th>
                  <th>Attendance Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(emp => {
                  const u = getEmployeeUser(emp);
                  const isLate = emp.login_time > "09:00 AM";
                  const isPresent = emp.remote_status !== "offline";
                  return (
                    <tr key={emp.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{u?.name}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{emp.department}</div>
                      </td>
                      <td>
                        <strong>{emp.login_time}</strong>
                      </td>
                      <td>
                        {emp.remote_status === "offline" ? (
                          <span className="badge badge-gray">Not Checked In</span>
                        ) : isLate ? (
                          <span className="badge badge-amber">Late (+15m)</span>
                        ) : (
                          <span className="badge badge-green">On Time (09:00)</span>
                        )}
                      </td>
                      <td style={{ color: "#15803d", fontWeight: 600 }}>{emp.active_time}</td>
                      <td style={{ color: "#b45309" }}>{emp.idle_time}</td>
                      <td>
                        <strong>{emp.remote_status === "offline" ? "0h" : "6h 10m"}</strong>
                      </td>
                      <td>
                        <span className={`badge ${isPresent ? "badge-green" : "badge-gray"}`}>
                          {isPresent ? "Present (Remote)" : "Absent / Off"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ACTIVE VS IDLE TIMELINE */}
      {activeTab === "active_idle" && (
        <div className="content-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Active vs. Idle Time Distribution Timeline</h3>
              <div className="panel-subtitle">Non-invasive work duration analysis showing keyboard/mouse focus vs pauses</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filtered.map(emp => {
              const u = getEmployeeUser(emp);
              const activeRatio = emp.remote_status === "offline" ? 0 : Math.min(95, emp.productivity_score);
              const idleRatio = emp.remote_status === "offline" ? 0 : 100 - activeRatio;
              return (
                <div key={emp.id} style={{ background: "#f9fafb", padding: 14, borderRadius: 8, border: "1px solid #e5e7eb" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
                    <div>
                      <strong style={{ fontSize: 14 }}>{u?.name}</strong>
                      <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 8 }}>{emp.position} · {emp.department}</span>
                    </div>
                    <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
                      <span style={{ color: "#15803d", fontWeight: 600 }}>🟢 Active: {emp.active_time} ({activeRatio}%)</span>
                      <span style={{ color: "#b45309", fontWeight: 600 }}>🟡 Idle/Break: {emp.idle_time} ({idleRatio}%)</span>
                    </div>
                  </div>

                  {/* Visual timeline bar */}
                  <div style={{ height: 20, width: "100%", background: "#e5e7eb", borderRadius: 6, display: "flex", overflow: "hidden" }}>
                    <div style={{ width: `${activeRatio * 0.4}%`, background: "#22c55e" }} title="Active morning session" />
                    <div style={{ width: `${idleRatio * 0.5}%`, background: "#f59e0b" }} title="Break / Idle" />
                    <div style={{ width: `${activeRatio * 0.6}%`, background: "#16a34a" }} title="Active afternoon session" />
                    <div style={{ width: `${idleRatio * 0.5}%`, background: "#f59e0b" }} title="Break" />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#9ca3af", marginTop: 4 }}>
                    <span>09:00 AM</span>
                    <span>11:00 AM</span>
                    <span>01:00 PM (Lunch)</span>
                    <span>03:00 PM</span>
                    <span>05:00 PM</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: PRODUCTIVITY & DISTRACTION SCORING */}
      {activeTab === "productivity" && (
        <div className="content-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Productivity &amp; Application Categorization Scoring</h3>
              <div className="panel-subtitle">Categorizes remote work hours into productive apps (IDE, Design), neutral apps (Email), and non-productive time</div>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Productive Work %</th>
                  <th>Neutral / Comm %</th>
                  <th>Distraction / Unproductive %</th>
                  <th>Primary Productive Tool</th>
                  <th>WorkTime Index</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(emp => {
                  const u = getEmployeeUser(emp);
                  const productive = emp.productivity_score;
                  const neutral = Math.max(0, 100 - productive - (emp.remote_status === "idle" ? 10 : 3));
                  const distraction = 100 - productive - neutral;
                  return (
                    <tr key={emp.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{u?.name}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{emp.department}</div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <strong style={{ color: "#16a34a" }}>{productive}%</strong>
                          <div className="progress-bar" style={{ width: 60 }}>
                            <div className="progress-fill" style={{ width: `${productive}%`, background: "#16a34a" }} />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ color: "#2563eb", fontWeight: 600 }}>{neutral}%</span>
                      </td>
                      <td>
                        <span style={{ color: distraction > 8 ? "#dc2626" : "#4b5563", fontWeight: 600 }}>
                          {distraction}%
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-purple">{emp.current_activity.split("·")[0] || "Code Editor"}</span>
                      </td>
                      <td>
                        <span className={`badge ${productive >= 90 ? "badge-green" : productive >= 80 ? "badge-blue" : "badge-amber"}`}>
                          {productive >= 90 ? "Outstanding" : productive >= 80 ? "Productive" : "Needs Review"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: BURNOUT & OVERTIME RISK */}
      {activeTab === "burnout" && (
        <div className="content-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Workload Health &amp; Burnout Prevention</h3>
              <div className="panel-subtitle">Highlights staff exceeding standard capacity, logging long shifts without breaks, or at risk of exhaustion</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {filtered.map(emp => {
              const u = getEmployeeUser(emp);
              const isHighRisk = emp.burnout_risk === "High";
              return (
                <div 
                  key={emp.id} 
                  style={{ 
                    padding: 16, 
                    borderRadius: 8, 
                    border: isHighRisk ? "2px solid #ef4444" : "1px solid #e5e7eb",
                    background: isHighRisk ? "#fef2f2" : "#ffffff"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{u?.name}</h4>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{emp.position} · {emp.department}</div>
                    </div>
                    <span className={`badge ${isHighRisk ? "badge-red" : emp.burnout_risk === "Moderate" ? "badge-amber" : "badge-green"}`}>
                      {isHighRisk ? "⚠️ High Burnout Risk" : `${emp.burnout_risk} Risk`}
                    </span>
                  </div>

                  <div style={{ fontSize: 12.5, color: "#374151", marginBottom: 10 }}>
                    <div><strong>Workload Allocation:</strong> {emp.workload_percentage}% capacity</div>
                    <div><strong>Active Shift Today:</strong> {emp.active_time} (Idle: {emp.idle_time})</div>
                  </div>

                  {isHighRisk && (
                    <div style={{ padding: "8px 10px", background: "#fee2e2", borderRadius: 6, fontSize: 12, color: "#991b1b", marginBottom: 12 }}>
                      ⚠️ Marcus has been assigned critical tasks totaling 90% capacity and logged 7h+ active focus with minimal breaks.
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => alert(`Reallocating workload for ${u?.name}`)}>
                      Rebalance Tasks
                    </button>
                    <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => alert(`Sent gentle break reminder to ${u?.name}`)}>
                      Send Break Reminder
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
