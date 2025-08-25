// Vercel Serverless Function (Node 18+)
import { Resend } from "resend";

// This expects JSON like { pdfBase64, filename, to, subject }
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    // Collect raw JSON body
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString());

    const { pdfBase64, filename = "report.pdf", to, subject } = body || {};
    if (!pdfBase64) return res.status(400).json({ ok: false, error: "Missing pdfBase64" });

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "LevelUP Reports <onboarding@resend.dev>", // or your verified domain
      to: [to || process.env.REPORT_TO],
      subject: subject || "LevelUP Shift Report",
      text: "Please find the attached PDF.",
      attachments: [
        {
          filename,
          content: pdfBase64, // base64 string
        },
      ],
    });

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Email send failed." });
  }
}
