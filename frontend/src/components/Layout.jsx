import { Outlet, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import { PageTransition } from "./motion/MotionPrimitives";

export default function Layout() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Navbar />
        <div className="app-content">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
