import { useState } from "react";
import { Outlet, Navigate, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
  const monitoringRoute = isAdmin ? "/admin/monitoring" : isMgr ? "/manager/monitoring" : "/employee/monitoring";
  const tasksRoute = isAdmin ? "/admin/tasks" : isMgr ? "/manager/tasks" : "/employee/tasks";
  const assignmentsRoute = isAdmin ? "/admin/assignments" : isMgr ? "/manager/assignments" : "/employee/availability";
  const progressRoute = isAdmin ? "/admin/progress" : isMgr ? "/manager/progress" : "/employee/progress";
  const employeesRoute = isAdmin ? "/admin/employees" : isMgr ? "/manager/employees" : "/profile";
  const analyticsRoute = isAdmin ? "/admin/analytics" : isMgr ? "/manager/analytics" : "/employee/dashboard";
  const skillsRoute = isAdmin ? "/admin/skills" : isMgr ? "/manager/skills" : "/profile";
  const logRoute = isAdmin ? "/admin/log" : isMgr ? "/manager/log" : "/employee/notifications";
  const feedbackRoute = isAdmin ? "/admin/feedback" : isMgr ? "/manager/feedback" : "/employee/feedback";

  // Determine current active page label for breadcrumb
  let pageTitle = "Dashboard";
  let breadcrumbText = "Work Allocation System";

  if (location.pathname.includes("/monitoring")) {
    pageTitle = "Active / Idle Monitoring";
    breadcrumbText = "Activity & Performance Telemetry";
  } else if (location.pathname.includes("/dashboard")) {
    pageTitle = "Dashboard";
    breadcrumbText = user.role.toUpperCase() + " Overview - " + user.name;
  } else if (location.pathname.includes("/tasks")) {
    pageTitle = "Task Allocation";
    breadcrumbText = "Deliverables & Workload Queue";
  } else if (location.pathname.includes("/assignments") || location.pathname.includes("/availability")) {
    pageTitle = isEmp ? "My Availability" : "Staff Allocation";
    breadcrumbText = isEmp ? "Working Schedule" : "Resource Matrix";
  } else if (location.pathname.includes("/employees")) {
    pageTitle = "Staff Directory";
    breadcrumbText = "Employee Registry";
  } else if (location.pathname.includes("/analytics")) {
    pageTitle = "Workload & Analytics";
    breadcrumbText = "Performance Reports";
  } else if (location.pathname.includes("/progress")) {
    pageTitle = "Performance Progress Report";
    breadcrumbText = "Appraisal Document";
  } else if (location.pathname.includes("/feedback")) {
    pageTitle = "Performance Feedback";
    breadcrumbText = "Evaluation & Appraisal Notes";
  } else if (location.pathname.includes("/profile")) {
    pageTitle = "User Profile";
    breadcrumbText = "Account Settings";
  }

  return (
    <div className="wt-app-shell">
      {/* SIDEBAR */}
      <aside className="wt-sidebar">
        {/* Simple Text Header (No Logos or Images) */}
        <div className="wt-logo-box" onClick={() => navigate(dashboardRoute)}>
          <div className="wt-logo-text">
            Work Allocation System
          </div>
          <div style={{ fontSize: 11, color: "#444444", marginTop: 2 }}>
            Management Portal
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="wt-nav-menu">
          {/* Dashboard */}
          <div className="wt-menu-group">
            <NavLink
              to={dashboardRoute}
              className={({ isActive }) => "wt-menu-header" + (isActive ? " active" : "")}
            >
              <span>Dashboard</span>
            </NavLink>
          </div>

          {/* What's now / Telemetry */}
          <div className="wt-menu-group">
            <NavLink
              to={monitoringRoute}
              className={({ isActive }) => "wt-menu-header" + (isActive ? " active" : "")}
            >
              <span>Live Telemetry</span>
            </NavLink>
          </div>

          {/* Progress */}
          <div className="wt-menu-group">
            <NavLink
              to={progressRoute}
              className={({ isActive }) => "wt-menu-header" + (isActive ? " active" : "")}
            >
              <span>Progress Reports</span>
            </NavLink>
          </div>

          {/* Feedback */}
          <div className="wt-menu-group">
            <NavLink
              to={feedbackRoute}
              className={({ isActive }) => "wt-menu-header" + (isActive ? " active" : "")}
            >
              <span>Feedback</span>
            </NavLink>
          </div>

          {/* Work Allocation & Tasks */}
          <div className="wt-menu-group" style={{ marginTop: 10, borderTop: "1px solid var(--border)", paddingTop: 6 }}>
            <div className="wt-menu-header" onClick={() => toggleSection("tasks")}>
              <span>Work Allocation </span>
            </div>
            {expandedSections.tasks && (
              <div className="wt-submenu">
                <NavLink to={tasksRoute} className="wt-submenu-item">{isEmp ? "My Tasks" : "Task Queue"}</NavLink>
                {isAdmin && <NavLink to="/admin/tasks/create" className="wt-submenu-item">Create Task</NavLink>}
                <NavLink to={assignmentsRoute} className="wt-submenu-item">{isEmp ? "My Availability" : "Staff Allocation"}</NavLink>
                {!isEmp && <NavLink to={employeesRoute} className="wt-submenu-item">Staff Directory</NavLink>}
                {!isEmp && <NavLink to={skillsRoute} className="wt-submenu-item">Skills Matrix</NavLink>}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="wt-menu-group" style={{ marginTop: 10, borderTop: "1px solid var(--border)", paddingTop: 6 }}>
            <NavLink to="/profile" className={({ isActive }) => "wt-menu-header" + (isActive ? " active" : "")}>
              <span>User Profile / Settings</span>
            </NavLink>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="wt-main-wrapper">
        {/* Top Header Bar */}
        <header className="wt-topbar">
          <div className="wt-page-title-section">
            <h1 className="wt-page-title">{pageTitle}</h1>
          </div>

          {/* User Profile & Logout */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#000000" }}>
              User: <strong>{user.name}</strong> ({user.role})
            </span>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => { logout(); navigate("/login"); }}
              title="Sign out"
            >
              Logout
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
