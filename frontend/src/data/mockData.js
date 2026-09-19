// ====================================================
// MOCK DATA — Real-Time Work Allocation System v2
// Entities: USER, EMPLOYEE, SKILL, TASK,
// TASK_ASSIGNMENT, AVAILABILITY, NOTIFICATION,
// FEEDBACK, ACTIVITY_LOG, DEPARTMENT_MANAGERS
// ====================================================

export const SKILLS = [
  { id: 1,  name: "React",        description: "Frontend library for building UIs" },
  { id: 2,  name: "Node.js",      description: "Server-side JavaScript runtime" },
  { id: 3,  name: "PostgreSQL",   description: "Relational database management" },
  { id: 4,  name: "TypeScript",   description: "Typed superset of JavaScript" },
  { id: 5,  name: "Python",       description: "General-purpose scripting language" },
  { id: 6,  name: "Docker",       description: "Containerization & deployment" },
  { id: 7,  name: "UI/UX Design", description: "User interface and experience design" },
  { id: 8,  name: "GraphQL",      description: "Query language for APIs" },
  { id: 9,  name: "AWS",          description: "Amazon Web Services cloud platform" },
  { id: 10, name: "Figma",        description: "Collaborative design tool" },
];

// Roles: admin | manager | employee
export const USERS = [
  { id: 1,  name: "Alex Johnson",    email: "alex@workflow.io",    password: "Password@123", role: "admin",    is_active: true,  created_at: "2025-01-10", temp_password: null,       created_by: null },
  { id: 2,  name: "Priya Sharma",    email: "priya@workflow.io",   password: "Password@123", role: "employee", is_active: true,  created_at: "2025-01-12", temp_password: "Tmp@1234", created_by: 1 },
  { id: 3,  name: "Marcus Lee",      email: "marcus@workflow.io",  password: "Password@123", role: "employee", is_active: true,  created_at: "2025-01-14", temp_password: "Tmp@5678", created_by: 1 },
  { id: 4,  name: "Sara Patel",      email: "sara@workflow.io",    password: "Password@123", role: "employee", is_active: true,  created_at: "2025-01-15", temp_password: "Tmp@9012", created_by: 1 },
  { id: 5,  name: "James Wilson",    email: "james@workflow.io",   password: "Password@123", role: "employee", is_active: false, created_at: "2025-01-18", temp_password: "Tmp@3456", created_by: 1 },
  { id: 6,  name: "Aisha Okonkwo",  email: "aisha@workflow.io",   password: "Password@123", role: "employee", is_active: true,  created_at: "2025-02-01", temp_password: "Tmp@7890", created_by: 1 },
  { id: 7,  name: "Chen Wei",        email: "chen@workflow.io",    password: "Password@123", role: "employee", is_active: true,  created_at: "2025-02-05", temp_password: "Tmp@2345", created_by: 1 },
  { id: 8,  name: "Laura Müller",    email: "laura@workflow.io",   password: "Password@123", role: "admin",    is_active: true,  created_at: "2025-02-10", temp_password: null,       created_by: null },
  // Managers (created by admin)
  { id: 9,  name: "Ravi Kapoor",     email: "ravi@workflow.io",    password: "Password@123", role: "manager",  is_active: true,  created_at: "2025-03-01", temp_password: "Mgr@1234", created_by: 1 },
  { id: 10, name: "Nina Torres",     email: "nina@workflow.io",    password: "Password@123", role: "manager",  is_active: true,  created_at: "2025-03-05", temp_password: "Mgr@5678", created_by: 1 },
  { id: 11, name: "Sam Osei",        email: "sam@workflow.io",     password: "Password@123", role: "manager",  is_active: true,  created_at: "2025-03-10", temp_password: "Mgr@9012", created_by: 1 },
];

// Maps department → manager user_id
export const DEPARTMENT_MANAGERS = [
  { department: "Engineering", manager_user_id: 9  },
  { department: "Design",      manager_user_id: 10 },
  { department: "Data",        manager_user_id: 11 },
];

