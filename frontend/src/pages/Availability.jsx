import { useState } from "react";
import { Plus, X, Edit2, Check, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getEmployeeAvailability } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import { StaggerContainer, StaggerItem, AnimatedNumber } from "../components/motion/MotionPrimitives";
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

  const availableDays = records.filter(r => r.status === "available").length;
  const busyDays      = records.filter(r => r.status === "busy").length;

  const stats = [
    { label: "Available Days",  value: availableDays, trend: "Ready for allocation" },
    { label: "High Workload",   value: busyDays,      trend: "Busy slots" },
    { label: "Days Off",        value: records.filter(r => r.status === "off").length, trend: "Scheduled off" },
    { label: "Total Logged",    value: records.length, trend: "Calendar entries" },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Personal Availability & Calendar</div>
          <div className="page-subtitle">Schedule your weekly shifts, availability statuses, and capacity limits</div>
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
                <th>Inline Action</th>
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
