import { useState } from "react";
import { EMPLOYEES, getEmployeeUser } from "../data/mockData";

export default function Analytics() {
  const [selectedOffice, setSelectedOffice] = useState("all");

  const deptStats = [
    { department: "Engineering", employeesCount: 4, activeCount: 3, avgScore: 92, avgWorkload: 75 },
    { department: "Design",      employeesCount: 1, activeCount: 1, avgScore: 88, avgWorkload: 40 },
    { department: "Data",        employeesCount: 1, activeCount: 1, avgScore: 91, avgWorkload: 55 },
  ];

  return (
    <div>
      {/* Top In-office / remote Card (Image 1) */}
      <div className="wt-card" style={{ marginBottom: 16 }}>
        <div className="wt-card-header">
          <div>
            <h2 className="wt-card-title">In-office/remote</h2>
            <div className="wt-card-subtitle"><strong>91</strong> employees monitored</div>
          </div>
        </div>

        <div className="wt-stat-block-row">
          <div className="wt-stat-side">
            <table className="wt-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Events#</th>
                  <th>Employees#</th>
                  <th>Attendance</th>
                  <th>Active</th>
                  <th>Idle</th>
                  <th>Productivity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="wt-color-square sq-blue" />In-office</td>
                  <td>0</td><td>0</td><td>0%</td><td>0%</td><td>0%</td><td>0%</td>
                </tr>
                <tr>
                  <td><span className="wt-color-square sq-teal" />Remote</td>
                  <td><strong>120</strong></td><td><strong>78</strong></td><td><strong>67%</strong></td><td><strong>59%</strong></td><td>8%</td><td><strong>50%</strong></td>
                </tr>
                <tr>
                  <td><span className="wt-color-square sq-red" />Off work</td>
                  <td>62</td><td>—</td><td>0%</td><td>0%</td><td>0%</td><td>0%</td>
                </tr>
                <tr>
                  <td><span className="wt-color-square sq-purple" />Wknd/day off</td>
                  <td>0</td><td>—</td><td>0%</td><td>0%</td><td>0%</td><td>0%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="wt-donut-wrapper">
            <svg viewBox="0 0 36 36" width="120" height="120">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="6" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#14b8a6" strokeWidth="6" strokeDasharray="67 100" strokeDashoffset="25" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" strokeWidth="6" strokeDasharray="33 100" strokeDashoffset="-42" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3 Columns: Top in-office apps, Top remote apps, Top websites */}
      <div className="wt-grid-3col">
        <div className="wt-card">
          <div className="wt-card-header"><h3 className="wt-card-title">Top in-office apps</h3></div>
          <table className="wt-mini-table">
            <tbody>
              <tr><td><a href="#!">App 1 (Outlook)</a></td><td style={{ textAlign: "right" }}>454:31</td></tr>
              <tr><td><a href="#!">App 2 (Teams)</a></td><td style={{ textAlign: "right" }}>218:17</td></tr>
              <tr><td><a href="#!">App 3 (Excel)</a></td><td style={{ textAlign: "right" }}>130:14</td></tr>
              <tr><td><a href="#!">App 4 (Word)</a></td><td style={{ textAlign: "right" }}>107:14</td></tr>
              <tr><td><a href="#!">App 5 (SAP)</a></td><td style={{ textAlign: "right" }}>70:10</td></tr>
              <tr><td><a href="#!">App 6 (PowerPoint)</a></td><td style={{ textAlign: "right" }}>52:38</td></tr>
              <tr><td><a href="#!">App 7 (Slack)</a></td><td style={{ textAlign: "right" }}>32:55</td></tr>
            </tbody>
          </table>
        </div>

        <div className="wt-card">
          <div className="wt-card-header"><h3 className="wt-card-title">Top remote apps</h3></div>
          <table className="wt-mini-table">
            <tbody>
              <tr><td><a href="#!">VS Code</a></td><td style={{ textAlign: "right" }}><strong>114:36</strong></td></tr>
              <tr><td><a href="#!">Figma Studio</a></td><td style={{ textAlign: "right" }}>56:04</td></tr>
              <tr><td><a href="#!">Google Meet</a></td><td style={{ textAlign: "right" }}>40:31</td></tr>
              <tr><td><a href="#!">PostgreSQL Studio</a></td><td style={{ textAlign: "right" }}>38:03</td></tr>
              <tr><td><a href="#!">Jupyter Notebook</a></td><td style={{ textAlign: "right" }}>22:38</td></tr>
              <tr><td><a href="#!">Git Terminal</a></td><td style={{ textAlign: "right" }}>13:04</td></tr>
              <tr><td><a href="#!">Slack Remote</a></td><td style={{ textAlign: "right" }}>09:44</td></tr>
            </tbody>
          </table>
        </div>

        <div className="wt-card">
          <div className="wt-card-header"><h3 className="wt-card-title">Top in-office / remote websites</h3></div>
          <table className="wt-mini-table">
            <tbody>
              <tr><td><a href="#!">github.com</a></td><td style={{ textAlign: "right" }}>88:20</td></tr>
              <tr><td><a href="#!">stackoverflow.com</a></td><td style={{ textAlign: "right" }}>42:15</td></tr>
              <tr><td><a href="#!">aws.amazon.com</a></td><td style={{ textAlign: "right" }}>31:10</td></tr>
              <tr><td><a href="#!">atlassian.net (Jira)</a></td><td style={{ textAlign: "right" }}>28:44</td></tr>
              <tr><td><a href="#!">notion.so</a></td><td style={{ textAlign: "right" }}>19:12</td></tr>
              <tr><td><a href="#!">developer.mozilla.org</a></td><td style={{ textAlign: "right" }}>14:50</td></tr>
              <tr><td><a href="#!">google.com/search</a></td><td style={{ textAlign: "right" }}>11:05</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Summary Table */}
      <div className="wt-card" style={{ marginTop: 16 }}>
        <div className="wt-card-header">
          <h3 className="wt-card-title">Department Workload & Performance Summary</h3>
        </div>
        <table className="wt-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Monitored Staff</th>
              <th>Active Right Now</th>
              <th>Avg Productivity</th>
              <th>Workload Capacity</th>
            </tr>
          </thead>
          <tbody>
            {deptStats.map(d => (
              <tr key={d.department}>
                <td><strong>{d.department}</strong></td>
                <td>{d.employeesCount} employees</td>
                <td><span className="badge badge-green">{d.activeCount} Active</span></td>
                <td><strong style={{ color: "#16a34a" }}>{d.avgScore}%</strong></td>
                <td style={{ minWidth: 140 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}>
                    <span>Allocated</span>
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
    </div>
  );
}
