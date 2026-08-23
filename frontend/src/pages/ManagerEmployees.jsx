import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { EMPLOYEES, USERS } from "../data/mockData";
import EmployeeCard from "../components/EmployeeCard";

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

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{managedDept} Employees</div>
          <div className="page-subtitle">{myEmployees.length} team members</div>
        </div>
      </div>

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
