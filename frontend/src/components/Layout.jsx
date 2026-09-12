import { useState } from "react";
import { Outlet, Navigate, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  ChevronDown, ChevronRight, LogOut, User, CheckSquare, 
  HelpCircle, Settings, Layers, BarChart2, Laptop, Globe, Users
} from "lucide-react";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [expandedSections, setExpandedSections] = useState({
    attendance: true,
    productivity: false,
    internet: false,
    appdoc: false,
    computer: false,
    tags: false,
    departments: false,
    offices: true,
    tasks: false,
  });

  if (!user) return <Navigate to="/login" replace />;

  const toggleSection = (sec) => {
    setExpandedSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const isEmp = user.role === "employee";
  const isMgr = user.role === "manager";
  const isAdmin = user.role === "admin";

  // Dynamic route helpers based on logged in user's role
  const dashboardRoute = isAdmin ? "/admin/dashboard" : isMgr ? "/manager/dashboard" : "/employee/dashboard";
  const monitoringRoute = isAdmin ? "/admin/monitoring" : isMgr ? "/manager/monitoring" : "/employee/dashboard";
  const tasksRoute = isAdmin ? "/admin/tasks" : isMgr ? "/manager/tasks" : "/employee/tasks";
  const assignmentsRoute = isAdmin ? "/admin/assignments" : isMgr ? "/manager/assignments" : "/employee/availability";
  const progressRoute = isAdmin ? "/admin/progress" : isMgr ? "/manager/progress" : "/employee/progress";
  const employeesRoute = isAdmin ? "/admin/employees" : isMgr ? "/manager/employees" : "/profile";
  const analyticsRoute = isAdmin ? "/admin/analytics" : isMgr ? "/manager/analytics" : "/employee/dashboard";
  const skillsRoute = isAdmin ? "/admin/skills" : isMgr ? "/manager/skills" : "/profile";
  const logRoute = isAdmin ? "/admin/log" : isMgr ? "/manager/log" : "/employee/notifications";

  // Determine current active page label for breadcrumb
  let pageTitle = "Dashboard";
  let breadcrumbText = "WorkTime - Operations Overview";

  if (location.pathname.includes("/monitoring")) {
    pageTitle = "Active/idle";
    breadcrumbText = "Company - Active/idle report";
  } else if (location.pathname.includes("/dashboard")) {
    pageTitle = "Summary";
    breadcrumbText = `${user.role.toUpperCase()} - ${user.name}'s Executive Hub`;
  } else if (location.pathname.includes("/tasks")) {
    pageTitle = "Task Allocation";
    breadcrumbText = "Work Allocation System - Task Queue & Deliverables";
  } else if (location.pathname.includes("/assignments") || location.pathname.includes("/availability")) {
    pageTitle = isEmp ? "My Availability" : "Staff Allocation";
    breadcrumbText = isEmp ? "Employee - Working Schedule & Availability" : "Resource Allocation Matrix";
  } else if (location.pathname.includes("/employees")) {
    pageTitle = "Staff Directory";
    breadcrumbText = "Company - Employee Registry & Profiles";
  } else if (location.pathname.includes("/analytics")) {
    pageTitle = "In-office/remote";
    breadcrumbText = "Company - In-office / Remote Performance Comparison";
  } else if (location.pathname.includes("/progress")) {
    pageTitle = "Performance Report";
    breadcrumbText = "Employee Performance & Progress Appraisal";
  } else if (location.pathname.includes("/profile")) {
    pageTitle = "Settings & Profile";
    breadcrumbText = "System - User Profile & Configuration";
  }

  return (
    <div className="wt-app-shell">
      {/* LEFT WORKTIME SIDEBAR */}
      <aside className="wt-sidebar">
        {/* Brand Logo Box - routes to own dashboard */}
        <div className="wt-logo-box" onClick={() => navigate(dashboardRoute)}>
          <div className="wt-clock-icon">
            <div className="q1" />
            <div className="q2" />
            <div className="q3" />
            <div className="q4" />
          </div>
          <div className="wt-logo-text">
            WORKTIME<sup>®</sup>
          </div>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="wt-nav-menu">
          {/* Summary */}
          <div className="wt-menu-group">
            <NavLink
              to={dashboardRoute}
              className={({ isActive }) => `wt-menu-header${isActive ? " active" : ""}`}
            >
              <span>Summary</span>
            </NavLink>
          </div>

          {/* What's now */}
          <div className="wt-menu-group">
            <NavLink
              to={monitoringRoute}
              className={({ isActive }) => `wt-menu-header${isActive ? " active" : ""}`}
            >
              <span>What&apos;s now</span>
            </NavLink>
          </div>

          {/* Progress */}
          <div className="wt-menu-group">
            <NavLink
              to={progressRoute}
              className={({ isActive }) => `wt-menu-header${isActive ? " active" : ""}`}
            >
              <span>Progress</span>
            </NavLink>
          </div>

          {/* Attendance (Dropdown Accordion) */}
          <div className="wt-menu-group">
            <div className="wt-menu-header" onClick={() => toggleSection("attendance")}>
              <span>Attendance</span>
              {expandedSections.attendance ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
            {expandedSections.attendance && (
              <div className="wt-submenu">
                <NavLink to={monitoringRoute} className="wt-submenu-item">Summary</NavLink>
                <NavLink to={monitoringRoute} className="wt-submenu-item">At work</NavLink>
                <NavLink to={monitoringRoute} className="wt-submenu-item">Off work</NavLink>
                <NavLink to={assignmentsRoute} className="wt-submenu-item">{isEmp ? "My Schedule" : "Timesheet/calendar"}</NavLink>
                <NavLink to={analyticsRoute} className="wt-submenu-item">Overtime</NavLink>
                <NavLink to={monitoringRoute} className="wt-submenu-item">Active/idle</NavLink>
                <NavLink to={monitoringRoute} className="wt-submenu-item">Login/logout</NavLink>
                <NavLink to={monitoringRoute} className="wt-submenu-item">Employee total time</NavLink>
                <NavLink to={logRoute} className="wt-submenu-item">Full log</NavLink>
              </div>
            )}
          </div>

          {/* Productivity */}
          <div className="wt-menu-group">
            <div className="wt-menu-header" onClick={() => toggleSection("productivity")}>
              <span>Productivity</span>
              {expandedSections.productivity ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
            {expandedSections.productivity && (
              <div className="wt-submenu">
                <NavLink to={monitoringRoute} className="wt-submenu-item">Summary</NavLink>
                <NavLink to={monitoringRoute} className="wt-submenu-item">Productive vs Idle</NavLink>
                <NavLink to={analyticsRoute} className="wt-submenu-item">Department Productivity</NavLink>
              </div>
            )}
          </div>

          {/* Internet */}
          <div className="wt-menu-group">
            <div className="wt-menu-header" onClick={() => toggleSection("internet")}>
              <span>Internet</span>
              {expandedSections.internet ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
            {expandedSections.internet && (
              <div className="wt-submenu">
                <NavLink to={analyticsRoute} className="wt-submenu-item">Top Websites</NavLink>
                <NavLink to={analyticsRoute} className="wt-submenu-item">URL Category Breakdown</NavLink>
              </div>
            )}
          </div>

          {/* App/doc */}
          <div className="wt-menu-group">
            <div className="wt-menu-header" onClick={() => toggleSection("appdoc")}>
              <span>App/doc</span>
              {expandedSections.appdoc ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
            {expandedSections.appdoc && (
              <div className="wt-submenu">
                <NavLink to={analyticsRoute} className="wt-submenu-item">Top Applications</NavLink>
                <NavLink to={analyticsRoute} className="wt-submenu-item">Document Usage</NavLink>
              </div>
            )}
          </div>

          {/* Computer */}
          <div className="wt-menu-group">
            <div className="wt-menu-header" onClick={() => toggleSection("computer")}>
              <span>Computer</span>
              {expandedSections.computer ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
          </div>

          {/* Tags */}
          <div className="wt-menu-group">
            <div className="wt-menu-header" onClick={() => toggleSection("tags")}>
              <span>Tags</span>
              {expandedSections.tags ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
          </div>

          {/* Departments */}
          <div className="wt-menu-group">
            <div className="wt-menu-header" onClick={() => toggleSection("departments")}>
              <span>Departments</span>
              {expandedSections.departments ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
            {expandedSections.departments && (
              <div className="wt-submenu">
                <NavLink to={analyticsRoute} className="wt-submenu-item">Engineering</NavLink>
                <NavLink to={analyticsRoute} className="wt-submenu-item">Design</NavLink>
                <NavLink to={analyticsRoute} className="wt-submenu-item">Data</NavLink>
              </div>
            )}
          </div>

          {/* Offices / Remote (Image 1) */}
          <div className="wt-menu-group">
            <div className="wt-menu-header" onClick={() => toggleSection("offices")}>
              <span>Offices</span>
              {expandedSections.offices ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
            {expandedSections.offices && (
              <div className="wt-submenu">
                <NavLink to={analyticsRoute} className="wt-submenu-item">Summary</NavLink>
                <NavLink to={employeesRoute} className="wt-submenu-item">Per employee</NavLink>
                <NavLink to={analyticsRoute} className="wt-submenu-item">In-office/remote</NavLink>
              </div>
            )}
          </div>

          {/* Work Allocation & Task System */}
          <div className="wt-menu-group" style={{ marginTop: 12, borderTop: "1px solid #454c55", paddingTop: 8 }}>
            <div className="wt-menu-header" onClick={() => toggleSection("tasks")}>
              <span>Work Allocation</span>
              {expandedSections.tasks ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
            {expandedSections.tasks && (
              <div className="wt-submenu">
                <NavLink to={tasksRoute} className="wt-submenu-item">{isEmp ? "My Tasks" : "Tasks Queue"}</NavLink>
                {isAdmin && <NavLink to="/admin/tasks/create" className="wt-submenu-item">Create Task</NavLink>}
                <NavLink to={assignmentsRoute} className="wt-submenu-item">{isEmp ? "My Availability" : "Staff Allocation"}</NavLink>
                {!isEmp && <NavLink to={employeesRoute} className="wt-submenu-item">Staff Directory</NavLink>}
                {!isEmp && <NavLink to={skillsRoute} className="wt-submenu-item">Skills Matrix</NavLink>}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="wt-menu-group">
            <NavLink to="/profile" className={({ isActive }) => `wt-menu-header${isActive ? " active" : ""}`}>
              <span>Settings</span>
            </NavLink>
          </div>
        </nav>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="wt-main-wrapper">
        {/* Top Breadcrumb Header Bar */}
        <header className="wt-topbar">
          <div className="wt-page-title-section">
            <h1 className="wt-page-title">{pageTitle}</h1>
            <div className="wt-breadcrumb">
              <a href="#!">{breadcrumbText.split(" - ")[0]}</a> - {breadcrumbText.split(" - ")[1]} <HelpCircle size={13} style={{ verticalAlign: "middle", color: "#94a3b8", cursor: "pointer" }} />
            </div>
          </div>

          {/* Right User Profile / Logout */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: "#475569" }}>
              👤 <strong>{user.name}</strong> <span style={{ textTransform: "capitalize", color: "var(--wt-blue)", fontWeight: 700 }}>({user.role})</span>
            </span>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => { logout(); navigate("/login"); }}
              title="Sign out"
            >
              <LogOut size={12} /> Logout
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="wt-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
