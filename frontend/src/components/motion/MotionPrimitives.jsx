import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

// ── 1. Page Transition Wrapper ──────────────────────────────
export function PageTransition({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── 2. Fade In with Direction ───────────────────────────────
export function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.35,
  className = "",
  style = {},
  ...props
}) {
  const directions = {
    up: { y: 16, x: 0 },
    down: { y: -16, x: 0 },
    left: { x: 16, y: 0 },
    right: { x: -16, y: 0 },
    none: { x: 0, y: 0 },
  };

  const offset = directions[direction] || directions.up;

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, ...offset }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ── 3. Stagger Container & Items ────────────────────────────
export function StaggerContainer({
  children,
  staggerDelay = 0.06,
  delayChildren = 0.05,
  className = "",
  style = {},
  ...props
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delayChildren,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
  style = {},
  ...props
}) {
  const itemVariants = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 380,
        damping: 26,
      },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ── 4. Spring-based Hover / Interactive Card ────────────────
export function HoverCard({
  children,
  className = "",
  style = {},
  onClick,
  ...props
}) {
  return (
    <motion.div
      whileHover={{
        y: -3,
        transition: { type: "spring", stiffness: 450, damping: 20 },
      }}
      whileTap={{
        scale: 0.985,
        transition: { type: "spring", stiffness: 500, damping: 25 },
      }}
      onClick={onClick}
      className={className}
      style={{ willChange: "transform", ...style }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ── 5. Scale In (for Badges, Modals, Buttons) ───────────────
export function ScaleIn({
  children,
  delay = 0,
  className = "",
  style = {},
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        type: "spring",
        stiffness: 420,
        damping: 24,
        delay,
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ── 6. Animated Counter for Numeric Metrics ─────────────────
export function AnimatedNumber({ value, prefix = "", suffix = "", duration = 0.8 }) {
  const numericVal = typeof value === "number" ? value : parseFloat(value) || 0;
  const isNaNVal = isNaN(numericVal);
  const [display, setDisplay] = useState(isNaNVal ? value : 0);

  const spring = useSpring(0, {
    stiffness: 80,
    damping: 18,
    duration: duration * 1000,
  });

  useEffect(() => {
    if (!isNaNVal) {
      spring.set(numericVal);
    }
  }, [numericVal, isNaNVal, spring]);

  useEffect(() => {
    if (isNaNVal) {
      setDisplay(value);
      return;
    }
    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(Math.round(latest));
    });
    return () => unsubscribe();
  }, [spring, isNaNVal, value]);

  if (isNaNVal) {
    return <span>{value}</span>;
  }

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

// ── 7. Text Character / Word Reveal Effect ──────────────────
export function TextEffect({
  text,
  className = "",
  delay = 0,
  mode = "word", // "word" or "char"
}) {
  const words = text ? (mode === "char" ? text.split("") : text.split(" ")) : [];

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: mode === "char" ? 0.02 : 0.06, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 18,
        stiffness: 250,
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
    },
  };

  return (
    <motion.span
      style={{ display: "inline-flex", flexWrap: "wrap", gap: mode === "char" ? "0px" : "0.25em" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((item, index) => (
        <motion.span variants={child} key={index} style={{ display: "inline-block" }}>
          {item}
          {mode === "char" && item === " " ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ── 8. Animated Modal Dialog with Backdrop Blur ───────────────
export function AnimatedModal({ isOpen = true, onClose, children, maxWidth = 560 }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="modal"
            style={{ maxWidth }}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 28,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
