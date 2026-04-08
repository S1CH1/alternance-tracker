"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickyNote, Plus, Trash2, Save, FileText } from "lucide-react";

interface Note {
  id: number;
  titre: string | null;
  contenu: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editTitre, setEditTitre] = useState("");
  const [editContenu, setEditContenu] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isNewRef = useRef(false);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const selectedNote = notes.find((n) => n.id === selectedId) ?? null;

  const handleSelect = (note: Note) => {
    isNewRef.current = false;
    setSelectedId(note.id);
    setEditTitre(note.titre ?? "");
    setEditContenu(note.contenu);
    setSaved(false);
  };

  const handleNew = async () => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titre: "", contenu: "" }),
    });
    const note = await res.json();
    setNotes((prev) => [note, ...prev]);
    isNewRef.current = true;
    setSelectedId(note.id);
    setEditTitre("");
    setEditContenu("");
    setSaved(false);
  };

  const saveNote = useCallback(
    async (id: number, titre: string, contenu: string) => {
      setSaving(true);
      try {
        const res = await fetch(`/api/notes/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ titre, contenu }),
        });
        const updated = await res.json();
        setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        console.error(err);
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette note ?")) return;
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
      setEditTitre("");
      setEditContenu("");
    }
  };

  const triggerDebounce = (id: number, titre: string, contenu: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveNote(id, titre, contenu);
    }, 1000);
  };

  const handleTitreChange = (val: string) => {
    setEditTitre(val);
    if (selectedId) triggerDebounce(selectedId, val, editContenu);
  };

  const handleContenuChange = (val: string) => {
    setEditContenu(val);
    if (selectedId) triggerDebounce(selectedId, editTitre, val);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="grid-bg page-pad">
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
          }}
        >
          <div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <StickyNote size={28} color="var(--cyan)" />
              <h1
                className="gradient-text"
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  margin: 0,
                  fontFamily: "monospace",
                }}
              >
                Notes
              </h1>
            </div>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "0.9rem",
                margin: "0.25rem 0 0 0",
              }}
            >
              {notes.length} note{notes.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={handleNew}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "linear-gradient(135deg, var(--cyan), var(--purple))",
              border: "none",
              borderRadius: "8px",
              padding: "0.6rem 1.2rem",
              color: "#000",
              fontWeight: "600",
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            <Plus size={16} />
            Nouvelle note
          </button>
        </motion.div>

        {/* Contenu principal */}
        <div className="notes-layout">
          {/* Liste des notes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "1rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "var(--muted)",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Toutes les notes
              </p>
            </div>
            {loading ? (
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "var(--muted)",
                }}
              >
                Chargement...
              </div>
            ) : notes.length === 0 ? (
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "var(--muted)",
                }}
              >
                <FileText
                  size={32}
                  style={{ margin: "0 auto 0.75rem", display: "block", opacity: 0.3 }}
                />
                <p style={{ margin: 0, fontSize: "0.85rem" }}>
                  Aucune note. Créez-en une !
                </p>
              </div>
            ) : (
              <div style={{ overflowY: "auto", flex: 1 }}>
                <AnimatePresence>
                  {notes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      onClick={() => handleSelect(note)}
                      style={{
                        padding: "1rem",
                        borderBottom: "1px solid var(--border)",
                        cursor: "pointer",
                        background:
                          selectedId === note.id
                            ? "var(--cyan-dim)"
                            : "transparent",
                        borderLeft:
                          selectedId === note.id
                            ? "2px solid var(--cyan)"
                            : "2px solid transparent",
                        transition: "all 0.2s",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 0.25rem",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color:
                            selectedId === note.id
                              ? "var(--cyan)"
                              : "var(--text)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {note.titre || "Sans titre"}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.75rem",
                          color: "var(--muted)",
                        }}
                      >
                        {formatDate(note.updatedAt)}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Zone d'édition */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {selectedNote || selectedId ? (
              <>
                {/* Toolbar */}
                <div
                  style={{
                    padding: "1rem 1.5rem",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {saving ? (
                      <span
                        style={{ fontSize: "0.8rem", color: "var(--muted)" }}
                      >
                        Enregistrement...
                      </span>
                    ) : saved ? (
                      <span style={{ fontSize: "0.8rem", color: "#10b981" }}>
                        Sauvegardé
                      </span>
                    ) : (
                      <span
                        style={{ fontSize: "0.8rem", color: "var(--muted)" }}
                      >
                        Sauvegarde auto
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() =>
                        selectedId &&
                        saveNote(selectedId, editTitre, editContenu)
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        background: "var(--cyan-dim)",
                        border: "1px solid var(--cyan)",
                        borderRadius: "6px",
                        padding: "0.4rem 0.8rem",
                        color: "var(--cyan)",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      <Save size={14} />
                      Sauvegarder
                    </button>
                    <button
                      onClick={() => selectedId && handleDelete(selectedId)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        background: "#ff000015",
                        border: "1px solid #ff000044",
                        borderRadius: "6px",
                        padding: "0.4rem 0.8rem",
                        color: "#ff6b6b",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={14} />
                      Supprimer
                    </button>
                  </div>
                </div>
                {/* Champs */}
                <div
                  style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}
                >
                  <input
                    type="text"
                    value={editTitre}
                    onChange={(e) => handleTitreChange(e.target.value)}
                    placeholder="Titre de la note..."
                    style={{
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "0.75rem 1rem",
                      color: "var(--text)",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      fontFamily: "monospace",
                      outline: "none",
                      width: "100%",
                    }}
                  />
                  <textarea
                    value={editContenu}
                    onChange={(e) => handleContenuChange(e.target.value)}
                    placeholder="Contenu de la note..."
                    style={{
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "1rem",
                      color: "var(--text)",
                      fontSize: "0.9rem",
                      lineHeight: "1.7",
                      outline: "none",
                      resize: "none",
                      flex: 1,
                      minHeight: "400px",
                      fontFamily: "system-ui, sans-serif",
                    }}
                  />
                </div>
              </>
            ) : (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--muted)",
                  gap: "1rem",
                }}
              >
                <StickyNote size={48} style={{ opacity: 0.2 }} />
                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                  Sélectionnez une note ou créez-en une nouvelle
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