export const EMPLOYEES = [
  { id: 1, user_id: 2, department: "Engineering", position: "Senior Frontend Dev", availability_status: "available", workload_percentage: 65, max_workload: 100, remote_status: "active", active_time: "5h 45m", idle_time: "25m", productivity_score: 94, current_activity: "VS Code · User Dashboard API", login_time: "09:00 AM", burnout_risk: "Low" },
  { id: 2, user_id: 3, department: "Engineering", position: "Backend Engineer",    availability_status: "busy",      workload_percentage: 90, max_workload: 100, remote_status: "active", active_time: "7h 10m", idle_time: "15m", productivity_score: 96, current_activity: "PostgreSQL · Query Optimization", login_time: "08:30 AM", burnout_risk: "High" },
  { id: 3, user_id: 4, department: "Design",      position: "UI/UX Designer",     availability_status: "available", workload_percentage: 40, max_workload: 100, remote_status: "in_meeting", active_time: "4h 20m", idle_time: "40m", productivity_score: 88, current_activity: "Google Meet · Sprint Design Review", login_time: "09:15 AM", burnout_risk: "Low" },
  { id: 4, user_id: 5, department: "Engineering", position: "DevOps Engineer",    availability_status: "offline",   workload_percentage: 0,  max_workload: 100, remote_status: "offline", active_time: "0h 00m", idle_time: "0m", productivity_score: 0, current_activity: "Logged Off", login_time: "—", burnout_risk: "None" },
  { id: 5, user_id: 6, department: "Data",        position: "Data Analyst",       availability_status: "available", workload_percentage: 55, max_workload: 100, remote_status: "active", active_time: "5h 15m", idle_time: "30m", productivity_score: 91, current_activity: "Jupyter Notebook · Performance Telemetry", login_time: "09:05 AM", burnout_risk: "Low" },
  { id: 6, user_id: 7, department: "Engineering", position: "Full-Stack Dev",     availability_status: "busy",      workload_percentage: 80, max_workload: 100, remote_status: "idle", active_time: "6h 05m", idle_time: "50m", productivity_score: 84, current_activity: "Idle (Break)", login_time: "08:45 AM", burnout_risk: "Moderate" },
];

export const EMPLOYEE_SKILLS = [
  { employee_id: 1, skill_ids: [1, 4, 7] },
  { employee_id: 2, skill_ids: [2, 3, 4] },
  { employee_id: 3, skill_ids: [7, 10]   },
  { employee_id: 4, skill_ids: [6, 9]    },
  { employee_id: 5, skill_ids: [5, 3]    },
  { employee_id: 6, skill_ids: [1, 2, 4, 8] },
];

// task_type: weekly | monthly | quarterly | yearly
export const TASKS = [
  { id: 1, title: "Redesign login & auth UI",      description: "Update the login and registration flows with the new design system.", priority: "high",     status: "in_progress", task_type: "monthly",    deadline: "2026-08-22", estimated_hours: 12, created_by: 1, created_at: "2026-08-10", required_skill_ids: [1, 7] },
  { id: 2, title: "Implement JWT refresh tokens",  description: "Add refresh token rotation and silent re-auth to the backend API.",  priority: "critical", status: "todo",        task_type: "weekly",     deadline: "2026-08-18", estimated_hours: 8,  created_by: 1, created_at: "2026-08-11", required_skill_ids: [2, 4] },
  { id: 3, title: "Database schema migration",     description: "Run Prisma migrate for new task_required_skill junction table.",     priority: "medium",   status: "done",        task_type: "monthly",    deadline: "2026-08-15", estimated_hours: 4,  created_by: 8, created_at: "2026-08-09", required_skill_ids: [3] },
  { id: 4, title: "WebSocket real-time updates",   description: "Integrate socket.io on the frontend for live task status updates.", priority: "high",     status: "review",      task_type: "monthly",    deadline: "2026-08-25", estimated_hours: 16, created_by: 1, created_at: "2026-08-12", required_skill_ids: [1, 2] },
  { id: 5, title: "Dockerize backend services",    description: "Create multi-stage Dockerfile and compose file for production.",    priority: "medium",   status: "in_progress", task_type: "quarterly",  deadline: "2026-08-28", estimated_hours: 6,  created_by: 8, created_at: "2026-08-13", required_skill_ids: [6, 9] },
  { id: 6, title: "Analytics dashboard charts",    description: "Build CSS-only bar charts for workload and task completion.",       priority: "low",      status: "todo",        task_type: "weekly",     deadline: "2026-09-05", estimated_hours: 10, created_by: 1, created_at: "2026-08-14", required_skill_ids: [1, 4] },
  { id: 7, title: "Employee skill gap report",     description: "Python script to identify departments with insufficient skills.",   priority: "medium",   status: "todo",        task_type: "quarterly",  deadline: "2026-09-01", estimated_hours: 8,  created_by: 8, created_at: "2026-08-15", required_skill_ids: [5, 3] },
  { id: 8, title: "GraphQL API for projects",      description: "Expose project module via GraphQL alongside existing REST routes.", priority: "low",      status: "todo",        task_type: "yearly",     deadline: "2026-09-10", estimated_hours: 14, created_by: 1, created_at: "2026-08-16", required_skill_ids: [8, 2] },
  { id: 9, title: "Q3 Infrastructure Audit",       description: "Quarterly review of all cloud infrastructure and costs.",           priority: "high",     status: "done",        task_type: "quarterly",  deadline: "2026-07-31", estimated_hours: 20, created_by: 8, created_at: "2026-07-01", required_skill_ids: [9, 6] },
  { id: 10, title: "Annual Security Review",       description: "Full security audit and penetration testing of all services.",      priority: "critical", status: "in_progress", task_type: "yearly",     deadline: "2026-12-31", estimated_hours: 40, created_by: 1, created_at: "2026-01-01", required_skill_ids: [9, 2] },
];

