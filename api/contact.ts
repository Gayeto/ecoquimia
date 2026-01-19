import { Resend } from "resend";

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

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const data = (req.body || {}) as Partial<Payload>;

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

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Falta RESEND_API_KEY." });

  const resend = new Resend(apiKey);

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
    await resend.emails.send({
      // Para pruebas puedes usar onboarding@resend.dev
      // Para producción, lo ideal es un from de tu dominio verificado (ej: contacto@ecoquimia.com)
      from: process.env.FROM_EMAIL || "EcoQuimia <onboarding@resend.dev>",
      to: [process.env.TO_EMAIL || "hector.andrade@ecoquimia.com"],
      replyTo: String(data.correo),
      subject,
      text,
      html,
    });

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({
      error: "No se pudo enviar el correo.",
      detail: e?.message,
    });
  }
}
