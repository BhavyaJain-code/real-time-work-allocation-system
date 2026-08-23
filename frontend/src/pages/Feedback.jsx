import { useState } from "react";
import { Star, Send, X, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  EMPLOYEES, TASKS, FEEDBACK,
  getEmployeeUser, getTask, getUser,
  initials, avatarColors, getManagerEmployees
} from "../data/mockData";
import { StaggerContainer, StaggerItem, AnimatedNumber } from "../components/motion/MotionPrimitives";
import { motion } from "framer-motion";

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={26}
          style={{ cursor: "pointer", transition: "transform 0.1s" }}
          fill={(hover || value) >= i ? "#f5d982" : "none"}
          color={(hover || value) >= i ? "#f5d982" : "var(--border)"}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
        />
      ))}
      <span style={{ marginLeft: 8, fontSize: 13, color: "#f5d982", fontWeight: 700, alignSelf: "center" }}>
        {value ? ["","Poor","Fair","Good","Very Good","⭐ Excellent"][value] : "Select Rating"}
      </span>
    </div>
  );
}

export default function Feedback() {
  const { user, managedDept } = useAuth();

  const visibleEmps = managedDept
    ? EMPLOYEES.filter(e => e.department === managedDept)
    : EMPLOYEES;

  const [feedbackList, setFeedbackList] = useState(FEEDBACK);
  const [form, setForm] = useState({ to_employee_id: "", task_id: "", rating: 0, comment: "" });
  const [filterEmp, setFilterEmp] = useState("all");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.to_employee_id || !form.rating) return;
    const newFb = {
      id: Date.now(),
      from_user_id: user.id,
      to_employee_id: Number(form.to_employee_id),
      task_id: form.task_id ? Number(form.task_id) : null,
      rating: form.rating,
      comment: form.comment,
      created_at: new Date().toISOString(),
    };
    setFeedbackList(f => [newFb, ...f]);
    setForm({ to_employee_id: "", task_id: "", rating: 0, comment: "" });
  };

  const filtered = feedbackList.filter(f => {
    if (filterEmp === "all") return true;
    return f.to_employee_id === Number(filterEmp);
  });

  const avgRating = feedbackList.length
    ? (feedbackList.reduce((s, f) => s + f.rating, 0) / feedbackList.length).toFixed(1)
    : "—";

  const stats = [
    { label: "Total Reviews",    value: feedbackList.length, trend: "Peer & Manager feedback" },
    { label: "Average Rating",   value: avgRating, suffix: " / 5.0", trend: "Overall score" },
    { label: "5-Star Ratings",   value: feedbackList.filter(f => f.rating === 5).length, trend: "Top performers" },
    { label: "Active Feedback",  value: visibleEmps.length, trend: "Employees covered" },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Performance Feedback</div>
          <div className="page-subtitle">Manager & Peer appraisals, rating scores, and constructive coaching</div>
        </div>
      </div>

      {/* Cobalt Stat Cards */}
      <StaggerContainer className="stats-grid" staggerDelay={0.07}>
        {stats.map((s, i) => (
          <StaggerItem key={i}>
            <motion.div
              className="stat-card"
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 450, damping: 22 } }}
            >
              <div className="stat-card-header">
                <span className="stat-label">{s.label}</span>
                <span className="stat-dots">•••</span>
              </div>
              <div className="stat-value">
                <AnimatedNumber value={s.value} suffix={s.suffix || ""} />
              </div>
              <div className="stat-sub">
                <TrendingUp size={14} color="#ee27d7" /> {s.trend}
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="grid-2" style={{ alignItems: "start" }}>
        {/* Submit Feedback Form */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Leave Employee Feedback</span>
          </div>
          <form onSubmit={handleSubmit} className="card-body form-grid">
            <div className="field form-grid-full">
              <label>Employee to Review</label>
              <select
                className="field-select"
                required
                value={form.to_employee_id}
                onChange={e => setForm(f => ({ ...f, to_employee_id: e.target.value }))}
              >
                <option value="">Select Employee</option>
                {visibleEmps.map(e => {
                  const u = getEmployeeUser(e);
                  return <option key={e.id} value={e.id}>{u?.name} ({e.department} - {e.position})</option>;
                })}
              </select>
            </div>

            <div className="field form-grid-full">
              <label>Related Task (Optional)</label>
              <select
                className="field-select"
                value={form.task_id}
                onChange={e => setForm(f => ({ ...f, task_id: e.target.value }))}
              >
                <option value="">General / None</option>
                {TASKS.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </div>

            <div className="field form-grid-full">
              <label>Rating Score</label>
              <StarPicker value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
            </div>

            <div className="field form-grid-full">
              <label>Feedback & Coaching Notes</label>
              <textarea
                className="field-textarea"
                required
                rows={4}
                value={form.comment}
                onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                placeholder="Detail accomplishments, code quality, punctuality or areas for growth…"
              />
            </div>

            <div className="form-grid-full" style={{ display: "flex", justifyContent: "flex-end" }}>
              <motion.button
                type="submit"
                className="btn btn-primary"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Send size={15} /> Submit Feedback
              </motion.button>
            </div>
          </form>
        </div>

        {/* Feedback Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="filter-bar" style={{ marginBottom: 0 }}>
            <select className="filter-select" value={filterEmp} onChange={e => setFilterEmp(e.target.value)} style={{ width: "100%" }}>
              <option value="all">All Feedback Logs</option>
              {visibleEmps.map(e => {
                const u = getEmployeeUser(e);
                return <option key={e.id} value={e.id}>Feedback for {u?.name}</option>;
              })}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.length === 0 ? (
              <div className="card"><div className="empty-state"><h3>No feedback recorded</h3><p>Be the first to leave feedback.</p></div></div>
            ) : filtered.map(fb => {
              const author = getUser(fb.from_user_id);
              const targetEmp = EMPLOYEES.find(e => e.id === fb.to_employee_id);
              const targetUser = targetEmp ? getEmployeeUser(targetEmp) : null;
              const task = fb.task_id ? getTask(fb.task_id) : null;
              const av = avatarColors(targetUser?.name || "");

              return (
                <div key={fb.id} className="card" style={{ padding: 18 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div className="avatar avatar-md" style={{ background: av.bg, color: av.color }}>{initials(targetUser?.name)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{targetUser?.name}</span>
                          <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 6 }}>reviewed by <strong>{author?.name}</strong> ({author?.role})</span>
                        </div>
                        <div style={{ display: "flex", gap: 2 }}>
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={13} fill={i <= fb.rating ? "#f5d982" : "none"} color={i <= fb.rating ? "#f5d982" : "var(--border)"} />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: "var(--text)", marginTop: 8, lineHeight: 1.5 }}>"{fb.comment}"</p>
                      {task && (
                        <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                          <span className="badge badge-accent" style={{ fontSize: 10 }}>Task</span> {task.title}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
