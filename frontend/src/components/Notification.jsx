import { CheckSquare, AlertCircle, Clock, Bell } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.div
      className={`notif-item${notif.is_read ? "" : " unread"}`}
      onClick={() => onRead && onRead(notif.id)}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4, backgroundColor: "var(--surface-2)", transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      style={{ cursor: "pointer" }}
    >
      <motion.div
        className="notif-icon"
        style={{ background: meta.bg, color: meta.color }}
        whileHover={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.3 }}
      >
        {meta.icon}
      </motion.div>
      <div className="notif-content">
        <div className="notif-msg">{notif.message}</div>
        <div className="notif-time">{timeAgo(notif.created_at)}</div>
      </div>
      {!notif.is_read && (
        <motion.div
          className="notif-unread-dot"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
        />
      )}
    </motion.div>
  );
}
