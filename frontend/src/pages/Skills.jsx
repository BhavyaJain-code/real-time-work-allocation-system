import { useState } from "react";
import { Zap, Plus, Trash2, X, TrendingUp } from "lucide-react";
import { SKILLS, EMPLOYEE_SKILLS, TASKS } from "../data/mockData";
import { StaggerContainer, StaggerItem, AnimatedNumber } from "../components/motion/MotionPrimitives";
import { motion } from "framer-motion";

export default function Skills() {
  const [skills, setSkills] = useState(SKILLS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Frontend", description: "" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSkills(s => [...s, { id: Date.now(), name: form.name.trim(), category: form.category, description: form.description.trim() }]);
    setForm({ name: "", category: "Frontend", description: "" });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this skill?")) setSkills(s => s.filter(x => x.id !== id));
  };

  const empCount = (skillId) => EMPLOYEE_SKILLS.filter(e => e.skill_ids.includes(skillId)).length;
  const taskCount = (skillId) => TASKS.filter(t => t.required_skill_ids.includes(skillId)).length;

  const categories = [...new Set(skills.map(s => s.category || "General"))];

  const stats = [
    { label: "Total Skills",     value: skills.length,      trend: "In registry" },
    { label: "Skill Categories", value: categories.length,  trend: "Domain fields" },
    { label: "Top Skill Match",  value: 4,                  trend: "React.js / Node.js" },
    { label: "Total Mappings",   value: EMPLOYEE_SKILLS.reduce((s, e) => s + e.skill_ids.length, 0), trend: "Verified competencies" },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Skills Competency Matrix</div>
          <div className="page-subtitle">{skills.length} skills in automated matching index</div>
        </div>
        <motion.button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={16} /> Add New Skill
        </motion.button>
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
                <AnimatedNumber value={s.value} />
              </div>
              <div className="stat-sub">
                <TrendingUp size={14} color="#ee27d7" /> {s.trend}
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Skill Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Employee Mastery</th>
                <th>Active Task Demand</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "var(--radius)", background: "rgba(245, 217, 130, 0.16)", border: "1px solid rgba(245, 217, 130, 0.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5d982" }}>
                        <Zap size={16} color="#f5d982" />
                      </div>
                      <span className="td-bold" style={{ color: "var(--text)" }}>{s.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-pink">{s.category || "General"}</span>
                  </td>
                  <td className="td-muted" style={{ maxWidth: 300 }}>{s.description || "—"}</td>
                  <td>
                    <span className="badge badge-blue">
                      {empCount(s.id)} employees
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-accent">
                      {taskCount(s.id)} tasks
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: "#ee27d7" }}
                      onClick={() => handleDelete(s.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add New Skill to Registry</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} className="form-grid">
              <div className="field form-grid-full">
                <label>Skill Name</label>
                <input className="field-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Next.js, Rust, TailwindCSS" />
              </div>
              <div className="field form-grid-full">
                <label>Category</label>
                <select className="field-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Design">Design</option>
                  <option value="Cloud">Cloud</option>
                </select>
              </div>
              <div className="field form-grid-full">
                <label>Description</label>
                <textarea className="field-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief summary of skills and use-cases…" />
              </div>
              <div className="modal-footer form-grid-full">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Skill</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
