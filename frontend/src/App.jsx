import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";

// Auth pages
import Login    from "./pages/Login";
import Register from "./pages/Register";

// Admin pages
import AdminDashboard  from "./pages/AdminDashboard";
import Tasks           from "./pages/Tasks";
import CreateTask      from "./pages/CreateTask";
import Assignments     from "./pages/Assignments";
import Employees       from "./pages/Employees";
import EmployeeProfile from "./pages/EmployeeProfile";
import Skills          from "./pages/Skills";
import Analytics       from "./pages/Analytics";

// Employee pages
import EmployeeDashboard from "./pages/EmployeeDashboard";
import MyTasks           from "./pages/MyTasks";
import Availability      from "./pages/Availability";
import Notifications     from "./pages/Notifications";

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/employee/dashboard"} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/"         element={<RootRedirect />} />

          {/* Admin — wrapped in Layout */}
          <Route element={<Layout />}>
            <Route path="/admin/dashboard"        element={<AdminDashboard />} />
            <Route path="/admin/tasks"            element={<Tasks />} />
            <Route path="/admin/tasks/create"     element={<CreateTask />} />
            <Route path="/admin/assignments"      element={<Assignments />} />
            <Route path="/admin/employees"        element={<Employees />} />
            <Route path="/admin/employees/:id"    element={<EmployeeProfile />} />
            <Route path="/admin/skills"           element={<Skills />} />
            <Route path="/admin/analytics"        element={<Analytics />} />
          </Route>

          {/* Employee — wrapped in Layout */}
          <Route element={<Layout />}>
            <Route path="/employee/dashboard"     element={<EmployeeDashboard />} />
            <Route path="/employee/tasks"         element={<MyTasks />} />
            <Route path="/employee/availability"  element={<Availability />} />
            <Route path="/employee/notifications" element={<Notifications />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;