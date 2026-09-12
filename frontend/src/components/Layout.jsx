import { Outlet, Navigate, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, UserCheck } from "lucide-react";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="was-container">
      {/* Top Navbar */}
      <header className="was-navbar">
        <div className="was-nav-logo" onClick={() => navigate(user.role === "admin" ? "/admin/dashboard" : user.role === "manager" ? "/manager/dashboard" : "/employee/dashboard")} style={{ cursor: "pointer" }}>
          <span>🏢</span> Work Allocation System
        </div>

        <nav className="was-nav-links">
          <NavLink to={user.role === "admin" ? "/admin/dashboard" : user.role === "manager" ? "/manager/dashboard" : "/employee/dashboard"} className={({ isActive }) => `was-nav-link${isActive ? " active" : ""}`}>
            Dashboard & Features
          </NavLink>
          <NavLink to={user.role === "admin" ? "/admin/tasks" : user.role === "manager" ? "/manager/tasks" : "/employee/tasks"} className={({ isActive }) => `was-nav-link${isActive ? " active" : ""}`}>
            Tasks
          </NavLink>
          <NavLink to={user.role === "admin" ? "/admin/assignments" : user.role === "manager" ? "/manager/assignments" : "/employee/availability"} className={({ isActive }) => `was-nav-link${isActive ? " active" : ""}`}>
            {user.role === "employee" ? "Availability" : "Staff Allocation"}
          </NavLink>
          {user.role === "admin" && (
            <NavLink to="/admin/employees" className={({ isActive }) => `was-nav-link${isActive ? " active" : ""}`}>
              Staff Directory
            </NavLink>
          )}
          {user.role === "admin" && (
            <NavLink to="/admin/analytics" className={({ isActive }) => `was-nav-link${isActive ? " active" : ""}`}>
              Workload Reports
            </NavLink>
          )}
          <NavLink to="/profile" className={({ isActive }) => `was-nav-link${isActive ? " active" : ""}`}>
            Profile
          </NavLink>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="was-nav-user">
            <span>👤</span> {user.name} ({user.role})
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { logout(); navigate("/login"); }}
            title="Sign out"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="was-footer">
        Work Allocation System · Resource Management Software © {new Date().getFullYear()} · All Rights Reserved
      </footer>
    </div>
  );
}
