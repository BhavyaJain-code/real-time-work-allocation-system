import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getEmployeeTasks, TASKS } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";

export default function MyTasks() {
  const { employee } = useAuth();
  const empId = employee?.id || 1;
  const [tasks, setTasks] = useState(getEmployeeTasks(empId));

  const handleUpdateStatus = (taskId, newStatus) => {
    const updated = tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    setTasks(updated);
    const globalTask = TASKS.find(t => t.id === taskId);
    if (globalTask) globalTask.status = newStatus;
  };

  return (
    <div>
      <div style={{ border: "1px solid #000000", padding: "12px 16px", marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: "bold", margin: 0 }}>
          My Scheduled Tasks &amp; Deliverables
        </h2>
        <div style={{ fontSize: 13, color: "#444444", marginTop: 2 }}>
          Your active queue of assigned project deliverables and sprint milestones.
        </div>
      </div>

      <div className="wt-card">
        <div className="wt-card-header">
          <h2 className="wt-card-title">Assigned Deliverables ({tasks.length} tasks)</h2>
        </div>
        <table className="wt-table">
          <thead>
            <tr>
              <th>Task Deliverable</th>
              <th>Scope / Type</th>
              <th>Estimated Duration</th>
              <th>Target Deadline</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(t => (
              <tr key={t.id}>
                <td>
                  <strong>{t.title}</strong>
                  <div style={{ fontSize: 11, color: "#444444" }}>{t.description}</div>
                </td>
                <td>{t.task_type}</td>
                <td>{t.estimated_hours} hrs</td>
                <td><strong>{t.deadline}</strong></td>
                <td><StatusBadge value={t.priority} type="priority" /></td>
                <td><StatusBadge value={t.status} /></td>
                <td>
                  <select
                    className="form-control"
                    style={{ fontSize: 12, padding: "2px 4px" }}
                    value={t.status}
                    onChange={(e) => handleUpdateStatus(t.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
