import { CheckSquare, AlertCircle, Clock, Bell } from "lucide-react";

const TYPE_META = {
  task_assigned:  { icon: <CheckSquare size={16} />, bg: "var(--primary-lt)",  color: "var(--primary)" },
  task_updated:   { icon: <AlertCircle size={16} />, bg: "var(--amber-lt)",    color: "var(--amber)" },
  task_completed: { icon: <CheckSquare size={16} />, bg: "var(--green-lt)",    color: "var(--green)" },
  reminder:       { icon: <Clock size={16} />,       bg: "var(--blue-lt)",     color: "var(--blue)" },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60)   return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs  < 24)   return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationItem({ notif, onRead }) {
  const meta = TYPE_META[notif.type] || { icon: <Bell size={16} />, bg: "var(--surface-2)", color: "var(--muted)" };

  return (
    <div
      className={`notif-item${notif.is_read ? "" : " unread"}`}
      onClick={() => onRead && onRead(notif.id)}
    >
      <div className="notif-icon" style={{ background: meta.bg, color: meta.color }}>
        {meta.icon}
      </div>
      <div className="notif-content">
        <div className="notif-msg">{notif.message}</div>
        <div className="notif-time">{timeAgo(notif.created_at)}</div>
      </div>
      {!notif.is_read && <div className="notif-unread-dot" />}
    </div>
  );
}
