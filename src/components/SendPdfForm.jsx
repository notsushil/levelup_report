// src/components/SendPdfForm.jsx
import { useState } from "react";

export default function SendPdfForm() {
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");

  // read the chosen PDF and return only the base64 part (no data: prefix)
  async function fileToBase64(pdfFile) {
    const dataUrl = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(pdfFile);
    });
    return String(dataUrl).split(",")[1]; // keep just the base64 payload
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!file) return setMsg("Please choose a PDF first.");
    if (file.type !== "application/pdf") return setMsg("File must be a PDF.");

    try {
      setSending(true);
      setMsg("");

      const pdfBase64 = await fileToBase64(file);

      const res = await fetch("/api/send-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdfBase64,
          filename: file.name || "report.pdf",
          // Optional: you can omit these and use server env vars instead
          // to: "dhakalsushil02@gmail.com",
          // subject: "LevelUP Shift Report",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed sending email");
      }

      setMsg("✅ Sent! Check your inbox.");
      setFile(null);
    } catch (err) {
      setMsg(`❌ ${err.message || "Something went wrong"}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button type="submit" disabled={sending || !file} aria-busy={sending}>
        {sending ? "Sending…" : "Submit"}
      </button>

      {msg && <p>{msg}</p>}
    </form>
  );
}
