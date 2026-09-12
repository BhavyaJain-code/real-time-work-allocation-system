import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ClipboardList, Users, Zap, BarChart3,
  CalendarDays, Bell, CheckSquare, LogOut, Briefcase,
  UserCircle, MessageSquare, ScrollText, UserCog, TrendingUp, UserCheck
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { initials } from "../data/mockData";

export default function Sidebar() {
  const { user, logout, managedDept } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const adminLinks = [
    { to: "/admin/dashboard",   icon: <LayoutDashboard size={16} />, label: "Dashboard" },
    { to: "/admin/tasks",       icon: <ClipboardList size={16} />,   label: "Work Allocation" },
    { to: "/admin/assignments", icon: <CheckSquare size={16} />,     label: "Staff Assignments" },
    { to: "/admin/employees",   icon: <Users size={16} />,           label: "Resource Directory" },
    { to: "/admin/skills",      icon: <Zap size={16} />,             label: "Skills & Competencies" },
    { to: "/admin/users",       icon: <UserCog size={16} />,         label: "User Access Control" },
    { to: "/admin/progress",    icon: <TrendingUp size={16} />,      label: "Workload Reports" },
    { to: "/admin/feedback",    icon: <MessageSquare size={16} />,   label: "Appraisal & Feedback" },
    { to: "/admin/log",         icon: <ScrollText size={16} />,      label: "Audit Trail" },
    { to: "/admin/analytics",   icon: <BarChart3 size={16} />,       label: "Capacity Analytics" },
  ];

  const managerLinks = [
    { to: "/manager/dashboard",   icon: <LayoutDashboard size={16} />, label: "Department Overview" },
    { to: "/manager/tasks",       icon: <ClipboardList size={16} />,   label: "Allocate Tasks" },
    { to: "/manager/employees",   icon: <Users size={16} />,           label: `${managedDept || "Dept"} Team` },
    { to: "/manager/assignments", icon: <UserCheck size={16} />,       label: "Active Allocations" },
    { to: "/manager/progress",    icon: <TrendingUp size={16} />,      label: "Performance Reports" },
    { to: "/manager/feedback",    icon: <MessageSquare size={16} />,   label: "Staff Feedback" },
    { to: "/manager/log",         icon: <ScrollText size={16} />,      label: "Activity Log" },
  ];

  const employeeLinks = [
    { to: "/employee/dashboard",     icon: <LayoutDashboard size={16} />, label: "My Work Overview" },
    { to: "/employee/tasks",         icon: <ClipboardList size={16} />,   label: "Assigned Tasks" },
    { to: "/employee/availability",  icon: <CalendarDays size={16} />,    label: "Availability & Shifts" },
    { to: "/employee/notifications", icon: <Bell size={16} />,            label: "Notifications" },
  ];

  const links       = user.role === "admin" ? adminLinks : user.role === "manager" ? managerLinks : employeeLinks;
  const sectionLabel = user.role === "admin" ? "Resource Management" : user.role === "manager" ? `Department (${managedDept || "Dept"})` : "Staff Portal";

  return (
    <aside className="app-sidebar">
      <div className="sb-brand">
        <div className="sb-logo">WAS</div>
        <div>
          <div className="sb-brand-name">Work Allocation</div>
          <div className="sb-brand-sub">Resource Management</div>
        </div>
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
          <UserCircle size={16} /> My Profile
        </NavLink>
        <div className="sb-user" style={{ marginTop: 4 }}>
          <div className="avatar avatar-sm" style={{ background: "#2563eb", color: "#ffffff" }}>{initials(user.name)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sb-user-name">{user.name}</div>
            <div className="sb-user-role">{user.role}</div>
          </div>
        </div>
        <button className="sb-link" style={{ color: "#ef4444", marginTop: 4 }}
          onClick={() => { logout(); navigate("/login"); }}>
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </aside>
  );
}
