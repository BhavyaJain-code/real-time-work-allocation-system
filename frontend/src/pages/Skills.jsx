import { useState } from "react";
import { Zap, Plus, Trash2, X } from "lucide-react";
import { SKILLS, EMPLOYEE_SKILLS, TASKS } from "../data/mockData";

export default function Skills() {
  const [skills, setSkills] = useState(SKILLS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSkills(s => [...s, { id: Date.now(), name: form.name.trim(), description: form.description.trim() }]);
    setForm({ name: "", description: "" });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this skill?")) setSkills(s => s.filter(x => x.id !== id));
  };

  // Count employees with each skill
  const empCount = (skillId) => EMPLOYEE_SKILLS.filter(e => e.skill_ids.includes(skillId)).length;
  const taskCount = (skillId) => TASKS.filter(t => t.required_skill_ids.includes(skillId)).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Skills</div>
          <div className="page-subtitle">{skills.length} skills in registry</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Skill
        </button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Skill Name</th>
                <th>Description</th>
                <th>Employees</th>
                <th>Tasks Requiring</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "var(--radius)", background: "var(--primary-lt)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                        <Zap size={15} />
                      </div>
                      <span className="td-bold">{s.name}</span>
                    </div>
                  </td>
                  <td className="td-muted">{s.description}</td>
                  <td>
                    <span className="badge badge-indigo">{empCount(s.id)} employees</span>
                  </td>
                  <td>
                    <span className="badge badge-blue">{taskCount(s.id)} tasks</span>
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm" style={{ color: "var(--red)" }} onClick={() => handleDelete(s.id)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Skill Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Add New Skill</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="field">
                <label>Skill Name *</label>
                <input className="field-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. React" required />
              </div>
              <div className="field">
                <label>Description</label>
                <textarea className="field-textarea" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description of the skill" />
              </div>
              <div className="modal-footer" style={{ marginTop: 0 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Skill</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
