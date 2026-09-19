import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { EMPLOYEES, USERS, getEmployeeUser, getManagerEmployees } from "../data/mockData";

// =========================================================
// DISTINCT REPORT DATA BY PERIOD (MONTHLY, QUARTERLY, ANNUAL)
// =========================================================

const EMPLOYEE_REPORTS = {
  // --- 1. Priya Sharma (Senior Frontend Dev) ---
  1: {
    empIdCode: "ENG-1042",
    shift: "Day (9:00 AM - 5:00 PM)",
    supervisor: "Ravi Kapoor (Engineering Lead)",
    location: "Technical Center / Remote",
    monthly: {
      periodTitle: "Monthly Progress Review (August 2026)",
      reviewDate: "2026-08-31",
      competencies: [
        { area: "Sprint Execution (React, TypeScript)", grade: "A+", pending: "Redesign login & auth UI sprint deliverable completed ahead of schedule" },
        { area: "Daily Productivity & Focus", grade: "A", pending: "Logged 5h 45m daily active coding telemetry" },
        { area: "Code Quality & PR Reviews", grade: "A+", pending: "Zero regression defects across 4 August sprint releases" },
        { area: "Live Telemetry & Work Allocation", grade: "A", pending: "100% on-time status updates in work allocation system" },
        { area: "Team Standup Collaboration", grade: "A", pending: "Assisted Chen Wei with UI component state synchronization" }
      ],
      comments: [
        "Delivered the new responsive auth flow with zero QA blockers in August.",
        "Refactored navigation component to improve frontend bundle rendering speed.",
        "Conducted 14 peer code reviews with actionable feedback for junior developers.",
        "Target for September: Begin architecture planning for real-time telemetry dashboard."
      ],
      attendanceRecord: "100% (22 working days logged / 0 late arrivals in August)",
      protocolUsage: "100% compliant with frontend branch naming and PR merge protocols",
      violations: "None",
      overallRating: "GRADE: A+ (TOP MONTHLY SPRINT VELOCITY)"
    },
    quarterly: {
      periodTitle: "Quarterly Performance & OKR Review (Q3 2026: Jul - Sep)",
      reviewDate: "2026-09-30",
      competencies: [
        { area: "Technical Domain Mastery (UI Architecture)", grade: "A+", pending: "Standardized TypeScript interfaces across all 6 core frontend modules" },
        { area: "Quarterly OKR & Milestone Delivery", grade: "A+", pending: "Achieved 100% of Q3 UI redesign & real-time sync milestones" },
        { area: "Quality & Security Compliance", grade: "A", pending: "Enforced strict sanitization on all authentication and form inputs" },
        { area: "Cross-Functional Collaboration (Design Handoff)", grade: "A+", pending: "Partnered closely with Nina Torres to integrate 100% of Figma design tokens" },
        { area: "Mentorship & Developer Guidance", grade: "A", pending: "Led 3 frontend architecture sharing workshops for engineering staff" }
      ],
      comments: [
        "Outstanding quarter driving frontend modernization and accessibility compliance.",
        "Maintained an average team productivity score of 94% across 12 sprint deliverables.",
        "Successfully reduced customer-reported UI latency issues by 45% during Q3.",
        "Recommended for Lead Frontend Architect technical certification in Q4."
      ],
      attendanceRecord: "99.2% (64 quarterly days logged / 0 unexcused absences)",
      protocolUsage: "Fully compliant with corporate CI/CD pipelines and security reviews",
      violations: "None",
      overallRating: "GRADE: A+ (EXCELLENT QUARTERLY IMPACT)"
    },
    annual: {
      periodTitle: "Annual Performance Appraisal & Career Review (Fiscal Year 2026)",
      reviewDate: "2026-12-31",
      competencies: [
        { area: "Year-Long Technical Innovation & Architecture", grade: "A+", pending: "Led complete frontend migration to scalable component design system" },
        { area: "Annual Roadmap Execution & Business Impact", grade: "A+", pending: "Delivered all 4 major platform releases on time with 99.9% release reliability" },
        { area: "Organizational Leadership & Culture", grade: "A+", pending: "Recognized as primary technical mentor for new engineering hires" },
        { area: "Enterprise Standards & Security Governance", grade: "A", pending: "Zero security vulnerabilities detected across all audited frontend repos in 2026" },
        { area: "Continuous Upskilling & Mastery", grade: "A+", pending: "Completed Advanced Web Performance and Web Accessibility certifications" }
      ],
      comments: [
        "Priya has been an indispensable pillar of the Engineering department throughout 2026.",
        "Consistently ranked among the top 5% of engineers in code quality and system throughput.",
        "Demonstrated exceptional leadership and autonomy in solving complex architectural challenges.",
        "Executive Committee Recommendation: Promoted to Staff Software Engineer with merit compensation tier."
      ],
      attendanceRecord: "99.6% (250 days logged / 2,080 annual working hours / 0 discrepancies)",
      protocolUsage: "100% compliant across all 4 annual internal and external enterprise audits",
      violations: "None",
      overallRating: "GRADE: A+ (EXCEEDS ANNUAL BENCHMARK — PROMOTION RECOMMENDED)"
    }
  },

  // --- 2. Marcus Lee (Backend Engineer) ---
  2: {
    empIdCode: "ENG-1088",
    shift: "Day (8:30 AM - 5:30 PM)",
    supervisor: "Ravi Kapoor (Engineering Lead)",
    location: "Technical Center - Floor 3",
    monthly: {
      periodTitle: "Monthly Progress Review (August 2026)",
      reviewDate: "2026-08-31",
      competencies: [
        { area: "Sprint Task Delivery (Node.js, PostgreSQL)", grade: "A", pending: "Delivered database schema migration and JWT refresh token rotation" },
        { area: "Daily Output & System Throughput", grade: "A+", pending: "96% WorkTime productivity rating (7h 10m daily focused output)" },
        { area: "API Reliability & Query Optimization", grade: "B+", pending: "Optimized reporting queries; Redis caching layer tuning underway" },
        { area: "Live Telemetry & Workload Balance", grade: "A", pending: "High workload (90%); monitor pacing to sustain output" },
        { area: "Incident Management & Bug Fixes", grade: "A", pending: "Resolved 6 backend service tickets within SLA during August" }
      ],
      comments: [
        "Completed critical Prisma database schema migrations with zero downtime in August.",
        "Implemented secure JWT refresh token mechanism to prevent session hijacking.",
        "Identified and fixed slow relational queries in progress report generation.",
        "Immediate Target: Complete Redis caching configuration for token authentication."
      ],
      attendanceRecord: "97.5% (22 days logged / 1 late arrival due to scheduled deploy)",
      protocolUsage: "100% compliant with database access and credential rotation policies",
      violations: "None",
      overallRating: "GRADE: A (VERY GOOD MONTHLY SPRINT VELOCITY)"
    },
    quarterly: {
      periodTitle: "Quarterly Performance & OKR Review (Q3 2026: Jul - Sep)",
      reviewDate: "2026-09-30",
      competencies: [
        { area: "Backend Systems Architecture & Scaling", grade: "A", pending: "Scaled database query throughput by 40% under peak simulation loads" },
        { area: "Quarterly OKR & Milestone Delivery", grade: "A", pending: "Delivered 100% of core backend and auth security milestones" },
        { area: "Security Protocols & Encryption", grade: "A+", pending: "Automated API key rotation and enforced bcrypt password hashing standards" },
        { area: "Cross-Functional Integration (Data & Frontend)", grade: "A", pending: "Delivered robust telemetry endpoints consumed by Data Analytics" },
        { area: "Code Quality & Automated Testing", grade: "B+", pending: "Backend unit test coverage maintained at 88%" }
      ],
      comments: [
        "Solid quarter architecting stable REST and WebSocket endpoints.",
        "Demonstrated rapid problem-solving during high-concurrency database tests.",
        "Maintained high reliability across 12 sprint cycles with minimal production hotfixes.",
        "Target for Q4: Enroll in Cloud Distributed Systems and Microservices certification."
      ],
      attendanceRecord: "98.0% (63 days logged / 1 scheduled late deploy rest)",
      protocolUsage: "Fully compliant with enterprise data protection and migration standards",
      violations: "None",
      overallRating: "GRADE: A (EXCELLENT QUARTERLY RELIABILITY)"
    },
    annual: {
      periodTitle: "Annual Performance Appraisal & Career Review (Fiscal Year 2026)",
      reviewDate: "2026-12-31",
      competencies: [
        { area: "Annual Backend Infrastructure Stability", grade: "A", pending: "Maintained 99.95% backend service uptime across all 4 quarters" },
        { area: "Database Optimization & Performance Engineering", grade: "A+", pending: "Reduced average API response time from 320ms to 110ms across platform" },
        { area: "Security Compliance & Zero Breach Record", grade: "A+", pending: "Passed all enterprise penetration and security audits with 0 critical findings" },
        { area: "Sprint Throughput & Technical Execution", grade: "A", pending: "Completed 38 major backend task deliverables in 2026" },
        { area: "Team Technical Contributions & Mentorship", grade: "A", pending: "Authored comprehensive backend API documentation and testing guidelines" }
      ],
      comments: [
        "Marcus demonstrated strong technical execution and dedication to backend robustness in 2026.",
        "His database optimizations significantly lowered server compute costs and boosted UX responsiveness.",
        "Consistently meets challenging technical deadlines while maintaining clean architecture.",
        "Appraisal Outcome: Recommended for Senior Backend Engineer title advancement."
      ],
      attendanceRecord: "98.4% (246 days logged / 2,048 annual hours logged)",
      protocolUsage: "100% compliant with cloud security, database governance, and data privacy",
      violations: "None",
      overallRating: "GRADE: A (STRONG ANNUAL PERFORMANCE — ADVANCEMENT RECOMMENDED)"
    }
  },

  // --- 3. Sara Patel (UI/UX Designer) ---
  3: {
    empIdCode: "DES-2015",
    shift: "Day (9:15 AM - 5:15 PM)",
    supervisor: "Nina Torres (Design Lead)",
    location: "Design Studio / Remote",
    monthly: {
      periodTitle: "Monthly Progress Review (August 2026)",
      reviewDate: "2026-08-31",
      competencies: [
        { area: "Design Execution (Figma, Prototyping)", grade: "A", pending: "Finalized user journey wireframes for Work Allocation dashboard" },
        { area: "Design System Tokens & Typography", grade: "A+", pending: "Enforced strict typography and sage green palette system tokens" },
        { area: "Design Handoff & Specification", grade: "A", pending: "Zero design ambiguity reported by frontend engineers during August" },
        { area: "Daily Productivity & Creative Focus", grade: "A", pending: "Logged 4h 20m daily active design telemetry" },
        { area: "User Research & Usability Testing", grade: "A", pending: "Conducted 4 usability testing interviews on navigation structure" }
      ],
      comments: [
        "Delivered crisp, intuitive Figma mockups for task assignment and telemetry workflows.",
        "Collaborated seamlessly with Priya Sharma to ensure exact pixel-level implementation.",
        "Standardized color contrast tokens to achieve full WCAG AA accessibility compliance.",
        "Immediate Target: Complete dark mode design token exploration for Q4 roadmap."
      ],
      attendanceRecord: "98.8% (22 days logged / 0 late arrivals in August)",
      protocolUsage: "100% compliant with Figma component versioning and asset licensing",
      violations: "None",
      overallRating: "GRADE: A+ (OUTSTANDING CREATIVE OUTPUT)"
    },
    quarterly: {
      periodTitle: "Quarterly Performance & OKR Review (Q3 2026: Jul - Sep)",
      reviewDate: "2026-09-30",
      competencies: [
        { area: "UX Strategy & User Journey Optimization", grade: "A+", pending: "Streamlined task creation and approval flow from 6 steps down to 3" },
        { area: "Quarterly OKR & Milestone Delivery", grade: "A", pending: "Completed 100% of Design department sprint UI deliverables" },
        { area: "Accessibility & Design Standards", grade: "A+", pending: "Achieved 100% WCAG 2.1 AA compliance across all application views" },
        { area: "Cross-Functional Collaboration (Engineering & Product)", grade: "A+", pending: "Held bi-weekly design review syncs with 100% stakeholder approval" },
        { area: "Design System Scalability", grade: "A", pending: "Maintained 85+ reusable Figma components with clear variant documentation" }
      ],
      comments: [
        "Sara demonstrated exceptional user empathy and precision in interface design this quarter.",
        "The simplified task allocation workflow received glowing feedback from manager users.",
        "Consistently ahead of engineering sprint handoff timelines.",
        "Suggested for Advanced Usability Testing & Eye-Tracking Analytics workshop in Q4."
      ],
      attendanceRecord: "99.0% (64 days logged / 0 unexcused absences)",
      protocolUsage: "Fully compliant with enterprise brand guidelines and digital asset protection",
      violations: "None",
      overallRating: "GRADE: A+ (EXCELLENT QUARTERLY IMPACT)"
    },
    annual: {
      periodTitle: "Annual Performance Appraisal & Career Review (Fiscal Year 2026)",
      reviewDate: "2026-12-31",
      competencies: [
        { area: "Year-Long Design Leadership & Brand Evolution", grade: "A+", pending: "Co-authored the complete Enterprise Design System 2.0" },
        { area: "User Satisfaction & Product Usability Impact", grade: "A+", pending: "Measured user task completion rate improved by 35% year-over-year" },
        { area: "Cross-Department Alignment & Mentorship", grade: "A", pending: "Guided junior designers and non-design stakeholders on UX best practices" },
        { area: "Consistency & Zero Design Regression", grade: "A+", pending: "100% design-to-code parity maintained across 4 major product releases" },
        { area: "Continuous Learning & Research Innovation", grade: "A", pending: "Completed Certified Usability Analyst (CUA) credentials" }
      ],
      comments: [
        "Sara has transformed the visual identity and user satisfaction of the platform throughout 2026.",
        "Her designs strike the ideal balance between functional data density and elegant aesthetics.",
        "Highly reliable, communicative, and collaborative team player.",
        "Executive Committee Recommendation: Promoted to Senior UI/UX Designer with merit bonus."
      ],
      attendanceRecord: "99.2% (248 days logged / 2,060 annual hours logged)",
      protocolUsage: "100% compliant with copyright, licensing, and enterprise design governance",
      violations: "None",
      overallRating: "GRADE: A+ (EXCEEDS ANNUAL BENCHMARK — PROMOTION RECOMMENDED)"
    }
  },

  // --- 4. James Wilson (DevOps Engineer) ---
  4: {
    empIdCode: "ENG-3091",
    shift: "Flexible (On-Call Rotation)",
    supervisor: "Ravi Kapoor (Engineering Lead)",
    location: "Infrastructure Operations",
    monthly: {
      periodTitle: "Monthly Progress Review (August 2026)",
      reviewDate: "2026-08-31",
      competencies: [
        { area: "Infrastructure Automation (Docker, AWS)", grade: "B", pending: "Dockerize backend services task in progress (65% complete)" },
        { area: "On-Call & System Uptime Maintenance", grade: "A", pending: "Zero unplanned cloud infrastructure downtime during August" },
        { area: "Security Protocols & IAM Policies", grade: "A", pending: "Enforced MFA and role-based access on all AWS development environments" },
        { area: "Daily Active Telemetry & Standup Attendance", grade: "B", pending: "Need improved daily check-in responsiveness during remote shifts" },
        { area: "Documentation & CI/CD Pipelines", grade: "B+", pending: "Updated deployment runbooks for staging environments" }
      ],
      comments: [
        "Maintained rock-solid cloud infrastructure uptime throughout August.",
        "Progressing well on multi-stage Docker container build automation.",
        "Action Item: Improve timeliness on daily standup updates and task logging.",
        "Scheduled refresher training on Terraform IAC state locking for September."
      ],
      attendanceRecord: "92.5% (20 days active / 2 off-work days logged)",
      protocolUsage: "Compliant with cloud security access policies and IAM key rotation",
      violations: "None",
      overallRating: "GRADE: B (SATISFACTORY MONTHLY PROGRESS)"
    },
    quarterly: {
      periodTitle: "Quarterly Performance & OKR Review (Q3 2026: Jul - Sep)",
      reviewDate: "2026-09-30",
      competencies: [
        { area: "Cloud Infrastructure & Cost Optimization", grade: "A", pending: "Completed Q3 Infrastructure Audit and reduced unused AWS instances by 18%" },
        { area: "Quarterly OKR & Milestone Delivery", grade: "B+", pending: "Completed containerization and automated rollback pipelines" },
        { area: "Disaster Recovery & Backup Verification", grade: "A+", pending: "100% automated backup testing succeeded with zero data loss" },
        { area: "Cross-Team Support (Engineering Releases)", grade: "B+", pending: "Assisted backend team during 3 major staging deployments" },
        { area: "Security Compliance & Patch Management", grade: "A", pending: "All OS and container security patches applied within 48 hours of release" }
      ],
      comments: [
        "James successfully reduced cloud infrastructure spending while improving deployment speed.",
        "Staging container environment drift was resolved following audit recommendations.",
        "Keep focusing on consistent daily communication during off-peak sprint days.",
        "Target for Q4: Complete AWS Certified DevOps Engineer Professional certification."
      ],
      attendanceRecord: "93.0% (60 days logged / 3 approved off-days)",
      protocolUsage: "100% compliant with zero-trust infrastructure security policies",
      violations: "None",
      overallRating: "GRADE: B+ (GOOD QUARTERLY CONTRIBUTION)"
    },
    annual: {
      periodTitle: "Annual Performance Appraisal & Career Review (Fiscal Year 2026)",
      reviewDate: "2026-12-31",
      competencies: [
        { area: "Year-Long Cloud Infrastructure Reliability", grade: "A", pending: "Achieved 99.98% overall enterprise cloud infrastructure uptime in 2026" },
        { area: "Annual Cost Governance & Resource Optimization", grade: "A+", pending: "Saved company \$24,000 annually through automated serverless scaling" },
        { area: "Security, Auditing & Disaster Recovery", grade: "A", pending: "Passed SOC2 and ISO 27001 infrastructure compliance audits with zero non-conformities" },
        { area: "Release Pipeline Automation (CI/CD)", grade: "A", pending: "Decreased production deploy duration from 45 mins to 8 mins" },
        { area: "Professional Growth & Technical Certifications", grade: "A", pending: "Achieved AWS Certified Solutions Architect Associate credential" }
      ],
      comments: [
        "James has provided solid foundational support for the entire development organization in 2026.",
        "His infrastructure automations have made software delivery significantly faster and safer.",
        "Communication and standup consistency showed notable improvement in the second half of the year.",
        "Appraisal Outcome: Retained as Core DevOps Engineer with standard annual increment."
      ],
      attendanceRecord: "95.2% (238 days logged / 1,980 annual hours logged)",
      protocolUsage: "100% compliant with enterprise cloud security and disaster recovery standards",
      violations: "None",
      overallRating: "GRADE: A- (MEETS ANNUAL BENCHMARKS SOLIDLY)"
    }
  },

  // --- 5. Aisha Okonkwo (Data Analyst) ---
  5: {
    empIdCode: "DAT-4008",
    shift: "Day (9:00 AM - 5:00 PM)",
    supervisor: "Sam Osei (Head of Data)",
    location: "Data Analytics Center",
    monthly: {
      periodTitle: "Monthly Progress Review (August 2026)",
      reviewDate: "2026-08-31",
      competencies: [
        { area: "Data Modeling & Python Scripting", grade: "A", pending: "Automated daily employee telemetry pipeline script in Python" },
        { area: "Productivity & Analytical Accuracy", grade: "A+", pending: "Logged 5h 15m active daily analytical focus with 99.8% precision" },
        { area: "Reporting & Visualization (SQL, BI)", grade: "A", pending: "Delivered executive employee skill gap dashboard for HR" },
        { area: "Data Governance & Privacy Compliance", grade: "A+", pending: "100% GDPR and PII anonymization compliance on all dataset exports" },
        { area: "Team Collaboration & Stakeholder Sync", grade: "A", pending: "Presented August workforce telemetry insights to management" }
      ],
      comments: [
        "Built highly accurate automated data models tracking employee productivity and burnout risk.",
        "Cleaned and integrated historical task allocation datasets with zero data loss.",
        "Proactively highlighted workload distribution anomalies to department managers.",
        "Immediate Target: Complete skill gap dashboard automation script by first week of September."
      ],
      attendanceRecord: "99.0% (22 days logged / 0 late arrivals in August)",
      protocolUsage: "100% compliant with data protection and employee privacy guidelines",
      violations: "None",
      overallRating: "GRADE: A+ (TOP ANALYTICAL PERFORMANCE)"
    },
    quarterly: {
      periodTitle: "Quarterly Performance & OKR Review (Q3 2026: Jul - Sep)",
      reviewDate: "2026-09-30",
      competencies: [
        { area: "Telemetry Analytics & Predictive Modeling", grade: "A+", pending: "Implemented predictive burnout detection model with 92% early warning accuracy" },
        { area: "Quarterly OKR & Milestone Delivery", grade: "A", pending: "Completed 100% of Q3 data warehouse and reporting automation goals" },
        { area: "SQL Query Efficiency & Pipeline Reliability", grade: "A+", pending: "Zero data pipeline downtime recorded across entire third quarter" },
        { area: "Cross-Functional Insights (HR & Operations)", grade: "A+", pending: "Provided data-driven headcount allocation recommendations adopted by Executive Admin" },
        { area: "Data Documentation & Schema Lineage", grade: "A", pending: "Documented complete data dictionary for 24 core telemetry metrics" }
      ],
      comments: [
        "Aisha has proven to be an exceptional analytical asset to the leadership team in Q3.",
        "Her predictive telemetry models have allowed proactive workload balancing across teams.",
        "Consistently delivers clear, visually compelling presentations to non-technical leaders.",
        "Recommended for Advanced Predictive Modeling and Machine Learning program in Q4."
      ],
      attendanceRecord: "99.2% (64 days logged / 0 unexcused absences)",
      protocolUsage: "Fully compliant with enterprise data protection and regulatory policies",
      violations: "None",
      overallRating: "GRADE: A+ (EXCELLENT QUARTERLY IMPACT)"
    },
    annual: {
      periodTitle: "Annual Performance Appraisal & Career Review (Fiscal Year 2026)",
      reviewDate: "2026-12-31",
      competencies: [
        { area: "Year-Long Data Strategy & Telemetry Architecture", grade: "A+", pending: "Spearheaded the enterprise real-time workforce telemetry data platform" },
        { area: "Business Value & Operational ROI Generated", grade: "A+", pending: "Data insights directly improved company-wide project delivery efficiency by 28%" },
        { area: "Data Governance, Ethics & Regulatory Audits", grade: "A+", pending: "Zero data compliance discrepancies across all internal and external data audits" },
        { area: "Analytics Throughput & Model Accuracy", grade: "A", pending: "Maintained 99.8% precision across 150+ automated executive reports in 2026" },
        { area: "Team Leadership & Data Mentorship", grade: "A", pending: "Trained department managers on data-driven resource allocation techniques" }
      ],
      comments: [
        "Aisha is an exemplary high-performer whose analytics have shaped corporate operations in 2026.",
        "Her work directly empowered executives to make informed hiring and workload decisions.",
        "Demonstrates high initiative, technical excellence, and unmatched analytical rigor.",
        "Executive Committee Recommendation: Promoted to Senior Data Analyst with merit compensation bonus."
      ],
      attendanceRecord: "99.5% (249 days logged / 2,075 annual hours logged)",
      protocolUsage: "100% compliant across all corporate data governance and security frameworks",
      violations: "None",
      overallRating: "GRADE: A+ (EXCEEDS ANNUAL BENCHMARK — PROMOTION RECOMMENDED)"
    }
  },

  // --- 6. Chen Wei (Full-Stack Dev) ---
  6: {
    empIdCode: "ENG-5022",
    shift: "Day (8:45 AM - 5:15 PM)",
    supervisor: "Ravi Kapoor (Engineering Lead)",
    location: "Technical Center - Floor 2",
    monthly: {
      periodTitle: "Monthly Progress Review (August 2026)",
      reviewDate: "2026-08-31",
      competencies: [
        { area: "Sprint Feature Delivery (Full-Stack, GraphQL)", grade: "B+", pending: "WebSocket real-time updates task in review phase; GraphQL API in progress" },
        { area: "Daily Coding Output & Throughput", grade: "A", pending: "Logged 6h 05m active daily coding output (84% productivity score)" },
        { area: "Unit Testing & Code Coverage", grade: "B+", pending: "Addressed test coverage drop on notification routes (restored to 86%)" },
        { area: "Live Telemetry & Workload Balance", grade: "A", pending: "Maintained steady workload pacing (80% allocation)" },
        { area: "Bug Triage & Peer Collaboration", grade: "A", pending: "Quickly resolved WebSocket connection drop bug reported during testing" }
      ],
      comments: [
        "Demonstrated strong full-stack capability implementing real-time socket listeners.",
        "Quickly incorporated code review feedback from Priya Sharma on state management.",
        "Restored automated test coverage across notification endpoints.",
        "Immediate Target: Complete GraphQL API project module endpoints for September deploy."
      ],
      attendanceRecord: "96.8% (21 days logged / 1 late arrival recorded)",
      protocolUsage: "100% compliant with pull request review guidelines and linting rules",
      violations: "None",
      overallRating: "GRADE: B+ (GOOD MONTHLY SPRINT VELOCITY)"
    },
    quarterly: {
      periodTitle: "Quarterly Performance & OKR Review (Q3 2026: Jul - Sep)",
      reviewDate: "2026-09-30",
      competencies: [
        { area: "Full-Stack Feature Delivery & Integration", grade: "A", pending: "Successfully connected frontend UI with backend WebSocket notification server" },
        { area: "Quarterly OKR & Milestone Delivery", grade: "A", pending: "Delivered 100% of assigned sprint tasks on time across 12 sprint cycles" },
        { area: "Code Quality & Architectural Hygiene", grade: "B+", pending: "Maintained average code review turnaround of under 4 hours" },
        { area: "Cross-Team Collaboration", grade: "A", pending: "Worked closely with both frontend and backend engineers to resolve sync bottlenecks" },
        { area: "Continuous Learning & Upskilling", grade: "A", pending: "Completed hands-on training in GraphQL Federation and WebSockets" }
      ],
      comments: [
        "Chen has shown versatile engineering capability across both client and server layers in Q3.",
        "His work on real-time task notifications substantially improved collaborative UX.",
        "Demonstrates a positive attitude and strong appetite for expanding technical knowledge.",
        "Target for Q4: Suggested for Advanced Microservices Architecture workshop."
      ],
      attendanceRecord: "97.5% (62 days logged / 1 late arrival recorded)",
      protocolUsage: "Fully compliant with code review, deployment, and security standards",
      violations: "None",
      overallRating: "GRADE: A (STRONG QUARTERLY PERFORMANCE)"
    },
    annual: {
      periodTitle: "Annual Performance Appraisal & Career Review (Fiscal Year 2026)",
      reviewDate: "2026-12-31",
      competencies: [
        { area: "Year-Long Full-Stack Delivery & Feature Velocity", grade: "A", pending: "Delivered 32 user-facing features and 18 backend service integrations in 2026" },
        { area: "System Reliability & Bug Resolution Speed", grade: "A", pending: "Resolved 95% of assigned bugs within 24 hours of triage" },
        { area: "Team Collaboration & Standup Engagement", grade: "A+", pending: "Consistently recognized as highly supportive and dependable teammate" },
        { area: "Engineering Standards & Test Automation", grade: "B+", pending: "Maintained 87% average test coverage across personal repository contributions" },
        { area: "Professional Growth & Technical Range", grade: "A", pending: "Expanded domain expertise to include React, Node, PostgreSQL, and GraphQL" }
      ],
      comments: [
        "Chen has been a highly reliable and productive full-stack developer throughout 2026.",
        "He bridges the gap between frontend interfaces and backend APIs with great skill and speed.",
        "Maintains consistent sprint output and works well under tight release timelines.",
        "Appraisal Outcome: Retained as Core Full-Stack Engineer with standard annual merit increase."
      ],
      attendanceRecord: "97.8% (244 days logged / 2,010 annual hours logged)",
      protocolUsage: "100% compliant with organizational security policies and code quality gates",
      violations: "None",
      overallRating: "GRADE: A (CONSISTENT & DEPENDABLE ANNUAL DELIVERY)"
    }
  }
};

