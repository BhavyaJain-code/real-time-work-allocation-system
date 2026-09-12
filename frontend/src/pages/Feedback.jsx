import { useState } from "react";
import { Star, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  EMPLOYEES, TASKS, FEEDBACK,
  getEmployeeUser, getTask, getUser,
  initials
} from "../data/mockData";

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={20}
          style={{ cursor: "pointer" }}
          fill={(hover || value) >= i ? "#ffc107" : "none"}
          color={(hover || value) >= i ? "#ffc107" : "#ced4da"}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
        />
      ))}
      <span style={{ marginLeft: 6, fontSize: 13, color: "#495057", fontWeight: 600 }}>
        {value ? ["","1/5 Poor","2/5 Fair","3/5 Good","4/5 Very Good","5/5 Excellent"][value] : "Select Rating"}
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

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Performance Feedback</div>
          <div className="page-subtitle">Submit and review employee appraisals and ratings</div>
        </div>
      </div>

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
              <label>Rating (1 to 5 Stars)</label>
              <StarPicker value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
            </div>

            <div className="field form-grid-full">
              <label>Feedback & Comments</label>
              <textarea
                className="field-textarea"
                required
                rows={4}
                value={form.comment}
                onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                placeholder="Enter feedback notes, work quality, areas of improvement..."
              />
            </div>

            <div className="form-grid-full" style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                className="btn btn-primary"
              >
                <Send size={14} /> Submit Feedback
              </button>
            </div>
          </form>
        </div>

        {/* Feedback Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="filter-bar" style={{ marginBottom: 0 }}>
            <select className="filter-select" value={filterEmp} onChange={e => setFilterEmp(e.target.value)} style={{ width: "100%" }}>
              <option value="all">All Feedback Records</option>
              {visibleEmps.map(e => {
                const u = getEmployeeUser(e);
                return <option key={e.id} value={e.id}>Feedback for {u?.name}</option>;
              })}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.length === 0 ? (
              <div className="card"><div className="empty-state"><h3>No feedback records found</h3></div></div>
            ) : filtered.map(fb => {
              const author = getUser(fb.from_user_id);
              const targetEmp = EMPLOYEES.find(e => e.id === fb.to_employee_id);
              const targetUser = targetEmp ? getEmployeeUser(targetEmp) : null;
              const task = fb.task_id ? getTask(fb.task_id) : null;

              return (
                <div key={fb.id} className="card" style={{ padding: 14 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div className="avatar avatar-sm" style={{ background: "#e9ecef", color: "#495057" }}>{initials(targetUser?.name)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ fontWeight: 600, fontSize: 13.5 }}>{targetUser?.name}</span>
                          <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 6 }}>reviewed by <strong>{author?.name}</strong></span>
                        </div>
                        <div style={{ display: "flex", gap: 2 }}>
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={12} fill={i <= fb.rating ? "#ffc107" : "none"} color={i <= fb.rating ? "#ffc107" : "#dee2e6"} />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: "var(--text)", marginTop: 6, lineHeight: 1.4 }}>"{fb.comment}"</p>
                      {task && (
                        <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4 }}>
                          Task: <strong>{task.title}</strong>
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
