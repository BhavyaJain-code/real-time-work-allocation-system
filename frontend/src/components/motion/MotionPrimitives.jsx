import React from "react";

// Clean, simple layout helpers without over-the-top AI animations

export function PageTransition({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function FadeIn({ children, className = "", style = {}, ...props }) {
  return <div className={className} style={style} {...props}>{children}</div>;
}

export function StaggerContainer({ children, className = "", style = {}, ...props }) {
  return <div className={className} style={style} {...props}>{children}</div>;
}

export function StaggerItem({ children, className = "", style = {}, ...props }) {
  return <div className={className} style={style} {...props}>{children}</div>;
}

export function AnimatedNumber({ value, prefix = "", suffix = "" }) {
  return <span>{prefix}{typeof value === "number" ? value.toLocaleString() : value}{suffix}</span>;
}

export function TextEffect({ text, className = "" }) {
  return <span className={className}>{text}</span>;
}

export function HoverCard({ children, className = "", style = {}, ...props }) {
  return <div className={className} style={style} {...props}>{children}</div>;
}

export function ScaleIn({ children, className = "", style = {}, ...props }) {
  return <div className={className} style={style} {...props}>{children}</div>;
}

export function AnimatedModal({ children, className = "", style = {}, ...props }) {
  return <div className={className} style={style} {...props}>{children}</div>;
}
