import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { EMPLOYEES, USERS, getEmployeeUser, getManagerEmployees } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

const INITIAL_STAFF_AVAILABILITY = [
  {
    employeeId: 1,
    shift: "09:00 AM - 05:00 PM",
    status: "available",
    workMode: "Remote",
    nextShift: "Tomorrow, 09:00 AM",
    notes: "Active in Sprint UI components",
    weeklyHours: "38.5 hrs"
  },
  {
    employeeId: 2,
    shift: "08:30 AM - 05:30 PM",
    status: "busy",
    workMode: "On-Site (Floor 3)",
    nextShift: "Tomorrow, 08:30 AM",
    notes: "Deep focus on Database indexing",
    weeklyHours: "42.0 hrs"
  },
  {
    employeeId: 3,
    shift: "09:15 AM - 05:15 PM",
    status: "in_meeting",
    workMode: "Remote",
    nextShift: "Tomorrow, 09:15 AM",
    notes: "Design sprint review with clients",
    weeklyHours: "37.5 hrs"
  },
  {
    employeeId: 4,
    shift: "Flexible (On-Call)",
    status: "offline",
    workMode: "Remote",
    nextShift: "Monday, 09:00 AM",
    notes: "Scheduled day off after on-call weekend",
    weeklyHours: "35.0 hrs"
  },
  {
    employeeId: 5,
    shift: "09:00 AM - 05:00 PM",
    status: "available",
    workMode: "On-Site (Data Center)",
    nextShift: "Tomorrow, 09:00 AM",
    notes: "Generating weekly telemetry analytics",
    weeklyHours: "40.0 hrs"
  },
  {
    employeeId: 6,
    shift: "08:45 AM - 05:15 PM",
    status: "idle",
    workMode: "Remote",
    nextShift: "Tomorrow, 08:45 AM",
    notes: "Lunch break interval",
    weeklyHours: "39.0 hrs"
  }
];

const INITIAL_LEAVE_REQUESTS = [
  {
    id: 1,
    employeeName: "Priya Sharma",
    department: "Engineering",
    leaveType: "Annual Paid Leave",
    dates: "2026-09-10 to 2026-09-12 (3 days)",
    reason: "Family travel and vacation",
    status: "Approved",
    appliedOn: "2026-08-20"
  },
  {
    id: 2,
    employeeName: "Marcus Lee",
    department: "Engineering",
    leaveType: "Remote Work Flex Day",
    dates: "2026-09-05 (1 day)",
    reason: "Home utility maintenance",
    status: "Pending",
    appliedOn: "2026-08-26"
  },
  {
    id: 3,
    employeeName: "Sara Patel",
    department: "Design",
    leaveType: "Medical / Sick Leave",
    dates: "2026-08-29 (1 day)",
    reason: "Scheduled medical consultation",
    status: "Approved",
    appliedOn: "2026-08-25"
  }
];

