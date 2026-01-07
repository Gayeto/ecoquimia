const nodemailer = require("nodemailer");

function isEmail(value = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const data = JSON.parse(event.body || "{}");

    const empresa = String(data.empresa || "").trim();
    const nombre = String(data.nombre || "").trim();
    const correo = String(data.correo || "").trim();
    const telefono = String(data.telefono || "").trim();
    const material = String(data.material || "").trim();

    // ✅ Validaciones mínimas
    if (!empresa || !nombre || !correo || !telefono || !material) {
      return {
        statusCode: 400,
        body: JSON.stringify({ ok: false, error: "Faltan campos obligatorios." }),
      };
    }
    if (!isEmail(correo)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ ok: false, error: "Correo inválido." }),
      };
    }

    // ✅ Variables de entorno (Netlify -> Site settings -> Environment variables)
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      TO_EMAIL,
      FROM_EMAIL,
    } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !TO_EMAIL) {
      return {
        statusCode: 500,
        body: JSON.stringify({ ok: false, error: "SMTP no configurado en el servidor." }),
      };
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465, // 465 = SSL, 587 = STARTTLS
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const subject = `📩 Nueva solicitud EcoQuimia — ${empresa} (${nombre})`;

    const text = `
Nueva solicitud desde la web:

Empresa: ${empresa}
Nombre: ${nombre}
Correo: ${correo}
Teléfono: ${telefono}

Material requerido:
${material}
`.trim();

    const html = `
      <h2>Nueva solicitud desde la web</h2>
      <p><b>Empresa:</b> ${empresa}</p>
      <p><b>Nombre:</b> ${nombre}</p>
      <p><b>Correo:</b> ${correo}</p>
      <p><b>Teléfono:</b> ${telefono}</p>
      <hr />
      <p><b>Material requerido:</b></p>
      <pre style="white-space:pre-wrap;font-family:inherit;">${material}</pre>
    `;

    await transporter.sendMail({
      from: FROM_EMAIL || SMTP_USER, // recomendable: un correo del mismo dominio/SMTP
      to: TO_EMAIL,                  // tu correo destino fijo
      replyTo: correo,               // para responderle directo al cliente
      subject,
      text,
      html,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: "Error enviando correo." }),
    };
  }
};
