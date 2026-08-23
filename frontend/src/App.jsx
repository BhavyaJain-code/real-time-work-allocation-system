import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";

import Login    from "./pages/Login";
import Register from "./pages/Register";
import Profile  from "./pages/Profile";

// Admin pages
import AdminDashboard  from "./pages/AdminDashboard";
import Tasks           from "./pages/Tasks";
import CreateTask      from "./pages/CreateTask";
import Assignments     from "./pages/Assignments";
import Employees       from "./pages/Employees";
import EmployeeProfile from "./pages/EmployeeProfile";
import Skills          from "./pages/Skills";
import Analytics       from "./pages/Analytics";
import UserManagement  from "./pages/UserManagement";
import ProgressReport  from "./pages/ProgressReport";
import Feedback        from "./pages/Feedback";
import ActivityLog     from "./pages/ActivityLog";

// Employee pages
import EmployeeDashboard from "./pages/EmployeeDashboard";
import MyTasks           from "./pages/MyTasks";
import Availability      from "./pages/Availability";
import Notifications     from "./pages/Notifications";

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin" || user.role === "manager") return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/employee/dashboard" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/"         element={<RootRedirect />} />

          <Route element={<Layout />}>
            {/* Shared */}
            <Route path="/profile" element={<Profile />} />

            {/* Admin + Manager shared */}
            <Route path="/admin/dashboard"     element={<AdminDashboard />} />
            <Route path="/admin/tasks"         element={<Tasks />} />
            <Route path="/admin/tasks/create"  element={<CreateTask />} />
            <Route path="/admin/assignments"   element={<Assignments />} />
            <Route path="/admin/employees"     element={<Employees />} />
            <Route path="/admin/employees/:id" element={<EmployeeProfile />} />

            {/* Admin only */}
            <Route path="/admin/skills"      element={<Skills />} />
            <Route path="/admin/analytics"   element={<Analytics />} />
            <Route path="/admin/users"       element={<UserManagement />} />
            <Route path="/admin/progress"    element={<ProgressReport />} />
            <Route path="/admin/feedback"    element={<Feedback />} />
            <Route path="/admin/log"         element={<ActivityLog />} />

            {/* Manager */}
            <Route path="/manager/progress"  element={<ProgressReport />} />
            <Route path="/manager/feedback"  element={<Feedback />} />
            <Route path="/manager/log"       element={<ActivityLog />} />

            {/* Employee */}
            <Route path="/employee/dashboard"     element={<EmployeeDashboard />} />
            <Route path="/employee/tasks"         element={<MyTasks />} />
            <Route path="/employee/availability"  element={<Availability />} />
            <Route path="/employee/notifications" element={<Notifications />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;