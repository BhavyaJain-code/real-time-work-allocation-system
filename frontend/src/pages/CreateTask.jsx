import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { SKILLS } from "../data/mockData";

const STEPS = ["Task Details", "Required Skills", "Review & Save"];

export default function CreateTask() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "", description: "", priority: "medium",
    status: "todo", deadline: "", estimated_hours: "",
    task_type: "monthly",
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
    alert("Task created successfully!");
    navigate("/admin/tasks");
  };

  const selectedSkills = SKILLS.filter(s => form.required_skill_ids.includes(s.id));

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Create New Task</div>
          <div className="page-subtitle">Step {step + 1} of {STEPS.length}: {STEPS[step]}</div>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate("/admin/tasks")}>
          <ArrowLeft size={14} /> Back to Tasks
        </button>
      </div>

      {/* Simple step indicators */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {STEPS.map((s, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              padding: "8px 12px",
              background: i === step ? "#0d6efd" : i < step ? "#d1e7dd" : "#ffffff",
              color: i === step ? "#ffffff" : i < step ? "#0f5132" : "#6c757d",
              border: "1px solid",
              borderColor: i === step ? "#0d6efd" : i < step ? "#badbcc" : "#dee2e6",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>{i + 1}.</span> {s}
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-body">
          {step === 0 && (
            <div className="form-grid">
              <div className="field form-grid-full">
                <label>Task Title *</label>
                <input
                  className="field-input"
                  name="title"
                  placeholder="e.g. Build User Authentication API"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field form-grid-full">
                <label>Description</label>
                <textarea
                  className="field-textarea"
                  name="description"
                  placeholder="Describe the requirements and scope..."
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                />
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
                <label>Task Type / Cadence</label>
                <select className="field-select" name="task_type" value={form.task_type} onChange={handleChange}>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="field">
                <label>Deadline</label>
                <input className="field-input" type="date" name="deadline" value={form.deadline} onChange={handleChange} />
              </div>

              <div className="field">
                <label>Estimated Hours</label>
                <input className="field-input" type="number" name="estimated_hours" placeholder="e.g. 16" value={form.estimated_hours} onChange={handleChange} min="1" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>
                Select all skills required to complete this task:
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
                {SKILLS.map(s => {
                  const selected = form.required_skill_ids.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => toggleSkill(s.id)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 4,
                        border: selected ? "2px solid #0d6efd" : "1px solid var(--border)",
                        background: selected ? "#e7f1ff" : "#ffffff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: 13, color: selected ? "#0d6efd" : "var(--text)" }}>{s.name}</span>
                      {selected && <Check size={14} color="#0d6efd" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ fontSize: 15, marginBottom: 12 }}>Review Task Details</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13.5 }}>
                <div><strong>Title:</strong> {form.title || <span className="text-muted">Not specified</span>}</div>
                <div><strong>Description:</strong> {form.description || <span className="text-muted">None</span>}</div>
                <div><strong>Priority:</strong> <span style={{ textTransform: "capitalize" }}>{form.priority}</span></div>
                <div><strong>Cadence:</strong> <span style={{ textTransform: "capitalize" }}>{form.task_type}</span></div>
                <div><strong>Deadline:</strong> {form.deadline || "None"}</div>
                <div><strong>Est. Hours:</strong> {form.estimated_hours ? `${form.estimated_hours}h` : "None"}</div>
                <div>
                  <strong>Required Skills ({selectedSkills.length}):</strong>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
                    {selectedSkills.length === 0 ? (
                      <span className="text-muted">No skills selected</span>
                    ) : (
                      selectedSkills.map(s => <span key={s.id} className="skill-tag">{s.name}</span>)
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card-footer" style={{ display: "flex", justifyContent: "space-between" }}>
          {step > 0 ? (
            <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>
              <ArrowLeft size={14} /> Back
            </button>
          ) : <div />}

          {step < STEPS.length - 1 ? (
            <button
              className="btn btn-primary"
              disabled={step === 0 && !form.title.trim()}
              onClick={() => setStep(s => s + 1)}
            >
              Next <ArrowRight size={14} />
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit}>
              <Check size={14} /> Create Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
