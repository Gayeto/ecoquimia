import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

type Payload = {
  empresa: string;
  nombre: string;
  correo: string;
  telefono: string;
  material: string;
  "bot-field"?: string;
};

const esc = (s: string) =>
  String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const data = (body || {}) as Partial<Payload>;

  // Honeypot
  if (data["bot-field"]) return res.status(200).json({ ok: true });

  const required: (keyof Payload)[] = [
    "empresa",
    "nombre",
    "correo",
    "telefono",
    "material",
  ];

  for (const k of required) {
    const v = String((data as any)[k] ?? "").trim();
    if (!v) return res.status(400).json({ error: `Falta campo: ${k}` });
  }

  const GMAIL_USER = process.env.GMAIL_USER;
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    return res.status(500).json({
      error: "Faltan variables GMAIL_USER o GMAIL_APP_PASSWORD en Vercel.",
    });
  }

  const subject = `EcoQuimia — Nueva solicitud (${data.empresa})`;

  const text = [
    `Empresa: ${data.empresa}`,
    `Nombre: ${data.nombre}`,
    `Correo: ${data.correo}`,
    `Teléfono: ${data.telefono}`,
    `Material requerido:\n${data.material}`,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.4">
      <h2 style="margin:0 0 12px">EcoQuimia — Nueva solicitud</h2>
      <p style="margin:0 0 10px"><b>Empresa:</b> ${esc(data.empresa)}</p>
      <p style="margin:0 0 10px"><b>Nombre:</b> ${esc(data.nombre)}</p>
      <p style="margin:0 0 10px"><b>Correo:</b> ${esc(data.correo)}</p>
      <p style="margin:0 0 10px"><b>Teléfono:</b> ${esc(data.telefono)}</p>
      <p style="margin:0 0 8px"><b>Material requerido:</b></p>
      <pre style="white-space:pre-wrap;background:#f6f7f9;padding:12px;border-radius:10px;border:1px solid #e7e8ec">${esc(
        data.material,
      )}</pre>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD, // App Password
      },
    });

    await transporter.sendMail({
      from: `EcoQuimia <${GMAIL_USER}>`,
      to: "handrade1404@gmail.com",
      subject,
      text,
      html,
      replyTo: String(data.correo), // para responder directo al cliente
    });

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error("SMTP error:", e);
    return res.status(500).json({
      error: "No se pudo enviar el correo.",
      detail: e?.message,
    });
  }
}
