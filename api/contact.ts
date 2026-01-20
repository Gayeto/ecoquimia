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
  // 1. Validar método
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Método ${req.method} no permitido` });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const data = (body || {}) as Partial<Payload>;

    // 2. Honeypot: Si el bot llenó el campo oculto, respondemos éxito pero no enviamos nada
    if (data["bot-field"] && data["bot-field"].trim() !== "") {
      return res.status(200).json({ ok: true, message: "Spam detected" });
    }

    // 3. Validar campos requeridos
    const required: (keyof Payload)[] = [
      "empresa",
      "nombre",
      "correo",
      "telefono",
      "material",
    ];
    for (const k of required) {
      if (!String(data[k] ?? "").trim()) {
        return res.status(400).json({ error: `El campo ${k} es obligatorio.` });
      }
    }

    // 4. Configurar variables de entorno
    const GMAIL_USER = process.env.GMAIL_USER;
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      throw new Error(
        "Configuración de servidor incompleta (Variables de entorno).",
      );
    }

    // 5. Configurar Transportador (Optimizado para Vercel)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true para puerto 465
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    const subject = `EcoQuimia — Nueva solicitud (${data.empresa})`;
    const text = `Empresa: ${data.empresa}\nNombre: ${data.nombre}\nCorreo: ${data.correo}\nTeléfono: ${data.telefono}\nMaterial:\n${data.material}`;

    const html = `
      <div style="font-family:sans-serif; line-height:1.6; color:#333; max-width:600px;">
        <h2 style="color:#0056b3;">Nueva Solicitud de Cotización</h2>
        <p><b>Empresa:</b> ${esc(data.empresa || "")}</p>
        <p><b>Nombre:</b> ${esc(data.nombre || "")}</p>
        <p><b>Correo:</b> ${esc(data.correo || "")}</p>
        <p><b>Teléfono:</b> ${esc(data.telefono || "")}</p>
        <hr />
        <p><b>Material requerido:</b></p>
        <div style="background:#f4f4f4; padding:15px; border-radius:5px; border:1px solid #ddd;">
          ${esc(data.material || "").replace(/\n/g, "<br>")}
        </div>
      </div>
    `;

    // 6. Enviar Correo
    await transporter.sendMail({
      from: `"EcoQuimia Web" <${GMAIL_USER}>`,
      to: "handrade1404@gmail.com",
      replyTo: String(data.correo),
      subject,
      text,
      html,
    });

    return res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error("Error en el handler:", error);
    return res.status(500).json({
      error: "Ocurrió un error al procesar el envío.",
      detail: error.message,
    });
  }
}
