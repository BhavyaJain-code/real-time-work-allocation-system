import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { EMPLOYEES, USERS } from "../data/mockData";
import EmployeeCard from "../components/EmployeeCard";
import { StaggerContainer, StaggerItem, AnimatedNumber } from "../components/motion/MotionPrimitives";
import { motion } from "framer-motion";

export default function ManagerEmployees() {
  const { managedDept } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [availF, setAvailF] = useState("all");

  const myEmployees = EMPLOYEES.filter(e => e.department === managedDept);

  const filtered = myEmployees.filter(emp => {
    const user = USERS.find(u => u.id === emp.user_id);
    const name = user?.name?.toLowerCase() || "";
    const q    = search.toLowerCase();
    return (name.includes(q) || emp.position.toLowerCase().includes(q))
      && (availF === "all" || emp.availability_status === availF);
  });

  const availableCount = myEmployees.filter(e => e.availability_status === "available").length;
  const avgWorkload    = myEmployees.length ? Math.round(myEmployees.reduce((s, e) => s + e.workload_percentage, 0) / myEmployees.length) : 0;

  const stats = [
    { label: "Dept Team Size",  value: myEmployees.length, trend: `${managedDept} Dept` },
    { label: "Available Now",   value: availableCount,     trend: "Ready to take tasks" },
    { label: "High Capacity",   value: myEmployees.filter(e => e.availability_status === "busy").length, trend: "Busy slots" },
    { label: "Avg Workload",    value: avgWorkload, suffix: "%", trend: "Team balance" },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{managedDept} Team Directory</div>
          <div className="page-subtitle">{myEmployees.length} department members & skill profiles</div>
        </div>
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
                <AnimatedNumber value={s.value} suffix={s.suffix || ""} />
              </div>
              <div className="stat-sub">
                <TrendingUp size={14} color="#ee27d7" /> {s.trend}
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="filter-bar">
        <div className="search-wrap">
          <Search size={15} className="search-icon" />
          <input className="search-input" placeholder="Search team…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={availF} onChange={e => setAvailF(e.target.value)}>
          <option value="all">All Availability</option>
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card"><div className="empty-state"><h3>No team members found</h3></div></div>
      ) : (
        <div className="grid-3">
          {filtered.map(emp => (
            <EmployeeCard key={emp.id} employee={emp} onClick={() => navigate(`/admin/employees/${emp.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
