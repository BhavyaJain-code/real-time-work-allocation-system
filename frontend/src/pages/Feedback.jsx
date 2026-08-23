import { useState } from "react";
import { Star, Send, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  EMPLOYEES, TASKS, FEEDBACK,
  getEmployeeUser, getTask, getUser,
  initials, avatarColors, getManagerEmployees
} from "../data/mockData";

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={26}
          style={{ cursor: "pointer", transition: "transform 0.1s" }}
          fill={(hover || value) >= i ? "var(--amber)" : "none"}
          color={(hover || value) >= i ? "var(--amber)" : "var(--border)"}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
        />
      ))}
      <span style={{ marginLeft: 8, fontSize: 13, color: "var(--muted)", alignSelf: "center" }}>
        {value ? ["","Poor","Fair","Good","Very Good","Excellent"][value] : "Rate"}
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

  const selectedEmpTasks = TASKS; // show all tasks in the task dropdown

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

  const displayFeedback = filterEmp === "all"
    ? feedbackList
    : feedbackList.filter(f => f.to_employee_id === Number(filterEmp));

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Feedback</div>
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        {/* Give feedback form */}
        <div className="card">
          <div className="card-header"><span className="card-title">Give Feedback</span></div>
          <form onSubmit={handleSubmit}>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="field">
                <label>Select Employee *</label>
                <select className="field-select" value={form.to_employee_id}
                  onChange={e => setForm(f => ({ ...f, to_employee_id: e.target.value, task_id: "" }))}>
                  <option value="">Choose employee…</option>
                  {visibleEmps.map(emp => {
                    const u = getEmployeeUser(emp);
                    return <option key={emp.id} value={emp.id}>{u?.name} ({emp.department})</option>;
                  })}
                </select>
              </div>

              <div className="field">
                <label>Related Task (optional)</label>
                <select className="field-select" value={form.task_id} onChange={e => setForm(f => ({ ...f, task_id: e.target.value }))}>
                  <option value="">General feedback</option>
                  {TASKS.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </div>

              <div className="field">
                <label>Rating *</label>
                <StarPicker value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
              </div>

              <div className="field">
                <label>Comment</label>
                <textarea
                  className="field-textarea"
                  rows={4}
                  value={form.comment}
                  onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                  placeholder="Share your feedback about this employee's performance…"
                />
              </div>
            </div>
            <div className="card-footer" style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" className="btn btn-primary" disabled={!form.to_employee_id || !form.rating}>
                <Send size={14} /> Submit Feedback
              </button>
            </div>
          </form>
        </div>

        {/* Past feedback */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Past Feedback</span>
            <select className="filter-select" value={filterEmp} onChange={e => setFilterEmp(e.target.value)}>
              <option value="all">All Employees</option>
              {visibleEmps.map(emp => {
                const u = getEmployeeUser(emp);
                return <option key={emp.id} value={emp.id}>{u?.name}</option>;
              })}
            </select>
          </div>
          <div style={{ maxHeight: 520, overflowY: "auto" }}>
            {displayFeedback.length === 0 ? (
              <div className="empty-state" style={{ padding: 32 }}><p>No feedback yet.</p></div>
            ) : displayFeedback.map(f => {
              const toEmp  = EMPLOYEES.find(e => e.id === f.to_employee_id);
              const toUser = toEmp ? getEmployeeUser(toEmp) : null;
              const fromUser = getUser(f.from_user_id);
              const task   = f.task_id ? getTask(f.task_id) : null;
              const av     = avatarColors(toUser?.name || "");
              return (
                <div key={f.id} style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                    <div className="avatar avatar-sm" style={{ background: av.bg, color: av.color }}>{initials(toUser?.name)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 700, fontSize: 13.5 }}>{toUser?.name}</span>
                        <div style={{ display: "flex", gap: 2 }}>
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={12} fill={i <= f.rating ? "var(--amber)" : "none"} color={i <= f.rating ? "var(--amber)" : "var(--border)"} />
                          ))}
                        </div>
                      </div>
                      {task && <div style={{ fontSize: 12, color: "var(--muted)" }}>re: {task.title}</div>}
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.5 }}>{f.comment}</p>
                  <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 6 }}>
                    By {fromUser?.name} · {new Date(f.created_at).toLocaleDateString()}
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
