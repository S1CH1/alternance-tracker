"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Send,
  RefreshCw,
  Users,
  CheckCircle,
  Filter,
  Bell,
  AlertTriangle,
  Clock,
  ArrowRight,
  ListTodo,
  Plus,
  Trash2,
  Square,
  CheckSquare,
  Building2,
} from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import CandidatureCard from "@/components/CandidatureCard";

interface Candidature {
  id: number;
  entreprise: string;
  poste: string;
  ville: string | null;
  dateEnvoi: string;
  statut: string;
}

interface Rappel {
  id: number;
  message: string;
  date: string;
  fait: boolean;
}

interface Todo {
  id: number;
  texte: string;
  fait: boolean;
}

function getRappelStatus(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const rappelDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (rappelDay < today) return "retard";
  if (rappelDay.getTime() === today.getTime()) return "aujourd_hui";
  return "a_venir";
}

function formatRappelDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUTS = ["Tous", "Envoyée", "Relance", "Entretien", "Acceptée", "Refusée"];

export default function Dashboard() {
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [rappels, setRappels] = useState<Rappel[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState("Tous");

  const fetchCandidatures = async () => {
    try {
      const res = await fetch("/api/candidatures");
      const data = await res.json();
      setCandidatures(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRappels = async () => {
    try {
      const res = await fetch("/api/rappels");
      const data = await res.json();
      setRappels(data.slice(0, 3));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos");
      setTodos(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texte: newTodo }),
    });
    const todo = await res.json();
    setTodos((prev) => [...prev, todo]);
    setNewTodo("");
  };

  const handleToggleTodo = async (todo: Todo) => {
    await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fait: !todo.fait }),
    });
    setTodos((prev) => prev.map((t) => t.id === todo.id ? { ...t, fait: !t.fait } : t));
  };

  const handleDeleteTodo = async (id: number) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    fetchCandidatures();
    fetchRappels();
    fetchTodos();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette candidature ?")) return;
    await fetch(`/api/candidatures/${id}`, { method: "DELETE" });
    setCandidatures((prev) => prev.filter((c) => c.id !== id));
  };

  const filtered =
    filtre === "Tous"
      ? candidatures
      : candidatures.filter((c) => c.statut === filtre);

  const stats = {
    total: candidatures.length,
    enCours: candidatures.filter((c) =>
      ["Envoyée", "Relance"].includes(c.statut)
    ).length,
    entretiens: candidatures.filter((c) => c.statut === "Entretien").length,
    acceptees: candidatures.filter((c) => c.statut === "Acceptée").length,
  };

  const parEntreprise = Object.entries(
    candidatures.reduce((acc, c) => {
      acc[c.entreprise] = acc[c.entreprise] || { total: 0, statuts: {} };
      acc[c.entreprise].total += 1;
      acc[c.entreprise].statuts[c.statut] = (acc[c.entreprise].statuts[c.statut] || 0) + 1;
      return acc;
    }, {} as Record<string, { total: number; statuts: Record<string, number> }>)
  ).sort((a, b) => b[1].total - a[1].total);

  return (
    <div className="grid-bg" style={{ minHeight: "calc(100vh - 64px)", padding: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: "2rem" }}
        >
          <h1
            className="gradient-text"
            style={{ fontSize: "2rem", fontWeight: "700", margin: "0 0 0.5rem", fontFamily: "monospace" }}
          >
            Suivi des candidatures
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: 0 }}>
            {candidatures.length} candidature{candidatures.length !== 1 ? "s" : ""} enregistrée{candidatures.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <StatCard label="Total" value={stats.total} icon={Send} accent="cyan" delay={0} />
          <StatCard label="En cours" value={stats.enCours} icon={RefreshCw} accent="purple" delay={0.1} />
          <StatCard label="Entretiens" value={stats.entretiens} icon={Users} accent="yellow" delay={0.2} />
          <StatCard label="Acceptées" value={stats.acceptees} icon={CheckCircle} accent="green" delay={0.3} />
        </div>

        {/* Par entreprise */}
        {parEntreprise.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.33 }}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "1.25rem 1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <Building2 size={16} color="var(--cyan)" />
              <span style={{ color: "var(--cyan)", fontWeight: "600", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Par entreprise
              </span>
              <span style={{ color: "var(--muted)", fontSize: "0.75rem", marginLeft: "auto" }}>
                {parEntreprise.length} entreprise{parEntreprise.length > 1 ? "s" : ""}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {parEntreprise.map(([entreprise, data]) => (
                <div
                  key={entreprise}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "8px",
                    background: "var(--surface2)",
                  }}
                >
                  <span style={{ flex: 1, fontSize: "0.875rem", color: "var(--text)", fontWeight: "500" }}>
                    {entreprise}
                  </span>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {Object.entries(data.statuts).map(([statut, count]) => (
                      <span
                        key={statut}
                        style={{
                          fontSize: "0.7rem",
                          padding: "0.15rem 0.5rem",
                          borderRadius: "9999px",
                          fontWeight: "600",
                          background:
                            statut === "Acceptée" ? "#22c55e22" :
                            statut === "Refusée" ? "#ef444422" :
                            statut === "Entretien" ? "#eab30822" :
                            statut === "Relance" ? "#a855f722" :
                            "var(--cyan-dim)",
                          color:
                            statut === "Acceptée" ? "#22c55e" :
                            statut === "Refusée" ? "#ef4444" :
                            statut === "Entretien" ? "#eab308" :
                            statut === "Relance" ? "#a855f7" :
                            "var(--cyan)",
                        }}
                      >
                        {statut} ×{count}
                      </span>
                    ))}
                  </div>
                  <span style={{
                    fontSize: "0.8rem",
                    fontWeight: "700",
                    color: data.total > 1 ? "var(--cyan)" : "var(--muted)",
                    minWidth: "1.5rem",
                    textAlign: "right",
                  }}>
                    {data.total}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Widget Rappels à venir */}
        {rappels.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "1.25rem 1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Bell size={16} color="var(--cyan)" />
                <span
                  style={{
                    color: "var(--cyan)",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Rappels à venir
                </span>
              </div>
              <Link
                href="/rappels"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  color: "var(--muted)",
                  fontSize: "0.8rem",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                Voir tous <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {rappels.map((rappel) => {
                const status = getRappelStatus(rappel.date);
                const isRetard = status === "retard";
                const isAujourdHui = status === "aujourd_hui";
                return (
                  <div
                    key={rappel.id}
                    className={isAujourdHui ? "pulse-glow" : ""}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.65rem 1rem",
                      borderRadius: "8px",
                      background: isRetard
                        ? "#ff000010"
                        : isAujourdHui
                        ? "var(--cyan-dim)"
                        : "var(--surface2)",
                      border: isRetard
                        ? "1px solid #ff000033"
                        : isAujourdHui
                        ? "1px solid var(--cyan)"
                        : "1px solid var(--border)",
                    }}
                  >
                    {isRetard ? (
                      <AlertTriangle size={15} color="#ff6b6b" />
                    ) : isAujourdHui ? (
                      <Bell size={15} color="var(--cyan)" />
                    ) : (
                      <Clock size={15} color="var(--muted)" />
                    )}
                    <span
                      style={{
                        flex: 1,
                        fontSize: "0.875rem",
                        color: isRetard
                          ? "#ff6b6b"
                          : isAujourdHui
                          ? "var(--cyan)"
                          : "var(--text)",
                      }}
                    >
                      {rappel.message}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: isRetard
                          ? "#ff6b6b"
                          : isAujourdHui
                          ? "var(--cyan)"
                          : "var(--muted)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatRappelDate(rappel.date)}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* À faire */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.38 }}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "1.25rem 1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <ListTodo size={16} color="var(--cyan)" />
            <span style={{ color: "var(--cyan)", fontWeight: "600", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              À faire
            </span>
            {todos.filter((t) => !t.fait).length > 0 && (
              <span style={{
                background: "var(--cyan-dim)",
                color: "var(--cyan)",
                borderRadius: "9999px",
                fontSize: "0.7rem",
                fontWeight: "700",
                padding: "0.1rem 0.5rem",
              }}>
                {todos.filter((t) => !t.fait).length}
              </span>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: todos.length > 0 ? "0.75rem" : "0" }}>
            {todos.map((todo) => (
              <div
                key={todo.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "8px",
                  background: todo.fait ? "var(--surface2)" : "none",
                  transition: "background 0.2s",
                }}
              >
                <button
                  onClick={() => handleToggleTodo(todo)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: todo.fait ? "var(--cyan)" : "var(--muted)", flexShrink: 0 }}
                >
                  {todo.fait ? <CheckSquare size={16} /> : <Square size={16} />}
                </button>
                <span style={{
                  flex: 1,
                  fontSize: "0.875rem",
                  color: todo.fait ? "var(--muted)" : "var(--text)",
                  textDecoration: todo.fait ? "line-through" : "none",
                  transition: "all 0.2s",
                }}>
                  {todo.texte}
                </span>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "var(--border)", display: "flex" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--border)")}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddTodo} style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Ajouter une tâche..."
              style={{
                flex: 1,
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "0.5rem 0.75rem",
                color: "var(--text)",
                fontSize: "0.875rem",
                outline: "none",
                fontFamily: "inherit",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
            <button
              type="submit"
              style={{
                background: "var(--cyan-dim)",
                border: "1px solid var(--cyan)44",
                borderRadius: "8px",
                padding: "0.5rem 0.75rem",
                color: "var(--cyan)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Plus size={16} />
            </button>
          </form>
        </motion.div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem", alignItems: "center" }}
        >
          <Filter size={16} color="var(--muted)" />
          {STATUTS.map((s) => (
            <button
              key={s}
              onClick={() => setFiltre(s)}
              style={{
                background: filtre === s ? "var(--cyan-dim)" : "var(--surface)",
                border: `1px solid ${filtre === s ? "var(--cyan)" : "var(--border)"}`,
                borderRadius: "9999px",
                padding: "0.35rem 1rem",
                color: filtre === s ? "var(--cyan)" : "var(--muted)",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: "500",
                transition: "all 0.2s",
              }}
            >
              {s}
            </button>
          ))}
        </motion.div>

        {/* Liste */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}>
            Chargement...
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "var(--surface)",
              border: "1px dashed var(--border)",
              borderRadius: "12px",
              color: "var(--muted)",
            }}
          >
            <Send size={40} style={{ margin: "0 auto 1rem", display: "block", opacity: 0.3 }} />
            <p style={{ margin: 0 }}>
              {filtre === "Tous"
                ? "Aucune candidature. Commencez par en ajouter une !"
                : `Aucune candidature avec le statut "${filtre}"`}
            </p>
          </motion.div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {filtered.map((c, i) => (
              <CandidatureCard
                key={c.id}
                candidature={c}
                index={i}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
