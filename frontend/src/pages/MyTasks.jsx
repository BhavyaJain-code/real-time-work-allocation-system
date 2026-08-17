import { useAuth } from "../context/AuthContext";
import { getTask, getEmployeeAssignments } from "../data/mockData";
import TaskCard from "../components/TaskCard";

const COLUMNS = [
  { key: "assigned",    label: "Assigned",    color: "var(--primary)" },
  { key: "in_progress", label: "In Progress", color: "var(--blue)" },
  { key: "completed",   label: "Completed",   color: "var(--green)" },
];

export default function MyTasks() {
  const { employee } = useAuth();

  if (!employee) return (
    <div className="card"><div className="empty-state"><h3>No profile linked</h3></div></div>
  );

  const assignments = getEmployeeAssignments(employee.id);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">My Tasks</div>
          <div className="page-subtitle">{assignments.length} total assignments</div>
        </div>
      </div>

      <div className="kanban">
        {COLUMNS.map(col => {
          const colAssignments = assignments.filter(a => a.status === col.key);
          return (
            <div className="kanban-col" key={col.key}>
              <div className="kanban-col-header">
                <span style={{ width: 10, height: 10, borderRadius: "99px", background: col.color, display: "inline-block" }} />
                {col.label}
                <span className="kanban-col-count">{colAssignments.length}</span>
              </div>
              <div className="kanban-col-body">
                {colAssignments.length === 0 ? (
                  <div style={{ padding: "20px 0", textAlign: "center", color: "var(--muted)", fontSize: 12.5 }}>
                    No tasks here
                  </div>
                ) : (
                  colAssignments.map(a => {
                    const task = getTask(a.task_id);
                    return task ? <TaskCard key={a.id} task={task} /> : null;
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
