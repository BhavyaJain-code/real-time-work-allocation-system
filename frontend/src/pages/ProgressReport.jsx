import { useState, useRef } from "react";
import { Printer, Download, User, ChevronDown, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { 
  EMPLOYEES, TASKS, TASK_ASSIGNMENTS, 
  getEmployeeUser, getEmployeeSkills, getEmployeeProgress, 
  getEmployeeFeedback, getTask, getUser, getManagerEmployees 
} from "../data/mockData";

export default function ProgressReport() {
  const { user } = useAuth();
  const isManager = user?.role === "manager";
  const allEmployees = isManager ? getManagerEmployees(user?.id) : EMPLOYEES;

  const [selectedEmpId, setSelectedEmpId] = useState(allEmployees[0]?.id || 1);
  const [reportPeriod, setReportPeriod] = useState("Quarterly (Q3 2026)");
  const [reportDate, setReportDate] = useState("2026-08-27");

  const selectedEmp = allEmployees.find(e => e.id === Number(selectedEmpId)) || allEmployees[0];
  const empUser = getEmployeeUser(selectedEmp);
  const empSkills = getEmployeeSkills(selectedEmp?.id);
  const empProgress = getEmployeeProgress(selectedEmp?.id);
  const empAssignments = TASK_ASSIGNMENTS.filter(a => a.employee_id === selectedEmp?.id);

  // Dynamic Grade & Rating calculation
  const score = selectedEmp?.productivity_score || 85;
  const grade = score >= 92 ? "A" : score >= 80 ? "B" : score >= 65 ? "C" : "D";
  const overallRating = score >= 92 ? "EXCELLENT (A+)" : score >= 85 ? "VERY GOOD (A)" : score >= 75 ? "GOOD (B+)" : "AVERAGE (B)";

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
              style={{ fontWeight: 600, minWidth: 200 }}
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

        {/* 4. Employee Details Box (Light Grey Grid) */}
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
          <div><strong>Employee Name :</strong> {empUser?.name || "Rone Gomal"}</div>
          <div><strong>Employee ID :</strong> EMP-10{selectedEmp?.id || "23"}</div>
          <div><strong>Department :</strong> {selectedEmp?.department || "Assembly Line"}</div>
          <div><strong>Designation :</strong> {selectedEmp?.position || "Machine Operator"}</div>
          <div><strong>Shift :</strong> Day (8:00 AM – 5:00 PM)</div>
          <div><strong>Supervisor :</strong> Mr. S. Thekker</div>
          <div><strong>Date :</strong> {reportDate}</div>
          <div><strong>Location :</strong> Plant 1 / TX Headquarters</div>
        </div>

        {/* 5. Grading Legend */}
        <div style={{ fontSize: 10.5, color: "#111827", fontWeight: 600, marginBottom: 8 }}>
          (A=Excellent, B=Good, C=Average, D=Needs Improvement)
        </div>

        {/* 6. Competency Area Table */}
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
            <tr>
              <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>Technical Skills</td>
              <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, border: "1px solid #e5e7eb" }}>{grade}</td>
              <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>Needs refresher training on CNC machine setup</td>
            </tr>
            <tr>
              <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>Productivity</td>
              <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, border: "1px solid #e5e7eb" }}>A</td>
              <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>None</td>
            </tr>
            <tr>
              <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>Quality Compliance</td>
              <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, border: "1px solid #e5e7eb" }}>{grade === "A" ? "A" : "B"}</td>
              <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>2 instances of rework due to improper finishing</td>
            </tr>
            <tr>
              <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>Safety Practices</td>
              <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, border: "1px solid #e5e7eb" }}>A</td>
              <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>None</td>
            </tr>
            <tr>
              <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>Teamwork &amp; Discipline</td>
              <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, border: "1px solid #e5e7eb" }}>A</td>
              <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>None</td>
            </tr>
          </tbody>
        </table>

        {/* 7. Bottom Section (Comments & Rating Box) */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, marginBottom: 18 }}>
          {/* Left Column: Comments & Observations */}
          <div>
            <div style={{ display: "inline-block", backgroundColor: "#fae4d2", padding: "2px 8px", fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
              Comments / Observations
            </div>
            <div style={{ fontSize: 11.5, lineHeight: 1.6, color: "#1f2937", marginBottom: 12 }}>
              <div>✅ Delivers consistent work output.</div>
              <div>✅ Works well with team members and supports junior staff.</div>
              <div>⚠️ Needs to improve <strong>quality checks</strong> before passing products.</div>
              <div>⚠️ Suggested <strong>CNC upskilling training</strong> in next quarter.</div>
            </div>

            <div style={{ display: "inline-block", backgroundColor: "#fae4d2", padding: "2px 8px", fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
              Compliance &amp; Attendance
            </div>
            <div style={{ fontSize: 11.5, lineHeight: 1.6, color: "#1f2937" }}>
              <div><strong>Attendance Record:</strong> 98% (1 late arrival recorded).</div>
              <div><strong>PPE Usage:</strong> Always compliant.</div>
              <div><strong>Incidents / Safety Violations:</strong> None.</div>
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
              {overallRating}
            </div>
          </div>
        </div>

        {/* 8. Confidentiality Statement */}
        <div style={{ fontSize: 10, color: "#6b7280", borderBottom: "1px solid #e5e7eb", paddingBottom: 10, marginBottom: 16 }}>
          Confidentiality Statement: &quot;This document is confidential and intended only for internal HR/Performance review purposes.&quot;
        </div>

        {/* 9. Signatures */}
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
