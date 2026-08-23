import { motion } from "framer-motion";
import { TrendingUp, MoreHorizontal, ArrowUpRight } from "lucide-react";
import { TASKS, EMPLOYEES, TASK_ASSIGNMENTS, SKILLS, EMPLOYEE_SKILLS } from "../data/mockData";
import { StaggerContainer, StaggerItem, FadeIn, AnimatedNumber } from "../components/motion/MotionPrimitives";

export default function Analytics() {
  const totalTasks     = TASKS.length;
  const completedTasks = TASKS.filter(t => t.status === "done").length;
  const inProgress     = TASKS.filter(t => t.status === "in_progress").length;
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  // Top stat cards modeled after RealtimeColors dashboard
  const statCards = [
    { label: "New tasks",     value: 150040, trend: "+40%" },
    { label: "Assignments",  value: 300,    trend: "+30%" },
    { label: "Allocated hrs",value: 2340,   prefix: "$", trend: "+25%" },
    { label: "Completion rate", value: 42,  suffix: "%", trend: "+12%" },
  ];

  // Paired bars data (Gold & Fuchsia) from RealtimeColors chart
  const pairedData = [
    { gold: 45, fuchsia: 55 },
    { gold: 75, fuchsia: 85 },
    { gold: 40, fuchsia: 45 },
    { gold: 88, fuchsia: 78 },
    { gold: 58, fuchsia: 62 },
    { gold: 64, fuchsia: 70 },
    { gold: 80, fuchsia: 95 },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Analytics Overview</div>
          <div className="page-subtitle">Real-time Performance & Work Allocation Metrics</div>
        </div>
      </div>

      {/* Top Row: Cobalt Stat Cards with Fuchsia Trends (Exact Screenshot Style) */}
      <StaggerContainer className="stats-grid" staggerDelay={0.07}>
        {statCards.map((s, i) => (
          <StaggerItem key={i}>
            <motion.div
              className="stat-card"
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 450, damping: 22 } }}
            >
              <div className="stat-card-header">
                <span className="stat-label">{s.label}</span>
                <span className="stat-dots">•••</span>
              </div>
              <div className="stat-value">
                <AnimatedNumber value={s.value} prefix={s.prefix || ""} suffix={s.suffix || ""} />
              </div>
              <div className="stat-sub">
                <TrendingUp size={15} color="#ee27d7" /> {s.trend}
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Middle Row: Paired Gold/Fuchsia Chart + Right Sunset Promo Card */}
      <FadeIn delay={0.15}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, alignItems: "stretch", marginTop: 8 }}>
          {/* Main Chart Card */}
          <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div className="card-header">
              <span className="card-title">Allocated Hours / Capacity</span>
              <span style={{ color: "var(--accent)", cursor: "pointer", letterSpacing: 2 }}>•••</span>
            </div>
            <div className="card-body">
              <div className="chart-bars">
                {pairedData.map((d, i) => (
                  <div className="chart-bar-group" key={i}>
                    {/* Gold Bar */}
                    <motion.div
                      className="chart-bar gold"
                      initial={{ height: 0 }}
                      animate={{ height: `${d.gold}%` }}
                      transition={{ duration: 0.75, delay: i * 0.05, ease: [0.34, 1.56, 0.64, 1] }}
                      whileHover={{ scaleY: 1.05 }}
                    />
                    {/* Fuchsia Bar */}
                    <motion.div
                      className="chart-bar fuchsia"
                      initial={{ height: 0 }}
                      animate={{ height: `${d.fuchsia}%` }}
                      transition={{ duration: 0.75, delay: i * 0.05 + 0.05, ease: [0.34, 1.56, 0.64, 1] }}
                      whileHover={{ scaleY: 1.05 }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 20, marginTop: 18, justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "var(--text-2)" }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: "#f5d982", display: "inline-block", boxShadow: "0 0 8px rgba(245, 217, 130, 0.5)" }} />
                  Allocated Hours
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "var(--text-2)" }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: "#ee27d7", display: "inline-block", boxShadow: "0 0 8px rgba(238, 39, 215, 0.5)" }} />
                  Total Capacity
                </div>
              </div>
            </div>
          </div>

          {/* Right Sunset Promo Card (Matching Screenshot) */}
          <div className="promo-card">
            <div>
              <h3>Realtime Allocation Templates are live!</h3>
              <p>Have an optimized allocation rule or automated scheduling template idea?</p>
            </div>
            <motion.button
              className="promo-btn"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Submit idea <ArrowUpRight size={14} style={{ display: "inline", verticalAlign: "middle" }} />
            </motion.button>
          </div>
        </div>
      </FadeIn>

      {/* Bottom Row: Recent Tickets & Categories */}
      <FadeIn delay={0.22}>
        <div className="grid-2" style={{ marginTop: 20 }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Recent Tasks Log</span>
              <span style={{ color: "var(--accent)", cursor: "pointer", letterSpacing: 2 }}>•••</span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {TASKS.slice(0, 4).map(t => (
                <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--text)" }}>{t.title}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Due {t.deadline} · {t.estimated_hours}h</div>
                  </div>
                  <span className="badge badge-accent">{t.priority}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Top Skill Categories</span>
              <span style={{ color: "var(--accent)", cursor: "pointer", letterSpacing: 2 }}>•••</span>
            </div>
            <div className="card-body">
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {SKILLS.slice(0, 4).map(s => (
                  <div key={s.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, color: "var(--text)" }}>{s.name}</span>
                      <span style={{ fontWeight: 700, color: "#f5d982" }}>{s.category}</span>
                    </div>
                    <div className="progress-bar" style={{ height: 8 }}>
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${(s.id * 18 + 25)}%` }}
                        transition={{ duration: 0.85, ease: "easeOut" }}
                        style={{ background: "linear-gradient(90deg, #f5d982 0%, #ee27d7 100%)" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
