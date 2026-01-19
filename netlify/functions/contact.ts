// netlify/functions/contact.ts
import type { Handler } from "@netlify/functions";
import nodemailer from "nodemailer";

type Payload = {
  empresa: string;
  nombre: string;
  correo: string;
  telefono: string;
  material: string;
  // honeypot opcional:
  "bot-field"?: string;
};

const esc = (s: string) =>
  String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let data: Payload;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "JSON inválido." }),
    };
  }

  // Honeypot (si algún bot lo llena, fingimos OK y no mandamos nada)
  if (data["bot-field"]) {
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  const required: (keyof Payload)[] = [
    "empresa",
    "nombre",
    "correo",
    "telefono",
    "material",
  ];
  for (const k of required) {
    const v = String(data[k] ?? "").trim();
    if (!v)
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Falta campo: ${k}` }),
      };
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, TO_EMAIL, FROM_NAME } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error:
          "Faltan variables SMTP en Netlify (SMTP_HOST/SMTP_USER/SMTP_PASS).",
      }),
    };
  }

  const port = Number(SMTP_PORT || 465);
  const secure = port === 465;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

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
    await transporter.sendMail({
      from: `"${FROM_NAME || "EcoQuimia"}" <${SMTP_USER}>`,
      to: TO_EMAIL || "handrade1404@gmail.com",
      replyTo: data.correo, // para responder directo al cliente
      subject,
      text,
      html,
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "No se pudo enviar el correo.",
        detail: e?.message,
      }),
    };
  }
};
