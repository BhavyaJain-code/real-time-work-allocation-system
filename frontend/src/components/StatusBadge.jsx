import { STATUS_BADGE, PRIORITY_BADGE, STATUS_LABEL } from "../data/mockData";

export default function StatusBadge({ value, type = "status" }) {
  const map   = type === "priority" ? PRIORITY_BADGE : STATUS_BADGE;
  const cls   = map[value] || "badge-gray";
  const label = STATUS_LABEL[value] || value;

  return (
    <span className={`badge ${cls}`}>
      <span className="badge-dot" style={{ background: "currentColor", opacity: 0.7 }} />
      {label}
    </span>
  );
}
