import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { USERS, EMPLOYEES } from "../data/mockData";

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
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedConfirm, setTouchedConfirm] = useState(false);

  // Email format validation
  const isEmailValid = useMemo(() => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }, [email]);

  // Password strength calculation
  const passStrength = useMemo(() => {
    if (!password) return { label: "None", width: "0%" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { label: "Weak", width: "25%" };
    if (score === 2) return { label: "Fair", width: "50%" };
    if (score === 3) return { label: "Good", width: "75%" };
    return { label: "Strong", width: "100%" };
  }, [password]);

  const passwordsMatch = useMemo(() => {
    if (!confirmPass) return false;
    return password === confirmPass;
  }, [password, confirmPass]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setTouchedEmail(true);
    setTouchedConfirm(true);

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim() || !isEmailValid) {
      setError("Please provide a valid email address (e.g. name@company.com).");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }

    const newUserId = USERS.length + 1;
    USERS.push({
      id: newUserId,
      name: name.trim(),
      email: email.trim(),
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

    setSuccess("Account registered successfully! Redirecting to login...");
    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-page)", padding: "20px" }}>
      <div style={{ maxWidth: 440, width: "100%", border: "2px solid var(--border-dark)", backgroundColor: "var(--bg-surface)", padding: "24px" }}>
        
        <div style={{ textAlign: "center", borderBottom: "2px solid #000000", paddingBottom: 12, marginBottom: 16 }}>
          <h1 style={{ fontSize: 20, fontWeight: "bold", margin: 0, textTransform: "uppercase" }}>
            Work Allocation System
          </h1>
          <div style={{ fontSize: 12, color: "#444444", marginTop: 4 }}>
            Account Registration
          </div>
        </div>

        {error && (
          <div style={{ border: "1px solid #000000", padding: "6px 10px", marginBottom: 12, fontSize: 12, fontWeight: "bold" }}>
            Error: {error}
          </div>
        )}

        {success && (
          <div style={{ border: "1px solid #000000", padding: "6px 10px", marginBottom: 12, fontSize: 12, fontWeight: "bold" }}>
            Success: {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>
              Full Name:
            </label>
            <input
              type="text"
              className="form-control"
              style={{ width: "100%" }}
              placeholder="e.g. John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <label style={{ fontSize: 13, fontWeight: "bold" }}>
                Work Email Address:
              </label>
              {touchedEmail && email && (
                <span style={{ fontSize: 11, fontWeight: "bold" }}>
                  [{isEmailValid ? "Valid Email" : "Invalid Email"}]
                </span>
              )}
            </div>
            <input
              type="email"
              className="form-control"
              style={{ width: "100%" }}
              placeholder="e.g. jdoe@company.com"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (!touchedEmail) setTouchedEmail(true);
              }}
              onBlur={() => setTouchedEmail(true)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>
                Role:
              </label>
              <select className="form-control" style={{ width: "100%" }} value={role} onChange={e => setRole(e.target.value)}>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>
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
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <label style={{ fontSize: 13, fontWeight: "bold" }}>
                Create Password:
              </label>
              {password && (
                <span style={{ fontSize: 11, fontWeight: "bold" }}>
                  [Strength: {passStrength.label}]
                </span>
              )}
            </div>
            <input
              type="password"
              className="form-control"
              style={{ width: "100%" }}
              placeholder="Minimum 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {password && (
              <div style={{ marginTop: 4 }}>
                <div className="progress-bar" style={{ height: 6 }}>
                  <div className="progress-fill" style={{ width: passStrength.width }} />
                </div>
              </div>
            )}
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <label style={{ fontSize: 13, fontWeight: "bold" }}>
                Confirm Password:
              </label>
              {touchedConfirm && confirmPass && (
                <span style={{ fontSize: 11, fontWeight: "bold" }}>
                  [{passwordsMatch ? "Passwords Match" : "Do Not Match"}]
                </span>
              )}
            </div>
            <input
              type="password"
              className="form-control"
              style={{ width: "100%" }}
              placeholder="Re-enter password"
              value={confirmPass}
              onChange={e => {
                setConfirmPass(e.target.value);
                if (!touchedConfirm) setTouchedConfirm(true);
              }}
              onBlur={() => setTouchedConfirm(true)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "8px", marginTop: 4 }}
          >
            Complete Registration
          </button>
        </form>

        <div style={{ marginTop: 14, textAlign: "center", fontSize: 12 }}>
          Already registered? <Link to="/login" style={{ fontWeight: "bold" }}>Sign in here</Link>
        </div>
      </div>
    </div>
  );
}
