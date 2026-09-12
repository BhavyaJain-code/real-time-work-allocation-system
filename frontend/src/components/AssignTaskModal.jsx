import { useState } from "react";
import { X, Zap, UserCheck, Check } from "lucide-react";
import {
  TASKS, EMPLOYEES, TASK_ASSIGNMENTS,
  getEmployeeUser, getMatchedEmployees, getEmployeeSkills,
  initials, STATUS_LABEL, TASK_TYPE_LABEL
} from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function AssignTaskModal({ onClose, onAssign, limitEmpIds, initialTaskId }) {
  const [step, setStep]       = useState(initialTaskId ? 1 : 0);
  const [taskId, setTaskId]   = useState(initialTaskId || null);
  const [empId, setEmpId]     = useState(null);

  const task = TASKS.find(t => t.id === taskId);

  const assignedTaskIds = TASK_ASSIGNMENTS.map(a => a.task_id);
  const availableTasks  = TASKS.filter(t => !assignedTaskIds.includes(t.id) && t.status !== "done");

  const matchedAll = task ? getMatchedEmployees(task.id) : [];
  const matched    = limitEmpIds
    ? matchedAll.filter(m => limitEmpIds.includes(m.employee.id))
    : matchedAll;

  const unmatchedDept = limitEmpIds
    ? EMPLOYEES.filter(e => limitEmpIds.includes(e.id) && !matched.find(m => m.employee.id === e.id))
    : [];

  const selectedEmp = empId ? EMPLOYEES.find(e => e.id === empId) : null;

  const handleConfirm = () => {
    onAssign(taskId, empId);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 580 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Task Assignment Wizard</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              Step {step + 1} of 3: {step === 0 ? "Select Task" : step === 1 ? "Select Employee" : "Confirm Assignment"}
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={15} /></button>
        </div>

        {/* Step Indicators */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {["1. Select Task", "2. Choose Employee", "3. Confirm"].map((label, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                padding: "6px 10px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 600,
                textAlign: "center",
                background: i === step ? "#0d6efd" : i < step ? "#d1e7dd" : "#f8f9fa",
                color: i === step ? "#ffffff" : i < step ? "#0f5132" : "#6c757d",
                border: "1px solid",
                borderColor: i === step ? "#0d6efd" : i < step ? "#badbcc" : "#dee2e6",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* STEP 0: Select Task */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 380, overflowY: "auto" }}>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>Select an unassigned task:</p>
            {availableTasks.length === 0 ? (
              <div className="empty-state"><h3>All tasks are assigned!</h3></div>
            ) : availableTasks.map(t => (
              <div
                key={t.id}
                onClick={() => { setTaskId(t.id); setStep(1); }}
                style={{
                  padding: "10px 14px",
                  borderRadius: 4,
                  border: taskId === t.id ? "2px solid #0d6efd" : "1px solid var(--border)",
                  background: taskId === t.id ? "#e7f1ff" : "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                    Due: {t.deadline} · {t.estimated_hours} hrs · <span style={{ textTransform: "capitalize" }}>{t.priority} Priority</span>
                  </div>
                </div>
                <StatusBadge value={t.priority} type="priority" />
              </div>
            ))}
          </div>
        )}

        {/* STEP 1: Choose Employee */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 380, overflowY: "auto" }}>
            <div style={{ padding: "8px 12px", background: "#f8f9fa", borderRadius: 4, border: "1px solid var(--border)", fontSize: 13 }}>
              Selected Task: <strong>{task?.title}</strong> ({task?.estimated_hours}h)
            </div>

            <p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--muted)", margin: "4px 0 0" }}>
              Matching Candidates (By Skill Relevancy):
            </p>

            {matched.map(({ employee, matchCount, totalRequired }) => {
              const u = getEmployeeUser(employee);
              const skills = getEmployeeSkills(employee.id);
              const isSelected = empId === employee.id;
              return (
                <div
                  key={employee.id}
                  onClick={() => setEmpId(employee.id)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 4,
                    border: isSelected ? "2px solid #0d6efd" : "1px solid var(--border)",
                    background: isSelected ? "#e7f1ff" : "#ffffff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div className="avatar avatar-sm" style={{ background: "#0d6efd", color: "#fff" }}>{initials(u?.name)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{u?.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--muted)" }}>
                      {employee.department} · {employee.workload_percentage}% workload
                    </div>
                  </div>
                  <span className="badge badge-blue">{matchCount}/{totalRequired} skills</span>
                </div>
              );
            })}
          </div>
        )}

        {/* STEP 2: Confirm */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13.5 }}>
            <div style={{ padding: "12px", background: "#f8f9fa", borderRadius: 4, border: "1px solid var(--border)" }}>
              <div style={{ marginBottom: 8 }}><strong>Task:</strong> {task?.title}</div>
              <div style={{ marginBottom: 8 }}><strong>Deadline:</strong> {task?.deadline}</div>
              <div style={{ marginBottom: 8 }}><strong>Estimated Duration:</strong> {task?.estimated_hours} hours</div>
              <div><strong>Assignee:</strong> {getEmployeeUser(selectedEmp)?.name} ({selectedEmp?.department})</div>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 13 }}>
              Confirming will assign this task to the selected employee and update their workload.
            </p>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="modal-footer">
          {step > 0 && (
            <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>
              Back
            </button>
          )}

          {step === 0 && (
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          )}

          {step < 2 ? (
            <button
              className="btn btn-primary"
              disabled={(step === 0 && !taskId) || (step === 1 && !empId)}
              onClick={() => setStep(s => s + 1)}
            >
              Next
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleConfirm}>
              <Check size={14} /> Confirm Assignment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
