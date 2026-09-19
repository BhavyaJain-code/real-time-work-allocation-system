import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Availability() {
  const { user, employee } = useAuth();
  const [status, setStatus] = useState("available");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [notes, setNotes] = useState("");
  const [notice, setNotice] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    setNotice("Availability and working hours saved successfully.");
    setTimeout(() => setNotice(""), 3000);
  };

  return (
    <div>
      <div style={{ border: "1px solid #000000", padding: "12px 16px", marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: "bold", margin: 0 }}>
          Working Hours, Timesheet &amp; Availability
        </h2>
        <div style={{ fontSize: 13, color: "#444444", marginTop: 2 }}>
          Configure daily active schedule, break intervals, and on-call availability.
        </div>
      </div>

      {notice && (
        <div style={{ border: "1px solid #000000", padding: "8px 12px", marginBottom: 16, fontWeight: "bold" }}>
          Notice: {notice}
        </div>
      )}

      <div className="wt-grid-2x2">
        <div className="wt-card">
          <div className="wt-card-header">
            <h2 className="wt-card-title">Daily Working Hours Schedule</h2>
          </div>
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Current Working State:</label>
              <select className="form-control" style={{ width: "100%" }} value={status} onChange={e => setStatus(e.target.value)}>
                <option value="available">Available (Active Work)</option>
                <option value="busy">Busy (In Deep Focus)</option>
                <option value="away">Away / Break</option>
                <option value="offline">Offline / Shift Concluded</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Shift Start:</label>
                <input type="time" className="form-control" style={{ width: "100%" }} value={startTime} onChange={e => setStartTime(e.target.value)} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Shift End:</label>
                <input type="time" className="form-control" style={{ width: "100%" }} value={endTime} onChange={e => setEndTime(e.target.value)} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Schedule Notes / Away Reason:</label>
              <textarea 
                className="form-control" 
                style={{ width: "100%", height: 60 }} 
                placeholder="e.g. Attending sprint architecture review at 2 PM..."
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: 4 }}>
              Save Schedule Settings
            </button>
          </form>
        </div>

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
    </div>
  );
}
