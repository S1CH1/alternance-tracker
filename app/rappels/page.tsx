"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Plus, Trash2, Check, Clock, AlertTriangle } from "lucide-react";

interface Rappel {
  id: number;
  message: string;
  date: string;
  fait: boolean;
  createdAt: string;
}

function getRappelStatus(dateStr: string, fait: boolean) {
  if (fait) return "fait";
  const now = new Date();
  const date = new Date(dateStr);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const rappelDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  if (rappelDay < today) return "retard";
  if (rappelDay.getTime() === today.getTime()) return "aujourd_hui";
  return "a_venir";
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function RappelsPage() {
  const [rappels, setRappels] = useState<Rappel[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchRappels = async () => {
    try {
      const res = await fetch("/api/rappels?all=true");
      const data = await res.json();
      setRappels(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRappels();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !date) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/rappels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), date }),
      });
      const nouveau = await res.json();
      setRappels((prev) => [...prev, nouveau].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ));
      setMessage("");
      setDate("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFait = async (id: number) => {
    try {
      const res = await fetch(`/api/rappels/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fait: true }),
      });
      const updated = await res.json();
      setRappels((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce rappel ?")) return;
    await fetch(`/api/rappels/${id}`, { method: "DELETE" });
    setRappels((prev) => prev.filter((r) => r.id !== id));
  };

  const actifs = rappels.filter((r) => !r.fait);
  const faits = rappels.filter((r) => r.fait);

  const getCardStyle = (status: string) => {
    switch (status) {
      case "retard":
        return {
          background: "#ff000010",
          border: "1px solid #ff000044",
          borderLeft: "3px solid #ff6b6b",
        };
      case "aujourd_hui":
        return {
          background: "var(--cyan-dim)",
          border: "1px solid var(--cyan)",
          borderLeft: "3px solid var(--cyan)",
        };
      default:
        return {
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderLeft: "3px solid var(--border)",
        };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "retard":
        return (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              color: "#ff6b6b",
              fontSize: "0.75rem",
              fontWeight: "600",
            }}
          >
            <AlertTriangle size={12} /> En retard
          </span>
        );
      case "aujourd_hui":
        return (
          <span
            className="pulse-glow"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              color: "var(--cyan)",
              fontSize: "0.75rem",
              fontWeight: "600",
              background: "var(--cyan-dim)",
              padding: "0.2rem 0.6rem",
              borderRadius: "9999px",
              border: "1px solid var(--cyan)",
            }}
          >
            <Bell size={12} /> Aujourd&apos;hui
          </span>
        );
      default:
        return (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              color: "var(--muted)",
              fontSize: "0.75rem",
            }}
          >
            <Clock size={12} /> À venir
          </span>
        );
    }
  };

  return (
    <div className="grid-bg page-pad">
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: "2rem" }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <Bell size={28} color="var(--cyan)" />
            <h1
              className="gradient-text"
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                margin: 0,
                fontFamily: "monospace",
              }}
            >
              Rappels
            </h1>
          </div>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "0.9rem",
              margin: "0.25rem 0 0 0",
            }}
          >
            {actifs.length} rappel{actifs.length !== 1 ? "s" : ""} actif
            {actifs.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Formulaire d'ajout */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          onSubmit={handleAdd}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "2rem",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label
              style={{
                display: "block",
                color: "var(--muted)",
                fontSize: "0.75rem",
                marginBottom: "0.4rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Message
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Que faut-il rappeler ?"
              required
              style={{
                width: "100%",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "0.65rem 1rem",
                color: "var(--text)",
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
          </div>
          <div style={{ minWidth: "180px" }}>
            <label
              style={{
                display: "block",
                color: "var(--muted)",
                fontSize: "0.75rem",
                marginBottom: "0.4rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "0.65rem 1rem",
                color: "var(--text)",
                fontSize: "0.9rem",
                outline: "none",
                colorScheme: "dark",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "linear-gradient(135deg, var(--cyan), var(--purple))",
              border: "none",
              borderRadius: "8px",
              padding: "0.65rem 1.2rem",
              color: "#000",
              fontWeight: "600",
              fontSize: "0.875rem",
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            <Plus size={16} />
            Ajouter
          </button>
        </motion.form>

        {/* Liste des rappels actifs */}
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "var(--muted)",
            }}
          >
            Chargement...
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                marginBottom: "2rem",
              }}
            >
              <AnimatePresence>
                {actifs.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      textAlign: "center",
                      padding: "3rem",
                      background: "var(--surface)",
                      border: "1px dashed var(--border)",
                      borderRadius: "12px",
                      color: "var(--muted)",
                    }}
                  >
                    <Bell
                      size={36}
                      style={{
                        margin: "0 auto 1rem",
                        display: "block",
                        opacity: 0.3,
                      }}
                    />
                    <p style={{ margin: 0, fontSize: "0.9rem" }}>
                      Aucun rappel actif
                    </p>
                  </motion.div>
                ) : (
                  actifs.map((rappel, i) => {
                    const status = getRappelStatus(rappel.date, rappel.fait);
                    return (
                      <motion.div
                        key={rappel.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className={status === "aujourd_hui" ? "pulse-glow" : ""}
                        style={{
                          ...getCardStyle(status),
                          borderRadius: "10px",
                          padding: "1rem 1.25rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "1rem",
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.75rem",
                              marginBottom: "0.25rem",
                            }}
                          >
                            <p
                              style={{
                                margin: 0,
                                fontWeight: "600",
                                fontSize: "0.95rem",
                                color:
                                  status === "retard"
                                    ? "#ff6b6b"
                                    : status === "aujourd_hui"
                                    ? "var(--cyan)"
                                    : "var(--text)",
                              }}
                            >
                              {rappel.message}
                            </p>
                            {getStatusBadge(status)}
                          </div>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "0.8rem",
                              color: "var(--muted)",
                            }}
                          >
                            {formatDate(rappel.date)}
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => handleFait(rappel.id)}
                            title="Marquer comme fait"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "#10b98115",
                              border: "1px solid #10b98144",
                              borderRadius: "6px",
                              padding: "0.4rem",
                              color: "#10b981",
                              cursor: "pointer",
                            }}
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(rappel.id)}
                            title="Supprimer"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "#ff000010",
                              border: "1px solid #ff000033",
                              borderRadius: "6px",
                              padding: "0.4rem",
                              color: "#ff6b6b",
                              cursor: "pointer",
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Rappels faits */}
            {faits.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "0.75rem",
                  }}
                >
                  Terminés ({faits.length})
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {faits.map((rappel) => (
                    <div
                      key={rappel.id}
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        padding: "0.85rem 1.25rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1rem",
                        opacity: 0.5,
                      }}
                    >
                      <div>
                        <p
                          style={{
                            margin: "0 0 0.2rem",
                            fontSize: "0.9rem",
                            color: "var(--muted)",
                            textDecoration: "line-through",
                          }}
                        >
                          {rappel.message}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.75rem",
                            color: "var(--muted)",
                          }}
                        >
                          {formatDate(rappel.date)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(rappel.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "transparent",
                          border: "1px solid var(--border)",
                          borderRadius: "6px",
                          padding: "0.4rem",
                          color: "var(--muted)",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
