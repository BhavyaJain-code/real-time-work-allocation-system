import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { EMPLOYEES, getEmployeeUser, getManagerEmployees } from "../data/mockData";

const INDIVIDUAL_REPORTS = {
  1: {
    empIdCode: "ENG-1042",
    shift: "Day (9:00 AM - 5:00 PM)",
    supervisor: "Ravi Kapoor (Engineering Lead)",
    location: "Technical Center / Remote",
    competencies: [
      { area: "Technical Skills (React, TypeScript)", grade: "A", pending: "None (Mentoring junior developers on UI architecture)" },
      { area: "Productivity", grade: "A+", pending: "None (5h 45m daily focused output)" },
      { area: "Quality Compliance", grade: "A", pending: "Zero regression defects across 12 sprint deliverables" },
      { area: "Safety Practices & Protocol", grade: "A", pending: "None (Compliant with authentication standards)" },
      { area: "Teamwork & Discipline", grade: "A+", pending: "None (Excellent peer code reviews)" }
    ],
    comments: [
      "Delivers clean UI components ahead of sprint deadlines.",
      "Proactively conducts code reviews and assists backend integration.",
      "Recommended for Lead Architecture certification in next cycle.",
      "Suggested Advanced Web Accessibility training in Q4."
    ],
    attendanceRecord: "99.2% (0 late arrivals recorded)",
    protocolUsage: "100% compliant with CI/CD and secure coding standards",
    violations: "None",
    overallRating: "GRADE: A+ (EXCELLENT)"
  },
  2: {
    empIdCode: "ENG-1088",
    shift: "Day (8:30 AM - 5:30 PM)",
    supervisor: "Ravi Kapoor (Engineering Lead)",
    location: "Technical Center - Floor 3",
    competencies: [
      { area: "Technical Skills (Node.js, PostgreSQL)", grade: "A", pending: "Complete Redis caching migration for token authentication" },
      { area: "Productivity", grade: "A", pending: "None (96% WorkTime productivity rating)" },
      { area: "Quality Compliance", grade: "B+", pending: "1 index tuning optimization on reporting queries" },
      { area: "Safety Practices & Protocol", grade: "A", pending: "None (Strict adherence to API key rotation)" },
      { area: "Teamwork & Discipline", grade: "A", pending: "None (Consistently meets backend deadlines)" }
    ],
    comments: [
      "Architected reliable REST API endpoints and migration scripts.",
      "Resolved query bottlenecks, improving response times by 40%.",
      "High workload capacity (90%); monitor to prevent overtime fatigue.",
      "Suggested Cloud Distributed Systems certification in next quarter."
    ],
    attendanceRecord: "97.5% (1 late arrival recorded due to scheduled late deploy)",
    protocolUsage: "Fully compliant with database access and migration protocols",
    violations: "None",
    overallRating: "GRADE: A (VERY GOOD)"
  },
  3: {
    empIdCode: "DES-2015",
    shift: "Day (9:15 AM - 5:15 PM)",
    supervisor: "Nina Torres (Design Lead)",
    location: "Design Studio / Remote",
    competencies: [
      { area: "Technical Skills (Figma, UX Research)", grade: "A", pending: "Finalize dark mode tokens in design library" },
      { area: "Productivity", grade: "A", pending: "None (High creative throughput)" },
      { area: "Quality Compliance", grade: "A", pending: "Design handoffs 100% aligned with specifications" },
      { area: "Safety Practices & Protocol", grade: "A", pending: "None (Compliant with digital asset licensing)" },
      { area: "Teamwork & Discipline", grade: "A+", pending: "None (Outstanding sprint review presentations)" }
    ],
    comments: [
      "Crafted intuitive user journey maps and clean interface systems.",
      "Works exceptionally well with engineering team during sprint implementation.",
      "Consistently incorporates user feedback into iterative UX improvements.",
      "Suggested Advanced Usability Testing & Analytics workshop in Q4."
    ],
    attendanceRecord: "98.8% (0 late arrivals recorded)",
    protocolUsage: "Always compliant with asset licensing and brand guidelines",
    violations: "None",
    overallRating: "GRADE: A+ (EXCELLENT)"
  },
  4: {
    empIdCode: "ENG-3091",
    shift: "Flexible (On-Call Rotation)",
    supervisor: "Ravi Kapoor (Engineering Lead)",
    location: "Infrastructure Operations",
    competencies: [
      { area: "Technical Skills (Docker, AWS)", grade: "B", pending: "Refresher training on Terraform IAC state locking" },
      { area: "Productivity", grade: "B", pending: "2 infrastructure audit action items pending resolution" },
      { area: "Quality Compliance", grade: "B", pending: "Minor drift detected in staging container configuration" },
      { area: "Safety Practices & Protocol", grade: "A", pending: "None (Multi-factor authentication enforced on AWS)" },
      { area: "Teamwork & Discipline", grade: "B+", pending: "Improve check-in response time during off-peak sprint days" }
    ],
    comments: [
      "Successfully automated production container build & deployment pipelines.",
      "Needs closer follow-up on staging environment drift resolution.",
      "Regular standup attendance and task tracking updates need consistency.",
      "Scheduled AWS Solutions Architect upskilling training in Q4."
    ],
    attendanceRecord: "91.0% (3 off-work days recorded during quarterly audit)",
    protocolUsage: "Compliant with cloud security access policies",
    violations: "None",
    overallRating: "GRADE: B (AVERAGE)"
  },
  5: {
    empIdCode: "DAT-4008",
    shift: "Day (9:00 AM - 5:00 PM)",
    supervisor: "Sam Osei (Head of Data)",
    location: "Data Analytics Center",
    competencies: [
      { area: "Technical Skills (Python, SQL, BI)", grade: "A", pending: "Complete skill gap dashboard automation script" },
      { area: "Productivity", grade: "A", pending: "None (5h 15m active daily analytical focus)" },
      { area: "Quality Compliance", grade: "A", pending: "Data validation integrity tests passed with 99.8% precision" },
      { area: "Safety Practices & Protocol", grade: "A", pending: "None (Full GDPR and employee data privacy adherence)" },
      { area: "Teamwork & Discipline", grade: "A", pending: "None (Clear, insightful analytical presentations)" }
    ],
    comments: [
      "Produced comprehensive workload and telemetry analytics models.",
      "Highly detail-oriented data cleaning and automated Python report pipelines.",
      "Excellent cross-department collaboration with HR and management teams.",
      "Recommended for Advanced Predictive Data Modeling program."
    ],
    attendanceRecord: "99.0% (0 late arrivals recorded)",
    protocolUsage: "100% compliant with corporate data governance policies",
    violations: "None",
    overallRating: "GRADE: A (EXCELLENT)"
  },
  6: {
    empIdCode: "ENG-5022",
    shift: "Day (8:45 AM - 5:15 PM)",
    supervisor: "Ravi Kapoor (Engineering Lead)",
    location: "Technical Center - Floor 2",
    competencies: [
      { area: "Technical Skills (Full-Stack, GraphQL)", grade: "B+", pending: "Complete GraphQL API migration for project modules" },
      { area: "Productivity", grade: "A", pending: "None (6h 05m active daily coding output)" },
      { area: "Quality Compliance", grade: "B+", pending: "1 instance of test coverage drop on notification routes" },
      { area: "Safety Practices & Protocol", grade: "A", pending: "None (Adheres to zero-trust API guidelines)" },
      { area: "Teamwork & Discipline", grade: "A", pending: "None (Helpful and approachable peer reviewer)" }
    ],
    comments: [
      "Versatile engineer delivering full-stack end-to-end task features.",
      "Quickly debugged and optimized real-time WebSocket sync issues.",
      "Maintain automated unit test coverage above 85% on all new PRs.",
      "Suggested GraphQL Federation & Microservices workshop in Q4."
    ],
    attendanceRecord: "96.8% (1 late arrival recorded)",
    protocolUsage: "Fully compliant with code review and deployment checklist",
    violations: "None",
    overallRating: "GRADE: B+ (GOOD)"
  }
};

