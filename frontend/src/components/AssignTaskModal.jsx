import { useState } from "react";
import { X, Zap, UserCheck, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TASKS, EMPLOYEES, TASK_ASSIGNMENTS, SKILLS,
  getEmployeeUser, getMatchedEmployees, getEmployeeSkills,
  initials, avatarColors, STATUS_LABEL, TASK_TYPE_LABEL
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

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.22, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      onClick={onClose}
    >
      <motion.div
        className="modal"
        style={{ maxWidth: 600 }}
        initial={{ opacity: 0, scale: 0.93, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <span className="modal-title">Assign Task</span>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", gap: 0, padding: "14px 20px", borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
          {["Select Task", "Select Employee", "Confirm"].map((s, i) => (
            <div key={i} style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <motion.div
                animate={{
                  scale: i === step ? [1, 1.15, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
                style={{
                  width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, flexShrink: 0,
                  background: i < step ? "var(--green)" : i === step ? "var(--primary)" : "var(--border)",
                  color: i <= step ? "#fff" : "var(--muted)",
                }}
              >
                {i < step ? <Check size={12} /> : i + 1}
              </motion.div>
              <span style={{ marginLeft: 6, fontSize: 12.5, fontWeight: i === step ? 700 : 500, color: i === step ? "var(--text)" : "var(--muted)" }}>{s}</span>
              {i < 2 && <div style={{ flex: 1, height: 2, background: i < step ? "var(--green)" : "var(--border)", margin: "0 8px" }} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Pick task */}
          {step === 0 && (
            <motion.div key="step-0" variants={stepVariants} initial="initial" animate="animate" exit="exit" style={{ maxHeight: 380, overflowY: "auto" }}>
              {availableTasks.length === 0 ? (
                <div className="empty-state" style={{ padding: 32 }}><p>No unassigned tasks available.</p></div>
              ) : availableTasks.map(t => (
                <motion.div
                  key={t.id}
                  onClick={() => { setTaskId(t.id); setStep(1); }}
                  whileHover={{ backgroundColor: "var(--surface-2)" }}
                  whileTap={{ scale: 0.99 }}
                  style={{
                    padding: "14px 20px", borderBottom: "1px solid var(--border)", cursor: "pointer",
                    background: taskId === t.id ? "var(--primary-lt)" : "transparent",
                    transition: "background 0.12s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{t.title}</div>
                      <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>{t.description.slice(0, 70)}…</div>
                      <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                        {t.required_skill_ids.map(sid => {
                          const sk = SKILLS.find(s => s.id === sid);
                          return sk ? <span key={sid} className="skill-tag">{sk.name}</span> : null;
                        })}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", flexShrink: 0 }}>
                      <StatusBadge value={t.priority} type="priority" />
                      <span className="badge badge-gray">{TASK_TYPE_LABEL[t.task_type]}</span>
                      <span style={{ fontSize: 11.5, color: "var(--muted)" }}>Due {t.deadline}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Step 1: Pick employee */}
          {step === 1 && task && (
            <motion.div key="step-1" variants={stepVariants} initial="initial" animate="animate" exit="exit">
              <div style={{ padding: "12px 20px", background: "var(--primary-lt)", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{task.title}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Skill-matched employees shown first</div>
              </div>
              <div style={{ maxHeight: 340, overflowY: "auto" }}>
                {matched.map(({ employee, matchCount, totalRequired }) => {
                  const u   = getEmployeeUser(employee);
                  const av  = avatarColors(u?.name || "");
                  const pct = Math.round((matchCount / totalRequired) * 100);
                  const wc  = employee.workload_percentage >= 85 ? "var(--red)" : employee.workload_percentage >= 60 ? "var(--amber)" : "var(--green)";
                  const selected = empId === employee.id;
                  return (
                    <motion.div
                      key={employee.id}
                      onClick={() => setEmpId(employee.id)}
                      whileHover={{ backgroundColor: selected ? "var(--primary-lt)" : "var(--surface-2)" }}
                      whileTap={{ scale: 0.99 }}
                      style={{
                        padding: "12px 20px", borderBottom: "1px solid var(--border)", cursor: "pointer",
                        background: selected ? "var(--primary-lt)" : "transparent",
                        outline: selected ? "2px solid var(--primary)" : "none",
                        outlineOffset: -2,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div className="avatar avatar-sm" style={{ background: av.bg, color: av.color }}>{initials(u?.name)}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{u?.name}</div>
                          <div style={{ fontSize: 12, color: "var(--text-2)" }}>{employee.position} · {employee.department}</div>
                          <div style={{ display: "flex", gap: 4, marginTop: 5, flexWrap: "wrap" }}>
                            {getEmployeeSkills(employee.id).map(s => {
                              const req = task.required_skill_ids.includes(s.id);
                              return (
                                <span key={s.id} className="skill-tag"
                                  style={{ background: req ? "var(--green-lt)" : "var(--primary-lt)", color: req ? "#065f46" : "var(--primary)", fontWeight: req ? 700 : 500 }}>
                                  {req && <Zap size={10} style={{ display: "inline", marginRight: 2 }} />}{s.name}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                          <StatusBadge value={employee.availability_status} />
                          <div style={{ fontSize: 11.5, fontWeight: 700, color: wc }}>{employee.workload_percentage}% load</div>
                          <div style={{ fontSize: 11, background: pct === 100 ? "var(--green-lt)" : "var(--amber-lt)", color: pct === 100 ? "#065f46" : "#92400e", padding: "2px 7px", borderRadius: 99, fontWeight: 700 }}>
                            {matchCount}/{totalRequired} skills
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {unmatchedDept.map(employee => {
                  const u   = getEmployeeUser(employee);
                  const av  = avatarColors(u?.name || "");
                  const wc  = employee.workload_percentage >= 85 ? "var(--red)" : employee.workload_percentage >= 60 ? "var(--amber)" : "var(--green)";
                  const selected = empId === employee.id;
                  return (
                    <div key={employee.id} onClick={() => setEmpId(employee.id)}
                      style={{
                        padding: "12px 20px", borderBottom: "1px solid var(--border)", cursor: "pointer",
                        background: selected ? "var(--primary-lt)" : "var(--surface-2)",
                        opacity: 0.7, outline: selected ? "2px solid var(--primary)" : "none", outlineOffset: -2,
                      }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div className="avatar avatar-sm" style={{ background: av.bg, color: av.color }}>{initials(u?.name)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{u?.name}</div>
                          <div style={{ fontSize: 12, color: "var(--muted)" }}>{employee.position} · No skill match</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                          <StatusBadge value={employee.availability_status} />
                          <div style={{ fontSize: 11.5, fontWeight: 700, color: wc }}>{employee.workload_percentage}% load</div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {matched.length === 0 && unmatchedDept.length === 0 && (
                  <div className="empty-state" style={{ padding: 32 }}><p>No employees available.</p></div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Confirm */}
          {step === 2 && task && selectedEmp && (
            <motion.div key="step-2" variants={stepVariants} initial="initial" animate="animate" exit="exit" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Confirm Assignment</h3>
              {[
                ["Task",       task.title],
                ["Priority",   task.priority],
                ["Type",       TASK_TYPE_LABEL[task.task_type]],
                ["Deadline",   task.deadline],
                ["Est. Hours", `${task.estimated_hours}h`],
                ["Assign To",  getEmployeeUser(selectedEmp)?.name],
                ["Department", selectedEmp.department],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 16, padding: "10px 14px", background: "var(--surface-2)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text-2)", minWidth: 110 }}>{k}</span>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{v}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer nav */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => step > 0 ? setStep(s => s - 1) : onClose()}>
            {step === 0 ? "Cancel" : "← Back"}
          </button>
          {step < 2 ? (
            <button
              className="btn btn-primary"
              disabled={(step === 0 && !taskId) || (step === 1 && !empId)}
              onClick={() => setStep(s => s + 1)}
            >
              Next →
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleConfirm}>
              <UserCheck size={15} /> Assign Task
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
