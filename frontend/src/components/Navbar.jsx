import { useLocation } from "react-router-dom";
import { Bell, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { NOTIFICATIONS, initials } from "../data/mockData";

const PAGE_TITLES = {
  "/admin/dashboard":   "Resource Management Dashboard",
  "/admin/tasks":       "Work Allocation & Task Management",
  "/admin/tasks/create":"Create & Allocate Task",
  "/admin/assignments": "Staff Task Assignments",
  "/admin/employees":   "Employee & Resource Directory",
  "/admin/skills":      "Skills & Competency Matrix",
  "/admin/analytics":   "Workload & Capacity Analytics",
  "/admin/users":       "User Accounts & Roles",
  "/admin/progress":    "Workload & Progress Reports",
  "/admin/feedback":    "Staff Feedback & Appraisals",
  "/admin/log":         "Audit Trail & System Logs",
  "/manager/dashboard": "Department Overview",
  "/manager/tasks":     "Department Work Allocation",
  "/manager/employees": "Department Team",
  "/manager/assignments":"Department Assignments",
  "/employee/dashboard":     "My Staff Dashboard",
  "/employee/tasks":         "My Allocated Tasks",
  "/employee/availability":  "My Availability & Shifts",
  "/employee/notifications": "Notifications & Alerts",
  "/profile":           "My Profile & Credentials",
};

export default function Navbar() {
  const { user, employee } = useAuth();
  const { pathname } = useLocation();

  const title = Object.entries(PAGE_TITLES).find(([k]) => pathname.startsWith(k))?.[1] || "Work Allocation System";

  const unread = employee
    ? NOTIFICATIONS.filter(n => n.employee_id === employee.id && !n.is_read).length
    : 0;

  return (
    <header className="app-topbar">
      <span className="topbar-title">{title}</span>
      <div className="topbar-right">
        {employee && (
          <button className="btn btn-secondary btn-sm" title="Notifications" style={{ padding: "4px 8px" }}>
            <Bell size={14} />
            {unread > 0 && <span className="badge badge-amber" style={{ marginLeft: 4 }}>{unread}</span>}
          </button>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#475569" }}>
          <div className="avatar avatar-sm" style={{ background: "#2563eb", color: "#ffffff", width: 28, height: 28 }}>
            {initials(user?.name)}
          </div>
          <span style={{ fontWeight: 600 }}>{user?.name}</span>
          <span className="badge badge-gray" style={{ textTransform: "capitalize" }}>{user?.role}</span>
        </div>
      </div>
    </header>
  );
}
