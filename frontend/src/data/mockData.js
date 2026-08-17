// ====================================================
// MOCK DATA — Real-Time Work Allocation System
// Mirrors ER model: USER, EMPLOYEE, SKILL, TASK,
// TASK_ASSIGNMENT, AVAILABILITY, NOTIFICATION
// ====================================================

export const SKILLS = [
  { id: 1, name: "React",         description: "Frontend library for building UIs" },
  { id: 2, name: "Node.js",       description: "Server-side JavaScript runtime" },
  { id: 3, name: "PostgreSQL",    description: "Relational database management" },
  { id: 4, name: "TypeScript",    description: "Typed superset of JavaScript" },
  { id: 5, name: "Python",        description: "General-purpose scripting language" },
  { id: 6, name: "Docker",        description: "Containerization & deployment" },
  { id: 7, name: "UI/UX Design",  description: "User interface and experience design" },
  { id: 8, name: "GraphQL",       description: "Query language for APIs" },
  { id: 9, name: "AWS",           description: "Amazon Web Services cloud platform" },
  { id: 10, name: "Figma",        description: "Collaborative design tool" },
];

export const USERS = [
  { id: 1,  name: "Alex Johnson",   email: "alex@workflow.io",   role: "admin",    is_active: true, created_at: "2025-01-10" },
  { id: 2,  name: "Priya Sharma",   email: "priya@workflow.io",  role: "employee", is_active: true, created_at: "2025-01-12" },
  { id: 3,  name: "Marcus Lee",     email: "marcus@workflow.io", role: "employee", is_active: true, created_at: "2025-01-14" },
  { id: 4,  name: "Sara Patel",     email: "sara@workflow.io",   role: "employee", is_active: true, created_at: "2025-01-15" },
  { id: 5,  name: "James Wilson",   email: "james@workflow.io",  role: "employee", is_active: false, created_at: "2025-01-18" },
  { id: 6,  name: "Aisha Okonkwo", email: "aisha@workflow.io",  role: "employee", is_active: true, created_at: "2025-02-01" },
  { id: 7,  name: "Chen Wei",       email: "chen@workflow.io",   role: "employee", is_active: true, created_at: "2025-02-05" },
  { id: 8,  name: "Laura Müller",   email: "laura@workflow.io",  role: "admin",    is_active: true, created_at: "2025-02-10" },
];

export const EMPLOYEES = [
  { id: 1, user_id: 2, department: "Engineering",  position: "Senior Frontend Dev",  availability_status: "available", workload_percentage: 65, max_workload: 100 },
  { id: 2, user_id: 3, department: "Engineering",  position: "Backend Engineer",      availability_status: "busy",      workload_percentage: 90, max_workload: 100 },
  { id: 3, user_id: 4, department: "Design",       position: "UI/UX Designer",        availability_status: "available", workload_percentage: 40, max_workload: 100 },
  { id: 4, user_id: 5, department: "Engineering",  position: "DevOps Engineer",       availability_status: "offline",   workload_percentage: 0,  max_workload: 100 },
  { id: 5, user_id: 6, department: "Data",         position: "Data Analyst",          availability_status: "available", workload_percentage: 55, max_workload: 100 },
  { id: 6, user_id: 7, department: "Engineering",  position: "Full-Stack Developer",  availability_status: "busy",      workload_percentage: 80, max_workload: 100 },
];

export const EMPLOYEE_SKILLS = [
  { employee_id: 1, skill_ids: [1, 4, 7] },
  { employee_id: 2, skill_ids: [2, 3, 4] },
  { employee_id: 3, skill_ids: [7, 10] },
  { employee_id: 4, skill_ids: [6, 9] },
  { employee_id: 5, skill_ids: [5, 3] },
  { employee_id: 6, skill_ids: [1, 2, 4, 8] },
];

export const TASKS = [
  { id: 1, title: "Redesign login & auth UI",     description: "Update the login and registration flows with the new design system.", priority: "high",     status: "in_progress", deadline: "2026-08-22", estimated_hours: 12, created_by: 1, created_at: "2026-08-10", required_skill_ids: [1, 7] },
  { id: 2, title: "Implement JWT refresh tokens", description: "Add refresh token rotation and silent re-auth to the backend API.",    priority: "critical", status: "todo",        deadline: "2026-08-18", estimated_hours: 8,  created_by: 1, created_at: "2026-08-11", required_skill_ids: [2, 4] },
  { id: 3, title: "Database schema migration",    description: "Run Prisma migrate for new task_required_skill junction table.",       priority: "medium",   status: "done",        deadline: "2026-08-15", estimated_hours: 4,  created_by: 8, created_at: "2026-08-09", required_skill_ids: [3] },
  { id: 4, title: "WebSocket real-time updates",  description: "Integrate socket.io on the frontend for live task status updates.",   priority: "high",     status: "review",      deadline: "2026-08-25", estimated_hours: 16, created_by: 1, created_at: "2026-08-12", required_skill_ids: [1, 2] },
  { id: 5, title: "Dockerize backend services",   description: "Create multi-stage Dockerfile and compose file for production.",      priority: "medium",   status: "in_progress", deadline: "2026-08-28", estimated_hours: 6,  created_by: 8, created_at: "2026-08-13", required_skill_ids: [6, 9] },
  { id: 6, title: "Analytics dashboard charts",   description: "Build CSS-only bar charts for workload and task completion.",         priority: "low",      status: "todo",        deadline: "2026-09-05", estimated_hours: 10, created_by: 1, created_at: "2026-08-14", required_skill_ids: [1, 4] },
  { id: 7, title: "Employee skill gap report",    description: "Python script to identify departments with insufficient skill coverage.", priority: "medium", status: "todo",       deadline: "2026-09-01", estimated_hours: 8,  created_by: 8, created_at: "2026-08-15", required_skill_ids: [5, 3] },
  { id: 8, title: "GraphQL API for projects",     description: "Expose project module via GraphQL alongside existing REST routes.",   priority: "low",      status: "todo",        deadline: "2026-09-10", estimated_hours: 14, created_by: 1, created_at: "2026-08-16", required_skill_ids: [8, 2] },
];

