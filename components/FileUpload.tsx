"use client";

import { useState, useRef } from "react";
import { Upload, File, X, CheckCircle } from "lucide-react";

interface FileUploadProps {
  label: string;
  accept?: string;
  onUpload: (path: string) => void;
  currentPath?: string;
}

export default function FileUpload({
  label,
  accept = ".pdf",
  onUpload,
  currentPath,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur upload");
      onUpload(data.path);
      setUploadedName(file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const isUploaded = uploadedName || currentPath;

  return (
    <div>
      <label
        style={{
          display: "block",
          color: "var(--muted)",
          fontSize: "0.8rem",
          fontWeight: "500",
          marginBottom: "0.5rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </label>

      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? "var(--cyan)" : isUploaded ? "#10b98166" : "var(--border)"}`,
          borderRadius: "10px",
          padding: "1.5rem",
          textAlign: "center",
          cursor: isUploading ? "not-allowed" : "pointer",
          background: isDragging ? "var(--cyan-dim)" : isUploaded ? "#10b98111" : "var(--surface2)",
          transition: "all 0.2s",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          style={{ display: "none" }}
        />

        {isUploading ? (
          <div style={{ color: "var(--cyan)", fontSize: "0.9rem" }}>
            <Upload size={24} style={{ margin: "0 auto 0.5rem", display: "block", animation: "pulse 1s infinite" }} />
            Upload en cours...
          </div>
        ) : isUploaded ? (
          <div style={{ color: "#10b981", fontSize: "0.9rem" }}>
            <CheckCircle size={24} style={{ margin: "0 auto 0.5rem", display: "block" }} />
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
              <File size={14} />
              {uploadedName || currentPath?.split("/").pop()}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUploadedName(null);
                onUpload("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#ef4444",
                cursor: "pointer",
                marginTop: "0.5rem",
                fontSize: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                margin: "0.5rem auto 0",
              }}
            >
              <X size={12} /> Supprimer
            </button>
          </div>
        ) : (
          <div style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
            <Upload size={24} style={{ margin: "0 auto 0.5rem", display: "block", color: "var(--cyan)" }} />
            <span>Glisser-déposer ou <span style={{ color: "var(--cyan)" }}>cliquer</span></span>
            <p style={{ fontSize: "0.75rem", margin: "0.25rem 0 0", color: "var(--muted)" }}>PDF uniquement</p>
          </div>
        )}
      </div>

      {error && (
        <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "0.25rem" }}>{error}</p>
      )}
    </div>
  );
}
