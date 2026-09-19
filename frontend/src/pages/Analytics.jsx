import { useState } from "react";
import { EMPLOYEES, TASKS } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function Analytics() {
  const deptStats = [
    { department: "Engineering", employeesCount: 4, activeCount: 3, avgScore: 92, avgWorkload: 75 },
    { department: "Design",      employeesCount: 1, activeCount: 1, avgScore: 88, avgWorkload: 40 },
    { department: "Data",        employeesCount: 1, activeCount: 1, avgScore: 91, avgWorkload: 55 },
  ];

  return (
    <div>
      <div style={{ border: "1px solid #000000", padding: "12px 16px", marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: "bold", margin: 0 }}>
          Workload &amp; Telemetry Analytics
        </h2>
        <div style={{ fontSize: 13, color: "#444444", marginTop: 2 }}>
          Summary metrics on department workloads, capacity allocation, and remote telemetry.
        </div>
      </div>

      <div className="wt-card" style={{ marginBottom: 16 }}>
        <div className="wt-card-header">
          <h2 className="wt-card-title">Department Workload Distribution</h2>
        </div>
        <table className="wt-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Monitored Staff</th>
              <th>Active Now</th>
              <th>Avg Productivity</th>
              <th>Workload Capacity</th>
            </tr>
          </thead>
          <tbody>
            {deptStats.map(d => (
              <tr key={d.department}>
                <td><strong>{d.department}</strong></td>
                <td>{d.employeesCount} staff</td>
                <td><StatusBadge value="active" /> {d.activeCount}</td>
                <td><strong>{d.avgScore}%</strong></td>
                <td style={{ minWidth: 160 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 2 }}>
                    <span>Allocation</span>
                    <strong>{d.avgWorkload}%</strong>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: d.avgWorkload + "%" }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="wt-card">
        <div className="wt-card-header">
          <h2 className="wt-card-title">Remote Telemetry Utilization</h2>
        </div>
        <table className="wt-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total Hours</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Focused Application Use (IDE, Tools)</td><td>114h 36m</td><td>78%</td></tr>
            <tr><td>Communication &amp; Meetings</td><td>40h 31m</td><td>14%</td></tr>
            <tr><td>Idle &amp; Scheduled Breaks</td><td>13h 02m</td><td>8%</td></tr>
            <tr style={{ fontWeight: "bold" }}><td>Total Monitored Time</td><td>168h 09m</td><td>100%</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
