import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
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
      setError("Invalid login credentials for the selected role.");
    }
  };

  const setDemoCredentials = (demoRole, demoEmail, demoPass) => {
    setRole(demoRole);
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#ffffff", padding: "20px" }}>
      <div style={{ maxWidth: 420, width: "100%", border: "2px solid #000000", padding: "24px" }}>
        
        <div style={{ textAlign: "center", borderBottom: "2px solid #000000", paddingBottom: 12, marginBottom: 16 }}>
          <h1 style={{ fontSize: 20, fontWeight: "bold", margin: 0, textTransform: "uppercase" }}>
            Work Allocation System
          </h1>
          <div style={{ fontSize: 12, color: "#444444", marginTop: 4 }}>
            Sign In Portal
          </div>
        </div>

        {/* Demo Buttons */}
        <div style={{ border: "1px solid #000000", padding: "8px 10px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: "bold", marginBottom: 4 }}>
            Quick Demo Sign-In:
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setDemoCredentials("admin", "alex@workflow.io", "admin123")}
            >
              Admin
            </button>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setDemoCredentials("manager", "ravi@workflow.io", "mgr123")}
            >
              Manager
            </button>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setDemoCredentials("employee", "priya@workflow.io", "emp123")}
            >
              Employee
            </button>
          </div>
        </div>

        {error && (
          <div style={{ border: "1px solid #000000", padding: "6px 10px", marginBottom: 12, fontSize: 12, fontWeight: "bold" }}>
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>
              Select Role:
            </label>
            <select 
              className="form-control" 
              style={{ width: "100%" }}
              value={role} 
              onChange={e => setRole(e.target.value)}
            >
              <option value="admin">Administrator</option>
              <option value="manager">Department Manager</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>
              Email Address:
            </label>
            <input
              type="email"
              className="form-control"
              style={{ width: "100%" }}
              placeholder="e.g. alex@workflow.io"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>
              Password:
            </label>
            <input
              type="password"
              className="form-control"
              style={{ width: "100%" }}
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "8px", marginTop: 4 }}
          >
            Sign In
          </button>
        </form>

        <div style={{ marginTop: 14, textAlign: "center", fontSize: 12 }}>
          Do not have an account? <Link to="/register" style={{ fontWeight: "bold" }}>Register here</Link>
        </div>
      </div>
    </div>
  );
}
