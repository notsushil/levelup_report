// server/server.js
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

// If you **don’t** add the Vite proxy (step 4), keep CORS enabled:
app.use(cors({ origin: "http://localhost:5173" }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

app.post("/api/send-pdf", upload.single("file"), async (req, res) => {
  try {
    const to = req.body.to;
    const file = req.file;

    if (!to) return res.status(400).json({ error: "Missing 'to' address." });
    if (!file) return res.status(400).json({ error: "Missing PDF file." });
    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "File must be a PDF." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // Gmail App Password
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject: "Your PDF from LevelUP Report",
      text: "Attached is the PDF you submitted.",
      attachments: [
        {
          filename: file.originalname || "report.pdf",
          content: file.buffer,
          contentType: "application/pdf",
        },
      ],
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Email send failed." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
