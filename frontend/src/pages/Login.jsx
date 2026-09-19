import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validatePasswordSecurity, updateUserPassword, USERS } from "../data/mockData";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");

  // Weak password modal state
  const [showWeakModal, setShowWeakModal] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [modalError, setModalError] = useState("");

  // Live Password Strength Calculation for Login field
  const loginPassStrength = useMemo(() => {
    return validatePasswordSecurity(password);
  }, [password]);

  // Live Password Strength Calculation for Modal Set New Password field
  const newPassStrength = useMemo(() => {
    return validatePasswordSecurity(newPassword);
  }, [newPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    // 1. Strict Authentication Check
    const result = login(email.trim(), password, role);
    if (!result.success) {
      setError(result.error || "Invalid Login ID or Password.");
      return;
    }

    const authenticatedUser = result.user;

    // 2. Check if password is weak according to security policy (min 8 chars, number, special char)
    const sec = validatePasswordSecurity(password);
    if (!sec.isStrong) {
      // Trigger Weak Password Pop-up
      setPendingUser(authenticatedUser);
      setShowWeakModal(true);
      return;
    }

    // Redirect to role dashboard if strong and valid
    navigate(
      authenticatedUser.role === "admin"
        ? "/admin/dashboard"
        : authenticatedUser.role === "manager"
        ? "/manager/dashboard"
        : "/employee/dashboard"
    );
  };

  const handleSaveStrongPassword = (e) => {
    e.preventDefault();
    setModalError("");

    if (!newPassStrength.isStrong) {
      setModalError(
        "Weak Password: Password must be at least 8 characters long and include numbers, uppercase, lowercase, and special characters."
      );
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setModalError("Passwords do not match. Please verify your confirmation.");
      return;
    }

    if (pendingUser) {
      updateUserPassword(pendingUser.id, newPassword);
      setShowWeakModal(false);
      navigate(
        pendingUser.role === "admin"
          ? "/admin/dashboard"
          : pendingUser.role === "manager"
          ? "/manager/dashboard"
          : "/employee/dashboard"
      );
    }
  };

  const setDemoCredentials = (demoRole, demoEmail, demoPass) => {
    setRole(demoRole);
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
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
          maxWidth: 440,
          width: "100%",
          border: "2px solid var(--border)",
          backgroundColor: "#ffffff",
          padding: "26px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {/* Title Banner */}
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
            Secure Enterprise Sign-In Portal
          </div>
        </div>

        {/* Demo Buttons */}
        <div
          style={{
            border: "1px solid var(--border)",
            backgroundColor: "var(--body)",
            padding: "10px 12px",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: "bold",
              marginBottom: 6,
              color: "var(--text)",
            }}
          >
            Quick Authorized Sign-In:
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 6,
            }}
          >
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() =>
                setDemoCredentials("admin", "alex@workflow.io", "Password@123")
              }
            >
              Admin
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() =>
                setDemoCredentials("manager", "ravi@workflow.io", "Password@123")
              }
            >
              Manager
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() =>
                setDemoCredentials("employee", "priya@workflow.io", "Password@123")
              }
            >
              Employee
            </button>
          </div>
        </div>

        {/* Error Alert */}
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
            Authentication Error: {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: "bold",
                marginBottom: 3,
              }}
            >
              Select Access Role:
            </label>
            <select
              className="form-control"
              style={{ width: "100%" }}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Administrator (Executive)</option>
              <option value="manager">Department Manager (Team Lead)</option>
              <option value="employee">Employee (Staff Member)</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: "bold",
                marginBottom: 3,
              }}
            >
              Registered Email (Login ID):
            </label>
            <input
              type="email"
              className="form-control"
              style={{ width: "100%" }}
              placeholder="e.g. alex@workflow.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 3,
              }}
            >
              <label style={{ fontSize: 13, fontWeight: "bold" }}>
                Password:
              </label>
              {password && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    color:
                      loginPassStrength.strength === "Strong"
                        ? "var(--footer)"
                        : loginPassStrength.strength === "Moderate"
                        ? "#d35400"
                        : "#c0392b",
                  }}
                >
                  Strength: {loginPassStrength.strength}
                </span>
              )}
            </div>
            <input
              type="password"
              className="form-control"
              style={{ width: "100%" }}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {password && (
              <div
                style={{
                  height: 4,
                  width: "100%",
                  backgroundColor: "var(--border)",
                  marginTop: 5,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width:
                      loginPassStrength.strength === "Strong"
                        ? "100%"
                        : loginPassStrength.strength === "Moderate"
                        ? "60%"
                        : "25%",
                    backgroundColor:
                      loginPassStrength.strength === "Strong"
                        ? "var(--header)"
                        : loginPassStrength.strength === "Moderate"
                        ? "#e67e22"
                        : "#e74c3c",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "9px", marginTop: 4, fontSize: 14 }}
          >
            Authenticate &amp; Sign In
          </button>
        </form>

        <div style={{ marginTop: 16, textAlign: "center", fontSize: 13 }}>
          Do not have an account?{" "}
          <Link to="/register" style={{ fontWeight: "bold", color: "var(--footer)" }}>
            Register New Account
          </Link>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* POP-UP MODAL: WEAK PASSWORD DETECTED — SET NEW STRONG PASSWORD */}
      {/* ───────────────────────────────────────────────────────── */}
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
              maxWidth: 480,
              width: "100%",
              backgroundColor: "#ffffff",
              border: "2px solid var(--header)",
              padding: "24px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                borderBottom: "2px solid #c0392b",
                paddingBottom: 10,
                marginBottom: 14,
              }}
            >
              <h2
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  color: "#c0392b",
                  margin: 0,
                }}
              >
                Weak Password Detected &mdash; Set New Strong Password
              </h2>
              <div style={{ fontSize: 12, color: "#444", marginTop: 4 }}>
                For organizational cybersecurity, you must update your password to a compliant strong password before entering the system.
              </div>
            </div>

            {modalError && (
              <div
                style={{
                  border: "1px solid #c0392b",
                  backgroundColor: "#fdf2f2",
                  color: "#c0392b",
                  padding: "8px 10px",
                  marginBottom: 12,
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                {modalError}
              </div>
            )}

            {/* Password Policy Guidelines */}
            <div
              style={{
                border: "1px solid var(--border)",
                backgroundColor: "var(--body)",
                padding: "10px 14px",
                marginBottom: 14,
                fontSize: 12,
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                Password Security Requirements:
              </div>
              <ul style={{ paddingLeft: 16, lineHeight: 1.5 }}>
                <li
                  style={{
                    color: newPassStrength.checks.minLength
                      ? "var(--footer)"
                      : "#666",
                    fontWeight: newPassStrength.checks.minLength
                      ? "bold"
                      : "normal",
                  }}
                >
                  {newPassStrength.checks.minLength ? "✓" : "○"} Minimum 8 characters
                </li>
                <li
                  style={{
                    color:
                      newPassStrength.checks.hasUpper &&
                      newPassStrength.checks.hasLower
                        ? "var(--footer)"
                        : "#666",
                    fontWeight:
                      newPassStrength.checks.hasUpper &&
                      newPassStrength.checks.hasLower
                        ? "bold"
                        : "normal",
                  }}
                >
                  {newPassStrength.checks.hasUpper &&
                  newPassStrength.checks.hasLower
                    ? "✓"
                    : "○"}{" "}
                  Uppercase (A-Z) and Lowercase (a-z) letters
                </li>
                <li
                  style={{
                    color: newPassStrength.checks.hasNumber
                      ? "var(--footer)"
                      : "#666",
                    fontWeight: newPassStrength.checks.hasNumber
                      ? "bold"
                      : "normal",
                  }}
                >
                  {newPassStrength.checks.hasNumber ? "✓" : "○"} At least 1 number (0-9)
                </li>
                <li
                  style={{
                    color: newPassStrength.checks.hasSpecial
                      ? "var(--footer)"
                      : "#666",
                    fontWeight: newPassStrength.checks.hasSpecial
                      ? "bold"
                      : "normal",
                  }}
                >
                  {newPassStrength.checks.hasSpecial ? "✓" : "○"} At least 1 special character (!@#$%^&amp;*...)
                </li>
              </ul>
            </div>

            <form
              onSubmit={handleSaveStrongPassword}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 2,
                  }}
                >
                  <label style={{ fontSize: 13, fontWeight: "bold" }}>
                    New Strong Password:
                  </label>
                  {newPassword && (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        color: newPassStrength.isStrong
                          ? "var(--footer)"
                          : "#c0392b",
                      }}
                    >
                      Status: {newPassStrength.strength}
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  className="form-control"
                  style={{ width: "100%" }}
                  placeholder="e.g. Secure@Work2026"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: "bold",
                    marginBottom: 2,
                  }}
                >
                  Confirm New Password:
                </label>
                <input
                  type="password"
                  className="form-control"
                  style={{ width: "100%" }}
                  placeholder="Re-enter new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, padding: "8px" }}
                >
                  Save Strong Password &amp; Enter
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowWeakModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
