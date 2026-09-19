import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SKILLS, TASKS, EMPLOYEES, TASK_ASSIGNMENTS, getEmployeeUser } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

const STEPS = ["Task Specification", "Skill Requirements", "Assignment & Review"];

export default function CreateTask() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";

  const [step, setStep] = useState(0);
  const [notification, setNotification] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    department: "Engineering",
    priority: "medium",
    status: "todo",
    task_type: "monthly",
    deadline: "2026-09-30",
    estimated_hours: 12,
    assigned_employee_id: "",
    required_skill_ids: [1, 2],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleSkill = (id) => {
    setForm(prev => ({
      ...prev,
      required_skill_ids: prev.required_skill_ids.includes(id)
        ? prev.required_skill_ids.filter(s => s !== id)
        : [...prev.required_skill_ids, id],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Please enter a valid task title.");
      return;
    }

    const newTaskId = TASKS.length > 0 ? Math.max(...TASKS.map(t => t.id)) + 1 : 1;
    const newTask = {
      id: newTaskId,
      title: form.title.trim(),
      description: form.description.trim() || "No detailed description provided.",
      priority: form.priority,
      status: form.assigned_employee_id ? "in_progress" : "todo",
      task_type: form.task_type,
      deadline: form.deadline,
      estimated_hours: Number(form.estimated_hours) || 8,
      created_by: user?.id || 1,
      created_at: new Date().toISOString().split("T")[0],
      required_skill_ids: form.required_skill_ids,
      department: form.department,
    };

    // Prepend to mock TASKS
    TASKS.unshift(newTask);

    // If assigned to an employee, record in TASK_ASSIGNMENTS
    if (form.assigned_employee_id) {
      const newAssignment = {
        id: TASK_ASSIGNMENTS.length + 1,
        task_id: newTaskId,
        employee_id: Number(form.assigned_employee_id),
        assigned_at: new Date().toISOString().split("T")[0],
        started_at: new Date().toISOString().split("T")[0],
        completed_at: null,
        assignment_score: null,
        status: "in_progress",
      };
      TASK_ASSIGNMENTS.unshift(newAssignment);
    }

    setNotification("Task created and published successfully!");
    setTimeout(() => {
      navigate(isManager ? "/manager/tasks" : "/admin/tasks");
    }, 800);
  };

  const selectedSkills = SKILLS.filter(s => form.required_skill_ids.includes(s.id));
  const assignedEmp = EMPLOYEES.find(e => e.id === Number(form.assigned_employee_id));
  const assignedUser = assignedEmp ? getEmployeeUser(assignedEmp) : null;

  return (
    <div>
      {/* Top Banner */}
      <div style={{ border: "1px solid var(--border)", padding: "14px 18px", marginBottom: 16, backgroundColor: "#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: "bold", margin: 0 }}>
            Create &amp; Allocate Work Deliverable
          </h2>
          <div style={{ fontSize: 13, color: "var(--footer)", marginTop: 4 }}>
            Define new project work packages, required skill competencies, deadlines, and staff assignment.
          </div>
        </div>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate(isManager ? "/manager/tasks" : "/admin/tasks")}
        >
          &larr; Back to Task Queue
        </button>
      </div>

      {notification && (
        <div style={{ border: "1px solid var(--border)", padding: "10px 14px", marginBottom: 16, fontWeight: "bold", backgroundColor: "var(--body)" }}>
          Notice: {notification}
        </div>
      )}

      {/* Step Progress Bar (Sage Green Palette) */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {STEPS.map((s, i) => {
          const isCurrent = i === step;
          const isCompleted = i < step;
          return (
            <div
              key={i}
              onClick={() => setStep(i)}
              style={{
                flex: 1,
                padding: "10px 14px",
                backgroundColor: isCurrent ? "var(--header)" : isCompleted ? "var(--body)" : "#ffffff",
                color: isCurrent ? "#ffffff" : "var(--text)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: isCurrent ? "bold" : "normal",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ 
                display: "inline-flex", 
                alignItems: "center", 
                justifyContent: "center", 
                width: 20, 
                height: 20, 
                backgroundColor: isCurrent ? "var(--footer)" : isCompleted ? "var(--header)" : "var(--border)",
                color: isCurrent || isCompleted ? "#ffffff" : "var(--text)",
                borderRadius: "50%",
                fontSize: 11,
                fontWeight: "bold"
              }}>
                {i + 1}
              </span>
              <span>{s}</span>
            </div>
          );
        })}
      </div>

      {/* Step Content Card */}
      <div className="wt-card" style={{ marginBottom: 16 }}>
        {/* STEP 0: Task Details */}
        {step === 0 && (
          <div>
            <div className="wt-card-header">
              <h2 className="wt-card-title">Step 1: Deliverable Specification</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>
                  Task Title *
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  placeholder="e.g. Implement Real-Time Telemetry Streaming Endpoint"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>
                  Description &amp; Acceptance Criteria
                </label>
                <textarea
                  className="form-control"
                  name="description"
                  placeholder="Detail the technical specifications, requirements, and deliverables..."
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>
                    Department
                  </label>
                  <select
                    className="form-control"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Data">Data</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>
                    Priority Level
                  </label>
                  <select
                    className="form-control"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>
                    Task Cadence / Type
                  </label>
                  <select
                    className="form-control"
                    name="task_type"
                    value={form.task_type}
                    onChange={handleChange}
                  >
                    <option value="weekly">Weekly Deliverable</option>
                    <option value="monthly">Monthly Project</option>
                    <option value="quarterly">Quarterly Milestone</option>
                    <option value="yearly">Annual Goal</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>
                    Deadline Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="estimated_hours"
                    placeholder="e.g. 16"
                    value={form.estimated_hours}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Required Skills */}
        {step === 1 && (
          <div>
            <div className="wt-card-header">
              <h2 className="wt-card-title">Step 2: Required Technical Skills &amp; Competencies</h2>
            </div>
            <p style={{ fontSize: 13, color: "var(--footer)", marginBottom: 14 }}>
              Select the skills needed to execute this deliverable. The system uses these to recommend qualified staff.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
              {SKILLS.map(s => {
                const selected = form.required_skill_ids.includes(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() => toggleSkill(s.id)}
                    style={{
                      padding: "10px 14px",
                      border: "1px solid var(--border)",
                      backgroundColor: selected ? "var(--body)" : "#ffffff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: selected ? "bold" : "normal", fontSize: 13 }}>
                        {s.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#666" }}>
                        {s.description}
                      </div>
                    </div>
                    <div style={{ 
                      width: 18, 
                      height: 18, 
                      border: "1px solid var(--border)", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      backgroundColor: selected ? "var(--header)" : "#ffffff",
                      color: "#ffffff",
                      fontSize: 11,
                      fontWeight: "bold"
                    }}>
                      {selected ? "✓" : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Review & Assign */}
        {step === 2 && (
          <div>
            <div className="wt-card-header">
              <h2 className="wt-card-title">Step 3: Staff Assignment &amp; Final Review</h2>
            </div>
            
            {/* Direct Assignment Option */}
            <div style={{ marginBottom: 18, padding: "12px 14px", border: "1px solid var(--border)", backgroundColor: "var(--body)" }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>
                Assign to Staff Member (Optional):
              </label>
              <select
                className="form-control"
                name="assigned_employee_id"
                value={form.assigned_employee_id}
                onChange={handleChange}
                style={{ width: "100%", maxWidth: 400 }}
              >
                <option value="">Unassigned (Keep in Task Queue)</option>
                {EMPLOYEES.map(emp => {
                  const u = getEmployeeUser(emp);
                  return (
                    <option key={emp.id} value={emp.id}>
                      {u?.name} — {emp.department} ({emp.position}) - {emp.workload_percentage}% Workload
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Task Specification Summary Table */}
            <table className="wt-table">
              <tbody>
                <tr>
                  <td style={{ width: "25%", fontWeight: "bold" }}>Task Title</td>
                  <td><strong>{form.title || <span style={{ color: "#888" }}>Untitled Task</span>}</strong></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>Description</td>
                  <td>{form.description || "No description provided."}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>Department</td>
                  <td>{form.department}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>Priority</td>
                  <td><span style={{ textTransform: "capitalize", fontWeight: "bold" }}>{form.priority}</span></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>Cadence / Type</td>
                  <td><span style={{ textTransform: "capitalize" }}>{form.task_type}</span></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>Deadline</td>
                  <td>{form.deadline}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>Estimated Effort</td>
                  <td>{form.estimated_hours} Hours</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>Required Skills ({selectedSkills.length})</td>
                  <td>
                    {selectedSkills.length === 0 ? (
                      <span style={{ color: "#888" }}>None selected</span>
                    ) : (
                      selectedSkills.map(s => s.name).join(", ")
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>Assigned Staff</td>
                  <td>
                    {assignedUser ? (
                      <span><strong>{assignedUser.name}</strong> ({assignedEmp?.position})</span>
                    ) : (
                      <span style={{ color: "#666" }}>Unassigned (Available in Pool)</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Navigation & Action Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {step > 0 ? (
          <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>
            &larr; Back
          </button>
        ) : (
          <div />
        )}

        {step < STEPS.length - 1 ? (
          <button
            className="btn btn-primary"
            disabled={step === 0 && !form.title.trim()}
            onClick={() => setStep(s => s + 1)}
          >
            Next: {STEPS[step + 1]} &rarr;
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleSubmit}>
            Create &amp; Publish Task
          </button>
        )}
      </div>
    </div>
  );
}