export default function Availability() {
  const { user, employee, managedDept } = useAuth();
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const isEmployee = user?.role === "employee";

  // State for Staff Availability matrix (Admin / Manager)
  const [staffData] = useState(INITIAL_STAFF_AVAILABILITY);
  const [leaveRequests, setLeaveRequests] = useState(INITIAL_LEAVE_REQUESTS);
  const [deptFilter, setDeptFilter] = useState(isManager ? (managedDept || "All") : "All");
  const [notification, setNotification] = useState("");

  // State for Employee personal availability
  const [myStatus, setMyStatus] = useState("available");
  const [myStartTime, setMyStartTime] = useState("09:00");
  const [myEndTime, setMyEndTime] = useState("17:00");
  const [myNotes, setMyNotes] = useState("");
  const [leaveType, setLeaveType] = useState("Annual Paid Leave");
  const [leaveStartDate, setLeaveStartDate] = useState("2026-09-15");
  const [leaveEndDate, setLeaveEndDate] = useState("2026-09-16");
  const [leaveReason, setLeaveReason] = useState("");

  // Filtered employees list for manager & admin
  const allEmployees = isManager 
    ? getManagerEmployees(user?.id)
    : EMPLOYEES;

  const filteredEmployees = allEmployees.filter(emp => {
    if (deptFilter === "All") return true;
    return emp.department === deptFilter;
  });

  // Handle approving or rejecting leave
  const handleLeaveDecision = (leaveId, newStatus) => {
    setLeaveRequests(prev => prev.map(l => l.id === leaveId ? { ...l, status: newStatus } : l));
    setNotification(`Leave request #${leaveId} marked as ${newStatus}.`);
    setTimeout(() => setNotification(""), 3000);
  };

  // Handle Employee Personal Availability Save
  const handleSaveMyAvailability = (e) => {
    e.preventDefault();
    setNotification("Your daily schedule and working status have been saved.");
    setTimeout(() => setNotification(""), 3000);
  };

  // Handle Employee Requesting Time-Off
  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!leaveReason.trim()) return;

    const newReq = {
      id: leaveRequests.length + 1,
      employeeName: user?.name || "Employee",
      department: managedDept || "Engineering",
      leaveType: leaveType,
      dates: `${leaveStartDate} to ${leaveEndDate}`,
      reason: leaveReason.trim(),
      status: "Pending",
      appliedOn: new Date().toISOString().split("T")[0]
    };

    setLeaveRequests([newReq, ...leaveRequests]);
    setLeaveReason("");
    setNotification("Time-off request submitted to management for approval.");
    setTimeout(() => setNotification(""), 3500);
  };

  // ─────────────────────────────────────────────────────────
  // 1. ADMIN & MANAGER: STAFF AVAILABILITY MATRIX
  // ─────────────────────────────────────────────────────────
  if (!isEmployee) {
    return (
      <div>
        {/* Top Header Banner */}
        <div style={{ border: "1px solid var(--border)", padding: "14px 18px", marginBottom: 16, backgroundColor: "#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: "bold", margin: 0 }}>
              {isAdmin ? "Enterprise Staff Availability & Shift Matrix" : `${managedDept || "Department"} Staff Availability Matrix`}
            </h2>
            <div style={{ fontSize: 13, color: "var(--footer)", marginTop: 4 }}>
              {isAdmin 
                ? "Organization-wide working hours, current availability status, shift coverage, and time-off tracking."
                : `Active shifts, working schedules, and leave approvals for ${managedDept || "managed"} department staff.`}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {isAdmin && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: "bold" }}>Filter Department:</span>
                <select
                  className="form-control"
                  style={{ width: "auto", padding: "4px 8px", fontSize: 13 }}
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Data">Data</option>
                </select>
              </div>
            )}
            {isManager && (
              <div style={{ fontSize: 13 }}>
                Department: <strong>{managedDept || "Engineering"}</strong>
              </div>
            )}
          </div>
        </div>

        {notification && (
          <div style={{ border: "1px solid var(--border)", padding: "8px 12px", marginBottom: 16, fontWeight: "bold", backgroundColor: "var(--body)" }}>
            Notice: {notification}
          </div>
        )}

        {/* Staff Availability Roster Table */}
        <div className="wt-card" style={{ marginBottom: 16 }}>
          <div className="wt-card-header">
            <div>
              <h2 className="wt-card-title">Staff Shift &amp; Working Availability Roster</h2>
              <div className="wt-card-subtitle">Live status, daily schedule windows, workload percentage, and on-site/remote modes</div>
            </div>
          </div>
          <table className="wt-table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Department</th>
                <th>Current Status</th>
                <th>Working Hours / Shift</th>
                <th>Work Mode</th>
                <th>Workload</th>
                <th>Weekly Hours</th>
                <th>Schedule Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => {
                const u = getEmployeeUser(emp);
                const sd = staffData.find(s => s.employeeId === emp.id) || {
                  shift: "09:00 AM - 05:00 PM",
                  status: emp.availability_status || "available",
                  workMode: "Remote",
                  notes: "Standard working shift",
                  weeklyHours: "40.0 hrs"
                };

                return (
                  <tr key={emp.id}>
                    <td>
                      <strong>{u?.name}</strong>
                      <div style={{ fontSize: 11, color: "#666" }}>{emp.position}</div>
                    </td>
                    <td>{emp.department}</td>
                    <td><StatusBadge value={sd.status} /></td>
                    <td><strong>{sd.shift}</strong></td>
                    <td>{sd.workMode}</td>
                    <td>
                      <span style={{ fontWeight: "bold", color: emp.workload_percentage > 80 ? "#b00" : "inherit" }}>
                        {emp.workload_percentage}%
                      </span>
                    </td>
                    <td>{sd.weeklyHours}</td>
                    <td style={{ fontSize: 12 }}>{sd.notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Leave & Time-Off Requests Management Table */}
        <div className="wt-card">
          <div className="wt-card-header">
            <div>
              <h2 className="wt-card-title">Leave &amp; Time-Off Requests ({leaveRequests.length})</h2>
              <div className="wt-card-subtitle">Review, approve, and track employee vacation, sick leave, and flexible days</div>
            </div>
          </div>
          <table className="wt-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Leave Category</th>
                <th>Requested Dates</th>
                <th>Reason / Justification</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map(req => (
                <tr key={req.id}>
                  <td><strong>#{req.id}</strong></td>
                  <td><strong>{req.employeeName}</strong></td>
                  <td>{req.department}</td>
                  <td>{req.leaveType}</td>
                  <td><strong>{req.dates}</strong></td>
                  <td style={{ fontSize: 12 }}>{req.reason}</td>
                  <td>{req.appliedOn}</td>
                  <td><strong>{req.status}</strong></td>
                  <td>
                    {req.status === "Pending" ? (
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleLeaveDecision(req.id, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleLeaveDecision(req.id, "Rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: "var(--footer)" }}>{req.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // 2. EMPLOYEE: PERSONAL AVAILABILITY & TIMESHEET
  // ─────────────────────────────────────────────────────────
  return (
    <div>
      <div style={{ border: "1px solid var(--border)", padding: "14px 18px", marginBottom: 16, backgroundColor: "#ffffff" }}>
        <h2 style={{ fontSize: 18, fontWeight: "bold", margin: 0 }}>
          Working Hours, Timesheet &amp; Availability
        </h2>
        <div style={{ fontSize: 13, color: "var(--footer)", marginTop: 4 }}>
          Configure your daily active schedule, break intervals, and submit time-off/leave requests to management.
        </div>
      </div>

      {notification && (
        <div style={{ border: "1px solid var(--border)", padding: "8px 12px", marginBottom: 16, fontWeight: "bold", backgroundColor: "var(--body)" }}>
          Notice: {notification}
        </div>
      )}

      <div className="wt-grid-2x2" style={{ marginBottom: 16 }}>
        {/* Daily Schedule Configuration */}
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Daily Working Hours &amp; Live Status</h2>
          </div>
          <form onSubmit={handleSaveMyAvailability} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Current Working State:</label>
              <select className="form-control" style={{ width: "100%" }} value={myStatus} onChange={e => setMyStatus(e.target.value)}>
                <option value="available">Available (Active Working)</option>
                <option value="busy">Busy (In Deep Focus)</option>
                <option value="in_meeting">In Meeting / Sync</option>
                <option value="away">Away / On Break</option>
                <option value="offline">Offline / Shift Concluded</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Shift Start Time:</label>
                <input type="time" className="form-control" style={{ width: "100%" }} value={myStartTime} onChange={e => setMyStartTime(e.target.value)} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Shift End Time:</label>
                <input type="time" className="form-control" style={{ width: "100%" }} value={myEndTime} onChange={e => setMyEndTime(e.target.value)} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Schedule Notes / Away Reason:</label>
              <textarea 
                className="form-control" 
                style={{ width: "100%", height: 60 }} 
                placeholder="e.g. Attending sprint architecture review at 2 PM..."
                value={myNotes} 
                onChange={e => setMyNotes(e.target.value)} 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start", marginTop: 4 }}>
              Save Schedule Settings
            </button>
          </form>
        </div>

        {/* Weekly Timesheet Log */}
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Weekly Timesheet Record</h2>
          </div>
          <table className="wt-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Active Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Monday</td><td>09:00 AM</td><td>05:15 PM</td><td>7h 45m</td><td>Complete</td></tr>
              <tr><td>Tuesday</td><td>08:55 AM</td><td>05:05 PM</td><td>7h 50m</td><td>Complete</td></tr>
              <tr><td>Wednesday</td><td>09:02 AM</td><td>05:30 PM</td><td>8h 10m</td><td>Complete</td></tr>
              <tr><td>Thursday</td><td>08:50 AM</td><td>05:00 PM</td><td>7h 40m</td><td>Complete</td></tr>
              <tr><td>Friday (Today)</td><td>09:00 AM</td><td>--</td><td>5h 45m</td><td><strong>Active</strong></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Application & History for Employee */}
      <div className="wt-grid-2x2">
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Request Time-Off / Leave</h2>
          </div>
          <form onSubmit={handleApplyLeave} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Leave Category:</label>
              <select className="form-control" style={{ width: "100%" }} value={leaveType} onChange={e => setLeaveType(e.target.value)}>
                <option value="Annual Paid Leave">Annual Paid Leave</option>
                <option value="Sick / Medical Leave">Sick / Medical Leave</option>
                <option value="Remote Work Flex Day">Remote Work Flex Day</option>
                <option value="Personal Leave">Personal Leave</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>From Date:</label>
                <input type="date" className="form-control" style={{ width: "100%" }} value={leaveStartDate} onChange={e => setLeaveStartDate(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>To Date:</label>
                <input type="date" className="form-control" style={{ width: "100%" }} value={leaveEndDate} onChange={e => setLeaveEndDate(e.target.value)} required />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Reason / Comments:</label>
              <textarea
                className="form-control"
                style={{ width: "100%", height: 60 }}
                placeholder="Provide reason for absence..."
                value={leaveReason}
                onChange={e => setLeaveReason(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
              Submit Leave Request
            </button>
          </form>
        </div>

        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">My Leave History &amp; Approvals</h2>
          </div>
          <table className="wt-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Dates</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.filter(l => l.employeeName === user?.name || l.employeeName === "Priya Sharma").map(l => (
                <tr key={l.id}>
                  <td><strong>{l.leaveType}</strong></td>
                  <td>{l.dates}</td>
                  <td><strong>{l.status}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
