import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { AVAILABILITY, getEmployeeAvailability } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Generate current week dates (Mon–Sun)
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
  const [showModal, setShowModal] = useState(false);
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

  const getSlot = (date) => records.find(r => r.date === date);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">My Availability</div>
          <div className="page-subtitle">This week's schedule</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Slot
        </button>
      </div>

      {/* Weekly calendar */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header"><span className="card-title">Weekly View</span></div>
        <div className="card-body">
          <div className="avail-grid">
            {weekDates.map((date, i) => {
              const slot = getSlot(date);
              const isToday = date === new Date().toISOString().split("T")[0];
              return (
                <div
                  key={date}
                  className="avail-day"
                  style={{ borderColor: isToday ? "var(--primary)" : "var(--border)", background: isToday ? "var(--primary-lt)" : "var(--surface)" }}
                >
                  <div className="avail-day-name">{DAYS[i]}</div>
                  <div className="avail-day-date" style={{ color: isToday ? "var(--primary)" : "var(--text)" }}>
                    {parseInt(date.split("-")[2])}
                  </div>
                  {slot ? (
                    <div className={`avail-slot ${slot.status}`}>
                      {slot.status === "off" ? "Off" : `${slot.start_time}–${slot.end_time}`}
                    </div>
                  ) : (
                    <div className="avail-slot off">No data</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header"><span className="card-title">All Availability Records</span></div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--muted)", padding: 28 }}>No availability records.</td></tr>
              ) : records.map(r => (
                <tr key={r.id}>
                  <td className="td-bold">{r.date}</td>
                  <td>{r.status === "off" ? "—" : r.start_time}</td>
                  <td>{r.status === "off" ? "—" : r.end_time}</td>
                  <td><StatusBadge value={r.status} /></td>
                  <td>
                    <button className="btn btn-ghost btn-sm" style={{ color: "var(--red)" }} onClick={() => handleDelete(r.id)}>
                      <X size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Add Availability Slot</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="field">
                <label>Date *</label>
                <input className="field-input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
              </div>
              <div className="field">
                <label>Status</label>
                <select className="field-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="off">Day Off</option>
                </select>
              </div>
              {form.status !== "off" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="field">
                    <label>Start Time</label>
                    <input className="field-input" type="time" value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} />
                  </div>
                  <div className="field">
                    <label>End Time</label>
                    <input className="field-input" type="time" value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} />
                  </div>
                </div>
              )}
              <div className="modal-footer" style={{ marginTop: 4 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Slot</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
