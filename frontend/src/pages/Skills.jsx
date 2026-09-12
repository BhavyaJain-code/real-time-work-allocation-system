import { useState } from "react";
import { Zap, Plus, Trash2, X } from "lucide-react";
import { SKILLS, EMPLOYEE_SKILLS, TASKS } from "../data/mockData";

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

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Skills Matrix Registry</div>
          <div className="page-subtitle">{skills.length} skills recorded in system</div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={15} /> Add Skill
        </button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Skill Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Employees With Skill</th>
                <th>Tasks Requiring Skill</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map(s => (
                <tr key={s.id}>
                  <td>
                    <span className="td-bold">{s.name}</span>
                  </td>
                  <td>
                    <span className="badge badge-gray">{s.category || "General"}</span>
                  </td>
                  <td className="td-muted" style={{ maxWidth: 300 }}>{s.description || "—"}</td>
                  <td>
                    <span className="badge badge-blue">
                      {empCount(s.id)} employees
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-amber">
                      {taskCount(s.id)} tasks
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: "#dc3545" }}
                      onClick={() => handleDelete(s.id)}
                    >
                      <Trash2 size={14} /> Delete
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
              <div className="modal-title">Add New Skill</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={15} /></button>
            </div>
            <form onSubmit={handleAdd} className="form-grid">
              <div className="field form-grid-full">
                <label>Skill Name</label>
                <input className="field-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. React, Python, SQL" />
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
                <textarea className="field-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description of skill..." />
              </div>
              <div className="modal-footer form-grid-full">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Skill</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
