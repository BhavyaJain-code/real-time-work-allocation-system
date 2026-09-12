import { useState } from "react";
import { Printer, Download, User, ChevronDown, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { 
  EMPLOYEES, TASKS, TASK_ASSIGNMENTS, 
  getEmployeeUser, getEmployeeSkills, getEmployeeProgress, 
  getTask, getUser, getManagerEmployees 
} from "../data/mockData";

// Dedicated, individual performance profiles for each employee
const INDIVIDUAL_REPORTS = {
  1: {
    empIdCode: "ENG-1042",
    shift: "Day (9:00 AM – 5:00 PM)",
    supervisor: "Mr. Ravi Kapoor (Eng Director)",
    location: "Tech Hub - Floor 3 / Remote",
    competencies: [
      { area: "Technical Skills (React, TypeScript)", grade: "A", pending: "None (Mentoring junior devs on UI architecture)" },
      { area: "Productivity", grade: "A+", pending: "None (5h 45m focused daily output)" },
      { area: "Quality Compliance", grade: "A", pending: "Zero regression bugs across 12 sprint deliverables" },
      { area: "Safety Practices & Security", grade: "A", pending: "None (100% compliant with auth security standards)" },
      { area: "Teamwork & Discipline", grade: "A+", pending: "None (Excellent cross-functional collaboration)" }
    ],
    comments: [
      { type: "positive", text: "Delivers pixel-perfect UI components ahead of scheduled sprint deadlines." },
      { type: "positive", text: "Proactively conducts thorough code reviews and supports backend integration." },
      { type: "neutral",  text: "Recommended to lead frontend architecture for next generation design system." },
      { type: "neutral",  text: "Suggested Advanced Web Performance & Accessibility certification in Q4." }
    ],
    attendanceRecord: "99.2% (0 late arrivals recorded)",
    protocolUsage: "100% compliant with CI/CD and secure coding standards",
    violations: "None",
    overallRating: "EXCELLENT (A+)"
  },
  2: {
    empIdCode: "ENG-1088",
    shift: "Day (8:30 AM – 5:30 PM)",
    supervisor: "Mr. Ravi Kapoor (Eng Director)",
    location: "Tech Hub - Floor 3",
    competencies: [
      { area: "Technical Skills (Node.js, PostgreSQL)", grade: "A", pending: "Complete Redis caching migration for refresh tokens" },
      { area: "Productivity", grade: "A", pending: "None (96% WorkTime productivity index)" },
      { area: "Quality Compliance", grade: "B+", pending: "1 index tuning optimization needed on reporting queries" },
      { area: "Safety Practices & Security", grade: "A", pending: "None (Strict adherence to API auth rotation)" },
      { area: "Teamwork & Discipline", grade: "A", pending: "None (Consistently meets complex backend deadlines)" }
    ],
    comments: [
      { type: "positive", text: "Architected high-throughput REST API endpoints and reliable migration scripts." },
      { type: "positive", text: "Resolved critical query bottlenecks, improving response times by 40%." },
      { type: "warning",  text: "High workload capacity (90%); supervisor must prevent overtime fatigue." },
      { type: "neutral",  text: "Suggested Cloud Distributed Systems certification in next quarter." }
    ],
    attendanceRecord: "97.5% (1 late arrival recorded due to scheduled late deploy)",
    protocolUsage: "Fully compliant with database access and migration protocols",
    violations: "None",
    overallRating: "VERY GOOD (A)"
  },
  3: {
    empIdCode: "DES-2015",
    shift: "Day (9:15 AM – 5:15 PM)",
    supervisor: "Ms. Nina Torres (Lead Designer)",
    location: "Design Studio / Remote",
    competencies: [
      { area: "Technical Skills (Figma, UX Research)", grade: "A", pending: "Finalize dark mode color tokens in design library" },
      { area: "Productivity", grade: "A", pending: "None (High creative throughput)" },
      { area: "Quality Compliance", grade: "A", pending: "Design handoffs 100% aligned with design system specs" },
      { area: "Safety Practices & Data", grade: "A", pending: "None (Strict adherence to digital asset licensing)" },
      { area: "Teamwork & Discipline", grade: "A+", pending: "None (Outstanding sprint review presentations)" }
    ],
    comments: [
      { type: "positive", text: "Crafted intuitive user journey maps and elegant pastel interface systems." },
      { type: "positive", text: "Works exceptionally well with engineering team during sprint implementation." },
      { type: "neutral",  text: "Consistently incorporates user feedback into iterative UX improvements." },
      { type: "neutral",  text: "Suggested Advanced Usability Testing & Analytics workshop in Q4." }
    ],
    attendanceRecord: "98.8% (0 late arrivals recorded)",
    protocolUsage: "Always compliant with design asset licensing & brand guidelines",
    violations: "None",
    overallRating: "EXCELLENT (A+)"
  },
  4: {
    empIdCode: "ENG-3091",
    shift: "Flexible (On-Call Rotation)",
    supervisor: "Mr. Ravi Kapoor (Eng Director)",
    location: "Infrastructure Ops / Remote",
    competencies: [
      { area: "Technical Skills (Docker, AWS)", grade: "B", pending: "Refresher training on Terraform IAC state locking" },
      { area: "Productivity", grade: "B", pending: "2 infrastructure audit action items pending resolution" },
      { area: "Quality Compliance", grade: "B", pending: "Minor drift detected in staging container configuration" },
      { area: "Safety Practices & Security", grade: "A", pending: "None (Multi-factor auth strictly enforced on AWS)" },
      { area: "Teamwork & Discipline", grade: "B+", pending: "Improve check-in response time during off-peak sprint days" }
    ],
    comments: [
      { type: "positive", text: "Successfully automated production container build & deployment pipelines." },
      { type: "warning",  text: "Needs closer follow-up on staging environment drift resolution." },
      { type: "warning",  text: "Regular standup attendance and task tracking updates need consistency." },
      { type: "neutral",  text: "Scheduled AWS Solutions Architect upskilling training in Q4." }
    ],
    attendanceRecord: "91.0% (3 off-work days recorded during quarterly audit)",
    protocolUsage: "Compliant with cloud security access policies",
    violations: "None",
    overallRating: "AVERAGE (B)"
  },
  5: {
    empIdCode: "DAT-4008",
    shift: "Day (9:00 AM – 5:00 PM)",
    supervisor: "Mr. Sam Osei (Head of Data)",
    location: "Data Analytics Wing",
    competencies: [
      { area: "Technical Skills (Python, SQL, BI)", grade: "A", pending: "Complete skill gap dashboard automation script" },
      { area: "Productivity", grade: "A", pending: "None (5h 15m active daily analytical focus)" },
      { area: "Quality Compliance", grade: "A", pending: "Data validation integrity tests passed with 99.8% precision" },
      { area: "Safety Practices & Security", grade: "A", pending: "None (Full GDPR and employee data privacy adherence)" },
      { area: "Teamwork & Discipline", grade: "A", pending: "None (Clear, insightful analytical presentations)" }
    ],
    comments: [
      { type: "positive", text: "Produced comprehensive workload and telemetry analytics dashboards." },
      { type: "positive", text: "Highly detail-oriented data cleaning and automated Python report pipelines." },
      { type: "positive", text: "Excellent cross-department collaboration with HR and management teams." },
      { type: "neutral",  text: "Recommended for Advanced Predictive Data Modeling program." }
    ],
    attendanceRecord: "99.0% (0 late arrivals recorded)",
    protocolUsage: "100% compliant with corporate data governance policies",
    violations: "None",
    overallRating: "EXCELLENT (A)"
  },
  6: {
    empIdCode: "ENG-5022",
    shift: "Day (8:45 AM – 5:15 PM)",
    supervisor: "Mr. Ravi Kapoor (Eng Director)",
    location: "Tech Hub - Floor 2",
    competencies: [
      { area: "Technical Skills (Full-Stack, GraphQL)", grade: "B+", pending: "Complete GraphQL API migration for project modules" },
      { area: "Productivity", grade: "A", pending: "None (6h 05m active daily coding output)" },
      { area: "Quality Compliance", grade: "B+", pending: "1 instance of test coverage drop on notification routes" },
      { area: "Safety Practices & Security", grade: "A", pending: "None (Adheres to zero-trust API guidelines)" },
      { area: "Teamwork & Discipline", grade: "A", pending: "None (Helpful and approachable peer reviewer)" }
    ],
    comments: [
      { type: "positive", text: "Versatile engineer delivering full-stack end-to-end task features." },
      { type: "positive", text: "Quickly debugged and optimized real-time WebSocket sync issues." },
      { type: "warning",  text: "Maintain automated unit test coverage above 85% on all new PRs." },
      { type: "neutral",  text: "Suggested GraphQL Federation & Microservices workshop in Q4." }
    ],
    attendanceRecord: "96.8% (1 late arrival recorded)",
    protocolUsage: "Fully compliant with code review and deployment checklist",
    violations: "None",
    overallRating: "GOOD (B+)"
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
      {/* Top Controls Bar (Hidden during Print) */}
      <div className="no-print" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, background: "#ffffff", padding: "14px 18px", borderRadius: 4, border: "1px solid var(--wt-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: "var(--wt-text-main)" }}>Select Employee Report:</span>
            <select
              className="form-control"
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(Number(e.target.value))}
              style={{ fontWeight: 600, minWidth: 220 }}
            >
              {allEmployees.map(e => {
                const u = getEmployeeUser(e);
                return <option key={e.id} value={e.id}>{u?.name} ({e.department} - {e.position})</option>;
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

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" onClick={handlePrint}>
              <Printer size={14} /> Download / Print Report (PDF)
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PRINTABLE REPORT CONTAINER (Exact match to uploaded template image)
         ========================================================================= */}
      <div 
        className="employee-report-sheet"
        style={{
          maxWidth: 820,
          margin: "0 auto",
          background: "#ffffff",
          padding: "24px 32px 40px",
          border: "1px solid #d1d5db",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          fontFamily: "'Inter', sans-serif",
          color: "#111827"
        }}
      >
        {/* 1. Yellow/Gold Top Banner */}
        <div 
          style={{
            backgroundColor: "#f5a623",
            color: "#111827",
            textAlign: "center",
            padding: "10px 16px",
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: "0.2px",
            marginBottom: 16
          }}
        >
          Employee Performance &amp; Progress Report
        </div>

        {/* 2. Center Subtitle: Report Period */}
        <div style={{ textAlign: "center", fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 16 }}>
          Report Period : <span style={{ fontWeight: 500, color: "#374151" }}>{reportPeriod}</span>
        </div>

        {/* 3. Employee Details Box (Light Grey Grid) */}
        <div 
          style={{
            backgroundColor: "#f3f4f6",
            padding: "14px 18px",
            marginBottom: 14,
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: "8px 24px",
            fontSize: 12.5,
            border: "1px solid #e5e7eb"
          }}
        >
          <div><strong>Employee Name :</strong> {empUser?.name}</div>
          <div><strong>Employee ID :</strong> {repData.empIdCode}</div>
          <div><strong>Department :</strong> {selectedEmp?.department}</div>
          <div><strong>Designation :</strong> {selectedEmp?.position}</div>
          <div><strong>Shift :</strong> {repData.shift}</div>
          <div><strong>Supervisor :</strong> {repData.supervisor}</div>
          <div><strong>Date :</strong> {reportDate}</div>
          <div><strong>Location :</strong> {repData.location}</div>
        </div>

        {/* 4. Grading Legend */}
        <div style={{ fontSize: 10.5, color: "#111827", fontWeight: 600, marginBottom: 8 }}>
          (A=Excellent, B=Good, C=Average, D=Needs Improvement)
        </div>

        {/* 5. Competency Area Table */}
        <table 
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 12,
            marginBottom: 18,
            border: "1px solid #e5e7eb"
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f5a623", color: "#111827" }}>
              <th style={{ padding: "8px 12px", textAlign: "left", width: "35%", fontWeight: 700, border: "1px solid #e5e7eb" }}>
                Competency Area
              </th>
              <th style={{ padding: "8px 12px", textAlign: "center", width: "15%", fontWeight: 700, border: "1px solid #e5e7eb" }}>
                Grade
              </th>
              <th style={{ padding: "8px 12px", textAlign: "left", width: "50%", fontWeight: 700, border: "1px solid #e5e7eb" }}>
                Pending Tasks / Non-Compliance
              </th>
            </tr>
          </thead>
          <tbody>
            {repData.competencies.map((comp, idx) => (
              <tr key={idx}>
                <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>{comp.area}</td>
                <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, border: "1px solid #e5e7eb" }}>
                  {comp.grade}
                </td>
                <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>{comp.pending}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 6. Bottom Section (Comments & Rating Box) */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, marginBottom: 18 }}>
          {/* Left Column: Comments & Observations */}
          <div>
            <div style={{ display: "inline-block", backgroundColor: "#fae4d2", padding: "2px 8px", fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
              Comments / Observations
            </div>
            <div style={{ fontSize: 11.5, lineHeight: 1.6, color: "#1f2937", marginBottom: 12 }}>
              {repData.comments.map((cmt, idx) => (
                <div key={idx}>
                  {cmt.type === "positive" ? "✅" : cmt.type === "warning" ? "⚠️" : "💡"} {cmt.text}
                </div>
              ))}
            </div>

            <div style={{ display: "inline-block", backgroundColor: "#fae4d2", padding: "2px 8px", fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
              Compliance &amp; Attendance
            </div>
            <div style={{ fontSize: 11.5, lineHeight: 1.6, color: "#1f2937" }}>
              <div><strong>Attendance Record:</strong> {repData.attendanceRecord}</div>
              <div><strong>PPE / Protocol Usage:</strong> {repData.protocolUsage}</div>
              <div><strong>Incidents / Safety Violations:</strong> {repData.violations}</div>
            </div>
          </div>

          {/* Right Column: Overall Performance Rating Box */}
          <div 
            style={{
              backgroundColor: "#fce9db",
              padding: "18px 14px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 2,
              height: "fit-content"
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
              Overall Performance Rating
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#c2410c" }}>
              {repData.overallRating}
            </div>
          </div>
        </div>

        {/* 7. Confidentiality Statement */}
        <div style={{ fontSize: 10, color: "#6b7280", borderBottom: "1px solid #e5e7eb", paddingBottom: 10, marginBottom: 16 }}>
          Confidentiality Statement: &quot;This document is confidential and intended only for internal HR/Performance review purposes.&quot;
        </div>

        {/* 8. Signatures */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 14 }}>
            Signatures
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 12 }}>
            <div>
              <strong>Employee Signature:</strong> <span style={{ textDecoration: "underline", color: "#9ca3af" }}>_______________________________________</span>
            </div>
            <div>
              <strong>Supervisor Signature:</strong> <span style={{ textDecoration: "underline", color: "#9ca3af" }}>_______________________________________</span>
            </div>
            <div>
              <strong>HR / Manager Signature:</strong> <span style={{ textDecoration: "underline", color: "#9ca3af" }}>_______________________________________</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