export const TASK_ASSIGNMENTS = [
  { id: 1, task_id: 1, employee_id: 1, assigned_at: "2026-08-10", started_at: "2026-08-11", completed_at: null,         assignment_score: null, status: "in_progress" },
  { id: 2, task_id: 2, employee_id: 2, assigned_at: "2026-08-11", started_at: "2026-08-12", completed_at: null,         assignment_score: null, status: "in_progress" },
  { id: 3, task_id: 3, employee_id: 2, assigned_at: "2026-08-09", started_at: "2026-08-09", completed_at: "2026-08-15", assignment_score: 94,   status: "completed" },
  { id: 4, task_id: 4, employee_id: 6, assigned_at: "2026-08-12", started_at: "2026-08-13", completed_at: null,         assignment_score: null, status: "in_progress" },
  { id: 5, task_id: 5, employee_id: 4, assigned_at: "2026-08-13", started_at: null,         completed_at: null,         assignment_score: null, status: "assigned" },
  { id: 6, task_id: 7, employee_id: 5, assigned_at: "2026-08-15", started_at: null,         completed_at: null,         assignment_score: null, status: "assigned" },
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
  { id: 1, employee_id: 1, task_id: 1, message: "You have been assigned to 'Redesign login & auth UI'",       type: "task_assigned",  is_read: false, created_at: "2026-08-10T10:30:00" },
  { id: 2, employee_id: 1, task_id: 1, message: "'Redesign login & auth UI' deadline is in 5 days",           type: "reminder",       is_read: false, created_at: "2026-08-17T09:00:00" },
  { id: 3, employee_id: 1, task_id: 4, message: "Task 'WebSocket real-time updates' has been updated",        type: "task_updated",   is_read: true,  created_at: "2026-08-13T14:22:00" },
  { id: 4, employee_id: 2, task_id: 3, message: "'Database schema migration' marked as completed. Score: 94", type: "task_completed", is_read: true,  created_at: "2026-08-15T16:00:00" },
  { id: 5, employee_id: 2, task_id: 2, message: "You have been assigned to 'Implement JWT refresh tokens'",   type: "task_assigned",  is_read: false, created_at: "2026-08-11T11:00:00" },
  { id: 6, employee_id: 5, task_id: 7, message: "You have been assigned to 'Employee skill gap report'",      type: "task_assigned",  is_read: false, created_at: "2026-08-15T08:30:00" },
];

// =============================================
// HELPER FUNCTIONS
// =============================================

export function getUser(userId)     { return USERS.find(u => u.id === userId); }
export function getEmployee(empId)  { return EMPLOYEES.find(e => e.id === empId); }
export function getTask(taskId)     { return TASKS.find(t => t.id === taskId); }
export function getSkill(skillId)   { return SKILLS.find(s => s.id === skillId); }

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

// Avatar color palette
const AVATAR_COLORS = [
  ["#6366f1","#eef2ff"],["#10b981","#d1fae5"],["#f59e0b","#fef3c7"],
  ["#ef4444","#fee2e2"],["#3b82f6","#dbeafe"],["#8b5cf6","#ede9fe"],
  ["#ec4899","#fce7f3"],["#14b8a6","#ccfbf1"],
];

export function avatarColors(name) {
  const idx = (name || "?").charCodeAt(0) % AVATAR_COLORS.length;
  return { bg: AVATAR_COLORS[idx][1], color: AVATAR_COLORS[idx][0] };
}

export function initials(name) {
  if (!name) return "?";
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

// Status → badge class
export const STATUS_BADGE = {
  todo:        "badge-gray",
  in_progress: "badge-blue",
  review:      "badge-purple",
  done:        "badge-green",
  completed:   "badge-green",
  assigned:    "badge-indigo",
  cancelled:   "badge-red",
  available:   "badge-green",
  busy:        "badge-amber",
  offline:     "badge-gray",
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
};
