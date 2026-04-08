"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Plus, Briefcase, StickyNote, Bell, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/notes", label: "Notes", icon: <StickyNote size={15} /> },
    { href: "/rappels", label: "Rappels", icon: <Bell size={15} /> },
  ];

  return (
    <>
      <nav
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          height: "64px",
          display: "flex",
          alignItems: "center",
          padding: "0 1.25rem",
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
            maxWidth: "1400px",
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
                  fontSize: "1.1rem",
                  letterSpacing: "0.05em",
                  fontFamily: "monospace",
                }}
              >
                S1CH1_
              </span>
              <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>/ alternance</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="nav-links">
            {links.map(({ href, label, icon }) => (
              <Link key={href} href={href} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    color: pathname === href ? "var(--cyan)" : "var(--muted)",
                    fontSize: "0.875rem",
                    transition: "color 0.2s",
                  }}
                >
                  {icon}
                  {label}
                </div>
              </Link>
            ))}
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
                Nouvelle
              </div>
            </Link>
          </div>

          {/* Hamburger */}
          <button className="nav-hamburger" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      <div className={`nav-mobile-panel ${menuOpen ? "open" : ""}`}>
        {links.map(({ href, label, icon }) => (
          <Link key={href} href={href} style={{ textDecoration: "none" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 0.5rem",
                color: pathname === href ? "var(--cyan)" : "var(--text)",
                fontSize: "0.95rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {icon}
              {label}
            </div>
          </Link>
        ))}
        <Link href="/nouvelle" style={{ textDecoration: "none", marginTop: "0.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "linear-gradient(135deg, var(--cyan), var(--purple))",
              padding: "0.65rem 1rem",
              borderRadius: "8px",
              color: "#000",
              fontWeight: "600",
              fontSize: "0.9rem",
              justifyContent: "center",
            }}
          >
            <Plus size={16} />
            Nouvelle candidature
          </div>
        </Link>
      </div>
    </>
  );
}