export const TASK_ASSIGNMENTS = [
  { id: 1, task_id: 1,  employee_id: 1, assigned_at: "2026-08-10", started_at: "2026-08-11", completed_at: null,         assignment_score: null, status: "in_progress" },
  { id: 2, task_id: 2,  employee_id: 2, assigned_at: "2026-08-11", started_at: "2026-08-12", completed_at: null,         assignment_score: null, status: "in_progress" },
  { id: 3, task_id: 3,  employee_id: 2, assigned_at: "2026-08-09", started_at: "2026-08-09", completed_at: "2026-08-15", assignment_score: 94,   status: "completed" },
  { id: 4, task_id: 4,  employee_id: 6, assigned_at: "2026-08-12", started_at: "2026-08-13", completed_at: null,         assignment_score: null, status: "in_progress" },
  { id: 5, task_id: 5,  employee_id: 4, assigned_at: "2026-08-13", started_at: null,         completed_at: null,         assignment_score: null, status: "assigned" },
  { id: 6, task_id: 7,  employee_id: 5, assigned_at: "2026-08-15", started_at: null,         completed_at: null,         assignment_score: null, status: "assigned" },
  { id: 7, task_id: 9,  employee_id: 4, assigned_at: "2026-07-01", started_at: "2026-07-02", completed_at: "2026-07-30", assignment_score: 88,   status: "completed" },
  { id: 8, task_id: 10, employee_id: 2, assigned_at: "2026-01-05", started_at: "2026-01-06", completed_at: null,         assignment_score: null, status: "in_progress" },
  { id: 9, task_id: 6,  employee_id: 1, assigned_at: "2026-08-14", started_at: null,         completed_at: null,         assignment_score: null, status: "assigned" },
];

export const AVAILABILITY = [
  { id: 1,  employee_id: 1, date: "2026-08-18", start_time: "09:00", end_time: "17:00", status: "available" },
  { id: 2,  employee_id: 1, date: "2026-08-19", start_time: "09:00", end_time: "13:00", status: "busy" },
  { id: 3,  employee_id: 1, date: "2026-08-20", start_time: "09:00", end_time: "17:00", status: "available" },
  { id: 4,  employee_id: 1, date: "2026-08-21", start_time: "09:00", end_time: "17:00", status: "available" },
  { id: 5,  employee_id: 1, date: "2026-08-22", start_time: "00:00", end_time: "00:00", status: "off" },
  { id: 6,  employee_id: 1, date: "2026-08-23", start_time: "00:00", end_time: "00:00", status: "off" },
  { id: 7,  employee_id: 1, date: "2026-08-24", start_time: "10:00", end_time: "15:00", status: "available" },
  { id: 8,  employee_id: 2, date: "2026-08-18", start_time: "09:00", end_time: "18:00", status: "busy" },
  { id: 9,  employee_id: 2, date: "2026-08-19", start_time: "09:00", end_time: "18:00", status: "busy" },
  { id: 10, employee_id: 2, date: "2026-08-20", start_time: "09:00", end_time: "17:00", status: "available" },
  { id: 11, employee_id: 3, date: "2026-08-18", start_time: "09:00", end_time: "17:00", status: "available" },
  { id: 12, employee_id: 3, date: "2026-08-19", start_time: "09:00", end_time: "17:00", status: "available" },
];

