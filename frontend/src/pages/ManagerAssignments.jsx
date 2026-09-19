import { useState } from "react";
import { TASKS, EMPLOYEES, TASK_ASSIGNMENTS, getEmployeeUser } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

export default function Assignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState(TASK_ASSIGNMENTS);
  const [selectedTask, setSelectedTask] = useState(TASKS[0]?.id || 1);
  const [selectedEmp, setSelectedEmp] = useState(EMPLOYEES[0]?.id || 1);
  const [allocationStatus, setAllocationStatus] = useState("assigned");
  const [notification, setNotification] = useState("");

  const handleAssign = (e) => {
    e.preventDefault();
    const newAssignment = {
      id: assignments.length + 1,
      task_id: Number(selectedTask),
      employee_id: Number(selectedEmp),
      assigned_at: new Date().toISOString().split("T")[0],
      status: allocationStatus
    };
    setAssignments([newAssignment, ...assignments]);
    TASK_ASSIGNMENTS.unshift(newAssignment);
    setNotification("Task successfully allocated to employee.");
    setTimeout(() => setNotification(""), 3000);
  };

  const handleRemoveAssignment = (id) => {
    const updated = assignments.filter(a => a.id !== id);
    setAssignments(updated);
  };

  return (
    <div>
      {/* Top Banner */}
      <div style={{ border: "1px solid #000000", padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: "bold", margin: 0 }}>
            Task Allocation &amp; Resource Assignment
          </h2>
          <div style={{ fontSize: 13, color: "#444444", marginTop: 2 }}>
            Assign deliverables to staff members, balance department workloads, and manage active allocations.
          </div>
        </div>
      </div>

      {notification && (
        <div style={{ border: "1px solid #000000", padding: "8px 12px", marginBottom: 16, fontWeight: "bold" }}>
          Success: {notification}
        </div>
      )}

      {/* Allocation Form Card */}
      <div className="wt-card" style={{ marginBottom: 16 }}>
        <div className="wt-card-header">
          <h2 className="wt-card-title">Allocate Task Deliverable</h2>
        </div>
        <form onSubmit={handleAssign} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Select Task:</label>
            <select 
              className="form-control" 
              style={{ width: "100%" }}
              value={selectedTask}
              onChange={e => setSelectedTask(e.target.value)}
            >
              {TASKS.map(t => (
                <option key={t.id} value={t.id}>{t.title} ({t.priority})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Assign To Staff:</label>
            <select 
              className="form-control" 
              style={{ width: "100%" }}
              value={selectedEmp}
              onChange={e => setSelectedEmp(e.target.value)}
            >
              {EMPLOYEES.map(emp => {
                const u = getEmployeeUser(emp);
                return (
                  <option key={emp.id} value={emp.id}>{u?.name} ({emp.department} - {emp.position})</option>
                );
              })}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Initial Status:</label>
            <select 
              className="form-control" 
              style={{ width: "100%" }}
              value={allocationStatus}
              onChange={e => setAllocationStatus(e.target.value)}
            >
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Completed</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: "8px 16px" }}>
            Assign Deliverable
          </button>
        </form>
      </div>

      {/* Allocation Matrix Table */}
      <div className="wt-card">
        <div className="wt-card-header">
          <div>
            <h2 className="wt-card-title">Current Resource Allocations ({assignments.length} assignments)</h2>
            <div className="wt-card-subtitle">Active task mappings across staff members</div>
          </div>
        </div>

        <table className="wt-table">
          <thead>
            <tr>
              <th>Task Deliverable</th>
              <th>Assigned Employee</th>
              <th>Department</th>
              <th>Assignment Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(a => {
              const task = TASKS.find(t => t.id === a.task_id);
              const emp = EMPLOYEES.find(e => e.id === a.employee_id);
              const u = getEmployeeUser(emp);
              return (
                <tr key={a.id}>
                  <td>
                    <strong>{task?.title || "Task #" + a.task_id}</strong>
                    <div style={{ fontSize: 11, color: "#444444" }}>Deadline: {task?.deadline} | {task?.estimated_hours} hrs</div>
                  </td>
                  <td>
                    <strong>{u?.name || "Staff #" + a.employee_id}</strong>
                    <div style={{ fontSize: 11, color: "#444444" }}>{emp?.position}</div>
                  </td>
                  <td>{emp?.department}</td>
                  <td>{a.assigned_at}</td>
                  <td><StatusBadge value={a.status} /></td>
                  <td>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleRemoveAssignment(a.id)}
                    >
                      Unassign
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
