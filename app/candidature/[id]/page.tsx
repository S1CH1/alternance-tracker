"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Briefcase,
  MapPin,
  Calendar,
  Link as LinkIcon,
  FileText,
  Save,
  ExternalLink,
  ChevronDown,
  Pencil,
  X,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

interface Candidature {
  id: number;
  entreprise: string;
  poste: string;
  ville: string | null;
  dateEnvoi: string;
  statut: string;
  lienOffre: string | null;
  notes: string | null;
  cvPath: string | null;
  lmPath: string | null;
  offrePdfPath: string | null;
}

const STATUTS = ["Envoyée", "Relance", "Entretien", "Acceptée", "Refusée"];

export default function CandidatureDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [candidature, setCandidature] = useState<Candidature | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [savedNotes, setSavedNotes] = useState(false);
  const [showStatutMenu, setShowStatutMenu] = useState(false);
  const [changingStatut, setChangingStatut] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ entreprise: "", poste: "", ville: "", lienOffre: "", dateEnvoi: "" });
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    const fetchCandidature = async () => {
      try {
        const res = await fetch(`/api/candidatures/${id}`);
        if (!res.ok) {
          router.push("/");
          return;
        }
        const data = await res.json();
        setCandidature(data);
        setNotes(data.notes || "");
        setEditForm({
          entreprise: data.entreprise,
          poste: data.poste,
          ville: data.ville || "",
          lienOffre: data.lienOffre || "",
          dateEnvoi: data.dateEnvoi.slice(0, 10),
        });
      } catch {
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    fetchCandidature();
  }, [id, router]);

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await fetch(`/api/candidatures/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      setSavedNotes(true);
      setTimeout(() => setSavedNotes(false), 2000);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleSaveEdit = async () => {
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/candidatures/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entreprise: editForm.entreprise,
          poste: editForm.poste,
          ville: editForm.ville || null,
          lienOffre: editForm.lienOffre || null,
          dateEnvoi: new Date(editForm.dateEnvoi).toISOString(),
        }),
      });
      const updated = await res.json();
      setCandidature((prev) => prev ? { ...prev, ...updated } : prev);
      setEditMode(false);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleChangeStatut = async (statut: string) => {
    setChangingStatut(true);
    setShowStatutMenu(false);
    try {
      await fetch(`/api/candidatures/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut }),
      });
      setCandidature((prev) => prev ? { ...prev, statut } : prev);
    } finally {
      setChangingStatut(false);
    }
  };

  if (loading) {
    return (
      <div className="grid-bg" style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--muted)" }}>Chargement...</div>
      </div>
    );
  }

  if (!candidature) return null;

  const date = new Date(candidature.dateEnvoi).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="grid-bg" style={{ minHeight: "calc(100vh - 64px)", padding: "2rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Back */}
        <button
          onClick={() => router.push("/")}
          style={{
            background: "none",
            border: "none",
            color: "var(--muted)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
            marginBottom: "1.5rem",
            padding: 0,
          }}
        >
          <ArrowLeft size={16} />
          Retour au dashboard
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "1.5rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: "linear-gradient(90deg, var(--cyan), var(--purple))",
            }}
          />

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {editMode ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {[
                    { key: "entreprise", icon: <Building2 size={16} color="var(--cyan)" />, placeholder: "Entreprise" },
                    { key: "poste", icon: <Briefcase size={16} />, placeholder: "Poste" },
                    { key: "ville", icon: <MapPin size={16} />, placeholder: "Ville (optionnel)" },
                    { key: "lienOffre", icon: <LinkIcon size={16} />, placeholder: "Lien de l'offre (optionnel)" },
                  ].map(({ key, icon, placeholder }) => (
                    <div key={key} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ color: "var(--muted)", flexShrink: 0 }}>{icon}</span>
                      <input
                        value={editForm[key as keyof typeof editForm]}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, [key]: e.target.value }))}
                        placeholder={placeholder}
                        style={{
                          background: "var(--surface2)",
                          border: "1px solid var(--border)",
                          borderRadius: "6px",
                          padding: "0.4rem 0.75rem",
                          color: "var(--text)",
                          fontSize: key === "entreprise" ? "1.1rem" : "0.9rem",
                          fontWeight: key === "entreprise" ? "700" : "400",
                          outline: "none",
                          width: "100%",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                      />
                    </div>
                  ))}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: "var(--muted)", flexShrink: 0 }}><Calendar size={16} /></span>
                    <input
                      type="date"
                      value={editForm.dateEnvoi}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, dateEnvoi: e.target.value }))}
                      style={{
                        background: "var(--surface2)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        padding: "0.4rem 0.75rem",
                        color: "var(--text)",
                        fontSize: "0.9rem",
                        outline: "none",
                        colorScheme: "dark",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <Building2 size={20} color="var(--cyan)" />
                    <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: "700", color: "var(--text)" }}>
                      {candidature.entreprise}
                    </h1>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--muted)" }}>
                    <Briefcase size={16} />
                    <span style={{ fontSize: "1rem" }}>{candidature.poste}</span>
                    {candidature.ville && (
                      <>
                        <span style={{ color: "var(--border)" }}>·</span>
                        <MapPin size={14} />
                        <span style={{ fontSize: "0.95rem" }}>{candidature.ville}</span>
                      </>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--muted)", marginTop: "0.5rem" }}>
                    <Calendar size={14} />
                    <span style={{ fontSize: "0.85rem" }}>Envoyée le {date}</span>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>
              {editMode ? (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => { setEditMode(false); setEditForm({ entreprise: candidature.entreprise, poste: candidature.poste, ville: candidature.ville || "", lienOffre: candidature.lienOffre || "", dateEnvoi: candidature.dateEnvoi.slice(0, 10) }); }}
                    style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "8px", padding: "0.5rem 1rem", color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem" }}
                  >
                    <X size={14} /> Annuler
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={savingEdit}
                    style={{ background: "var(--cyan-dim)", border: "1px solid var(--cyan)44", borderRadius: "8px", padding: "0.5rem 1rem", color: "var(--cyan)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem" }}
                  >
                    <Save size={14} /> {savingEdit ? "..." : "Enregistrer"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "8px", padding: "0.5rem 1rem", color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem" }}
                >
                  <Pencil size={14} /> Modifier
                </button>
              )}
              <StatusBadge statut={candidature.statut} />

              {/* Changement statut */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowStatutMenu(!showStatutMenu)}
                  disabled={changingStatut}
                  style={{
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "0.5rem 1rem",
                    color: "var(--muted)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.8rem",
                  }}
                >
                  Changer statut <ChevronDown size={14} />
                </button>
                {showStatutMenu && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 4px)",
                      right: 0,
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      overflow: "hidden",
                      zIndex: 10,
                      minWidth: "150px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                    }}
                  >
                    {STATUTS.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleChangeStatut(s)}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "0.6rem 1rem",
                          background: candidature.statut === s ? "var(--cyan-dim)" : "none",
                          border: "none",
                          color: candidature.statut === s ? "var(--cyan)" : "var(--text)",
                          cursor: "pointer",
                          textAlign: "left",
                          fontSize: "0.875rem",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          if (candidature.statut !== s)
                            (e.target as HTMLButtonElement).style.background = "var(--border)";
                        }}
                        onMouseLeave={(e) => {
                          if (candidature.statut !== s)
                            (e.target as HTMLButtonElement).style.background = "none";
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {candidature.lienOffre && (
                <a
                  href={candidature.lienOffre}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "var(--cyan)",
                    fontSize: "0.8rem",
                    textDecoration: "none",
                  }}
                >
                  <LinkIcon size={14} />
                  Voir l&apos;offre originale
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              <FileText size={14} />
              Notes
            </div>
            <button
              onClick={handleSaveNotes}
              disabled={savingNotes}
              style={{
                background: savedNotes ? "#10b98122" : "var(--cyan-dim)",
                border: `1px solid ${savedNotes ? "#10b98155" : "var(--cyan)44"}`,
                borderRadius: "6px",
                padding: "0.4rem 0.75rem",
                color: savedNotes ? "#10b981" : "var(--cyan)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.8rem",
              }}
            >
              <Save size={14} />
              {savedNotes ? "Sauvegardé !" : savingNotes ? "..." : "Sauvegarder"}
            </button>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ajoutez vos notes ici..."
            rows={5}
            style={{
              width: "100%",
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              color: "var(--text)",
              fontSize: "0.9rem",
              outline: "none",
              resize: "vertical",
              fontFamily: "inherit",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </motion.div>

        {/* Documents PDF */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {[
            { label: "CV", path: candidature.cvPath },
            { label: "Lettre de motivation", path: candidature.lmPath },
            { label: "Offre (PDF)", path: candidature.offrePdfPath },
          ].map(({ label, path }) =>
            path ? (
              <div
                key={label}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "1rem 1.5rem",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "var(--cyan)",
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  <FileText size={14} />
                  {label}
                </div>
                <iframe
                  src={`/api/files/${path}`}
                  style={{
                    width: "100%",
                    height: "600px",
                    border: "none",
                    background: "#fff",
                  }}
                  title={label}
                />
              </div>
            ) : null
          )}

          {!candidature.cvPath && !candidature.lmPath && !candidature.offrePdfPath && (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                background: "var(--surface)",
                border: "1px dashed var(--border)",
                borderRadius: "12px",
                color: "var(--muted)",
                fontSize: "0.875rem",
              }}
            >
              Aucun document uploadé pour cette candidature.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