export const NOTIFICATIONS = [
  { id: 1, employee_id: 1, task_id: 1, message: "You have been assigned to 'Redesign login & auth UI'",        type: "task_assigned",  is_read: false, created_at: "2026-08-10T10:30:00" },
  { id: 2, employee_id: 1, task_id: 1, message: "'Redesign login & auth UI' deadline is in 5 days",            type: "reminder",       is_read: false, created_at: "2026-08-17T09:00:00" },
  { id: 3, employee_id: 1, task_id: 4, message: "Task 'WebSocket real-time updates' has been updated",         type: "task_updated",   is_read: true,  created_at: "2026-08-13T14:22:00" },
  { id: 4, employee_id: 2, task_id: 3, message: "'Database schema migration' marked as completed. Score: 94",  type: "task_completed", is_read: true,  created_at: "2026-08-15T16:00:00" },
  { id: 5, employee_id: 2, task_id: 2, message: "You have been assigned to 'Implement JWT refresh tokens'",    type: "task_assigned",  is_read: false, created_at: "2026-08-11T11:00:00" },
  { id: 6, employee_id: 5, task_id: 7, message: "You have been assigned to 'Employee skill gap report'",       type: "task_assigned",  is_read: false, created_at: "2026-08-15T08:30:00" },
];

// FEEDBACK — from admin/manager to employee
export const FEEDBACK = [
  { id: 1, from_user_id: 9,  to_employee_id: 1, task_id: 1, rating: 4, comment: "Great progress on the UI redesign. Keep up the clean code!", created_at: "2026-08-16T10:00:00" },
  { id: 2, from_user_id: 9,  to_employee_id: 2, task_id: 3, rating: 5, comment: "Exceptional work on the migration. Completed ahead of schedule!", created_at: "2026-08-15T17:00:00" },
  { id: 3, from_user_id: 1,  to_employee_id: 6, task_id: 4, rating: 3, comment: "Good effort on WebSocket integration. Need better test coverage.", created_at: "2026-08-14T12:00:00" },
  { id: 4, from_user_id: 11, to_employee_id: 5, task_id: 7, rating: 4, comment: "Thorough analysis. Consider adding visualizations to the report.", created_at: "2026-08-16T15:30:00" },
];

// ACTIVITY LOG — task actions per employee
export const ACTIVITY_LOG = [
  { id: 1,  employee_id: 2, task_id: 3, action: "completed", description: "Completed task 'Database schema migration'",          timestamp: "2026-08-15T16:00:00" },
  { id: 2,  employee_id: 2, task_id: 3, action: "started",   description: "Started work on 'Database schema migration'",         timestamp: "2026-08-09T09:00:00" },
  { id: 3,  employee_id: 2, task_id: 3, action: "assigned",  description: "Assigned to 'Database schema migration'",             timestamp: "2026-08-09T08:00:00" },
  { id: 4,  employee_id: 1, task_id: 1, action: "started",   description: "Started work on 'Redesign login & auth UI'",          timestamp: "2026-08-11T09:00:00" },
  { id: 5,  employee_id: 1, task_id: 1, action: "assigned",  description: "Assigned to 'Redesign login & auth UI'",              timestamp: "2026-08-10T10:00:00" },
  { id: 6,  employee_id: 1, task_id: 6, action: "assigned",  description: "Assigned to 'Analytics dashboard charts'",            timestamp: "2026-08-14T09:30:00" },
  { id: 7,  employee_id: 6, task_id: 4, action: "started",   description: "Started work on 'WebSocket real-time updates'",       timestamp: "2026-08-13T09:00:00" },
  { id: 8,  employee_id: 6, task_id: 4, action: "assigned",  description: "Assigned to 'WebSocket real-time updates'",           timestamp: "2026-08-12T10:00:00" },
  { id: 9,  employee_id: 6, task_id: 4, action: "updated",   description: "Updated status to 'In Review' for 'WebSocket updates'",timestamp: "2026-08-17T14:00:00" },
  { id: 10, employee_id: 4, task_id: 9, action: "completed", description: "Completed 'Q3 Infrastructure Audit'",                 timestamp: "2026-07-30T17:00:00" },
  { id: 11, employee_id: 4, task_id: 9, action: "started",   description: "Started 'Q3 Infrastructure Audit'",                   timestamp: "2026-07-02T09:00:00" },
  { id: 12, employee_id: 4, task_id: 5, action: "assigned",  description: "Assigned to 'Dockerize backend services'",            timestamp: "2026-08-13T11:00:00" },
  { id: 13, employee_id: 5, task_id: 7, action: "assigned",  description: "Assigned to 'Employee skill gap report'",             timestamp: "2026-08-15T08:30:00" },
  { id: 14, employee_id: 2, task_id: 2, action: "started",   description: "Started 'Implement JWT refresh tokens'",              timestamp: "2026-08-12T09:00:00" },
  { id: 15, employee_id: 2, task_id: 2, action: "assigned",  description: "Assigned to 'Implement JWT refresh tokens'",          timestamp: "2026-08-11T11:00:00" },
];

