import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState("admin");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const user = login(email || "bhavya@workflow.io", password || "admin123", role);
    if (user) {
      navigate(user.role === "admin" ? "/admin/dashboard" : user.role === "manager" ? "/manager/dashboard" : "/employee/dashboard");
    } else {
      setError("Invalid credentials. Please check your role or email.");
    }
  };

  const demoLogin = (demoRole) => {
    const user = login("", "", demoRole);
    if (user) {
      navigate(user.role === "admin" ? "/admin/dashboard" : user.role === "manager" ? "/manager/dashboard" : "/employee/dashboard");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-right">
        <div className="auth-right-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, background: "#0d6efd", color: "#fff", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
              WA
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 18 }}>Work Allocation System</h1>
              <div style={{ fontSize: 12, color: "#6c757d" }}>DBMS Mini Project</div>
            </div>
          </div>

          <p style={{ marginBottom: 16 }}>Sign in to continue to your dashboard</p>

          {/* Quick role shortcuts */}
          <div style={{ marginBottom: 16, background: "#f8f9fa", padding: 10, borderRadius: 4, border: "1px solid #dee2e6" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#6c757d", textTransform: "uppercase", marginBottom: 6 }}>
              Quick Demo Login:
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => demoLogin("admin")}
              >
                Admin
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => demoLogin("manager")}
              >
                Manager
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => demoLogin("employee")}
              >
                Employee
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div style={{ padding: "8px 12px", borderRadius: 4, background: "#f8d7da", border: "1px solid #f5c2c7", color: "#842029", fontSize: 13 }}>
                {error}
              </div>
            )}

            <div className="auth-input-group">
              <label>Select Role</label>
              <div className="auth-input-wrap">
                <select value={role} onChange={e => setRole(e.target.value)}>
                  <option value="admin">Administrator</option>
                  <option value="manager">Department Manager</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
            </div>

            <div className="auth-input-group">
              <label>Email Address</label>
              <div className="auth-input-wrap">
                <Mail size={15} color="#6c757d" />
                <input
                  type="email"
                  placeholder="e.g. bhavya@workflow.io"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <div className="auth-input-wrap">
                <Lock size={15} color="#6c757d" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="pass-toggle"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="auth-options">
              <label style={{ display: "flex", alignItems: "center", gap: 6, color: "#495057" }}>
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              className="auth-submit"
            >
              Sign In <ArrowRight size={15} />
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account?
            <Link to="/register">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}