export default function ProgressReport() {
  const { user } = useAuth();
  const isManager = user?.role === "manager";
  const allEmployees = isManager ? getManagerEmployees(user?.id) : EMPLOYEES;

  const [selectedEmpId, setSelectedEmpId] = useState(allEmployees[0]?.id || 1);
  const [reportPeriod, setReportPeriod] = useState("Quarterly (Q3 2026)");
  const [reportDate, setReportDate] = useState("2026-08-27");

  const selectedEmp = allEmployees.find(e => e.id === Number(selectedEmpId)) || allEmployees[0];
  const empUser = getEmployeeUser(selectedEmp);
  const repData = INDIVIDUAL_REPORTS[selectedEmp?.id] || INDIVIDUAL_REPORTS[1];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Controls Bar */}
      <div className="no-print" style={{ border: "1px solid #000000", padding: "10px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label style={{ fontWeight: "bold" }}>Select Employee:</label>
          <select
            className="form-control"
            value={selectedEmpId}
            onChange={(e) => setSelectedEmpId(Number(e.target.value))}
            style={{ minWidth: 200 }}
          >
            {allEmployees.map(e => {
              const u = getEmployeeUser(e);
              return <option key={e.id} value={e.id}>{u?.name} ({e.department})</option>;
            })}
          </select>

          <select
            className="form-control"
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
          >
            <option value="Quarterly (Q3 2026)">Quarterly (Q3 2026)</option>
            <option value="Monthly (August 2026)">Monthly (August 2026)</option>
            <option value="Annual Review (2026)">Annual Review (2026)</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={handlePrint}>
          Print / Save as PDF
        </button>
      </div>

      {/* Report Document */}
      <div 
        className="employee-report-sheet"
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "24px 30px",
          border: "2px solid #000000",
          backgroundColor: "#ffffff",
          color: "#000000"
        }}
      >
        {/* Title Header */}
        <div 
          style={{
            border: "2px solid #000000",
            textAlign: "center",
            padding: "8px 12px",
            fontWeight: "bold",
            fontSize: 18,
            textTransform: "uppercase",
            marginBottom: 14
          }}
        >
          Employee Performance &amp; Progress Report
        </div>

        {/* Subtitle */}
        <div style={{ textAlign: "center", fontSize: 13, fontWeight: "bold", marginBottom: 14 }}>
          Report Period : {reportPeriod}
        </div>

        {/* Details Table */}
        <table className="wt-table" style={{ marginBottom: 12 }}>
          <tbody>
            <tr>
              <td style={{ width: "20%", fontWeight: "bold" }}>Employee Name:</td>
              <td style={{ width: "30%" }}>{empUser?.name}</td>
              <td style={{ width: "20%", fontWeight: "bold" }}>Employee ID:</td>
              <td style={{ width: "30%" }}>{repData.empIdCode}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: "bold" }}>Department:</td>
              <td>{selectedEmp?.department}</td>
              <td style={{ fontWeight: "bold" }}>Designation:</td>
              <td>{selectedEmp?.position}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: "bold" }}>Shift Schedule:</td>
              <td>{repData.shift}</td>
              <td style={{ fontWeight: "bold" }}>Supervisor:</td>
              <td>{repData.supervisor}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: "bold" }}>Date of Review:</td>
              <td>{reportDate}</td>
              <td style={{ fontWeight: "bold" }}>Location:</td>
              <td>{repData.location}</td>
            </tr>
          </tbody>
        </table>

        {/* Legend */}
        <div style={{ fontSize: 11, fontStyle: "italic", marginBottom: 6 }}>
          (Grading System: A = Excellent, B = Good, C = Average, D = Needs Improvement)
        </div>

        {/* Competencies Table */}
        <table className="wt-table" style={{ marginBottom: 14 }}>
          <thead>
            <tr>
              <th style={{ width: "35%" }}>Competency Area</th>
              <th style={{ width: "15%", textAlign: "center" }}>Grade</th>
              <th style={{ width: "50%" }}>Pending Tasks / Observations</th>
            </tr>
          </thead>
          <tbody>
            {repData.competencies.map((comp, idx) => (
              <tr key={idx}>
                <td>{comp.area}</td>
                <td style={{ textAlign: "center", fontWeight: "bold" }}>{comp.grade}</td>
                <td>{comp.pending}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Comments and Rating */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginBottom: 14 }}>
          <div style={{ border: "1px solid #000000", padding: "10px" }}>
            <div style={{ fontWeight: "bold", borderBottom: "1px solid #000000", paddingBottom: 4, marginBottom: 6 }}>
              Comments &amp; Observations
            </div>
            <ul style={{ paddingLeft: 18, fontSize: 13, lineHeight: 1.5, marginBottom: 10 }}>
              {repData.comments.map((cmt, idx) => (
                <li key={idx}>{cmt}</li>
              ))}
            </ul>

            <div style={{ fontWeight: "bold", borderBottom: "1px solid #000000", paddingBottom: 4, marginBottom: 6 }}>
              Compliance &amp; Attendance
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.5 }}>
              <div>- Attendance Record: {repData.attendanceRecord}</div>
              <div>- Protocol Compliance: {repData.protocolUsage}</div>
              <div>- Safety / Violations: {repData.violations}</div>
            </div>
          </div>

          <div style={{ border: "1px solid #000000", padding: "14px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 12, fontWeight: "bold", textTransform: "uppercase", marginBottom: 6 }}>
              Overall Performance Rating
            </div>
            <div style={{ fontSize: 18, fontWeight: "bold", padding: "8px 4px", border: "2px solid #000000" }}>
              {repData.overallRating}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ fontSize: 11, fontStyle: "italic", borderBottom: "1px solid #000000", paddingBottom: 6, marginBottom: 14 }}>
          Confidentiality Statement: &quot;This document is confidential and intended solely for internal organizational performance evaluation.&quot;
        </div>

        {/* Signatures */}
        <div>
          <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 10 }}>Signatures &amp; Approvals</div>
          <table className="wt-table" style={{ border: "none" }}>
            <tbody>
              <tr>
                <td style={{ border: "none", width: "33%" }}>
                  <div>Employee Signature:</div>
                  <div style={{ marginTop: 24, borderBottom: "1px solid #000000", width: "90%" }}></div>
                </td>
                <td style={{ border: "none", width: "33%" }}>
                  <div>Supervisor Signature:</div>
                  <div style={{ marginTop: 24, borderBottom: "1px solid #000000", width: "90%" }}></div>
                </td>
                <td style={{ border: "none", width: "33%" }}>
                  <div>Manager / HR Signature:</div>
                  <div style={{ marginTop: 24, borderBottom: "1px solid #000000", width: "90%" }}></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
