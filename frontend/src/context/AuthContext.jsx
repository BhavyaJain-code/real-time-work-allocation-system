import { createContext, useContext, useState } from "react";
import { USERS, EMPLOYEES, initials, avatarColors, getManagerDepartment } from "../data/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null);
  const [employee, setEmployee] = useState(null);

  function login(email, password, role) {
    let found = USERS.find(u => u.email === email && u.is_active);
    if (!found) {
      found = USERS.find(u => u.role === (role || "employee") && u.is_active);
    }
    if (!found) return false;
    const emp = EMPLOYEES.find(e => e.user_id === found.id) || null;
    setUser(found);
    setEmployee(emp);
    return found;
  }

  function logout() { setUser(null); setEmployee(null); }

  // For manager: which department they manage
  const managedDept = user?.role === "manager" ? getManagerDepartment(user.id) : null;

  const userInitials = user ? initials(user.name) : "?";
  const userColors   = user ? avatarColors(user.name) : { bg: "#eef2ff", color: "#6366f1" };

  return (
    <AuthContext.Provider value={{ user, employee, login, logout, userInitials, userColors, managedDept }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
