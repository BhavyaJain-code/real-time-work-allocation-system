import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase, CheckCircle2, Users, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { FadeIn, StaggerContainer, StaggerItem, TextEffect } from "../components/motion/MotionPrimitives";

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
      navigate(user.role === "admin" ? "/admin/dashboard" : user.role === "manager" ? "/manager/dashboard" : "/employee/dashboard");
    } else {
      setError("Invalid credentials. Try any email with role demo.");
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
      {/* Left panel */}
      <motion.div
        className="auth-left"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="auth-left-brand">
          <motion.div
            className="auth-left-logo"
            whileHover={{ scale: 1.1, rotate: 6 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Briefcase size={20} color="#0d0a01" />
          </motion.div>
          <span className="auth-left-brand-name">WorkFlow</span>
        </div>

        <h2>
          <TextEffect text="Intelligent work allocation for modern teams." mode="word" delay={0.05} />
        </h2>
        <p>Assign the right tasks to the right people in real time — based on verified skills, availability, and capacity balance.</p>

        <div className="auth-features">
          <div className="auth-feature">
            <div className="auth-feature-icon" style={{ background: "rgba(245, 217, 130, 0.16)", borderColor: "rgba(245, 217, 130, 0.35)", color: "#f5d982" }}>
              <CheckCircle2 size={18} />
            </div>
            <div className="auth-feature-text">Skill-based automated heuristic matching algorithm</div>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon" style={{ background: "rgba(77, 92, 248, 0.22)", borderColor: "rgba(77, 92, 248, 0.45)", color: "#7d8bff" }}>
              <Users size={18} />
            </div>
            <div className="auth-feature-text">Multi-role hierarchy: Executive Admin, Dept Managers & Employees</div>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon" style={{ background: "rgba(238, 39, 215, 0.20)", borderColor: "rgba(238, 39, 215, 0.45)", color: "#ee27d7" }}>
              <BarChart3 size={18} />
            </div>
            <div className="auth-feature-text">Live telemetry, capacity charts & performance auditing</div>
          </div>
        </div>
      </motion.div>

      {/* Right panel */}
      <motion.div
        className="auth-right"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="auth-right-inner">
          <h1>Sign in</h1>
          <p>Access your workspace portal</p>

          {/* Quick role shortcuts */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
              Fast Demo Access
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => demoLogin("admin")}
                style={{ borderColor: "rgba(245, 217, 130, 0.35)", color: "#f5d982" }}
              >
                👑 Admin
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => demoLogin("manager")}
                style={{ borderColor: "rgba(238, 39, 215, 0.4)", color: "#ee27d7" }}
              >
                👔 Manager
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => demoLogin("employee")}
                style={{ borderColor: "rgba(77, 92, 248, 0.4)", color: "#7d8bff" }}
              >
                💻 Employee
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "rgba(238, 39, 215, 0.2)", border: "1px solid rgba(238, 39, 215, 0.5)", color: "#ff78ef", fontSize: 13 }}>
                {error}
              </div>
            )}

            <div className="auth-input-group">
              <label>Role</label>
              <div className="auth-input-wrap">
                <select value={role} onChange={e => setRole(e.target.value)}>
                  <option value="admin">Administrator (Executive view)</option>
                  <option value="manager">Department Manager</option>
                  <option value="employee">Employee (Personal view)</option>
                </select>
              </div>
            </div>

            <div className="auth-input-group">
              <label>Email Address</label>
              <div className="auth-input-wrap">
                <Mail size={16} />
                <input
                  type="email"
                  placeholder="name@workflow.io"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <div className="auth-input-wrap">
                <Lock size={16} />
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
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} color="#ee27d7" />}
                </button>
              </div>
            </div>

            <div className="auth-options">
              <label className="auth-remember">
                <input type="checkbox" defaultChecked />
                <span>Keep me signed in</span>
              </label>
              <a href="#" className="auth-forgot">Forgot?</a>
            </div>

            <motion.button
              type="submit"
              className="auth-submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign In <ArrowRight size={16} />
            </motion.button>
          </form>

          <div className="auth-switch">
            Don't have an account?
            <Link to="/register">Create one</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}