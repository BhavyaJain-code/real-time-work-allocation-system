import { useState } from "react";
import { TASKS, EMPLOYEES, TASK_ASSIGNMENTS } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

export default function Tasks() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";

  const [taskList, setTaskList] = useState(TASKS);
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTaskModal, setEditTaskModal] = useState(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState("Feature Development");
  const [estimatedHours, setEstimatedHours] = useState(12);
  const [priority, setPriority] = useState("medium");
  const [deadline, setDeadline] = useState("2026-09-30");

  const handleCreateTask = (e) => {
    e.preventDefault();
    const newTask = {
      id: taskList.length + 1,
      title: title.trim(),
      description: description.trim(),
      task_type: taskType,
      estimated_hours: Number(estimatedHours),
      priority: priority,
      deadline: deadline,
      status: "pending",
      created_by: user?.id || 1,
      created_at: new Date().toISOString().split("T")[0]
    };
    setTaskList([newTask, ...taskList]);
    TASKS.unshift(newTask);
    setShowCreateModal(false);
    resetForm();
  };

  const handleEditTask = (e) => {
    e.preventDefault();
    if (!editTaskModal) return;

    const updated = taskList.map(t => {
      if (t.id === editTaskModal.id) {
        return {
          ...t,
          title: title.trim(),
          description: description.trim(),
          task_type: taskType,
          estimated_hours: Number(estimatedHours),
          priority: priority,
          deadline: deadline,
          status: editTaskModal.status
        };
      }
      return t;
    });

    setTaskList(updated);
    // update mockData
    const idx = TASKS.findIndex(t => t.id === editTaskModal.id);
    if (idx !== -1) {
      TASKS[idx] = { ...TASKS[idx], title, description, task_type: taskType, estimated_hours: Number(estimatedHours), priority, deadline };
    }

    setEditTaskModal(null);
    resetForm();
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const updated = taskList.filter(t => t.id !== taskId);
      setTaskList(updated);
      const idx = TASKS.findIndex(t => t.id === taskId);
      if (idx !== -1) TASKS.splice(idx, 1);
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    const updated = taskList.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    setTaskList(updated);
    const idx = TASKS.findIndex(t => t.id === taskId);
    if (idx !== -1) TASKS[idx].status = newStatus;
  };

  const openEdit = (task) => {
    setEditTaskModal(task);
    setTitle(task.title);
    setDescription(task.description);
    setTaskType(task.task_type);
    setEstimatedHours(task.estimated_hours);
    setPriority(task.priority);
    setDeadline(task.deadline);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTaskType("Feature Development");
    setEstimatedHours(12);
    setPriority("medium");
    setDeadline("2026-09-30");
  };

  const filteredTasks = taskList.filter(t => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !t.description?.toLowerCase().includes(q)) return false;
    }
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div>
      {/* Top Banner */}
      <div style={{ border: "1px solid #000000", padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: "bold", margin: 0 }}>
            Work Allocation &amp; Task Deliverables Management
          </h2>
          <div style={{ fontSize: 13, color: "#444444", marginTop: 2 }}>
            Complete task lifecycle: Create, update, allocate, track status, and remove tasks.
          </div>
        </div>
        {(isAdmin || isManager) && (
          <button 
            className="btn btn-primary"
            onClick={() => { resetForm(); setShowCreateModal(true); }}
          >
            + Create New Task
          </button>
        )}
      </div>

      {/* Filter Bar with Dropdowns */}
      <div style={{ border: "1px solid #000000", padding: "12px", marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: "bold", display: "block" }}>Search Task:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search title, description..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ minWidth: 200 }}
          />
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: "bold", display: "block" }}>Status:</label>
          <select 
            className="form-control"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Completed</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: "bold", display: "block" }}>Priority:</label>
          <select 
            className="form-control"
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {(searchTerm || statusFilter !== "all" || priorityFilter !== "all") && (
          <button 
            className="btn btn-secondary btn-sm" 
            style={{ alignSelf: "flex-end" }}
            onClick={() => { setSearchTerm(""); setStatusFilter("all"); setPriorityFilter("all"); }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Tasks Table */}
      <div className="wt-card">
        <div className="wt-card-header">
          <div>
            <h2 className="wt-card-title">Task Deliverables ({filteredTasks.length} tasks)</h2>
            <div className="wt-card-subtitle">Manage assignments and update task states</div>
          </div>
        </div>

        <table className="wt-table">
          <thead>
            <tr>
              <th>Task Title &amp; Description</th>
              <th>Type / Scope</th>
              <th>Hours</th>
              <th>Deadline</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr key={task.id}>
                <td>
                  <strong>{task.title}</strong>
                  <div style={{ fontSize: 11, color: "#444444" }}>{task.description}</div>
                </td>
                <td>{task.task_type}</td>
                <td>{task.estimated_hours} hrs</td>
                <td><strong>{task.deadline}</strong></td>
                <td><StatusBadge value={task.priority} type="priority" /></td>
                <td>
                  <select
                    className="form-control"
                    style={{ fontSize: 12, padding: "2px 4px" }}
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Completed</option>
                  </select>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button 
                      className="btn btn-sm"
                      onClick={() => openEdit(task)}
                    >
                      Edit
                    </button>
                    {(isAdmin || isManager) && (
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE TASK MODAL */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: 550 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: 16, textTransform: "uppercase" }}>
                Create New Task Deliverable
              </h3>
              <button className="btn btn-sm" onClick={() => setShowCreateModal(false)}>
                Close
              </button>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Task Title:</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    style={{ width: "100%" }} 
                    placeholder="e.g. Implement OAuth Flow" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Task Description:</label>
                  <textarea 
                    className="form-control" 
                    style={{ width: "100%", height: 70 }} 
                    placeholder="Provide deliverables detail..." 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    required 
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Task Type:</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      style={{ width: "100%" }} 
                      value={taskType} 
                      onChange={e => setTaskType(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Estimated Hours:</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      style={{ width: "100%" }} 
                      value={estimatedHours} 
                      onChange={e => setEstimatedHours(e.target.value)} 
                      min="1" 
                    />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Priority:</label>
                    <select 
                      className="form-control" 
                      style={{ width: "100%" }} 
                      value={priority} 
                      onChange={e => setPriority(e.target.value)}
                    >
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Target Deadline:</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      style={{ width: "100%" }} 
                      value={deadline} 
                      onChange={e => setDeadline(e.target.value)} 
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Create Task</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TASK MODAL */}
      {editTaskModal && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: 550 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: 16, textTransform: "uppercase" }}>
                Update Task Deliverable
              </h3>
              <button className="btn btn-sm" onClick={() => setEditTaskModal(null)}>
                Close
              </button>
            </div>
            <form onSubmit={handleEditTask}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Task Title:</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    style={{ width: "100%" }} 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Task Description:</label>
                  <textarea 
                    className="form-control" 
                    style={{ width: "100%", height: 70 }} 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    required 
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Task Type:</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      style={{ width: "100%" }} 
                      value={taskType} 
                      onChange={e => setTaskType(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Estimated Hours:</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      style={{ width: "100%" }} 
                      value={estimatedHours} 
                      onChange={e => setEstimatedHours(e.target.value)} 
                      min="1" 
                    />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Priority:</label>
                    <select 
                      className="form-control" 
                      style={{ width: "100%" }} 
                      value={priority} 
                      onChange={e => setPriority(e.target.value)}
                    >
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: "bold", marginBottom: 2 }}>Target Deadline:</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      style={{ width: "100%" }} 
                      value={deadline} 
                      onChange={e => setDeadline(e.target.value)} 
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditTaskModal(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