// =========================================================
// DISTINCT MANAGER REPORT DATA BY PERIOD (MONTHLY, QUARTERLY, ANNUAL)
// =========================================================

const MANAGER_REPORTS = {
  // --- 9. Ravi Kapoor (Engineering Manager) ---
  9: {
    managerIdCode: "MGR-0901",
    name: "Ravi Kapoor",
    department: "Engineering",
    position: "Engineering Lead & Manager",
    teamSize: "4 Engineers",
    supervisor: "Alex Johnson (Executive Admin)",
    location: "Technical Center & Executive Ops",
    monthly: {
      periodTitle: "Manager Monthly Leadership Review (August 2026)",
      reviewDate: "2026-08-31",
      competencies: [
        { area: "Sprint Velocity & Blocker Resolution", grade: "A+", pending: "Resolved 5 inter-team blockers within 2 hours of report in August" },
        { area: "Team Workload Balancing & Telemetry Oversight", grade: "A", pending: "Adjusted Marcus Lee workload to prevent burnout risk" },
        { area: "Technical Guidance & Code Review Governance", grade: "A+", pending: "100% PR review compliance achieved across all 4 managed engineers" },
        { area: "Monthly 1-on-1s & Mentorship", grade: "A", pending: "Conducted 4 weekly 1-on-1 coaching syncs with engineering staff" },
        { area: "Cross-Department Delivery (Design & Data)", grade: "A", pending: "Aligned sprint deliverables with Design and Data timelines" }
      ],
      comments: [
        "Successfully guided Engineering team to complete 92% of scheduled August sprint story points.",
        "Effectively reallocated task assignments to ensure on-time delivery of database migrations.",
        "Maintained high team morale and active telemetry engagement throughout the month.",
        "Immediate Target for September: Oversee initial deployment of real-time telemetry dashboards."
      ],
      attendanceRecord: "100% (22 days logged / 100% standup attendance)",
      protocolUsage: "100% compliant with technical governance and security standards",
      violations: "None",
      overallRating: "GRADE: A+ (TOP MONTHLY LEADERSHIP EXECUTION)"
    },
    quarterly: {
      periodTitle: "Manager Quarterly Leadership & OKR Review (Q3 2026: Jul - Sep)",
      reviewDate: "2026-09-30",
      competencies: [
        { area: "Department OKR & Sprint Roadmap Execution", grade: "A+", pending: "Delivered 12 consecutive sprint cycles with 94% on-time milestone completion" },
        { area: "Resource Allocation & Engineering Productivity", grade: "A", pending: "Maintained 94% department-wide productivity index with zero unmanaged overtime" },
        { area: "Technical Architecture & System Directives", grade: "A+", pending: "Oversaw zero-downtime database schema migration and auth security overhaul" },
        { area: "Budget & Cloud Infrastructure Governance", grade: "A", pending: "Kept cloud infrastructure spending within 96% of Q3 quarterly budget" },
        { area: "Cross-Functional Alignment (Executive Sync)", grade: "A", pending: "Delivered clear, metric-driven engineering updates to Executive Administration" }
      ],
      comments: [
        "Exemplary quarterly leadership in steering complex multi-tier software projects.",
        "Fostered an environment of technical rigor, psychological safety, and continuous learning.",
        "Zero regrettable staff turnover across the entire engineering department in Q3.",
        "Recommended for Senior Director track evaluation in upcoming annual appraisal."
      ],
      attendanceRecord: "99.5% (64 days logged / 100% executive sync attendance)",
      protocolUsage: "100% compliant with organizational security, cloud, and deployment governance",
      violations: "None",
      overallRating: "GRADE: A+ (OUTSTANDING QUARTERLY LEADERSHIP)"
    },
    annual: {
      periodTitle: "Manager Annual Executive Leadership Appraisal (Fiscal Year 2026)",
      reviewDate: "2026-12-31",
      competencies: [
        { area: "Annual Engineering Strategy & Vision Execution", grade: "A+", pending: "Successfully led the company-wide transition to real-time micro-architecture" },
        { area: "Talent Retention, Growth & Team Building", grade: "A+", pending: "Achieved 100% team retention rate and promoted 2 senior engineers in 2026" },
        { area: "System Stability, Scalability & SLA Delivery", grade: "A+", pending: "Maintained 99.95% overall application availability across the fiscal year" },
        { area: "Budget Governance & Resource ROI", grade: "A", pending: "Delivered all annual engineering roadmap goals 4% under total allocated budget" },
        { area: "Executive Collaboration & Corporate Culture", grade: "A+", pending: "Championed transparent telemetry practices adopted as corporate standard" }
      ],
      comments: [
        "Ravi has demonstrated outstanding leadership, strategic foresight, and managerial maturity in 2026.",
        "His leadership built an engineering culture that consistently delivers high-quality software on time.",
        "Maintains exceptional trust and respect from both direct reports and executive board members.",
        "Executive Committee Recommendation: Promoted to Director of Engineering with stock option appraisal."
      ],
      attendanceRecord: "99.8% (250 days logged / 100% executive committee attendance)",
      protocolUsage: "100% compliant across all enterprise governance, legal, and security audits",
      violations: "None",
      overallRating: "GRADE: A+ (EXEMPLARY ANNUAL LEADERSHIP — PROMOTION RECOMMENDED)"
    }
  },

  // --- 10. Nina Torres (Design Manager) ---
  10: {
    managerIdCode: "MGR-1002",
    name: "Nina Torres",
    department: "Design",
    position: "Design Lead & Manager",
    teamSize: "1 Designer (Expanding)",
    supervisor: "Alex Johnson (Executive Admin)",
    location: "Design Studio & Headquarters",
    monthly: {
      periodTitle: "Manager Monthly Leadership Review (August 2026)",
      reviewDate: "2026-08-31",
      competencies: [
        { area: "Design Sprint Delivery & Asset Direction", grade: "A+", pending: "Directed the UI redesign of authentication and telemetry dashboards" },
        { area: "Design-to-Engineering Handoff Efficiency", grade: "A+", pending: "Achieved zero specification ambiguities with frontend development team" },
        { area: "Design System Standards & Tokens", grade: "A", pending: "Enforced sage green palette tokens and Times New Roman typography rules" },
        { area: "Team Mentorship & Review Cadence", grade: "A", pending: "Conducted weekly design critiques and usability reviews with Sara Patel" },
        { area: "Licensing & Asset Governance", grade: "A", pending: "100% compliance with Figma enterprise plugin licensing policies" }
      ],
      comments: [
        "Delivered immaculate design direction for August product release cycles.",
        "Streamlined handoff workflows, reducing frontend integration questions by 40%.",
        "Championed user-first design methodologies across all new dashboard modules.",
        "Immediate Target: Finalize dark mode contrast validation for Q4 product roadmap."
      ],
      attendanceRecord: "100% (22 days logged / 0 late arrivals in August)",
      protocolUsage: "100% compliant with brand guidelines and intellectual property policies",
      violations: "None",
      overallRating: "GRADE: A+ (TOP DESIGN LEADERSHIP)"
    },
    quarterly: {
      periodTitle: "Manager Quarterly Leadership & OKR Review (Q3 2026: Jul - Sep)",
      reviewDate: "2026-09-30",
      competencies: [
        { area: "Design System 2.0 Strategy & Rollout", grade: "A+", pending: "Established unified design language adopted across all company web applications" },
        { area: "Quarterly OKR & Milestone Delivery", grade: "A", pending: "Completed 100% of Q3 UI/UX design deliverables ahead of sprint schedules" },
        { area: "Accessibility Compliance (WCAG 2.1 AA)", grade: "A+", pending: "Achieved 100% accessibility compliance audit across all core user flows" },
        { area: "Cross-Department Collaboration (Engineering & Executive)", grade: "A+", pending: "Seamlessly aligned design iterations with engineering capabilities" },
        { area: "Design Research & User Feedback Integration", grade: "A", pending: "Conducted 12 user testing sessions to guide interface refinement" }
      ],
      comments: [
        "Nina has established an industry-standard design practice within the company.",
        "Her systems-thinking approach significantly accelerated development velocity in Q3.",
        "Demonstrated strong creative vision combined with pragmatic business awareness.",
        "Target for Q4: Plan hiring and onboarding framework for expanding design department."
      ],
      attendanceRecord: "99.0% (64 days logged / 0 unexcused absences)",
      protocolUsage: "Fully compliant with enterprise brand and asset security governance",
      violations: "None",
      overallRating: "GRADE: A+ (OUTSTANDING QUARTERLY DIRECTION)"
    },
    annual: {
      periodTitle: "Manager Annual Executive Leadership Appraisal (Fiscal Year 2026)",
      reviewDate: "2026-12-31",
      competencies: [
        { area: "Annual Visual & UX Architecture Transformation", grade: "A+", pending: "Transformed product experience resulting in a 35% boost in user satisfaction" },
        { area: "Design Department Scalability & Team Leadership", grade: "A+", pending: "Successfully built and maintained high-performance design workflows in 2026" },
        { area: "Brand Identity, Typography & System Standards", grade: "A+", pending: "Authored corporate Design System bible adopted across the entire organization" },
        { area: "Resource Governance & Budget Management", grade: "A", pending: "Managed design software tool budget with zero cost overruns in 2026" },
        { area: "Executive Presence & Strategic Product Contribution", grade: "A+", pending: "Key contributor to executive product roadmaps and strategic feature definition" }
      ],
      comments: [
        "Nina's leadership has fundamentally elevated the brand perception and product usability of the system in 2026.",
        "She consistently bridges the gap between executive vision and intuitive user interactions.",
        "Highly admired leader with impeccable creative standards and collaborative spirit.",
        "Executive Committee Recommendation: Promoted to Head of Product Design with equity appraisal."
      ],
      attendanceRecord: "99.4% (248 days logged / 100% executive sync attendance)",
      protocolUsage: "100% compliant across all design governance, copyright, and security audits",
      violations: "None",
      overallRating: "GRADE: A+ (EXEMPLARY ANNUAL LEADERSHIP — ADVANCEMENT RECOMMENDED)"
    }
  },

  // --- 11. Sam Osei (Data Manager) ---
  11: {
    managerIdCode: "MGR-1103",
    name: "Sam Osei",
    department: "Data",
    position: "Head of Data & Analytics",
    teamSize: "1 Analyst (Expanding)",
    supervisor: "Alex Johnson (Executive Admin)",
    location: "Data Center & Executive Ops",
    monthly: {
      periodTitle: "Manager Monthly Leadership Review (August 2026)",
      reviewDate: "2026-08-31",
      competencies: [
        { area: "Data Pipeline Uptime & Monitoring", grade: "A+", pending: "100% data pipeline availability maintained throughout August" },
        { area: "Workforce Telemetry Model Direction", grade: "A+", pending: "Directed development of live telemetry and burnout detection algorithms" },
        { area: "Data Security & GDPR Governance", grade: "A+", pending: "Zero data leakage incidents; full PII masking enforced" },
        { area: "Analyst Mentorship & Coaching", grade: "A", pending: "Guided Aisha Okonkwo on predictive time-series modeling" },
        { area: "Executive Reporting Delivery", grade: "A", pending: "Delivered weekly workforce productivity telemetry reports to Admin" }
      ],
      comments: [
        "Maintained flawless uptime and data integrity across all analytical databases in August.",
        "Delivered actionable workforce productivity insights directly utilized by department leads.",
        "Strong mentorship and quality assurance on all analyst pipeline scripts.",
        "Immediate Target: Integrate automated alert thresholds for employee workload spikes in September."
      ],
      attendanceRecord: "100% (22 days logged / 0 missed syncs in August)",
      protocolUsage: "100% compliant with enterprise data protection policies",
      violations: "None",
      overallRating: "GRADE: A+ (EXCELLENT MONTHLY DATA LEADERSHIP)"
    },
    quarterly: {
      periodTitle: "Manager Quarterly Leadership & OKR Review (Q3 2026: Jul - Sep)",
      reviewDate: "2026-09-30",
      competencies: [
        { area: "Enterprise Telemetry Infrastructure Architecture", grade: "A+", pending: "Architected centralized data pipeline processing 50,000+ daily telemetry events" },
        { area: "Quarterly OKR & Milestone Delivery", grade: "A", pending: "Delivered 100% of Q3 data analytics roadmap objectives on schedule" },
        { area: "Predictive Telemetry Precision & Value", grade: "A+", pending: "Burnout prediction model achieved 92% validation accuracy" },
        { area: "Data Compliance & Privacy Governance", grade: "A+", pending: "Passed quarterly GDPR and employee data privacy audit with 100% score" },
        { area: "Executive Decision Support & Forecasting", grade: "A", pending: "Provided data-driven headcount models used in 2027 resource budgeting" }
      ],
      comments: [
        "Sam has engineered an exceptionally robust and reliable data foundation for the business in Q3.",
        "His workforce telemetry analytics provide invaluable real-time visibility for organizational leadership.",
        "Maintains zero pipeline downtime and rigorous standards for analytical accuracy.",
        "Target for Q4: Plan data infrastructure expansion for high-scale machine learning workloads."
      ],
      attendanceRecord: "99.2% (64 days logged / 0 unexcused absences)",
      protocolUsage: "100% compliant with enterprise data governance and cybersecurity policies",
      violations: "None",
      overallRating: "GRADE: A+ (OUTSTANDING QUARTERLY IMPACT)"
    },
    annual: {
      periodTitle: "Manager Annual Executive Leadership Appraisal (Fiscal Year 2026)",
      reviewDate: "2026-12-31",
      competencies: [
        { area: "Annual Data Strategy & Enterprise Telemetry Transformation", grade: "A+", pending: "Built the company-wide data analytics ecosystem from the ground up in 2026" },
        { area: "Business Impact & Data-Driven Cost Reductions", grade: "A+", pending: "Workforce optimization models yielded a 22% improvement in overall project delivery times" },
        { area: "Enterprise Data Governance & Zero Non-Compliance Record", grade: "A+", pending: "Zero data breaches and 100% compliance across all statutory data audits" },
        { area: "Infrastructure Reliability & Pipeline Scalability", grade: "A+", pending: "Achieved 99.98% analytics platform uptime across the entire fiscal year" },
        { area: "Executive Advisory & Department Expansion Strategy", grade: "A", pending: "Successfully planned and budgeted the 2027 data team infrastructure expansion" }
      ],
      comments: [
        "Sam is a visionary data leader whose work has revolutionized operational transparency across the company in 2026.",
        "His analytical infrastructure directly empowered executive leadership to make strategic resource decisions.",
        "Exemplifies technical mastery, ethical data stewardship, and executive professionalism.",
        "Executive Committee Recommendation: Promoted to Vice President of Data & Analytics with merit bonus."
      ],
      attendanceRecord: "99.6% (250 days logged / 100% executive sync attendance)",
      protocolUsage: "100% compliant across all enterprise data security, legal, and privacy frameworks",
      violations: "None",
      overallRating: "GRADE: A+ (EXEMPLARY ANNUAL LEADERSHIP — PROMOTION RECOMMENDED)"
    }
  }
};

