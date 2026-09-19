import { createContext, useContext, useState } from "react";
import { USERS, EMPLOYEES, initials, avatarColors, getManagerDepartment } from "../data/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null);
  const [employee, setEmployee] = useState(null);

  function login(email, password, role) {
    if (!email || !password) return { success: false, error: "Email and password are required." };

    const normalizedEmail = email.trim().toLowerCase();
    const found = USERS.find(u => u.email.toLowerCase() === normalizedEmail && u.is_active);
    
    if (!found) {
      return { success: false, error: "Invalid login ID. No active account found with this email." };
    }

    if (role && found.role !== role) {
      return { success: false, error: `Account exists, but not with the selected role (${role}).` };
    }

    const isPasswordCorrect = found.password === password || (found.temp_password && found.temp_password === password);
    if (!isPasswordCorrect) {
      return { success: false, error: "Invalid password. Please check your credentials and try again." };
    }

    const emp = EMPLOYEES.find(e => e.user_id === found.id) || null;
    setUser(found);
    setEmployee(emp);
    return { success: true, user: found };
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
