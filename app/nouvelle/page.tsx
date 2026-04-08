"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, Briefcase, MapPin, Link as LinkIcon, FileText, ArrowLeft, Send, Calendar } from "lucide-react";
import FileUpload from "@/components/FileUpload";

export default function NouvelleCandidature() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    entreprise: "",
    poste: "",
    ville: "",
    dateEnvoi: today,
    lienOffre: "",
    notes: "",
    cvPath: "",
    lmPath: "",
    offrePdfPath: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.entreprise || !form.poste) {
      setError("L'entreprise et le poste sont obligatoires.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/candidatures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      router.push(`/candidature/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    color: "var(--text)",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block" as const,
    color: "var(--muted)",
    fontSize: "0.8rem",
    fontWeight: "500" as const,
    marginBottom: "0.5rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
  };

  return (
    <div className="grid-bg page-pad">
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: "2rem" }}
        >
          <button
            onClick={() => router.back()}
            style={{
              background: "none",
              border: "none",
              color: "var(--muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.875rem",
              marginBottom: "1rem",
              padding: 0,
            }}
          >
            <ArrowLeft size={16} />
            Retour
          </button>
          <h1
            className="gradient-text"
            style={{ fontSize: "1.75rem", fontWeight: "700", margin: "0 0 0.5rem", fontFamily: "monospace" }}
          >
            Nouvelle candidature
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: 0 }}>
            Enregistrez une nouvelle candidature d&apos;alternance
          </p>
        </motion.div>

        {/* Formulaire */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="form-card"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {/* Infos principales */}
          <div className="form-grid-3">
            <div>
              <label style={labelStyle}>
                <Building2 size={12} style={{ display: "inline", marginRight: "0.35rem" }} />
                Entreprise *
              </label>
              <input
                type="text"
                value={form.entreprise}
                onChange={(e) => setForm({ ...form, entreprise: e.target.value })}
                placeholder="Ex: Airbus"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
            <div>
              <label style={labelStyle}>
                <Briefcase size={12} style={{ display: "inline", marginRight: "0.35rem" }} />
                Poste *
              </label>
              <input
                type="text"
                value={form.poste}
                onChange={(e) => setForm({ ...form, poste: e.target.value })}
                placeholder="Ex: Développeur Full Stack"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
            <div>
              <label style={labelStyle}>
                <MapPin size={12} style={{ display: "inline", marginRight: "0.35rem" }} />
                Ville
              </label>
              <input
                type="text"
                value={form.ville}
                onChange={(e) => setForm({ ...form, ville: e.target.value })}
                placeholder="Ex: Paris"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
          </div>

          <div style={{ maxWidth: "100%" }}>
            <label style={labelStyle}>
              <Calendar size={12} style={{ display: "inline", marginRight: "0.35rem" }} />
              Date d&apos;envoi
            </label>
            <input
              type="date"
              value={form.dateEnvoi}
              onChange={(e) => setForm({ ...form, dateEnvoi: e.target.value })}
              style={{ ...inputStyle, colorScheme: "dark", width: "100%" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          <div>
            <label style={labelStyle}>
              <LinkIcon size={12} style={{ display: "inline", marginRight: "0.35rem" }} />
              Lien de l&apos;offre
            </label>
            <input
              type="url"
              value={form.lienOffre}
              onChange={(e) => setForm({ ...form, lienOffre: e.target.value })}
              placeholder="https://..."
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          <div>
            <label style={labelStyle}>
              <FileText size={12} style={{ display: "inline", marginRight: "0.35rem" }} />
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Informations supplémentaires, contact RH, salaire, etc."
              rows={4}
              style={{
                ...inputStyle,
                resize: "vertical",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--cyan)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          {/* Séparateur */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
            <p style={{ color: "var(--muted)", fontSize: "0.8rem", margin: "0 0 1rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Documents (PDF)
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <FileUpload
                label="CV"
                onUpload={(path) => setForm({ ...form, cvPath: path })}
              />
              <FileUpload
                label="Lettre de motivation"
                onUpload={(path) => setForm({ ...form, lmPath: path })}
              />
              <FileUpload
                label="Offre (PDF)"
                onUpload={(path) => setForm({ ...form, offrePdfPath: path })}
              />
            </div>
          </div>

          {error && (
            <div
              style={{
                background: "#ef444411",
                border: "1px solid #ef444433",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                color: "#ef4444",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading
                ? "var(--border)"
                : "linear-gradient(135deg, var(--cyan), var(--purple))",
              border: "none",
              borderRadius: "10px",
              padding: "0.875rem 2rem",
              color: loading ? "var(--muted)" : "#000",
              fontWeight: "700",
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "opacity 0.2s",
              width: "100%",
            }}
          >
            <Send size={18} />
            {loading ? "Enregistrement..." : "Enregistrer la candidature"}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
