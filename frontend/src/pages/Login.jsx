import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Temporary frontend authentication.
    // This will be replaced with the FastAPI API later.

    if (email && password) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        <div className="auth-brand">
          <div className="brand-logo">WA</div>

          <h1>WorkFlow</h1>

          <p>
            Intelligent work allocation for modern teams.
          </p>
        </div>

        <div className="auth-card">

          <div className="auth-header">
            <h2>Welcome back</h2>
            <p>Sign in to continue to your workspace.</p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Email address</label>

              <div className="input-wrapper">
                <Mail size={18} />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>

              <div className="input-wrapper">
                <Lock size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="form-options">
              <label className="remember">
                <input type="checkbox" />
                Remember me
              </label>

              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button className="auth-button" type="submit">
              Sign in
              <ArrowRight size={18} />
            </button>

          </form>

          <div className="auth-footer">
            Don't have an account?
            <Link to="/register">Create account</Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;