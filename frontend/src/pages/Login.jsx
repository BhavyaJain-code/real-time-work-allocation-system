import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase, CheckCircle2, Users, BarChart3 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]       = useState("admin");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const user = login(email || "demo@workflow.io", password || "demo", role);
    if (user) {
      navigate(user.role === "admin" ? "/admin/dashboard" : "/employee/dashboard");
    } else {
      setError("Invalid credentials. Try any email with role demo.");
    }
  };

  // Demo shortcuts
  const demoLogin = (demoRole) => {
    const user = login("", "", demoRole);
    if (user) navigate(user.role === "admin" ? "/admin/dashboard" : "/employee/dashboard");
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left-brand">
          <div className="auth-left-logo"><Briefcase size={20} /></div>
          <span className="auth-left-brand-name">WorkFlow</span>
        </div>

        <h2>Intelligent work allocation for modern teams.</h2>
        <p>Assign the right tasks to the right people, in real time — based on skills, availability, and workload.</p>

        <div className="auth-features">
          {[
            { icon: <CheckCircle2 size={15} />, text: "Skill-based smart task assignment" },
            { icon: <Users size={15} />,        text: "Real-time employee availability tracking" },
            { icon: <BarChart3 size={15} />,    text: "Live analytics & workload insights" },
          ].map((f, i) => (
            <div className="auth-feature" key={i}>
              <div className="auth-feature-icon">{f.icon}</div>
              <span className="auth-feature-text">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-right-inner">
          <h1>Welcome back</h1>
          <p>Sign in to continue to your workspace.</p>

          {error && (
            <div style={{ padding: "10px 14px", background: "var(--red-lt)", color: "#991b1b", borderRadius: "var(--radius)", fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label>Email address</label>
              <div className="auth-input-wrap">
                <Mail size={16} />
                <input type="email" placeholder="you@workflow.io" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <div className="auth-input-wrap">
                <Lock size={16} />
                <input type={showPass ? "text" : "password"} placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="auth-input-group">
              <label>Sign in as</label>
              <div className="auth-input-wrap">
                <select value={role} onChange={e => setRole(e.target.value)}>
                  <option value="admin">Admin / Manager</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
            </div>

            <div className="auth-options">
              <label className="auth-remember">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="auth-forgot">Forgot password?</a>
            </div>

            <button type="submit" className="auth-submit">
              Sign in <ArrowRight size={17} />
            </button>
          </form>

          {/* Demo shortcuts */}
          <div style={{ marginTop: 20, padding: "14px", background: "var(--surface-2)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Demo Quick Access</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => demoLogin("admin")}>Admin Demo</button>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => demoLogin("employee")}>Employee Demo</button>
            </div>
          </div>

          <div className="auth-switch">
            Don't have an account? <Link to="/register">Create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}