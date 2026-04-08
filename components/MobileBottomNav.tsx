"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, StickyNote, Bell, Plus } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", icon: <LayoutDashboard size={20} />, label: "Offres" },
    { href: "/notes", icon: <StickyNote size={20} />, label: "Notes" },
    { href: "/rappels", icon: <Bell size={20} />, label: "Rappels" },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {tabs.map(({ href, icon, label }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} style={{ textDecoration: "none", flex: 1 }}>
            <div className={`mobile-tab ${active ? "mobile-tab-active" : ""}`}>
              {icon}
              <span>{label}</span>
            </div>
          </Link>
        );
      })}
      <Link href="/nouvelle" style={{ textDecoration: "none", flex: 1 }}>
        <div className="mobile-tab mobile-tab-new">
          <Plus size={20} />
          <span>Nouvelle</span>
        </div>
      </Link>
    </nav>
  );
}
