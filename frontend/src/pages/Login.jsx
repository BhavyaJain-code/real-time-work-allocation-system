import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    const user = login(email.trim(), password, role);
    if (user) {
      navigate(user.role === "admin" ? "/admin/dashboard" : user.role === "manager" ? "/manager/dashboard" : "/employee/dashboard");
    } else {
      setError("Invalid credentials. Please verify your email and role.");
    }
  };

  const setDemoCredentials = (demoRole, demoEmail, demoPass) => {
    setRole(demoRole);
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#eef1f5", padding: "20px 16px" }}>
      <div style={{ maxWidth: 460, width: "100%", backgroundColor: "#ffffff", borderRadius: 8, border: "1px solid #d1d5db", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        
        {/* Brand Header */}
        <div style={{ backgroundColor: "#414954", padding: "20px 24px", color: "#ffffff", display: "flex", alignItems: "center", gap: 12 }}>
          <div className="wt-clock-icon">
            <div className="q1" />
            <div className="q2" />
            <div className="q3" />
            <div className="q4" />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "0.5px" }}>
              WORKTIME<sup>®</sup>
            </div>
            <div style={{ fontSize: 11, color: "#cbd5e1" }}>
              Real-Time Work Allocation &amp; Monitoring
            </div>
          </div>
        </div>

        <div style={{ padding: "24px 28px 32px" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: "0 0 6px" }}>Sign In to Account</h2>
          <p style={{ fontSize: 12.5, color: "#64748b", margin: "0 0 18px" }}>
            Enter your credentials to access the monitoring dashboard.
          </p>

          {/* Quick Demo Credential Buttons */}
          <div style={{ marginBottom: 18, background: "#f8fafc", padding: "10px 12px", borderRadius: 4, border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", marginBottom: 6 }}>
              Quick Demo Accounts:
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setDemoCredentials("admin", "alex@workflow.io", "admin123")}
              >
                Admin
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setDemoCredentials("manager", "ravi@workflow.io", "mgr123")}
              >
                Manager
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setDemoCredentials("employee", "priya@workflow.io", "emp123")}
              >
                Employee
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {error && (
              <div style={{ padding: "8px 12px", borderRadius: 4, background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <AlertCircle size={15} color="#dc2626" />
                <span>{error}</span>
              </div>
            )}

            {/* Role Selector */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                Select Role
              </label>
              <select 
                className="form-control" 
                style={{ width: "100%", padding: "8px 10px" }}
                value={role} 
                onChange={e => setRole(e.target.value)}
              >
                <option value="admin">Administrator</option>
                <option value="manager">Department Manager</option>
                <option value="employee">Employee</option>
              </select>
            </div>

            {/* Email Address */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  className="form-control"
                  style={{ width: "100%", padding: "8px 10px 8px 34px" }}
                  placeholder="e.g. alex@workflow.io"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <Mail size={15} style={{ position: "absolute", left: 10, top: 11, color: "#94a3b8" }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  className="form-control"
                  style={{ width: "100%", padding: "8px 34px 8px 34px" }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <Lock size={15} style={{ position: "absolute", left: 10, top: 11, color: "#94a3b8" }} />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: 10, top: 9, background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", padding: "9px 14px", justifyContent: "center", fontSize: 13, marginTop: 4 }}
            >
              Sign In to WorkTime <ArrowRight size={15} />
            </button>
          </form>

          <div style={{ marginTop: 18, textAlign: "center", fontSize: 12, color: "#64748b" }}>
            Don&apos;t have an account?{" "}
            <Link to="/register" style={{ color: "#2563eb", fontWeight: 600 }}>
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
