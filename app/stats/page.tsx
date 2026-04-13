"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart2,
  TrendingUp,
  Calendar,
  Building2,
  Target,
  Send,
  Users,
  CheckCircle,
} from "lucide-react";

interface Candidature {
  id: number;
  entreprise: string;
  poste: string;
  statut: string;
  dateEnvoi: string;
}

function getLast30Days(): string[] {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

const STATUS_COLORS: Record<string, string> = {
  Envoyée: "var(--cyan)",
  Relance: "var(--purple)",
  Entretien: "#eab308",
  Acceptée: "#22c55e",
  Refusée: "#ef4444",
};

export default function StatsPage() {
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/candidatures")
      .then((r) => r.json())
      .then((data) => {
        setCandidatures(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        className="grid-bg"
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "var(--muted)" }}>Chargement...</div>
      </div>
    );
  }

  const total = candidatures.length;

  const byStatus: Record<string, number> = {
    Envoyée: 0,
    Relance: 0,
    Entretien: 0,
    Acceptée: 0,
    Refusée: 0,
  };
  candidatures.forEach((c) => {
    byStatus[c.statut] = (byStatus[c.statut] || 0) + 1;
  });

  const days = getLast30Days();
  const today = new Date().toISOString().slice(0, 10);
  const byDay: Record<string, number> = {};
  days.forEach((d) => {
    byDay[d] = candidatures.filter(
      (c) => c.dateEnvoi.slice(0, 10) === d
    ).length;
  });
  const maxPerDay = Math.max(...Object.values(byDay), 1);
  const totalLast30 = Object.values(byDay).reduce((a, b) => a + b, 0);

  const parEntreprise = Object.entries(
    candidatures.reduce((acc, c) => {
      acc[c.entreprise] = (acc[c.entreprise] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);

  const reponsesTotal =
    byStatus["Relance"] +
    byStatus["Entretien"] +
    byStatus["Acceptée"] +
    byStatus["Refusée"];
  const entretiensTotal = byStatus["Entretien"] + byStatus["Acceptée"];
  const tauxReponse =
    total > 0 ? Math.round((reponsesTotal / total) * 100) : 0;
  const tauxEntretien =
    total > 0 ? Math.round((entretiensTotal / total) * 100) : 0;
  const tauxAcceptation =
    total > 0 ? Math.round((byStatus["Acceptée"] / total) * 100) : 0;

  const funnelSteps = [
    {
      label: "Candidatures envoyées",
      value: total,
      color: "var(--cyan)",
      icon: <Send size={14} />,
    },
    {
      label: "Réponses obtenues",
      value: reponsesTotal,
      color: "var(--purple)",
      icon: <TrendingUp size={14} />,
    },
    {
      label: "Entretiens décrochés",
      value: entretiensTotal,
      color: "#eab308",
      icon: <Users size={14} />,
    },
    {
      label: "Offres acceptées",
      value: byStatus["Acceptée"],
      color: "#22c55e",
      icon: <CheckCircle size={14} />,
    },
  ];

  return (
    <div className="grid-bg page-pad">
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "1.5rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <BarChart2 size={22} color="var(--cyan)" />
            <h1
              className="gradient-text"
              style={{
                fontSize: "1.6rem",
                fontWeight: "700",
                margin: 0,
                fontFamily: "monospace",
              }}
            >
              Statistiques
            </h1>
          </div>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "0.82rem",
              margin: "0.3rem 0 0 2.6rem",
            }}
          >
            Vue d&apos;ensemble de tes candidatures
          </p>
        </motion.div>

        {/* KPI cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="stats-row"
        >
          {[
            {
              label: "Total candidatures",
              value: total,
              color: "var(--cyan)",
              icon: <Send size={15} />,
            },
            {
              label: "30 derniers jours",
              value: totalLast30,
              color: "var(--purple)",
              icon: <Calendar size={15} />,
            },
            {
              label: "Taux de réponse",
              value: `${tauxReponse}%`,
              color: "#eab308",
              icon: <TrendingUp size={15} />,
            },
            {
              label: "Taux d'entretien",
              value: `${tauxEntretien}%`,
              color: "#22c55e",
              icon: <Users size={15} />,
            },
            {
              label: "Taux d'acceptation",
              value: `${tauxAcceptation}%`,
              color: "#22c55e",
              icon: <CheckCircle size={15} />,
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.04 }}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "0.875rem 1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: "var(--muted)",
                }}
              >
                <span style={{ color: s.color }}>{s.icon}</span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    lineHeight: 1.3,
                  }}
                >
                  {s.label}
                </span>
              </div>
              <span
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "700",
                  color: s.color,
                  fontFamily: "monospace",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Activity bar chart — 30 derniers jours */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "1.25rem 1.5rem",
            marginBottom: "0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <Calendar size={14} color="var(--cyan)" />
            <span
              style={{
                color: "var(--cyan)",
                fontWeight: "600",
                fontSize: "0.78rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Activité — 30 derniers jours
            </span>
            <span
              style={{
                color: "var(--muted)",
                fontSize: "0.72rem",
                marginLeft: "auto",
              }}
            >
              {totalLast30} candidature{totalLast30 !== 1 ? "s" : ""} envoyée
              {totalLast30 !== 1 ? "s" : ""}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "3px",
              height: "120px",
              padding: "0 2px",
            }}
          >
            {days.map((day) => {
              const count = byDay[day];
              const isToday = day === today;
              const barHeight = count === 0
                ? 6
                : Math.max(16, Math.round((count / maxPerDay) * 120));
              return (
                <div
                  key={day}
                  title={`${new Date(day + "T12:00:00").toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                  })} : ${count} candidature${count !== 1 ? "s" : ""}`}
                  style={{
                    flex: 1,
                    height: `${barHeight}px`,
                    background: count === 0
                      ? "rgba(255,255,255,0.07)"
                      : isToday
                      ? "#00d4ff"
                      : "#00d4ff88",
                    borderRadius: "3px 3px 0 0",
                    transition: "background 0.15s",
                    minWidth: 0,
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    if (count > 0)
                      (e.currentTarget as HTMLDivElement).style.background = "#00d4ff";
                  }}
                  onMouseLeave={(e) => {
                    if (count > 0 && !isToday)
                      (e.currentTarget as HTMLDivElement).style.background = "#00d4ff88";
                  }}
                />
              );
            })}
          </div>

          {/* Date labels every 5 days */}
          <div style={{ display: "flex", marginTop: "0.35rem" }}>
            {days.map((day, i) => (
              <div key={day} style={{ flex: 1, minWidth: 0 }}>
                {i % 5 === 0 && (
                  <span
                    style={{
                      fontSize: "0.58rem",
                      color: "var(--muted)",
                      display: "block",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {new Date(day + "T12:00:00").toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* 2-col : status breakdown + top entreprises */}
        <div className="stats-2col">
          {/* Répartition par statut */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "1.25rem 1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <Target size={14} color="var(--cyan)" />
              <span
                style={{
                  color: "var(--cyan)",
                  fontWeight: "600",
                  fontSize: "0.78rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Répartition par statut
              </span>
            </div>
            {total === 0 ? (
              <div
                style={{
                  color: "var(--muted)",
                  fontSize: "0.85rem",
                  textAlign: "center",
                  padding: "1.5rem 0",
                }}
              >
                Aucune candidature
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                {Object.entries(byStatus).map(([statut, count]) => {
                  const pct = total > 0 ? (count / total) * 100 : 0;
                  const color = STATUS_COLORS[statut] || "var(--cyan)";
                  return (
                    <div key={statut}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <span style={{ fontSize: "0.82rem", color: "var(--text)" }}>
                          {statut}
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--muted)",
                            fontFamily: "monospace",
                          }}
                        >
                          {count} ({Math.round(pct)}%)
                        </span>
                      </div>
                      <div
                        style={{
                          height: "6px",
                          background: "var(--border)",
                          borderRadius: "3px",
                          overflow: "hidden",
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                          style={{
                            height: "100%",
                            background: color,
                            borderRadius: "3px",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Top entreprises */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "1.25rem 1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <Building2 size={14} color="var(--cyan)" />
              <span
                style={{
                  color: "var(--cyan)",
                  fontWeight: "600",
                  fontSize: "0.78rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Top entreprises
              </span>
            </div>
            {parEntreprise.length === 0 ? (
              <div
                style={{
                  color: "var(--muted)",
                  fontSize: "0.85rem",
                  textAlign: "center",
                  padding: "1.5rem 0",
                }}
              >
                Aucune donnée
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                {parEntreprise.map(([entreprise, count], i) => {
                  const maxCount = parEntreprise[0][1];
                  const pct = (count / maxCount) * 100;
                  return (
                    <div
                      key={entreprise}
                      style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
                    >
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: "700",
                          fontFamily: "monospace",
                          color: i === 0 ? "var(--cyan)" : "var(--muted)",
                          width: "1.1rem",
                          textAlign: "right",
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </span>
                      <span
                        style={{
                          flex: 1,
                          fontSize: "0.82rem",
                          color: "var(--text)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {entreprise}
                      </span>
                      <div
                        style={{
                          width: "70px",
                          height: "5px",
                          background: "var(--border)",
                          borderRadius: "3px",
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            background: i === 0 ? "var(--cyan)" : "var(--purple)",
                            borderRadius: "3px",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: "700",
                          color: "var(--muted)",
                          fontFamily: "monospace",
                          flexShrink: 0,
                          minWidth: "1rem",
                          textAlign: "right",
                        }}
                      >
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Entonnoir de conversion */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "1.25rem 1.5rem",
            marginTop: "1.25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1.25rem",
            }}
          >
            <TrendingUp size={14} color="var(--cyan)" />
            <span
              style={{
                color: "var(--cyan)",
                fontWeight: "600",
                fontSize: "0.78rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Entonnoir de conversion
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0",
              flexWrap: "wrap",
            }}
          >
            {funnelSteps.map((step, i) => (
              <div
                key={step.label}
                style={{ display: "flex", alignItems: "center", flex: 1, minWidth: "120px" }}
              >
                <div
                  style={{
                    flex: 1,
                    background: "var(--surface2)",
                    border: `1px solid ${step.color}44`,
                    borderRadius: "10px",
                    padding: "1rem 0.75rem",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      color: step.color,
                      marginBottom: "0.4rem",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {step.icon}
                  </div>
                  <div
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: "700",
                      color: step.color,
                      fontFamily: "monospace",
                      lineHeight: 1,
                    }}
                  >
                    {step.value}
                  </div>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      color: "var(--muted)",
                      marginTop: "0.35rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {step.label}
                  </div>
                  {i > 0 && funnelSteps[i - 1].value > 0 && (
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: step.color,
                        marginTop: "0.2rem",
                        fontFamily: "monospace",
                        fontWeight: "600",
                      }}
                    >
                      {Math.round((step.value / funnelSteps[i - 1].value) * 100)}%
                    </div>
                  )}
                </div>
                {i < funnelSteps.length - 1 && (
                  <div
                    style={{
                      padding: "0 0.35rem",
                      color: "var(--muted)",
                      fontSize: "1.2rem",
                      flexShrink: 0,
                    }}
                  >
                    ›
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
