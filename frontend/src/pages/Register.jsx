import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-brand">
          <div className="auth-left-logo"><Briefcase size={20} /></div>
          <span className="auth-left-brand-name">WorkFlow</span>
        </div>
        <h2>Build smarter teams. Allocate work intelligently.</h2>
        <p>Create your account to join your team's workspace and start managing tasks, skills, and availability in one place.</p>
      </div>

      <div className="auth-right">
        <div className="auth-right-inner">
          <h1>Create your account</h1>
          <p>Join your team's workspace today.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label>Full name</label>
              <div className="auth-input-wrap">
                <User size={16} />
                <input name="name" type="text" placeholder="Your full name" value={form.name} onChange={handleChange} required />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Email address</label>
              <div className="auth-input-wrap">
                <Mail size={16} />
                <input name="email" type="email" placeholder="you@workflow.io" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <div className="auth-input-wrap">
                <Lock size={16} />
                <input name="password" type={showPass ? "text" : "password"} placeholder="Create a password" value={form.password} onChange={handleChange} required />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="auth-input-group">
              <label>Account type</label>
              <div className="auth-input-wrap">
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin / Manager</option>
                </select>
              </div>
            </div>

            <button type="submit" className="auth-submit">
              Create account <ArrowRight size={17} />
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}