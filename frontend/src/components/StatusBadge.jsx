import { motion } from "framer-motion";
import { STATUS_BADGE, PRIORITY_BADGE, STATUS_LABEL } from "../data/mockData";

export default function StatusBadge({ value, type = "status" }) {
  const map   = type === "priority" ? PRIORITY_BADGE : STATUS_BADGE;
  const cls   = map[value] || "badge-gray";
  const label = STATUS_LABEL[value] || value;

  return (
    <motion.span
      className={`badge ${cls}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
      whileHover={{ scale: 1.04 }}
    >
      <span className="badge-dot" style={{ background: "currentColor", opacity: 0.7 }} />
      {label}
    </motion.span>
  );
}
