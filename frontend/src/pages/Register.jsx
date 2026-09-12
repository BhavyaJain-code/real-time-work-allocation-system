import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { USERS, EMPLOYEES } from "../data/mockData";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [role, setRole] = useState("employee");
  const [department, setDepartment] = useState("Engineering");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedConfirm, setTouchedConfirm] = useState(false);

  // Email format validation regex
  const isEmailValid = useMemo(() => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }, [email]);

  // Password strength calculation
  const passStrength = useMemo(() => {
    if (!password) return { score: 0, label: "None", color: "#e2e8f0", width: "0%", tip: "Minimum 6 characters recommended" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: "Weak", color: "#ef4444", width: "25%", tip: "Weak: Add numbers, symbols, and uppercase letters" };
    if (score === 2) return { score: 2, label: "Fair", color: "#f59e0b", width: "50%", tip: "Fair: Mix uppercase, lowercase, and numbers" };
    if (score === 3) return { score: 3, label: "Good", color: "#2563eb", width: "75%", tip: "Good password! Make it 8+ chars for maximum security" };
    return { score: 4, label: "Strong", color: "#22c55e", width: "100%", tip: "Strong & secure password" };
  }, [password]);

  // Password match check
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

    if (!password) {
      setError("Please create a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }

    // Add new user to simulated user list
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

    setSuccess("Account successfully registered! Redirecting to login...");
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#eef1f5", padding: "24px 16px" }}>
      <div style={{ maxWidth: 480, width: "100%", backgroundColor: "#ffffff", borderRadius: 8, border: "1px solid #d1d5db", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        
        {/* WorkTime Brand Banner */}
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
              Create New Employee / Manager Account
            </div>
          </div>
        </div>

        <div style={{ padding: "24px 28px 32px" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: "0 0 6px" }}>Register Account</h2>
          <p style={{ fontSize: 12.5, color: "#64748b", margin: "0 0 18px" }}>
            Fill in your validated credentials to register with WorkTime.
          </p>

          {error && (
            <div style={{ padding: "8px 12px", borderRadius: 4, background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b", fontSize: 12, display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <AlertCircle size={15} color="#dc2626" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{ padding: "8px 12px", borderRadius: 4, background: "#dcfce7", border: "1px solid #86efac", color: "#166534", fontSize: 12, display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <CheckCircle2 size={15} color="#16a34a" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Full Name */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  className="form-control"
                  style={{ width: "100%", padding: "8px 10px 8px 34px" }}
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <User size={15} style={{ position: "absolute", left: 10, top: 11, color: "#94a3b8" }} />
              </div>
            </div>

            {/* Email Address with validation check */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>
                  Work Email Address
                </label>
                {touchedEmail && email && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: isEmailValid ? "#16a34a" : "#dc2626" }}>
                    {isEmailValid ? "✓ Valid email address" : "✕ Invalid email address"}
                  </span>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  className="form-control"
                  style={{
                    width: "100%",
                    padding: "8px 10px 8px 34px",
                    borderColor: touchedEmail && email && !isEmailValid ? "#ef4444" : "#cbd5e1"
                  }}
                  placeholder="e.g. jdoe@company.com"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (!touchedEmail) setTouchedEmail(true);
                  }}
                  onBlur={() => setTouchedEmail(true)}
                  required
                />
                <Mail size={15} style={{ position: "absolute", left: 10, top: 11, color: "#94a3b8" }} />
              </div>
            </div>

            {/* Role & Department */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Role
                </label>
                <select className="form-control" style={{ width: "100%" }} value={role} onChange={e => setRole(e.target.value)}>
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Department
                </label>
                <select className="form-control" style={{ width: "100%" }} value={department} onChange={e => setDepartment(e.target.value)}>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Data">Data</option>
                </select>
              </div>
            </div>

            {/* Password with Strength Meter */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>
                  Create Password
                </label>
                {password && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: passStrength.color }}>
                    Strength: {passStrength.label}
                  </span>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  className="form-control"
                  style={{ width: "100%", padding: "8px 34px 8px 34px" }}
                  placeholder="At least 6 characters"
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

              {/* Password Strength Progress Bar & Tip */}
              {password && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ height: 4, background: "#e2e8f0", borderRadius: 2, overflow: "hidden", marginBottom: 4 }}>
                    <div 
                      style={{ 
                        height: "100%", 
                        width: passStrength.width, 
                        background: passStrength.color,
                        transition: "all 0.3s ease" 
                      }} 
                    />
                  </div>
                  <div style={{ fontSize: 11, color: passStrength.score <= 1 ? "#ef4444" : "#64748b" }}>
                    {passStrength.tip}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password with Match Indicator */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>
                  Confirm Password
                </label>
                {touchedConfirm && confirmPass && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: passwordsMatch ? "#16a34a" : "#dc2626" }}>
                    {passwordsMatch ? "✓ Passwords match" : "✕ Passwords do not match"}
                  </span>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPass ? "text" : "password"}
                  className="form-control"
                  style={{
                    width: "100%",
                    padding: "8px 34px 8px 34px",
                    borderColor: touchedConfirm && confirmPass && !passwordsMatch ? "#ef4444" : "#cbd5e1"
                  }}
                  placeholder="Re-enter your password"
                  value={confirmPass}
                  onChange={e => {
                    setConfirmPass(e.target.value);
                    if (!touchedConfirm) setTouchedConfirm(true);
                  }}
                  onBlur={() => setTouchedConfirm(true)}
                  required
                />
                <Lock size={15} style={{ position: "absolute", left: 10, top: 11, color: "#94a3b8" }} />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  style={{ position: "absolute", right: 10, top: 9, background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
                >
                  {showConfirmPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", padding: "9px 14px", justifyContent: "center", fontSize: 13, marginTop: 6 }}
            >
              Create WorkTime Account <ArrowRight size={15} />
            </button>
          </form>

          <div style={{ marginTop: 18, textAlign: "center", fontSize: 12, color: "#64748b" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#2563eb", fontWeight: 600 }}>
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