export default function ProgressReport() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const isEmployee = user?.role === "employee";

  // Managers in the organization (for Admin)
  const managerUsers = USERS.filter(u => u.role === "manager");

  // Employees list (Admin gets all, Manager gets their department team only, Employee gets self)
  const employeeList = isManager 
    ? getManagerEmployees(user?.id) 
    : isEmployee 
      ? EMPLOYEES.filter(e => e.user_id === user?.id)
      : EMPLOYEES;

  const [personnelType, setPersonnelType] = useState("employee");
  const [selectedEmpId, setSelectedEmpId] = useState(employeeList[0]?.id || 1);
  const [selectedMgrId, setSelectedMgrId] = useState(managerUsers[0]?.id || 9);
  const [periodType, setPeriodType] = useState("monthly"); // "monthly" | "quarterly" | "annual"

  // Selected Employee & Data
  const selectedEmp = employeeList.find(e => e.id === Number(selectedEmpId)) || employeeList[0] || EMPLOYEES[0];
  const empUser = getEmployeeUser(selectedEmp);
  const empBase = EMPLOYEE_REPORTS[selectedEmp?.id] || EMPLOYEE_REPORTS[1];
  const empPeriodData = empBase[periodType] || empBase.monthly;

  // Selected Manager & Data
  const selectedMgr = managerUsers.find(m => m.id === Number(selectedMgrId)) || managerUsers[0];
  const mgrBase = MANAGER_REPORTS[selectedMgr?.id] || MANAGER_REPORTS[9];
  const mgrPeriodData = mgrBase[periodType] || mgrBase.monthly;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Controls Bar */}
      <div className="no-print" style={{ border: "1px solid var(--border)", padding: "12px 16px", marginBottom: 16, backgroundColor: "#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {isAdmin && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <label style={{ fontWeight: "bold", fontSize: 13 }}>Report Type:</label>
              <select
                className="form-control"
                value={personnelType}
                onChange={(e) => setPersonnelType(e.target.value)}
                style={{ minWidth: 160 }}
              >
                <option value="employee">Employee Progress Report</option>
                <option value="manager">Manager Leadership Report</option>
              </select>
            </div>
          )}

          {isManager && (
            <div style={{ fontSize: 13, color: "var(--footer)" }}>
              Scope: <strong>Department Employee Reports Only</strong>
            </div>
          )}

          {personnelType === "employee" && !isEmployee && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <label style={{ fontWeight: "bold", fontSize: 13 }}>Select Employee:</label>
              <select
                className="form-control"
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(Number(e.target.value))}
                style={{ minWidth: 200 }}
              >
                {employeeList.map(e => {
                  const u = getEmployeeUser(e);
                  return <option key={e.id} value={e.id}>{u?.name} ({e.department} - {e.position})</option>;
                })}
              </select>
            </div>
          )}

          {personnelType === "manager" && isAdmin && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <label style={{ fontWeight: "bold", fontSize: 13 }}>Select Manager:</label>
              <select
                className="form-control"
                value={selectedMgrId}
                onChange={(e) => setSelectedMgrId(Number(e.target.value))}
                style={{ minWidth: 200 }}
              >
                {managerUsers.map(m => (
                  <option key={m.id} value={m.id}>{m.name} (Manager - {m.email})</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <label style={{ fontWeight: "bold", fontSize: 13 }}>Appraisal Period:</label>
            <select
              className="form-control"
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value)}
              style={{ minWidth: 190 }}
            >
              <option value="monthly">Monthly (August 2026)</option>
              <option value="quarterly">Quarterly (Q3 2026)</option>
              <option value="annual">Annual Review (2026)</option>
            </select>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handlePrint}>
          Print / Save as PDF (A4)
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 1. EMPLOYEE PROGRESS REPORT DOCUMENT (A4 SAGE GREEN) */}
      {/* ───────────────────────────────────────────────────────── */}
      {personnelType === "employee" && (
        <div 
          className="employee-report-sheet"
          style={{
            maxWidth: 820,
            margin: "0 auto",
            padding: "24px 30px",
            border: "2px solid var(--header)",
            backgroundColor: "#ffffff",
            color: "var(--text)"
          }}
        >
          {/* Title Header Banner */}
          <div 
            style={{
              border: "2px solid var(--header)",
              backgroundColor: "var(--body)",
              textAlign: "center",
              padding: "10px 14px",
              fontWeight: "bold",
              fontSize: 18,
              textTransform: "uppercase",
              marginBottom: 14,
              color: "var(--text)"
            }}
          >
            Employee Performance &amp; Progress Report
          </div>

          {/* Subtitle / Period */}
          <div style={{ textAlign: "center", fontSize: 13, fontWeight: "bold", marginBottom: 14, color: "var(--footer)" }}>
            Period: {empPeriodData.periodTitle}
          </div>

          {/* Details Table */}
          <table className="wt-table" style={{ marginBottom: 12 }}>
            <tbody>
              <tr>
                <td style={{ width: "20%", fontWeight: "bold", backgroundColor: "var(--body)" }}>Employee Name:</td>
                <td style={{ width: "30%" }}>{empUser?.name}</td>
                <td style={{ width: "20%", fontWeight: "bold", backgroundColor: "var(--body)" }}>Employee ID:</td>
                <td style={{ width: "30%" }}>{empBase.empIdCode}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", backgroundColor: "var(--body)" }}>Department:</td>
                <td>{selectedEmp?.department}</td>
                <td style={{ fontWeight: "bold", backgroundColor: "var(--body)" }}>Designation:</td>
                <td>{selectedEmp?.position}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", backgroundColor: "var(--body)" }}>Shift Schedule:</td>
                <td>{empBase.shift}</td>
                <td style={{ fontWeight: "bold", backgroundColor: "var(--body)" }}>Supervisor:</td>
                <td>{empBase.supervisor}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", backgroundColor: "var(--body)" }}>Date of Review:</td>
                <td>{empPeriodData.reviewDate}</td>
                <td style={{ fontWeight: "bold", backgroundColor: "var(--body)" }}>Location:</td>
                <td>{empBase.location}</td>
              </tr>
            </tbody>
          </table>

          {/* Legend */}
          <div style={{ fontSize: 11, fontStyle: "italic", marginBottom: 6, color: "var(--footer)" }}>
            (Grading Standard: A+ = Outstanding, A = Excellent, B+ = Good, B = Average, C = Needs Improvement)
          </div>

          {/* Competencies Table */}
          <table className="wt-table" style={{ marginBottom: 14 }}>
            <thead>
              <tr>
                <th style={{ width: "35%", backgroundColor: "var(--body)", color: "var(--text)" }}>Competency Area</th>
                <th style={{ width: "15%", textAlign: "center", backgroundColor: "var(--body)", color: "var(--text)" }}>Grade</th>
                <th style={{ width: "50%", backgroundColor: "var(--body)", color: "var(--text)" }}>Specific Deliverables &amp; Observations</th>
              </tr>
            </thead>
            <tbody>
              {empPeriodData.competencies.map((comp, idx) => (
                <tr key={idx}>
                  <td><strong>{comp.area}</strong></td>
                  <td style={{ textAlign: "center", fontWeight: "bold", color: "var(--header)" }}>{comp.grade}</td>
                  <td>{comp.pending}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Comments and Rating */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginBottom: 14 }}>
            <div style={{ border: "1px solid var(--border)", padding: "12px", backgroundColor: "#ffffff" }}>
              <div style={{ fontWeight: "bold", borderBottom: "1px solid var(--border)", paddingBottom: 4, marginBottom: 6, color: "var(--footer)" }}>
                {periodType === "monthly" ? "Monthly Sprint Observations" : periodType === "quarterly" ? "Quarterly OKR & Technical Observations" : "Annual Performance & Career Appraisal"}
              </div>
              <ul style={{ paddingLeft: 18, fontSize: 13, lineHeight: 1.5, marginBottom: 10 }}>
                {empPeriodData.comments.map((cmt, idx) => (
                  <li key={idx}>{cmt}</li>
                ))}
              </ul>

              <div style={{ fontWeight: "bold", borderBottom: "1px solid var(--border)", paddingBottom: 4, marginBottom: 6, color: "var(--footer)" }}>
                Compliance &amp; Attendance Record
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                <div>- Attendance / Hours: <strong>{empPeriodData.attendanceRecord}</strong></div>
                <div>- Protocol Compliance: <strong>{empPeriodData.protocolUsage}</strong></div>
                <div>- Violations / Infractions: <strong>{empPeriodData.violations}</strong></div>
              </div>
            </div>

            <div style={{ border: "2px solid var(--header)", backgroundColor: "var(--body)", padding: "14px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 12, fontWeight: "bold", textTransform: "uppercase", marginBottom: 6, color: "var(--footer)" }}>
                Overall {periodType === "monthly" ? "Sprint" : periodType === "quarterly" ? "Quarterly" : "Annual"} Rating
              </div>
              <div style={{ fontSize: 17, fontWeight: "bold", padding: "10px 6px", border: "2px solid var(--header)", backgroundColor: "#ffffff", color: "var(--footer)" }}>
                {empPeriodData.overallRating}
              </div>
            </div>
          </div>

          {/* Confidentiality Statement */}
          <div style={{ fontSize: 11, fontStyle: "italic", borderBottom: "1px solid var(--border)", paddingBottom: 6, marginBottom: 14, color: "var(--footer)" }}>
            Confidentiality Statement: &quot;This appraisal document is confidential and intended solely for enterprise performance evaluation.&quot;
          </div>

          {/* Signatures */}
          <div>
            <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 10, color: "var(--text)" }}>Signatures &amp; Approvals</div>
            <table className="wt-table" style={{ border: "none" }}>
              <tbody>
                <tr>
                  <td style={{ border: "none", width: "33%" }}>
                    <div>Employee Signature:</div>
                    <div style={{ marginTop: 24, borderBottom: "1px solid var(--header)", width: "90%" }}></div>
                  </td>
                  <td style={{ border: "none", width: "33%" }}>
                    <div>Supervisor Signature:</div>
                    <div style={{ marginTop: 24, borderBottom: "1px solid var(--header)", width: "90%" }}></div>
                  </td>
                  <td style={{ border: "none", width: "33%" }}>
                    <div>Department / HR Director:</div>
                    <div style={{ marginTop: 24, borderBottom: "1px solid var(--header)", width: "90%" }}></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 2. MANAGER LEADERSHIP PROGRESS REPORT (ADMIN ONLY) */}
      {/* ───────────────────────────────────────────────────────── */}
      {personnelType === "manager" && isAdmin && (
        <div 
          className="manager-report-sheet"
          style={{
            maxWidth: 820,
            margin: "0 auto",
            padding: "24px 30px",
            border: "2px solid var(--header)",
            backgroundColor: "#ffffff",
            color: "var(--text)"
          }}
        >
          {/* Title Header Banner */}
          <div 
            style={{
              border: "2px solid var(--header)",
              backgroundColor: "var(--body)",
              textAlign: "center",
              padding: "10px 14px",
              fontWeight: "bold",
              fontSize: 18,
              textTransform: "uppercase",
              marginBottom: 14,
              color: "var(--text)"
            }}
          >
            Manager Leadership &amp; Performance Appraisal Report
          </div>

          {/* Subtitle */}
          <div style={{ textAlign: "center", fontSize: 13, fontWeight: "bold", marginBottom: 14, color: "var(--footer)" }}>
            Period: {mgrPeriodData.periodTitle} | Evaluated by Executive Administration
          </div>

          {/* Details Table */}
          <table className="wt-table" style={{ marginBottom: 12 }}>
            <tbody>
              <tr>
                <td style={{ width: "20%", fontWeight: "bold", backgroundColor: "var(--body)" }}>Manager Name:</td>
                <td style={{ width: "30%" }}>{mgrBase.name}</td>
                <td style={{ width: "20%", fontWeight: "bold", backgroundColor: "var(--body)" }}>Manager ID:</td>
                <td style={{ width: "30%" }}>{mgrBase.managerIdCode}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", backgroundColor: "var(--body)" }}>Department:</td>
                <td>{mgrBase.department}</td>
                <td style={{ fontWeight: "bold", backgroundColor: "var(--body)" }}>Role:</td>
                <td>{mgrBase.position}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", backgroundColor: "var(--body)" }}>Supervising Team:</td>
                <td>{mgrBase.teamSize}</td>
                <td style={{ fontWeight: "bold", backgroundColor: "var(--body)" }}>Executive Supervisor:</td>
                <td>{mgrBase.supervisor}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", backgroundColor: "var(--body)" }}>Date of Review:</td>
                <td>{mgrPeriodData.reviewDate}</td>
                <td style={{ fontWeight: "bold", backgroundColor: "var(--body)" }}>Operational Center:</td>
                <td>{mgrBase.location}</td>
              </tr>
            </tbody>
          </table>

          {/* Legend */}
          <div style={{ fontSize: 11, fontStyle: "italic", marginBottom: 6, color: "var(--footer)" }}>
            (Leadership Grading Standard: A+ = Outstanding, A = Excellent, B+ = Very Good, B = Satisfactory, C = Needs Alignment)
          </div>

          {/* Competencies Table */}
          <table className="wt-table" style={{ marginBottom: 14 }}>
            <thead>
              <tr>
                <th style={{ width: "38%", backgroundColor: "var(--body)", color: "var(--text)" }}>Leadership &amp; Management Competency</th>
                <th style={{ width: "15%", textAlign: "center", backgroundColor: "var(--body)", color: "var(--text)" }}>Grade</th>
                <th style={{ width: "47%", backgroundColor: "var(--body)", color: "var(--text)" }}>Strategic Directives &amp; Action Items</th>
              </tr>
            </thead>
            <tbody>
              {mgrPeriodData.competencies.map((comp, idx) => (
                <tr key={idx}>
                  <td><strong>{comp.area}</strong></td>
                  <td style={{ textAlign: "center", fontWeight: "bold", color: "var(--header)" }}>{comp.grade}</td>
                  <td>{comp.pending}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Comments and Rating */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginBottom: 14 }}>
            <div style={{ border: "1px solid var(--border)", padding: "12px", backgroundColor: "#ffffff" }}>
              <div style={{ fontWeight: "bold", borderBottom: "1px solid var(--border)", paddingBottom: 4, marginBottom: 6, color: "var(--footer)" }}>
                {periodType === "monthly" ? "Monthly Department Operations Observations" : periodType === "quarterly" ? "Quarterly Leadership & Strategy Observations" : "Annual Executive Leadership Appraisal & Review"}
              </div>
              <ul style={{ paddingLeft: 18, fontSize: 13, lineHeight: 1.5, marginBottom: 10 }}>
                {mgrPeriodData.comments.map((cmt, idx) => (
                  <li key={idx}>{cmt}</li>
                ))}
              </ul>

              <div style={{ fontWeight: "bold", borderBottom: "1px solid var(--border)", paddingBottom: 4, marginBottom: 6, color: "var(--footer)" }}>
                Department Governance &amp; Compliance
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                <div>- Meeting &amp; Standup Record: <strong>{mgrPeriodData.attendanceRecord}</strong></div>
                <div>- Governance Compliance: <strong>{mgrPeriodData.protocolUsage}</strong></div>
                <div>- Operational Discrepancies: <strong>{mgrPeriodData.violations}</strong></div>
              </div>
            </div>

            <div style={{ border: "2px solid var(--header)", backgroundColor: "var(--body)", padding: "14px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 12, fontWeight: "bold", textTransform: "uppercase", marginBottom: 6, color: "var(--footer)" }}>
                Executive Leadership Rating ({periodType === "monthly" ? "Monthly" : periodType === "quarterly" ? "Quarterly" : "Annual"})
              </div>
              <div style={{ fontSize: 17, fontWeight: "bold", padding: "10px 6px", border: "2px solid var(--header)", backgroundColor: "#ffffff", color: "var(--footer)" }}>
                {mgrPeriodData.overallRating}
              </div>
            </div>
          </div>

          {/* Confidentiality Statement */}
          <div style={{ fontSize: 11, fontStyle: "italic", borderBottom: "1px solid var(--border)", paddingBottom: 6, marginBottom: 14, color: "var(--footer)" }}>
            Confidentiality Statement: &quot;This leadership appraisal is confidential and intended solely for executive performance reviews.&quot;
          </div>

          {/* Signatures */}
          <div>
            <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 10, color: "var(--text)" }}>Signatures &amp; Executive Approval</div>
            <table className="wt-table" style={{ border: "none" }}>
              <tbody>
                <tr>
                  <td style={{ border: "none", width: "33%" }}>
                    <div>Department Manager Signature:</div>
                    <div style={{ marginTop: 24, borderBottom: "1px solid var(--header)", width: "90%" }}></div>
                  </td>
                  <td style={{ border: "none", width: "33%" }}>
                    <div>Lead Executive Administrator:</div>
                    <div style={{ marginTop: 24, borderBottom: "1px solid var(--header)", width: "90%" }}></div>
                  </td>
                  <td style={{ border: "none", width: "33%" }}>
                    <div>HR Board Director:</div>
                    <div style={{ marginTop: 24, borderBottom: "1px solid var(--header)", width: "90%" }}></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
