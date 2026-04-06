const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  Envoyée: {
    bg: "#00d4ff11",
    color: "#00d4ff",
    border: "#00d4ff44",
  },
  Relance: {
    bg: "#a855f711",
    color: "#a855f7",
    border: "#a855f744",
  },
  Entretien: {
    bg: "#f59e0b11",
    color: "#f59e0b",
    border: "#f59e0b44",
  },
  Acceptée: {
    bg: "#10b98111",
    color: "#10b981",
    border: "#10b98144",
  },
  Refusée: {
    bg: "#ef444411",
    color: "#ef4444",
    border: "#ef444444",
  },
};

export default function StatusBadge({ statut }: { statut: string }) {
  const colors = STATUS_COLORS[statut] ?? {
    bg: "#64748b11",
    color: "#64748b",
    border: "#64748b44",
  };

  return (
    <span
      style={{
        background: colors.bg,
        color: colors.color,
        border: `1px solid ${colors.border}`,
        padding: "0.25rem 0.75rem",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: "600",
        letterSpacing: "0.05em",
        whiteSpace: "nowrap",
      }}
    >
      {statut}
    </span>
  );
}
