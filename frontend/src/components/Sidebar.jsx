import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ClipboardList, Users, Zap, BarChart3,
  CalendarDays, Bell, CheckSquare, LogOut, Briefcase,
  UserCircle, MessageSquare, ScrollText, UserCog, TrendingUp
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { initials, avatarColors } from "../data/mockData";

export default function Sidebar() {
  const { user, logout, managedDept } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  const av = avatarColors(user.name);

  const adminLinks = [
    { to: "/admin/dashboard",   icon: <LayoutDashboard size={17} />, label: "Dashboard" },
    { to: "/admin/tasks",       icon: <ClipboardList size={17} />,   label: "Tasks" },
    { to: "/admin/assignments", icon: <CheckSquare size={17} />,     label: "Assignments" },
    { to: "/admin/employees",   icon: <Users size={17} />,           label: "Employees" },
    { to: "/admin/skills",      icon: <Zap size={17} />,             label: "Skills" },
    { to: "/admin/users",       icon: <UserCog size={17} />,         label: "User Management" },
    { to: "/admin/progress",    icon: <TrendingUp size={17} />,      label: "Progress Reports" },
    { to: "/admin/feedback",    icon: <MessageSquare size={17} />,   label: "Feedback" },
    { to: "/admin/log",         icon: <ScrollText size={17} />,      label: "Activity Log" },
    { to: "/admin/analytics",   icon: <BarChart3 size={17} />,       label: "Analytics" },
  ];

  const managerLinks = [
    { to: "/admin/dashboard",   icon: <LayoutDashboard size={17} />, label: "Dashboard" },
    { to: "/admin/tasks",       icon: <ClipboardList size={17} />,   label: "Tasks" },
    { to: "/admin/employees",   icon: <Users size={17} />,           label: "Employees" },
    { to: "/admin/assignments", icon: <CheckSquare size={17} />,     label: "Assignments" },
    { to: "/manager/progress",  icon: <TrendingUp size={17} />,      label: "Progress Reports" },
    { to: "/manager/feedback",  icon: <MessageSquare size={17} />,   label: "Feedback" },
    { to: "/manager/log",       icon: <ScrollText size={17} />,      label: "Activity Log" },
  ];

  const employeeLinks = [
    { to: "/employee/dashboard",     icon: <LayoutDashboard size={17} />, label: "Dashboard" },
    { to: "/employee/tasks",         icon: <ClipboardList size={17} />,   label: "My Tasks" },
    { to: "/employee/availability",  icon: <CalendarDays size={17} />,    label: "Availability" },
    { to: "/employee/notifications", icon: <Bell size={17} />,            label: "Notifications" },
  ];

  const links = user.role === "admin" ? adminLinks : user.role === "manager" ? managerLinks : employeeLinks;
  const sectionLabel = user.role === "admin" ? "Admin" : user.role === "manager" ? `Manager${managedDept ? ` · ${managedDept}` : ""}` : "Employee";

  return (
    <aside className="app-sidebar">
      <div className="sb-brand">
        <div className="sb-logo"><Briefcase size={16} /></div>
        <span className="sb-brand-name">WorkFlow</span>
      </div>

      <div className="sb-section" style={{ flex: 1 }}>
        <div className="sb-section-label">{sectionLabel}</div>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => `sb-link${isActive ? " active" : ""}`}>
            {l.icon}{l.label}
          </NavLink>
        ))}
      </div>

      <div className="sb-bottom">
        <NavLink to="/profile" className={({ isActive }) => `sb-link${isActive ? " active" : ""}`}>
          <UserCircle size={17} /> My Profile
        </NavLink>
        <div className="sb-user" style={{ marginTop: 4 }}>
          <div className="avatar avatar-sm" style={{ background: av.bg, color: av.color }}>{initials(user.name)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sb-user-name">{user.name}</div>
            <div className="sb-user-role">{user.role}</div>
          </div>
        </div>
        <button className="sb-link" style={{ color: "#ef4444", marginTop: 4 }}
          onClick={() => { logout(); navigate("/login"); }}>
          <LogOut size={17} /> Sign out
        </button>
      </div>
    </aside>
  );
}