// =============================================
// HELPER FUNCTIONS
// =============================================

export function getUser(userId)    { return USERS.find(u => u.id === userId); }
export function getEmployee(empId) { return EMPLOYEES.find(e => e.id === empId); }
export function getTask(taskId)    { return TASKS.find(t => t.id === taskId); }
export function getSkill(skillId)  { return SKILLS.find(s => s.id === skillId); }

export function getEmployeeUser(emp) {
  return USERS.find(u => u.id === emp.user_id);
}

export function getEmployeeSkills(employeeId) {
  const row = EMPLOYEE_SKILLS.find(e => e.employee_id === employeeId);
  if (!row) return [];
  return row.skill_ids.map(id => SKILLS.find(s => s.id === id)).filter(Boolean);
}

export function getTaskSkills(taskId) {
  const task = TASKS.find(t => t.id === taskId);
  if (!task) return [];
  return task.required_skill_ids.map(id => SKILLS.find(s => s.id === id)).filter(Boolean);
}

export function getAssignmentTask(a)     { return getTask(a.task_id); }
export function getAssignmentEmployee(a) { return getEmployee(a.employee_id); }

export function getEmployeeAssignments(employeeId) {
  return TASK_ASSIGNMENTS.filter(a => a.employee_id === employeeId);
}

export function getTaskAssignment(taskId) {
  return TASK_ASSIGNMENTS.find(a => a.task_id === taskId);
}

export function getEmployeeNotifications(employeeId) {
  return NOTIFICATIONS.filter(n => n.employee_id === employeeId);
}

export function getEmployeeAvailability(employeeId) {
  return AVAILABILITY.filter(a => a.employee_id === employeeId);
}

export function getDepartmentManager(department) {
  const dm = DEPARTMENT_MANAGERS.find(d => d.department === department);
  return dm ? USERS.find(u => u.id === dm.manager_user_id) : null;
}

export function getManagerDepartment(managerUserId) {
  const dm = DEPARTMENT_MANAGERS.find(d => d.manager_user_id === managerUserId);
  return dm ? dm.department : null;
}

export function getManagerEmployees(managerUserId) {
  const dept = getManagerDepartment(managerUserId);
  if (!dept) return [];
  return EMPLOYEES.filter(e => e.department === dept);
}

// Skill-matched employees for a task
export function getMatchedEmployees(taskId) {
  const task = getTask(taskId);
  if (!task || !task.required_skill_ids.length) return [];
  return EMPLOYEES.map(emp => {
    const empSkillRow = EMPLOYEE_SKILLS.find(e => e.employee_id === emp.id);
    const empSkillIds = empSkillRow ? empSkillRow.skill_ids : [];
    const matchCount  = task.required_skill_ids.filter(id => empSkillIds.includes(id)).length;
    return { employee: emp, matchCount, totalRequired: task.required_skill_ids.length };
  }).filter(e => e.matchCount > 0).sort((a, b) => b.matchCount - a.matchCount);
}

// Employee progress stats
export function getEmployeeProgress(employeeId) {
  const assignments   = TASK_ASSIGNMENTS.filter(a => a.employee_id === employeeId);
  const completed     = assignments.filter(a => a.status === "completed");
  const scored        = completed.filter(a => a.assignment_score !== null);
  const avgScore      = scored.length ? Math.round(scored.reduce((s, a) => s + a.assignment_score, 0) / scored.length) : null;
  const totalHours    = completed.map(a => getTask(a.task_id)?.estimated_hours || 0).reduce((s, h) => s + h, 0);
  const onTimeCount   = completed.filter(a => {
    const task = getTask(a.task_id);
    return task && a.completed_at && a.completed_at <= task.deadline;
  }).length;
  const onTimeRate    = completed.length ? Math.round((onTimeCount / completed.length) * 100) : 0;

  return {
    total:      assignments.length,
    completed:  completed.length,
    inProgress: assignments.filter(a => a.status === "in_progress").length,
    assigned:   assignments.filter(a => a.status === "assigned").length,
    avgScore,
    totalHours,
    onTimeRate,
    completionRate: assignments.length ? Math.round((completed.length / assignments.length) * 100) : 0,
  };
}

