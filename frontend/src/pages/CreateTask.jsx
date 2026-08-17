import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { SKILLS } from "../data/mockData";

const STEPS = ["Task Details", "Required Skills", "Review"];

export default function CreateTask() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "", description: "", priority: "medium",
    status: "todo", deadline: "", estimated_hours: "",
    required_skill_ids: [],
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleSkill = (id) => {
    setForm(f => ({
      ...f,
      required_skill_ids: f.required_skill_ids.includes(id)
        ? f.required_skill_ids.filter(s => s !== id)
        : [...f.required_skill_ids, id],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Task created! (Backend integration pending)");
    navigate("/admin/tasks");
  };

  const selectedSkills = SKILLS.filter(s => form.required_skill_ids.includes(s.id));

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Create Task</div>
          <div className="page-subtitle">Step {step + 1} of {STEPS.length}</div>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate("/admin/tasks")}>
          <ArrowLeft size={15} /> Back to Tasks
        </button>
      </div>

      {/* Step indicators */}
      <div style={{ display: "flex", gap: 0, marginBottom: 28 }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "99px", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 12,
              background: i < step ? "var(--green)" : i === step ? "var(--primary)" : "var(--border)",
              color: i <= step ? "#fff" : "var(--muted)",
            }}>
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span style={{ marginLeft: 8, fontSize: 13, fontWeight: i === step ? 700 : 500, color: i === step ? "var(--text)" : "var(--muted)" }}>{s}</span>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < step ? "var(--green)" : "var(--border)", margin: "0 12px" }} />
            )}
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-body">
          {/* Step 0: Task Details */}
          {step === 0 && (
            <div className="form-grid">
              <div className="field form-grid-full">
                <label>Task Title *</label>
                <input className="field-input" name="title" value={form.title} onChange={handleChange} placeholder="Enter task title" required />
              </div>
              <div className="field form-grid-full">
                <label>Description</label>
                <textarea className="field-textarea" name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Describe the task…" />
              </div>
              <div className="field">
                <label>Priority</label>
                <select className="field-select" name="priority" value={form.priority} onChange={handleChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="field">
                <label>Status</label>
                <select className="field-select" name="status" value={form.status} onChange={handleChange}>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                </select>
              </div>
              <div className="field">
                <label>Deadline</label>
                <input className="field-input" type="date" name="deadline" value={form.deadline} onChange={handleChange} />
              </div>
              <div className="field">
                <label>Estimated Hours</label>
                <input className="field-input" type="number" name="estimated_hours" value={form.estimated_hours} onChange={handleChange} placeholder="e.g. 8" min={1} />
              </div>
            </div>
          )}

          {/* Step 1: Required Skills */}
          {step === 1 && (
            <div>
              <p style={{ color: "var(--text-2)", marginBottom: 18, fontSize: 13.5 }}>
                Select the skills required to complete this task. Employees will be matched based on these skills.
              </p>
              <div className="grid-3">
                {SKILLS.map(s => {
                  const selected = form.required_skill_ids.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => toggleSkill(s.id)}
                      style={{
                        padding: "14px 16px",
                        border: `2px solid ${selected ? "var(--primary)" : "var(--border)"}`,
                        borderRadius: "var(--radius-lg)",
                        cursor: "pointer",
                        background: selected ? "var(--primary-lt)" : "var(--surface)",
                        transition: "all 0.15s",
                        display: "flex", alignItems: "center", gap: 10,
                      }}
                    >
                      <div style={{
                        width: 20, height: 20, borderRadius: 6,
                        border: `2px solid ${selected ? "var(--primary)" : "var(--border)"}`,
                        background: selected ? "var(--primary)" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, transition: "all 0.15s",
                      }}>
                        {selected && <Check size={12} color="#fff" />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13.5 }}>{s.name}</div>
                        <div style={{ fontSize: 11.5, color: "var(--text-2)" }}>{s.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Review your task</h3>
              {[
                ["Title",           form.title || "—"],
                ["Description",     form.description || "—"],
                ["Priority",        form.priority],
                ["Status",          form.status],
                ["Deadline",        form.deadline || "—"],
                ["Estimated Hours", form.estimated_hours ? `${form.estimated_hours}h` : "—"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 16, padding: "12px 16px", background: "var(--surface-2)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text-2)", minWidth: 140 }}>{k}</span>
                  <span style={{ fontWeight: 500, fontSize: 13 }}>{v}</span>
                </div>
              ))}
              <div style={{ padding: "12px 16px", background: "var(--surface-2)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text-2)" }}>Required Skills</span>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                  {selectedSkills.length ? selectedSkills.map(s => <span key={s.id} className="skill-tag">{s.name}</span>) : <span style={{ color: "var(--muted)", fontSize: 13 }}>None selected</span>}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card-footer" style={{ display: "flex", justifyContent: "space-between" }}>
          <button className="btn btn-secondary" onClick={() => step > 0 ? setStep(s => s - 1) : navigate("/admin/tasks")} disabled={false}>
            <ArrowLeft size={15} /> {step === 0 ? "Cancel" : "Back"}
          </button>
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} disabled={step === 0 && !form.title}>
              Next <ArrowRight size={15} />
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit}>
              <Check size={15} /> Create Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
