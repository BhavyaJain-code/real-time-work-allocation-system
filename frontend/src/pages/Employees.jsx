import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { EMPLOYEES, USERS } from "../data/mockData";
import EmployeeCard from "../components/EmployeeCard";

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

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Employees</div>
          <div className="page-subtitle">{EMPLOYEES.length} team members</div>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> Add Employee
        </button>
      </div>

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
        <div className="card"><div className="empty-state"><h3>No employees found</h3><p>Try adjusting your filters.</p></div></div>
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
