"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Briefcase, StickyNote, Bell } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        height: "64px",
        display: "flex",
        alignItems: "center",
        padding: "0 2rem",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Briefcase size={20} color="var(--cyan)" />
            <span
              className="text-glow"
              style={{
                color: "var(--cyan)",
                fontWeight: "700",
                fontSize: "1.25rem",
                letterSpacing: "0.05em",
                fontFamily: "monospace",
              }}
            >
              S1CH1_
            </span>
            <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
              / alternance
            </span>
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span
              style={{
                color: pathname === "/" ? "var(--cyan)" : "var(--muted)",
                fontSize: "0.875rem",
                transition: "color 0.2s",
              }}
            >
              Dashboard
            </span>
          </Link>

          <Link href="/notes" style={{ textDecoration: "none" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                color: pathname === "/notes" ? "var(--cyan)" : "var(--muted)",
                fontSize: "0.875rem",
                transition: "color 0.2s",
              }}
            >
              <StickyNote size={15} />
              Notes
            </div>
          </Link>

          <Link href="/rappels" style={{ textDecoration: "none" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                color: pathname === "/rappels" ? "var(--cyan)" : "var(--muted)",
                fontSize: "0.875rem",
                transition: "color 0.2s",
              }}
            >
              <Bell size={15} />
              Rappels
            </div>
          </Link>

          <Link href="/nouvelle" style={{ textDecoration: "none" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "linear-gradient(135deg, var(--cyan), var(--purple))",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                color: "#000",
                fontWeight: "600",
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
            >
              <Plus size={16} />
              Nouvelle candidature
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
