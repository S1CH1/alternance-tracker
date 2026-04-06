"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, Trash2, Building2, Briefcase, MapPin, Calendar } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface CandidatureCardProps {
  candidature: {
    id: number;
    entreprise: string;
    poste: string;
    ville: string | null;
    dateEnvoi: string;
    statut: string;
  };
  index: number;
  onDelete: (id: number) => void;
}

export default function CandidatureCard({
  candidature,
  index,
  onDelete,
}: CandidatureCardProps) {
  const date = new Date(candidature.dateEnvoi).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        padding: "1rem 1.25rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--cyan)44";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <Building2 size={14} color="var(--cyan)" />
          <span style={{ fontWeight: "600", color: "var(--text)", fontSize: "0.95rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {candidature.entreprise}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Briefcase size={13} color="var(--muted)" />
          <span style={{ color: "var(--muted)", fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {candidature.poste}
          </span>
          {candidature.ville && (
            <>
              <span style={{ color: "var(--border)" }}>·</span>
              <MapPin size={12} color="var(--muted)" />
              <span style={{ color: "var(--muted)", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                {candidature.ville}
              </span>
            </>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--muted)", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
        <Calendar size={13} />
        {date}
      </div>

      <StatusBadge statut={candidature.statut} />

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Link href={`/candidature/${candidature.id}`} style={{ textDecoration: "none" }}>
          <button
            style={{
              background: "var(--cyan-dim)",
              border: "1px solid var(--cyan)44",
              borderRadius: "6px",
              padding: "0.4rem 0.75rem",
              color: "var(--cyan)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.8rem",
              transition: "background 0.2s",
            }}
          >
            <Eye size={14} />
            Voir
          </button>
        </Link>

        <button
          onClick={() => onDelete(candidature.id)}
          style={{
            background: "#ef444411",
            border: "1px solid #ef444433",
            borderRadius: "6px",
            padding: "0.4rem 0.75rem",
            color: "#ef4444",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.8rem",
            transition: "background 0.2s",
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}
