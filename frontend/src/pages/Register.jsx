import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee"
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Temporary frontend registration.
    // Backend API will be connected later.

    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        <div className="auth-brand">
          <div className="brand-logo">WA</div>

          <h1>WorkFlow</h1>

          <p>
            Build smarter teams. Allocate work intelligently.
          </p>
        </div>

        <div className="auth-card">

          <div className="auth-header">
            <h2>Create your account</h2>
            <p>Join your team's workspace.</p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Full name</label>

              <div className="input-wrapper">
                <User size={18} />

                <input
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email address</label>

              <div className="input-wrapper">
                <Mail size={18} />

                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>

              <div className="input-wrapper">
                <Lock size={18} />

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Account type</label>

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin / Manager</option>
              </select>
            </div>

            <button className="auth-button" type="submit">
              Create account
              <ArrowRight size={18} />
            </button>

          </form>

          <div className="auth-footer">
            Already have an account?
            <Link to="/login">Sign in</Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;