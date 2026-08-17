import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ClipboardList, Users, Zap, BarChart3,
  CalendarDays, Bell, CheckSquare, LogOut, Briefcase
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { initials, avatarColors } from "../data/mockData";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;
  const isAdmin = user.role === "admin";
  const av = avatarColors(user.name);

  const adminLinks = [
    { to: "/admin/dashboard",   icon: <LayoutDashboard size={17} />, label: "Dashboard" },
    { to: "/admin/tasks",       icon: <ClipboardList size={17} />,   label: "Tasks" },
    { to: "/admin/assignments", icon: <CheckSquare size={17} />,     label: "Assignments" },
    { to: "/admin/employees",   icon: <Users size={17} />,           label: "Employees" },
    { to: "/admin/skills",      icon: <Zap size={17} />,             label: "Skills" },
    { to: "/admin/analytics",   icon: <BarChart3 size={17} />,       label: "Analytics" },
  ];

  const employeeLinks = [
    { to: "/employee/dashboard",     icon: <LayoutDashboard size={17} />, label: "Dashboard" },
    { to: "/employee/tasks",         icon: <ClipboardList size={17} />,   label: "My Tasks" },
    { to: "/employee/availability",  icon: <CalendarDays size={17} />,    label: "Availability" },
    { to: "/employee/notifications", icon: <Bell size={17} />,            label: "Notifications" },
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  return (
    <aside className="app-sidebar">
      {/* Brand */}
      <div className="sb-brand">
        <div className="sb-logo">
          <Briefcase size={16} />
        </div>
        <span className="sb-brand-name">WorkFlow</span>
      </div>

      {/* Nav */}
      <div className="sb-section" style={{ flex: 1 }}>
        <div className="sb-section-label">{isAdmin ? "Admin" : "Employee"}</div>
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => `sb-link${isActive ? " active" : ""}`}
          >
            {l.icon}
            {l.label}
          </NavLink>
        ))}
      </div>

      {/* User + Logout */}
      <div className="sb-bottom">
        <div className="sb-user">
          <div
            className="avatar avatar-sm"
            style={{ background: av.bg, color: av.color }}
          >
            {initials(user.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sb-user-name">{user.name}</div>
            <div className="sb-user-role">{user.role}</div>
          </div>
        </div>
        <button
          className="sb-link"
          style={{ color: "#ef4444", marginTop: 4 }}
          onClick={() => { logout(); navigate("/login"); }}
        >
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
