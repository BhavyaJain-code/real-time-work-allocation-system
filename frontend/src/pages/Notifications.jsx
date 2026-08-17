import { useState } from "react";
import { CheckCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getEmployeeNotifications, getTask } from "../data/mockData";
import NotificationItem from "../components/Notification";

const TYPE_LABELS = {
  all:            "All",
  task_assigned:  "Assigned",
  task_updated:   "Updated",
  task_completed: "Completed",
  reminder:       "Reminders",
};

export default function Notifications() {
  const { employee } = useAuth();
  const [notifs, setNotifs] = useState(
    employee ? getEmployeeNotifications(employee.id) : []
  );
  const [filter, setFilter] = useState("all");

  if (!employee) return (
    <div className="card"><div className="empty-state"><h3>No employee profile linked.</h3></div></div>
  );

  const unread  = notifs.filter(n => !n.is_read).length;
  const filtered = filter === "all" ? notifs : notifs.filter(n => n.type === filter);

  const markRead  = (id) => setNotifs(n => n.map(x => x.id === id ? { ...x, is_read: true } : x));
  const markAll   = () => setNotifs(n => n.map(x => ({ ...x, is_read: true })));

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Notifications</div>
          <div className="page-subtitle">{unread} unread</div>
        </div>
        {unread > 0 && (
          <button className="btn btn-secondary" onClick={markAll}>
            <CheckCheck size={15} /> Mark all as read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
        {Object.entries(TYPE_LABELS).map(([k, v]) => {
          const count = k === "all" ? notifs.length : notifs.filter(n => n.type === k).length;
          return (
            <button
              key={k}
              className={`btn btn-sm ${filter === k ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setFilter(k)}
            >
              {v} {count > 0 && <span style={{ opacity: 0.7, fontSize: 11 }}>({count})</span>}
            </button>
          );
        })}
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state"><h3>No notifications</h3><p>You're all caught up!</p></div>
        ) : (
          filtered.map(n => <NotificationItem key={n.id} notif={n} onRead={markRead} />)
        )}
      </div>
    </div>
  );
}
