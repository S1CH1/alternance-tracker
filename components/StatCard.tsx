"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  accent?: "cyan" | "purple" | "green" | "yellow";
  delay?: number;
}

const ACCENT_COLORS = {
  cyan: "var(--cyan)",
  purple: "var(--purple)",
  green: "#10b981",
  yellow: "#f59e0b",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = "cyan",
  delay = 0,
}: StatCardProps) {
  const color = ACCENT_COLORS[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={{
        background: "var(--surface)",
        border: `1px solid var(--border)`,
        borderRadius: "12px",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, ${color}, transparent)`,
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p style={{ color: "var(--muted)", fontSize: "0.8rem", margin: "0 0 0.5rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {label}
          </p>
          <p
            style={{
              color,
              fontSize: "2.5rem",
              fontWeight: "700",
              margin: 0,
              lineHeight: 1,
              fontFamily: "monospace",
            }}
          >
            {value}
          </p>
        </div>
        <div
          style={{
            background: `${color}15`,
            border: `1px solid ${color}33`,
            borderRadius: "8px",
            padding: "0.75rem",
          }}
        >
          <Icon size={20} color={color} />
        </div>
      </div>
    </motion.div>
  );
}
