import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Account created successfully! You can now log in.");
    navigate("/login");
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
              <h1 style={{ margin: 0, fontSize: 18 }}>Register Account</h1>
              <div style={{ fontSize: 12, color: "#6c757d" }}>Work Allocation System</div>
            </div>
          </div>

          <p style={{ marginBottom: 16 }}>Create a new user account</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label>Full Name</label>
              <div className="auth-input-wrap">
                <User size={15} color="#6c757d" />
                <input name="name" type="text" placeholder="e.g. John Doe" value={form.name} onChange={handleChange} required />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Email Address</label>
              <div className="auth-input-wrap">
                <Mail size={15} color="#6c757d" />
                <input name="email" type="email" placeholder="e.g. john@workflow.io" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <div className="auth-input-wrap">
                <Lock size={15} color="#6c757d" />
                <input name="password" type={showPass ? "text" : "password"} placeholder="Enter your password" value={form.password} onChange={handleChange} required />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="auth-input-group">
              <label>Role</label>
              <div className="auth-input-wrap">
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="employee">Employee</option>
                  <option value="manager">Department Manager</option>
                </select>
              </div>
            </div>

            <button type="submit" className="auth-submit">
              Register <ArrowRight size={15} />
            </button>
          </form>

          <div className="auth-switch">
            Already have an account?
            <Link to="/login">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}