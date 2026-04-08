"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Send,
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
  Search,
  Eye,
} from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";

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
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

const STATUTS = ["Tous", "Envoyée", "Relance", "Entretien", "Acceptée", "Refusée"];

export default function Dashboard() {
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [rappels, setRappels] = useState<Rappel[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState("Tous");
  const [search, setSearch] = useState("");

  const fetchCandidatures = async () => {
    try {
      const res = await fetch("/api/candidatures");
      setCandidatures(await res.json());
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
      setRappels(data.slice(0, 4));
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
    setTodos((prev) => prev.map((t) => (t.id === todo.id ? { ...t, fait: !t.fait } : t)));
  };

  const handleDeleteTodo = async (id: number) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette candidature ?")) return;
    await fetch(`/api/candidatures/${id}`, { method: "DELETE" });
    setCandidatures((prev) => prev.filter((c) => c.id !== id));
  };

  useEffect(() => {
    fetchCandidatures();
    fetchRappels();
    fetchTodos();
  }, []);

  const filtered = candidatures
    .filter((c) => filtre === "Tous" || c.statut === filtre)
    .filter((c) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return c.entreprise.toLowerCase().includes(q) || c.poste.toLowerCase().includes(q);
    });

  const stats = {
    total: candidatures.length,
    enCours: candidatures.filter((c) => ["Envoyée", "Relance"].includes(c.statut)).length,
    entretiens: candidatures.filter((c) => c.statut === "Entretien").length,
    acceptees: candidatures.filter((c) => c.statut === "Acceptée").length,
    refusees: candidatures.filter((c) => c.statut === "Refusée").length,
  };

  const parEntreprise = Object.entries(
    candidatures.reduce((acc, c) => {
      acc[c.entreprise] = (acc[c.entreprise] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="grid-bg dashboard-pad">
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}
        >
          <div>
            <h1 className="gradient-text" style={{ fontSize: "1.6rem", fontWeight: "700", margin: 0, fontFamily: "monospace" }}>
              Suivi des candidatures
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "0.82rem", margin: "0.2rem 0 0" }}>
              {candidatures.length} candidature{candidatures.length !== 1 ? "s" : ""} enregistrée{candidatures.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link href="/nouvelle" style={{ textDecoration: "none" }}>
            <button style={{
              background: "var(--cyan-dim)",
              border: "1px solid var(--cyan)55",
              borderRadius: "8px",
              padding: "0.6rem 1.25rem",
              color: "var(--cyan)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              fontFamily: "inherit",
              transition: "background 0.2s",
            }}>
              <Plus size={15} />
              Nouvelle candidature
            </button>
          </Link>
        </motion.div>

        {/* Stats compactes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="stats-row"
        >
          {[
            { label: "Total", value: stats.total, color: "var(--cyan)" },
            { label: "En cours", value: stats.enCours, color: "var(--purple)" },
            { label: "Entretiens", value: stats.entretiens, color: "#eab308" },
            { label: "Acceptées", value: stats.acceptees, color: "#22c55e" },
            { label: "Refusées", value: stats.refusees, color: "#ef4444" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "0.875rem 1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}>
              <span style={{ fontSize: "1.75rem", fontWeight: "700", color: s.color, fontFamily: "monospace", lineHeight: 1 }}>
                {s.value}
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", lineHeight: 1.3 }}>
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Contenu principal 2 colonnes */}
        <div className="content-cols">

          {/* Colonne principale : liste */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {/* Recherche + filtres */}
            <div style={{ marginBottom: "0.875rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", pointerEvents: "none" }} />
                <input
                  type="text"
                  placeholder="Rechercher une entreprise, un poste..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "0.6rem 0.75rem 0.6rem 2.25rem",
                    color: "var(--text)",
                    fontSize: "0.875rem",
                    outline: "none",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {STATUTS.map((s) => {
                  const count = s === "Tous" ? candidatures.length : candidatures.filter((c) => c.statut === s).length;
                  return (
                    <button
                      key={s}
                      onClick={() => setFiltre(s)}
                      style={{
                        background: filtre === s ? "var(--cyan-dim)" : "var(--surface)",
                        border: `1px solid ${filtre === s ? "var(--cyan)" : "var(--border)"}`,
                        borderRadius: "9999px",
                        padding: "0.3rem 0.875rem",
                        color: filtre === s ? "var(--cyan)" : "var(--muted)",
                        cursor: "pointer",
                        fontSize: "0.78rem",
                        fontWeight: "500",
                        transition: "all 0.2s",
                        fontFamily: "inherit",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      {s}
                      <span style={{ opacity: 0.6, fontSize: "0.72rem" }}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Liste des candidatures */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)", fontSize: "0.9rem" }}>
                Chargement...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 2rem", background: "var(--surface)", border: "1px dashed var(--border)", borderRadius: "12px", color: "var(--muted)" }}>
                <Send size={32} style={{ margin: "0 auto 0.75rem", display: "block", opacity: 0.3 }} />
                <p style={{ margin: 0, fontSize: "0.875rem" }}>
                  {filtre === "Tous" && !search ? "Aucune candidature. Commencez par en ajouter une !" : "Aucun résultat pour cette recherche."}
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {filtered.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.025 }}
                    className="cand-card"
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--cyan)44"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; }}
                  >
                    <span className="cand-entreprise">{c.entreprise}</span>
                    <span className="cand-poste">{c.poste}{c.ville ? ` · ${c.ville}` : ""}</span>
                    <span className="cand-date">
                      {new Date(c.dateEnvoi).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                    </span>
                    <span className="cand-statut"><StatusBadge statut={c.statut} /></span>
                    <div className="cand-actions">
                      <Link href={`/candidature/${c.id}`} style={{ textDecoration: "none" }}>
                        <button style={{ background: "var(--cyan-dim)", border: "1px solid var(--cyan)44", borderRadius: "6px", padding: "0.4rem 0.6rem", color: "var(--cyan)", cursor: "pointer", display: "flex", alignItems: "center", fontFamily: "inherit" }}>
                          <Eye size={14} />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(c.id)}
                        style={{ background: "#ef444411", border: "1px solid #ef444433", borderRadius: "6px", padding: "0.4rem 0.6rem", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", fontFamily: "inherit" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="dashboard-sidebar"
          >

            {/* Par entreprise */}
            {parEntreprise.length > 0 && (
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1rem 1.125rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <Building2 size={14} color="var(--cyan)" />
                  <span style={{ color: "var(--cyan)", fontWeight: "600", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Par entreprise
                  </span>
                  <span style={{ color: "var(--muted)", fontSize: "0.72rem", marginLeft: "auto" }}>
                    {parEntreprise.length} entreprise{parEntreprise.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", maxHeight: "220px", overflowY: "auto" }}>
                  {parEntreprise.map(([entreprise, count]) => (
                    <div
                      key={entreprise}
                      style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 0.5rem", borderRadius: "6px", cursor: "pointer", transition: "background 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      onClick={() => { setSearch(entreprise); setFiltre("Tous"); }}
                      title="Filtrer par cette entreprise"
                    >
                      <span style={{ flex: 1, fontSize: "0.82rem", color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {entreprise}
                      </span>
                      <span style={{
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        color: count > 1 ? "var(--cyan)" : "var(--muted)",
                        fontFamily: "monospace",
                        background: count > 1 ? "var(--cyan-dim)" : "transparent",
                        borderRadius: "9999px",
                        padding: count > 1 ? "0.1rem 0.4rem" : "0",
                        minWidth: "1.2rem",
                        textAlign: "center",
                      }}>
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rappels */}
            {rappels.length > 0 && (
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1rem 1.125rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Bell size={14} color="var(--cyan)" />
                    <span style={{ color: "var(--cyan)", fontWeight: "600", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Rappels
                    </span>
                  </div>
                  <Link href="/rappels" style={{ display: "flex", alignItems: "center", gap: "0.2rem", color: "var(--muted)", fontSize: "0.75rem", textDecoration: "none" }}>
                    Tous <ArrowRight size={12} />
                  </Link>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
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
                          gap: "0.5rem",
                          padding: "0.45rem 0.6rem",
                          borderRadius: "6px",
                          background: isRetard ? "#ff000010" : isAujourdHui ? "var(--cyan-dim)" : "var(--surface2)",
                          border: isRetard ? "1px solid #ff000033" : isAujourdHui ? "1px solid var(--cyan)" : "1px solid transparent",
                        }}
                      >
                        {isRetard ? <AlertTriangle size={13} color="#ff6b6b" /> : isAujourdHui ? <Bell size={13} color="var(--cyan)" /> : <Clock size={13} color="var(--muted)" />}
                        <span style={{
                          flex: 1, fontSize: "0.8rem",
                          color: isRetard ? "#ff6b6b" : isAujourdHui ? "var(--cyan)" : "var(--text)",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {rappel.message}
                        </span>
                        <span style={{ fontSize: "0.7rem", color: "var(--muted)", whiteSpace: "nowrap" }}>
                          {formatRappelDate(rappel.date)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Todos */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1rem 1.125rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <ListTodo size={14} color="var(--cyan)" />
                <span style={{ color: "var(--cyan)", fontWeight: "600", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  À faire
                </span>
                {todos.filter((t) => !t.fait).length > 0 && (
                  <span style={{ background: "var(--cyan-dim)", color: "var(--cyan)", borderRadius: "9999px", fontSize: "0.65rem", fontWeight: "700", padding: "0.1rem 0.45rem" }}>
                    {todos.filter((t) => !t.fait).length}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginBottom: todos.length > 0 ? "0.6rem" : "0" }}>
                {todos.map((todo) => (
                  <div key={todo.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem 0.25rem" }}>
                    <button
                      onClick={() => handleToggleTodo(todo)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: todo.fait ? "var(--cyan)" : "var(--muted)", flexShrink: 0 }}
                    >
                      {todo.fait ? <CheckSquare size={14} /> : <Square size={14} />}
                    </button>
                    <span style={{ flex: 1, fontSize: "0.82rem", color: todo.fait ? "var(--muted)" : "var(--text)", textDecoration: todo.fait ? "line-through" : "none", transition: "all 0.2s" }}>
                      {todo.texte}
                    </span>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "var(--border)", display: "flex" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--border)")}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddTodo} style={{ display: "flex", gap: "0.4rem" }}>
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Ajouter une tâche..."
                  style={{
                    flex: 1,
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    padding: "0.45rem 0.65rem",
                    color: "var(--text)",
                    fontSize: "0.82rem",
                    outline: "none",
                    fontFamily: "inherit",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <button
                  type="submit"
                  style={{
                    background: "var(--cyan-dim)",
                    border: "1px solid var(--cyan)44",
                    borderRadius: "6px",
                    padding: "0.45rem 0.65rem",
                    color: "var(--cyan)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    fontFamily: "inherit",
                  }}
                >
                  <Plus size={14} />
                </button>
              </form>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
