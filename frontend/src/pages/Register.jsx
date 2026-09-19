import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { USERS, EMPLOYEES, validatePasswordSecurity } from "../data/mockData";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [role, setRole] = useState("employee");
  const [department, setDepartment] = useState("Engineering");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showWeakModal, setShowWeakModal] = useState(false);

  // Email format validation
  const isEmailValid = useMemo(() => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }, [email]);

  // Password strength calculation
  const passSecurity = useMemo(() => {
    return validatePasswordSecurity(password);
  }, [password]);

  const passwordsMatch = useMemo(() => {
    if (!confirmPass) return false;
    return password === confirmPass;
  }, [password, confirmPass]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim() || !isEmailValid) {
      setError("Please provide a valid email address (e.g. name@company.com).");
      return;
    }

    // Check password security
    if (!passSecurity.isStrong) {
      setShowWeakModal(true);
      setError("Weak Password: You must set a strong password meeting all security requirements.");
      return;
    }

    if (password !== confirmPass) {
      setError("Passwords do not match. Please verify your confirmation.");
      return;
    }

    // Check if email already registered
    const existing = USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      setError("An account with this email address already exists. Please sign in instead.");
      return;
    }

    const newUserId = USERS.length + 1;
    USERS.push({
      id: newUserId,
      name: name.trim(),
      email: email.trim(),
      password: password,
      role: role,
      is_active: true,
      created_at: new Date().toISOString().split("T")[0],
    });

    if (role === "employee") {
      EMPLOYEES.push({
        id: EMPLOYEES.length + 1,
        user_id: newUserId,
        department: department,
        position: "Junior Associate",
        availability_status: "available",
        workload_percentage: 0,
        max_workload: 100,
        remote_status: "active",
        active_time: "0h 00m",
        idle_time: "0m",
        productivity_score: 90,
        current_activity: "Onboarding & Setup",
        login_time: "09:00 AM",
        burnout_risk: "Low"
      });
    }

    setSuccess("Account registered successfully with strong credentials! Redirecting to sign in...");
    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--background)",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: 460,
          width: "100%",
          border: "2px solid var(--border)",
          backgroundColor: "#ffffff",
          padding: "26px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            borderBottom: "2px solid var(--header)",
            paddingBottom: 12,
            marginBottom: 16,
          }}
        >
          <h1
            style={{
              fontSize: 20,
              fontWeight: "bold",
              margin: 0,
              textTransform: "uppercase",
              color: "var(--text)",
            }}
          >
            Work Allocation System
          </h1>
          <div style={{ fontSize: 13, color: "var(--footer)", marginTop: 4 }}>
            New User Registration Portal
          </div>
        </div>

        {error && (
          <div
            style={{
              border: "1px solid #c0392b",
              backgroundColor: "#fdf2f2",
              color: "#c0392b",
              padding: "8px 12px",
              marginBottom: 14,
              fontSize: 13,
              fontWeight: "bold",
            }}
          >
            Registration Error: {error}
          </div>
        )}

        {success && (
          <div
            style={{
              border: "1px solid var(--header)",
              backgroundColor: "var(--body)",
              color: "var(--footer)",
              padding: "8px 12px",
              marginBottom: 14,
              fontSize: 13,
              fontWeight: "bold",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 3 }}>
              Full Name:
            </label>
            <input
              type="text"
              className="form-control"
              style={{ width: "100%" }}
              placeholder="e.g. Eleanor Vance"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 3 }}>
              Work Email Address:
            </label>
            <input
              type="email"
              className="form-control"
              style={{ width: "100%" }}
              placeholder="e.g. evance@workflow.io"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 3 }}>
                Role:
              </label>
              <select className="form-control" style={{ width: "100%" }} value={role} onChange={e => setRole(e.target.value)}>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 3 }}>
                Department:
              </label>
              <select className="form-control" style={{ width: "100%" }} value={department} onChange={e => setDepartment(e.target.value)}>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Data">Data</option>
              </select>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
              <label style={{ fontSize: 13, fontWeight: "bold" }}>
                Create Password:
              </label>
              {password && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    color: passSecurity.isStrong
                      ? "var(--footer)"
                      : passSecurity.strength === "Moderate"
                      ? "#d35400"
                      : "#c0392b",
                  }}
                >
                  Strength: {passSecurity.strength}
                </span>
              )}
            </div>
            <input
              type="password"
              className="form-control"
              style={{ width: "100%" }}
              placeholder="Min 8 chars, 1 number, 1 special char"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {password && (
              <div style={{ height: 4, width: "100%", backgroundColor: "var(--border)", marginTop: 5 }}>
                <div
                  style={{
                    height: "100%",
                    width: passSecurity.isStrong ? "100%" : passSecurity.strength === "Moderate" ? "60%" : "25%",
                    backgroundColor: passSecurity.isStrong ? "var(--header)" : passSecurity.strength === "Moderate" ? "#e67e22" : "#e74c3c",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
              <label style={{ fontSize: 13, fontWeight: "bold" }}>
                Confirm Password:
              </label>
              {confirmPass && (
                <span style={{ fontSize: 12, fontWeight: "bold", color: passwordsMatch ? "var(--footer)" : "#c0392b" }}>
                  {passwordsMatch ? "✓ Passwords Match" : "✕ Do Not Match"}
                </span>
              )}
            </div>
            <input
              type="password"
              className="form-control"
              style={{ width: "100%" }}
              placeholder="Re-enter password"
              value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)}
              required
            />
          </div>

          {/* Password Security Rules Box */}
          <div style={{ border: "1px solid var(--border)", backgroundColor: "var(--body)", padding: "8px 12px", fontSize: 11 }}>
            <div style={{ fontWeight: "bold", marginBottom: 3 }}>Security Requirements:</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
              <span style={{ color: passSecurity.checks.minLength ? "var(--footer)" : "#666", fontWeight: passSecurity.checks.minLength ? "bold" : "normal" }}>
                {passSecurity.checks.minLength ? "✓" : "○"} Min 8 characters
              </span>
              <span style={{ color: (passSecurity.checks.hasUpper && passSecurity.checks.hasLower) ? "var(--footer)" : "#666", fontWeight: (passSecurity.checks.hasUpper && passSecurity.checks.hasLower) ? "bold" : "normal" }}>
                {(passSecurity.checks.hasUpper && passSecurity.checks.hasLower) ? "✓" : "○"} Mixed Case (A-z)
              </span>
              <span style={{ color: passSecurity.checks.hasNumber ? "var(--footer)" : "#666", fontWeight: passSecurity.checks.hasNumber ? "bold" : "normal" }}>
                {passSecurity.checks.hasNumber ? "✓" : "○"} Number (0-9)
              </span>
              <span style={{ color: passSecurity.checks.hasSpecial ? "var(--footer)" : "#666", fontWeight: passSecurity.checks.hasSpecial ? "bold" : "normal" }}>
                {passSecurity.checks.hasSpecial ? "✓" : "○"} Special Char (!@#$)
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "9px", marginTop: 4, fontSize: 14 }}
          >
            Complete Registration
          </button>
        </form>

        <div style={{ marginTop: 16, textAlign: "center", fontSize: 13 }}>
          Already registered?{" "}
          <Link to="/login" style={{ fontWeight: "bold", color: "var(--footer)" }}>
            Sign in here
          </Link>
        </div>
      </div>

      {/* WEAK PASSWORD POP-UP MODAL */}
      {showWeakModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            zIndex: 9999,
          }}
        >
          <div
            style={{
              maxWidth: 460,
              width: "100%",
              backgroundColor: "#ffffff",
              border: "2px solid #c0392b",
              padding: "24px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ fontSize: 17, fontWeight: "bold", color: "#c0392b", margin: 0, borderBottom: "2px solid #c0392b", paddingBottom: 8, marginBottom: 12 }}>
              Weak Password &mdash; Set New Strong Password
            </h2>
            <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 14 }}>
              Your password does not satisfy the enterprise security criteria. Please choose a password with:
              <ul style={{ paddingLeft: 20, marginTop: 6 }}>
                <li><strong>Minimum 8 characters</strong> in length</li>
                <li>At least <strong>1 number</strong> (0-9)</li>
                <li>At least <strong>1 special character</strong> (!@#$%^&amp;*)</li>
                <li>Both <strong>uppercase and lowercase</strong> letters</li>
              </ul>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: "100%", padding: "8px" }}
              onClick={() => setShowWeakModal(false)}
            >
              I Understand, Update My Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
