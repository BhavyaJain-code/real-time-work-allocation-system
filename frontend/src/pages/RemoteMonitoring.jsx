import { useState } from "react";
import { EMPLOYEES, getEmployeeUser } from "../data/mockData";
import { HelpCircle, Download, Play, Pause, ExternalLink } from "lucide-react";

export default function RemoteMonitoring() {
  const [activeReportTab, setActiveReportTab] = useState("active_idle"); // "active_idle" | "summary" | "in_office_remote" | "whats_now"

  // Hourly data for 24-hr bar chart (minutes per hour active & idle)
  const hourlyData = [
    { hour: "12am", active: 0,  idle: 0  },
    { hour: "1am",  active: 0,  idle: 0  },
    { hour: "2am",  active: 0,  idle: 0  },
    { hour: "3am",  active: 0,  idle: 0  },
    { hour: "4am",  active: 0,  idle: 0  },
    { hour: "5am",  active: 0,  idle: 0  },
    { hour: "6am",  active: 2,  idle: 2  },
    { hour: "7am",  active: 5,  idle: 4  },
    { hour: "8am",  active: 16, idle: 4  },
    { hour: "9am",  active: 48, idle: 4  },
    { hour: "10am", active: 52, idle: 3  },
    { hour: "11am", active: 38, idle: 5  },
    { hour: "12pm", active: 37, idle: 6  },
    { hour: "1pm",  active: 14, idle: 4  },
    { hour: "2pm",  active: 16, idle: 3  },
    { hour: "3pm",  active: 12, idle: 4  },
    { hour: "4pm",  active: 8,  idle: 3  },
    { hour: "5pm",  active: 4,  idle: 2  },
    { hour: "6pm",  active: 3,  idle: 2  },
    { hour: "7pm",  active: 3,  idle: 1  },
    { hour: "8pm",  active: 1,  idle: 1  },
    { hour: "9pm",  active: 1,  idle: 0  },
    { hour: "10pm", active: 0,  idle: 0  },
    { hour: "11pm", active: 0,  idle: 0  },
  ];

  // Employee detailed log rows
  const employeeLogs = [
    { id: 1, name: "Kris K.",    role: "Senior Frontend Dev", dept: "Engineering", status: "Active", activeTotal: "73:00:38", activeAvg: "73:00:38", idleTotal: "00:00:00", idleAvg: "00:00:00", date: "2/19/2026", app: "VS Code · User Dashboard API" },
    { id: 2, name: "Camryn M.",  role: "Backend Engineer",   dept: "Engineering", status: "Active", activeTotal: "07:41:51", activeAvg: "07:41:51", idleTotal: "00:07:56", idleAvg: "00:07:56", date: "2/19/2026", app: "PostgreSQL · Query Optimizer" },
    { id: 3, name: "Avery W.",   role: "UI/UX Designer",    dept: "Design",      status: "Idle",   activeTotal: "05:09:08", activeAvg: "05:09:08", idleTotal: "03:07:40", idleAvg: "03:07:40", date: "2/19/2026", app: "Figma · Design System V2" },
    { id: 4, name: "Tracey C.",  role: "Data Analyst",      dept: "Data",        status: "Active", activeTotal: "07:27:24", activeAvg: "07:27:24", idleTotal: "04:34:32", idleAvg: "04:34:32", date: "2/19/2026", app: "Jupyter · Telemetry Analysis" },
    { id: 5, name: "Emery W.",   role: "Full-Stack Dev",    dept: "Engineering", status: "Active", activeTotal: "06:04:38", activeAvg: "06:04:38", idleTotal: "01:04:17", idleAvg: "01:04:17", date: "2/19/2026", app: "React · Auth Workflow" },
    { id: 6, name: "Collins W.", role: "DevOps Engineer",   dept: "Engineering", status: "Off",    activeTotal: "04:04:23", activeAvg: "04:04:23", idleTotal: "04:08:00", idleAvg: "04:08:00", date: "2/19/2026", app: "Logged Off" },
  ];

  return (
    <div>
      {/* Top View Selector Tabs */}
      <div style={{ display: "flex", gap: 6, borderBottom: "1px solid #cbd5e1", marginBottom: 16 }}>
        <button
          onClick={() => setActiveReportTab("active_idle")}
          style={{
            padding: "6px 14px",
            fontSize: 12.5,
            fontWeight: activeReportTab === "active_idle" ? 700 : 500,
            border: "1px solid",
            borderColor: activeReportTab === "active_idle" ? "#cbd5e1 #cbd5e1 #ffffff" : "transparent",
            background: activeReportTab === "active_idle" ? "#ffffff" : "transparent",
            color: activeReportTab === "active_idle" ? "#1e293b" : "#64748b",
            borderRadius: "4px 4px 0 0",
            marginBottom: -1,
            cursor: "pointer"
          }}
        >
          📊 Active/idle Report (Image 3)
        </button>

        <button
          onClick={() => setActiveReportTab("summary")}
          style={{
            padding: "6px 14px",
            fontSize: 12.5,
            fontWeight: activeReportTab === "summary" ? 700 : 500,
            border: "1px solid",
            borderColor: activeReportTab === "summary" ? "#cbd5e1 #cbd5e1 #ffffff" : "transparent",
            background: activeReportTab === "summary" ? "#ffffff" : "transparent",
            color: activeReportTab === "summary" ? "#1e293b" : "#64748b",
            borderRadius: "4px 4px 0 0",
            marginBottom: -1,
            cursor: "pointer"
          }}
        >
          📈 Executive Summary (Image 2)
        </button>

        <button
          onClick={() => setActiveReportTab("in_office_remote")}
          style={{
            padding: "6px 14px",
            fontSize: 12.5,
            fontWeight: activeReportTab === "in_office_remote" ? 700 : 500,
            border: "1px solid",
            borderColor: activeReportTab === "in_office_remote" ? "#cbd5e1 #cbd5e1 #ffffff" : "transparent",
            background: activeReportTab === "in_office_remote" ? "#ffffff" : "transparent",
            color: activeReportTab === "in_office_remote" ? "#1e293b" : "#64748b",
            borderRadius: "4px 4px 0 0",
            marginBottom: -1,
            cursor: "pointer"
          }}
        >
          🏢 In-office / Remote (Image 1)
        </button>

        <button
          onClick={() => setActiveReportTab("whats_now")}
          style={{
            padding: "6px 14px",
            fontSize: 12.5,
            fontWeight: activeReportTab === "whats_now" ? 700 : 500,
            border: "1px solid",
            borderColor: activeReportTab === "whats_now" ? "#cbd5e1 #cbd5e1 #ffffff" : "transparent",
            background: activeReportTab === "whats_now" ? "#ffffff" : "transparent",
            color: activeReportTab === "whats_now" ? "#1e293b" : "#64748b",
            borderRadius: "4px 4px 0 0",
            marginBottom: -1,
            cursor: "pointer"
          }}
        >
          🟢 &quot;What&apos;s Now&quot; Live Feed
        </button>
      </div>

      {/* VIEW 1: ACTIVE / IDLE REPORT (IMAGE 3) */}
      {activeReportTab === "active_idle" && (
        <div>
          <div className="wt-grid-2x2">
            {/* Quadrant 1: Active/idle */}
            <div className="wt-card">
              <div className="wt-card-header">
                <h2 className="wt-card-title">Active/idle</h2>
              </div>
              <div className="wt-stat-block-row">
                <div className="wt-stat-side">
                  <div className="wt-count-callout">
                    <strong>6</strong> active employees <span style={{ color: "#64748b", fontSize: 11 }}>(out of 17)</span>
                  </div>
                  <table className="wt-mini-table">
                    <thead>
                      <tr><th></th><th>Total time</th><th>Per empl/work day</th><th>%</th></tr>
                    </thead>
                    <tbody>
                      <tr><td><span className="wt-color-square sq-green" />Active</td><td><strong>103:28:02</strong></td><td>06:05:11</td><td><strong>78%</strong></td></tr>
                      <tr><td><span className="wt-color-square sq-yellow" />Idle</td><td>13:02:25</td><td>00:46:01</td><td>10%</td></tr>
                      <tr style={{ fontWeight: 700 }}><td>Total</td><td>116:30:27 <span style={{ fontWeight: 400, color: "#64748b", fontSize: 10 }}>(out of 133 h)</span></td><td>06:51:12 <span style={{ fontWeight: 400, color: "#64748b", fontSize: 10 }}>(out of 8 h)</span></td><td>88%</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="wt-donut-wrapper">
                  <svg viewBox="0 0 36 36" width="110" height="110">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#22c55e" strokeWidth="6" strokeDasharray="68.6 100" strokeDashoffset="25" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="6" strokeDasharray="8.8 100" strokeDashoffset="-43.6" />
                  </svg>
                </div>
              </div>
              <div className="wt-card-footer-link"><a href="#!">More info</a></div>
            </div>

            {/* Quadrant 2: Active/idle per hour */}
            <div className="wt-card">
              <div className="wt-card-header">
                <h2 className="wt-card-title">Active/idle per hour (average per employee/day)</h2>
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
                  <span>12:00 am</span><span>4:00 am</span><span>8:00 am</span><span>12:00 pm</span><span>4:00 pm</span><span>8:00 pm</span><span>11:00 pm</span>
                </div>
                <div style={{ textAlign: "center", fontSize: 11, color: "#64748b", marginTop: 4 }}>2026-02-19</div>
                <div className="wt-hourly-legend">
                  <span><span className="wt-color-square sq-green" />Active</span>
                  <span><span className="wt-color-square sq-yellow" />Idle</span>
                </div>
              </div>
              <div className="wt-card-footer-link"><a href="#!">More info</a></div>
            </div>
          </div>

          {/* Bottom 2 Quadrants */}
          <div className="wt-grid-2x2">
            {/* Quadrant 3: Employee - active/idle */}
            <div className="wt-card">
              <div className="wt-card-header">
                <div>
                  <h2 className="wt-card-title">Employee - active/idle</h2>
                  <div className="wt-card-subtitle">Total active time <strong>103 hours 28 minutes</strong> · Total idle time <strong>13 hours 2 minutes</strong></div>
                </div>
              </div>
              <table className="wt-table">
                <thead>
                  <tr><th>Now is ▲</th><th>Employee</th><th>Active total</th><th>Active avg.</th><th>Idle total</th><th>Idle avg.</th></tr>
                </thead>
                <tbody>
                  {employeeLogs.map(emp => (
                    <tr key={emp.id}>
                      <td>
                        {emp.status === "Active" ? (
                          <span><span className="wt-color-square sq-green" />Active</span>
                        ) : (
                          <span style={{ color: "#64748b" }}><span className="wt-color-square sq-gray" />No monitoring</span>
                        )}
                      </td>
                      <td><span className="wt-table-link">{emp.name}</span></td>
                      <td><strong>{emp.activeTotal}</strong></td>
                      <td>{emp.activeAvg}</td>
                      <td>{emp.idleTotal}</td>
                      <td>{emp.idleAvg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quadrant 4: Employee - active/idle per day */}
            <div className="wt-card">
              <div className="wt-card-header">
                <h2 className="wt-card-title">Employee - active/idle per day</h2>
              </div>
              <table className="wt-table">
                <thead>
                  <tr><th>Date ▲</th><th>Employee</th><th>Active total</th><th>Idle total</th></tr>
                </thead>
                <tbody>
                  {employeeLogs.map(emp => (
                    <tr key={emp.id}>
                      <td>{emp.date}</td>
                      <td><span className="wt-table-link">{emp.name}</span></td>
                      <td><strong>{emp.activeTotal}</strong></td>
                      <td>{emp.idleTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: EXECUTIVE SUMMARY (IMAGE 2) */}
      {activeReportTab === "summary" && (
        <div>
          <div className="wt-grid-2x2">
            <div className="wt-card">
              <div className="wt-card-header"><h2 className="wt-card-title">Active/idle</h2></div>
              <div className="wt-stat-block-row">
                <div className="wt-stat-side">
                  <div className="wt-count-callout"><strong>15</strong> active employees <span style={{ color: "#64748b", fontSize: 11 }}>(out of 15)</span></div>
                  <table className="wt-mini-table">
                    <thead><tr><th></th><th>Total time</th><th>Per empl/work day</th><th>%</th></tr></thead>
                    <tbody>
                      <tr><td><span className="wt-color-square sq-green" />Active</td><td>102:09:25</td><td>06:48:38</td><td><strong>85%</strong></td></tr>
                      <tr><td><span className="wt-color-square sq-yellow" />Idle</td><td>25:42:25</td><td>01:42:50</td><td>21%</td></tr>
                      <tr style={{ fontWeight: 700 }}><td>Total</td><td>127:51:50</td><td>08:31:28</td><td>107%</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="wt-donut-wrapper">
                  <svg viewBox="0 0 36 36" width="110" height="110">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#22c55e" strokeWidth="6" strokeDasharray="74 100" strokeDashoffset="25" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="6" strokeDasharray="18 100" strokeDashoffset="-49" />
                  </svg>
                </div>
              </div>
              <div className="wt-card-footer-link"><a href="#!">More info</a></div>
            </div>

            <div className="wt-card">
              <div className="wt-card-header"><h2 className="wt-card-title">Productivity</h2></div>
              <div className="wt-stat-block-row">
                <div className="wt-stat-side">
                  <div className="wt-count-callout"><strong>15</strong> active employees <span style={{ color: "#64748b", fontSize: 11 }}>(out of 15)</span></div>
                  <table className="wt-mini-table">
                    <thead><tr><th></th><th>Total time</th><th>Per empl/work day</th></tr></thead>
                    <tbody>
                      <tr><td><span className="wt-color-square sq-green" />Productive</td><td>99:20:29</td><td>06:37:22</td></tr>
                      <tr><td><span className="wt-color-square sq-red" />Unproductive</td><td>02:00:28</td><td>00:08:02</td></tr>
                      <tr><td><span className="wt-color-square sq-blue" /><a href="#!">Undefined</a></td><td>00:48:02</td><td>00:03:12</td></tr>
                      <tr><td><span className="wt-color-square sq-yellow" />Idle</td><td>25:41:50</td><td>01:42:47</td></tr>
                      <tr style={{ fontWeight: 700 }}><td>Total</td><td>127:50:49</td><td>08:31:23 (107%)</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="wt-donut-wrapper">
                  <svg viewBox="0 0 36 36" width="110" height="110">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#22c55e" strokeWidth="6" strokeDasharray="72 100" strokeDashoffset="25" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" strokeWidth="6" strokeDasharray="4 100" strokeDashoffset="-47" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" strokeWidth="6" strokeDasharray="2 100" strokeDashoffset="-51" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="6" strokeDasharray="20 100" strokeDashoffset="-53" />
                  </svg>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto", paddingTop: 10, fontSize: 11.5 }}>
                <a href="#!">Assign productivity</a>
                <a href="#!">More info</a>
              </div>
            </div>
          </div>

          <div className="wt-grid-2x2">
            <div className="wt-card">
              <div className="wt-card-header"><h2 className="wt-card-title">Active/idle per hour (average per employee/day)</h2></div>
              <div className="wt-hourly-chart">
                <div className="wt-hourly-bars">
                  {hourlyData.map((d, i) => (
                    <div key={i} className="wt-hourly-col">
                      <div className="wt-bar-idle" style={{ height: (d.idle / 60 * 100) + "%" }} />
                      <div className="wt-bar-active" style={{ height: (d.active / 60 * 100) + "%" }} />
                    </div>
                  ))}
                </div>
                <div className="wt-hourly-labels">
                  <span>12:00 am</span><span>4:00 am</span><span>8:00 am</span><span>12:00 pm</span><span>4:00 pm</span><span>8:00 pm</span><span>11:00 pm</span>
                </div>
                <div className="wt-hourly-legend">
                  <span><span className="wt-color-square sq-green" />Active</span>
                  <span><span className="wt-color-square sq-yellow" />Idle</span>
                </div>
              </div>
              <div className="wt-card-footer-link"><a href="#!">More info</a></div>
            </div>

            <div className="wt-card">
              <div className="wt-card-header"><h2 className="wt-card-title">Attendance - work started</h2></div>
              <div className="wt-stat-block-row">
                <div className="wt-stat-side">
                  <table className="wt-mini-table">
                    <thead><tr><th>Event</th><th>Events#</th><th>Empl/day</th><th>%</th></tr></thead>
                    <tbody>
                      <tr><td><span className="wt-color-square sq-green" />Early</td><td>4</td><td>4</td><td>27%</td></tr>
                      <tr><td><span className="wt-color-square sq-green" />On time</td><td>8</td><td>8</td><td><strong>53%</strong></td></tr>
                      <tr><td><span className="wt-color-square sq-yellow" />Late</td><td>3</td><td>3</td><td>20%</td></tr>
                      <tr><td>Off work</td><td>0</td><td>0</td><td>0%</td></tr>
                      <tr style={{ fontWeight: 700 }}><td>Total</td><td>15</td><td>15</td><td>100%</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="wt-donut-wrapper">
                  <svg viewBox="0 0 36 36" width="110" height="110">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#22c55e" strokeWidth="6" strokeDasharray="80 100" strokeDashoffset="25" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="6" strokeDasharray="20 100" strokeDashoffset="-55" />
                  </svg>
                </div>
              </div>
              <div className="wt-card-footer-link"><a href="#!">More info</a></div>
            </div>
          </div>

          <div className="wt-card">
            <div className="wt-card-header"><h2 className="wt-card-title">Active time progress</h2></div>
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <div style={{ minWidth: 180 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#16a34a" }}>↑ 12%</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Active time %: <strong style={{ color: "#1e293b" }}>86%</strong></div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Total active: <strong style={{ color: "#1e293b" }}>2 063:54:50</strong></div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Per empl/day: <strong style={{ color: "#1e293b" }}>06:15:15</strong></div>
              </div>
              <div style={{ flex: 1 }}>
                <svg viewBox="0 0 500 80" width="100%" height="90">
                  <line x1="0" y1="24" x2="500" y2="24" stroke="#94a3b8" strokeDasharray="3 3" />
                  <text x="5" y="20" fontSize="9" fill="#94a3b8">Goal 80%</text>
                  <path d="M 0 80 Q 50 15 100 24 T 200 20 T 300 22 T 400 18 T 500 20 L 500 80 Z" fill="#fef3c7" opacity="0.8" />
                  <path d="M 0 80 Q 50 20 100 24 T 200 20 T 300 22 T 400 18 T 500 20 L 500 80 Z" fill="#bbf7d0" opacity="0.9" />
                  <path d="M 0 35 Q 50 15 100 24 T 200 20 T 300 22 T 400 18 T 500 20" fill="none" stroke="#16a34a" strokeWidth="2" />
                </svg>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "#94a3b8" }}>
                  <span>5/20</span><span>5/25</span><span>5/30</span><span>6/4</span><span>6/9</span><span>6/14</span><span>6/18</span>
                </div>
              </div>
            </div>
            <div className="wt-card-footer-link"><a href="#!">More info</a></div>
          </div>
        </div>
      )}

      {/* VIEW 3: IN-OFFICE / REMOTE (IMAGE 1) */}
      {activeReportTab === "in_office_remote" && (
        <div>
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
                    <tr><th>Event</th><th>Events#</th><th>Employees#</th><th>Attendance</th><th>Active</th><th>Idle</th><th>Productivity</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><span className="wt-color-square sq-blue" />In-office</td><td>0</td><td>0</td><td>0%</td><td>0%</td><td>0%</td><td>0%</td></tr>
                    <tr><td><span className="wt-color-square sq-teal" />Remote</td><td><strong>120</strong></td><td><strong>78</strong></td><td><strong>67%</strong></td><td><strong>59%</strong></td><td>8%</td><td><strong>50%</strong></td></tr>
                    <tr><td><span className="wt-color-square sq-red" />Off work</td><td>62</td><td>—</td><td>0%</td><td>0%</td><td>0%</td><td>0%</td></tr>
                    <tr><td><span className="wt-color-square sq-purple" />Wknd/day off</td><td>0</td><td>—</td><td>0%</td><td>0%</td><td>0%</td><td>0%</td></tr>
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
        </div>
      )}

      {/* VIEW 4: 'WHAT'S NOW' REAL-TIME LIVE TELEMETRY */}
      {activeReportTab === "whats_now" && (
        <div className="wt-card">
          <div className="wt-card-header">
            <div>
              <h2 className="wt-card-title">&quot;What&apos;s Going On In The Company Right Now&quot;</h2>
              <div className="wt-card-subtitle">Live employee activity, focus applications, and real-time timers</div>
            </div>
            <span className="badge badge-green">🟢 Live Feed Connected</span>
          </div>

          <table className="wt-table">
            <thead>
              <tr>
                <th>Current Status</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Current Active Application / Task</th>
                <th>Active Today</th>
                <th>Idle Today</th>
                <th>WorkTime Score</th>
              </tr>
            </thead>
            <tbody>
              {EMPLOYEES.map(emp => {
                const u = getEmployeeUser(emp);
                return (
                  <tr key={emp.id}>
                    <td>
                      {emp.remote_status === "active" ? (
                        <span><span className="wt-color-square sq-green" />Active</span>
                      ) : emp.remote_status === "in_meeting" ? (
                        <span><span className="wt-color-square sq-purple" />In Meeting</span>
                      ) : emp.remote_status === "idle" ? (
                        <span><span className="wt-color-square sq-yellow" />Idle / Break</span>
                      ) : (
                        <span><span className="wt-color-square sq-gray" />Offline</span>
                      )}
                    </td>
                    <td>
                      <span className="wt-table-link">{u?.name}</span>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{emp.position}</div>
                    </td>
                    <td>{emp.department}</td>
                    <td>
                      <strong>{emp.current_activity}</strong>
                    </td>
                    <td><strong style={{ color: "#15803d" }}>{emp.active_time}</strong></td>
                    <td style={{ color: "#b45309" }}>{emp.idle_time}</td>
                    <td>
                      <strong>{emp.productivity_score}%</strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
