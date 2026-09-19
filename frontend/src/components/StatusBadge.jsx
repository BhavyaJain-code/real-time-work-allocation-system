import { STATUS_LABEL } from "../data/mockData";

export default function StatusBadge({ value, type = "status" }) {
  const label = STATUS_LABEL[value] || value;

  return (
    <span className="badge">
      [{label}]
    </span>
  );
}
