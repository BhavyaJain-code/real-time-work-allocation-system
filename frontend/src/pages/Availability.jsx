import { useState } from "react";
import { Plus, X, Edit2, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getEmployeeAvailability } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import { motion } from "framer-motion";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function getWeekDates() {
  const today = new Date();
  const mon = new Date(today);
  mon.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

export default function Availability() {
  const { employee } = useAuth();
  const [records, setRecords] = useState(
    employee ? getEmployeeAvailability(employee.id) : []
  );
  const [showModal, setShowModal]   = useState(false);
  const [editingId, setEditingId]   = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [form, setForm] = useState({ date: "", start_time: "09:00", end_time: "17:00", status: "available" });

  if (!employee) return (
    <div className="card"><div className="empty-state"><h3>No employee profile linked.</h3></div></div>
  );

  const weekDates = getWeekDates();

  const handleAdd = (e) => {
    e.preventDefault();
    setRecords(r => [...r, { id: Date.now(), employee_id: employee.id, ...form }]);
    setShowModal(false);
    setForm({ date: "", start_time: "09:00", end_time: "17:00", status: "available" });
  };

  const handleDelete = (id) => setRecords(r => r.filter(x => x.id !== id));

  const startEdit = (r) => { setEditingId(r.id); setEditStatus(r.status); };
  const saveEdit  = (id) => {
    setRecords(r => r.map(x => x.id === id ? { ...x, status: editStatus } : x));
    setEditingId(null);
  };

  const getSlot = (date) => records.find(r => r.date === date);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Personal Availability & Schedule</div>
          <div className="page-subtitle">Set your weekly shifts, availability statuses, and daily capacity</div>
        </div>
        <motion.button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={16} /> Add Schedule Slot
        </motion.button>
      </div>

      {/* Calendar Week View */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header"><span className="card-title">This Week's Visual Schedule</span></div>
        <div className="card-body">
          <div className="avail-grid">
            {weekDates.map((date, idx) => {
              const slot = getSlot(date);
              const dayNum = new Date(date).getDate();
              return (
                <div key={date} className="avail-day">
                  <div className="avail-day-name">{DAYS[idx]}</div>
                  <div className="avail-day-date" style={{ color: "#ffffff" }}>{dayNum}</div>
                  {slot ? (
                    <div>
                      <div className={`avail-slot ${slot.status}`}>
                        {slot.status}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--muted)" }}>
                        {slot.start_time} - {slot.end_time}
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: 11, color: "var(--muted)", fontStyle: "italic", marginTop: 6 }}>No slot</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="card">
        <div className="card-header"><span className="card-title">All Availability Records</span></div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Working Hours</th>
                <th>Availability Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id}>
                  <td className="td-bold" style={{ color: "var(--text)" }}>{r.date}</td>
                  <td>{r.start_time} — {r.end_time}</td>
                  <td>
                    {editingId === r.id ? (
                      <select
                        className="field-select"
                        style={{ padding: "4px 8px", height: "auto", width: "auto" }}
                        value={editStatus}
                        onChange={e => setEditStatus(e.target.value)}
                      >
                        <option value="available">Available</option>
                        <option value="busy">Busy</option>
                        <option value="off">Day Off</option>
                      </select>
                    ) : (
                      <StatusBadge value={r.status} />
                    )}
                  </td>
                  <td>
                    {editingId === r.id ? (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-primary btn-sm" onClick={() => saveEdit(r.id)}><Check size={13} /> Save</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}><X size={13} /></button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => startEdit(r)}><Edit2 size={12} /> Edit</button>
                        <button className="btn btn-ghost btn-sm" style={{ color: "#ee27d7" }} onClick={() => handleDelete(r.id)}><X size={13} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add Availability Slot</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} className="form-grid">
              <div className="field form-grid-full">
                <label>Date</label>
                <input className="field-input" type="date" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div className="field">
                <label>Start Time</label>
                <input className="field-input" type="time" value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} />
              </div>
              <div className="field">
                <label>End Time</label>
                <input className="field-input" type="time" value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} />
              </div>
              <div className="field form-grid-full">
                <label>Status</label>
                <select className="field-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="off">Day Off</option>
                </select>
              </div>
              <div className="modal-footer form-grid-full">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
