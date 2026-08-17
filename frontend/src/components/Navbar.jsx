import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { NOTIFICATIONS } from "../data/mockData";

const PAGE_TITLES = {
  "/admin/dashboard":   "Dashboard",
  "/admin/tasks":       "Tasks",
  "/admin/tasks/create":"Create Task",
  "/admin/assignments": "Assignments",
  "/admin/employees":   "Employees",
  "/admin/skills":      "Skills",
  "/admin/analytics":   "Analytics",
  "/employee/dashboard":     "Dashboard",
  "/employee/tasks":         "My Tasks",
  "/employee/availability":  "Availability",
  "/employee/notifications": "Notifications",
};

export default function Navbar() {
  const { user, employee, userInitials, userColors } = useAuth();
  const { pathname } = useLocation();

  const title = Object.entries(PAGE_TITLES).find(([k]) => pathname.startsWith(k))?.[1] || "WorkFlow";

  const unread = employee
    ? NOTIFICATIONS.filter(n => n.employee_id === employee.id && !n.is_read).length
    : 0;

  return (
    <header className="app-topbar">
      <span className="topbar-title">{title}</span>
      <div className="topbar-right">
        {employee && (
          <button className="icon-btn" title="Notifications">
            <Bell size={18} />
            {unread > 0 && <span className="notif-badge" />}
          </button>
        )}
        <div
          className="topbar-avatar"
          title={user?.name}
          style={{ background: userColors.bg, color: userColors.color }}
        >
          {userInitials}
        </div>
      </div>
    </header>
  );
}
