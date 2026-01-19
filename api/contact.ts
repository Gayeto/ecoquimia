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

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let data: Payload;
  try {
    data = (await req.json()) as Payload;
  } catch {
    return new Response(JSON.stringify({ error: "JSON inválido." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (data["bot-field"]) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
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
    if (!v) {
      return new Response(JSON.stringify({ error: `Falta campo: ${k}` }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, TO_EMAIL, FROM_NAME } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return new Response(
      JSON.stringify({
        error: "Faltan variables SMTP (SMTP_HOST/SMTP_USER/SMTP_PASS).",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
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
      replyTo: data.correo,
      subject,
      text,
      html,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({
        error: "No se pudo enviar el correo.",
        detail: e?.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
