import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { EMPLOYEES, USERS } from "../data/mockData";
import EmployeeCard from "../components/EmployeeCard";
import { StaggerContainer, StaggerItem, AnimatedNumber } from "../components/motion/MotionPrimitives";

export default function Employees() {
  const navigate = useNavigate();
  const [search, setSearch]   = useState("");
  const [deptF,  setDeptF]    = useState("all");
  const [availF, setAvailF]   = useState("all");

  const departments = [...new Set(EMPLOYEES.map(e => e.department))];

  const filtered = EMPLOYEES.filter(emp => {
    const user = USERS.find(u => u.id === emp.user_id);
    const name = user?.name?.toLowerCase() || "";
    const q = search.toLowerCase();
    const matchSearch = name.includes(q) || emp.position.toLowerCase().includes(q) || emp.department.toLowerCase().includes(q);
    const matchDept   = deptF  === "all" || emp.department === deptF;
    const matchAvail  = availF === "all" || emp.availability_status === availF;
    return matchSearch && matchDept && matchAvail;
  });

  const availableCount = EMPLOYEES.filter(e => e.availability_status === "available").length;
  const busyCount      = EMPLOYEES.filter(e => e.availability_status === "busy").length;
  const avgWorkload    = Math.round(EMPLOYEES.reduce((s, e) => s + e.workload_percentage, 0) / EMPLOYEES.length);

  const empStats = [
    { label: "Total Team",      value: EMPLOYEES.length, trend: "3 Departments" },
    { label: "Available Now",   value: availableCount,   trend: "Ready for tasks" },
    { label: "High Capacity",   value: busyCount,        trend: "Busy / Active" },
    { label: "Avg Workload",    value: avgWorkload, suffix: "%", trend: "Balanced" },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Employees Directory</div>
          <div className="page-subtitle">{EMPLOYEES.length} talent profiles & skill matrices</div>
        </div>
        <motion.button
          className="btn btn-primary"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={16} /> Add Employee
        </motion.button>
      </div>

      {/* Top Cobalt Metric Cards */}
      <StaggerContainer className="stats-grid" staggerDelay={0.07}>
        {empStats.map((s, i) => (
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
          <input className="search-input" placeholder="Search employees…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={deptF} onChange={e => setDeptF(e.target.value)}>
          <option value="all">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="filter-select" value={availF} onChange={e => setAvailF(e.target.value)}>
          <option value="all">All Availability</option>
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card"><div className="empty-state"><h3>No employees found</h3><p>Try adjusting your search filters.</p></div></div>
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
