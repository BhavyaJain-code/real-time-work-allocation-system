import { createContext, useContext, useState } from "react";
import { USERS, EMPLOYEES, initials, avatarColors } from "../data/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // USERS row
  const [employee, setEmployee] = useState(null); // EMPLOYEES row (null for admins)

  function login(email, password, role) {
    // Mock: find user by email (ignore password for now)
    let found = USERS.find(u => u.email === email && u.is_active);

    // Demo shortcut: if no match, create a mock session by role
    if (!found) {
      found = role === "admin"
        ? USERS.find(u => u.role === "admin")
        : USERS.find(u => u.role === "employee");
    }

    if (!found) return false;

    const emp = EMPLOYEES.find(e => e.user_id === found.id) || null;
    setUser(found);
    setEmployee(emp);
    return found;
  }

  function logout() {
    setUser(null);
    setEmployee(null);
  }

  // Avatar metadata for the logged-in user
  const userInitials = user ? initials(user.name) : "?";
  const userColors   = user ? avatarColors(user.name) : { bg: "#eef2ff", color: "#6366f1" };

  return (
    <AuthContext.Provider value={{ user, employee, login, logout, userInitials, userColors }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