export function getEmployeeFeedback(employeeId) {
  return FEEDBACK.filter(f => f.to_employee_id === employeeId);
}

export function getEmployeeTasks(employeeId) {
  const assignments = TASK_ASSIGNMENTS.filter(a => a.employee_id === employeeId);
  return assignments.map(a => getTask(a.task_id)).filter(Boolean);
}

export function getEmployeeActivityLog(employeeId) {
  return ACTIVITY_LOG.filter(l => l.employee_id === employeeId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// Overdue tasks with assignee info
export function getOverdueTasks() {
  const today = new Date().toISOString().split("T")[0];
  return TASKS.filter(t => t.deadline < today && t.status !== "done").map(task => {
    const assignment = TASK_ASSIGNMENTS.find(a => a.task_id === task.id);
    const emp        = assignment ? getEmployee(assignment.employee_id) : null;
    const user       = emp ? getEmployeeUser(emp) : null;
    return { task, assignee: user };
  });
}

// Avatar color palette aligned with brand theme
const AVATAR_COLORS = [
  ["#745ec0", "#f1edf9"],
  ["#76283d", "#fcebef"],
  ["#c57556", "#faece7"],
  ["#059669", "#d1fae5"],
  ["#2563eb", "#dbeafe"],
  ["#6d28d9", "#ede9fe"],
  ["#b45309", "#fef3c7"],
  ["#9d174d", "#fce7f3"],
];

export function avatarColors(name) {
  const idx = (name || "?").charCodeAt(0) % AVATAR_COLORS.length;
  return { bg: AVATAR_COLORS[idx][1], color: AVATAR_COLORS[idx][0] };
}

export function initials(name) {
  if (!name) return "?";
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

export const STATUS_BADGE = {
  todo:        "badge-gray",
  in_progress: "badge-blue",
  review:      "badge-purple",
  done:        "badge-green",
  completed:   "badge-green",
  assigned:    "badge-purple",
  cancelled:   "badge-red",
  available:   "badge-green",
  busy:        "badge-amber",
  offline:     "badge-gray",
  off:         "badge-gray",
  active:      "badge-green",
  idle:        "badge-amber",
  in_meeting:  "badge-purple",
};

export const PRIORITY_BADGE = {
  low:      "badge-gray",
  medium:   "badge-blue",
  high:     "badge-amber",
  critical: "badge-red",
};

export const STATUS_LABEL = {
  todo:        "To Do",
  in_progress: "In Progress",
  review:      "In Review",
  done:        "Done",
  completed:   "Completed",
  assigned:    "Assigned",
  cancelled:   "Cancelled",
  available:   "Available",
  busy:        "Busy",
  offline:     "Offline",
  off:         "Day Off",
  active:      "Active",
  idle:        "Idle",
  in_meeting:  "In Meeting",
};

export const TASK_TYPE_LABEL = {
  weekly:    "Weekly",
  monthly:   "Monthly",
  quarterly: "Quarterly",
  yearly:    "Yearly",
};

export const TASK_TYPE_BADGE = {
  weekly:    "badge-accent", // Terracotta #c47454
  monthly:   "badge-purple", // Lavender #a595db
  quarterly: "badge-wine",   // Berry Wine #76283d
  yearly:    "badge-green",
};

// Password Security Validation Helper
export function validatePasswordSecurity(password) {
  const p = password || "";
  const minLength = p.length >= 8;
  const hasUpper = /[A-Z]/.test(p);
  const hasLower = /[a-z]/.test(p);
  const hasNumber = /[0-9]/.test(p);
  const hasSpecial = /[^A-Za-z0-9]/.test(p);

  const isStrong = minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  
  let score = 0;
  if (p.length >= 6) score++;
  if (minLength) score++;
  if (hasUpper && hasLower) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  let strength = "Weak";
  if (score >= 5) strength = "Strong";
  else if (score >= 3) strength = "Moderate";

  return {
    isStrong,
    strength,
    score,
    checks: {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial
    }
  };
}

export function updateUserPassword(userId, newPassword) {
  const u = USERS.find(user => user.id === userId);
  if (u) {
    u.password = newPassword;
    u.temp_password = null;
    return true;
  }
  return false;
}
