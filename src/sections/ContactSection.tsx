import { useState } from "react";
import "../styles/contact.css";

type FormState = {
  empresa: string;
  nombre: string;
  correo: string;
  telefono: string;
  material: string;
  // honeypot opcional
  "bot-field"?: string;
};

const initialState: FormState = {
  empresa: "",
  nombre: "",
  correo: "",
  telefono: "",
  material: "",
  "bot-field": "",
};

type Status = "idle" | "sending" | "success" | "error";

export default function ContactSection() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const onChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setErrorMsg("");

    try {
      // ✅ Vercel Serverless Function (api/contact.ts)
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "No se pudo enviar el mensaje.");
      }

      setStatus("success");
      setForm(initialState);
      window.setTimeout(() => setStatus("idle"), 3500);
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "Error enviando tu mensaje.");
      window.setTimeout(() => setStatus("idle"), 4500);
    }
  };

  return (
    <section id="contacto" className="ct-section">
      <div className="ct-wrap">
        {/* Header */}
        <div className="ct-header">
          <div className="ct-kicker">
            <span className="ct-kickerIc" aria-hidden="true">
              📩
            </span>
            <span>Contacto</span>
          </div>

          <h2 className="ct-title">Cotiza rápido tu material</h2>
          <p className="ct-subtitle">
            Déjanos tus datos y lo que necesitas. Te respondemos con
            disponibilidad, tiempos y costo estimado.
          </p>

          {/* Quick info cards */}
          <div className="ct-infoGrid" aria-label="Beneficios de contacto">
            <div className="ct-infoCard">
              <span className="ct-ic" aria-hidden="true">
                🚚
              </span>
              <div>
                <div className="ct-infoTitle">Entregas zona centro</div>
                <div className="ct-infoText">
                  Cobertura en CDMX y estados cercanos.
                </div>
              </div>
            </div>
            <div className="ct-infoCard">
              <span className="ct-ic" aria-hidden="true">
                🧾
              </span>
              <div>
                <div className="ct-infoTitle">Cotización clara</div>
                <div className="ct-infoText">
                  Respuesta con precio y tiempos.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="ct-card">
          <div className="ct-cardHeader">
            <div className="ct-cardTitle">
              <span className="ct-cardIcon" aria-hidden="true">
                🧪
              </span>
              Solicitar información
            </div>
            <div className="ct-cardHint">Campos obligatorios *</div>
          </div>

          <form className="ct-form" onSubmit={onSubmit}>
            {/* Honeypot (oculto): si bots lo llenan, el backend lo ignora */}
            <input
              type="text"
              name="bot-field"
              value={form["bot-field"] || ""}
              onChange={onChange("bot-field")}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-10000px",
                top: "auto",
                width: 1,
                height: 1,
                overflow: "hidden",
              }}
            />

            <div className="ct-grid">
              <label className="ct-field">
                <span className="ct-label">
                  <span className="ct-miniIc" aria-hidden="true">
                    🏢
                  </span>
                  Empresa *
                </span>
                <input
                  value={form.empresa}
                  onChange={onChange("empresa")}
                  className="ct-input"
                  placeholder="Ej. Químicos del Centro"
                  required
                  disabled={status === "sending"}
                />
              </label>

              <label className="ct-field">
                <span className="ct-label">
                  <span className="ct-miniIc" aria-hidden="true">
                    👤
                  </span>
                  Nombre *
                </span>
                <input
                  value={form.nombre}
                  onChange={onChange("nombre")}
                  className="ct-input"
                  placeholder="Tu nombre"
                  required
                  disabled={status === "sending"}
                />
              </label>

              <label className="ct-field">
                <span className="ct-label">
                  <span className="ct-miniIc" aria-hidden="true">
                    ✉️
                  </span>
                  Correo *
                </span>
                <input
                  value={form.correo}
                  onChange={onChange("correo")}
                  className="ct-input"
                  placeholder="tucorreo@empresa.com"
                  type="email"
                  required
                  disabled={status === "sending"}
                />
              </label>

              <label className="ct-field">
                <span className="ct-label">
                  <span className="ct-miniIc" aria-hidden="true">
                    📞
                  </span>
                  Teléfono *
                </span>
                <input
                  value={form.telefono}
                  onChange={onChange("telefono")}
                  className="ct-input"
                  placeholder="55 1234 5678"
                  inputMode="tel"
                  required
                  disabled={status === "sending"}
                />
              </label>
            </div>

            <label className="ct-field ct-fieldFull">
              <span className="ct-label">
                <span className="ct-miniIc" aria-hidden="true">
                  🧫
                </span>
                Material requerido *
              </span>
              <textarea
                value={form.material}
                onChange={onChange("material")}
                className="ct-textarea"
                placeholder="Ej. Alcohol isopropílico 99% (20 L), ácido acético glacial, SDS requerido..."
                rows={5}
                required
                disabled={status === "sending"}
              />
            </label>

            <div className="ct-actions">
              <button
                type="submit"
                className="ct-btn"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Enviando..." : "Enviar solicitud"}
                <span className="ct-btnArrow" aria-hidden="true">
                  →
                </span>
              </button>

              <div className="ct-privacy">
                <span className="ct-privacyIc" aria-hidden="true">
                  🔒
                </span>
                Tus datos se usan solo para responder tu solicitud.
              </div>
            </div>

            {status === "success" && (
              <div className="ct-toast" role="status" aria-live="polite">
                ✅ Listo. Recibimos tu mensaje. Te contactamos pronto.
              </div>
            )}

            {status === "error" && (
              <div className="ct-toast" role="status" aria-live="polite">
                ❌ {errorMsg || "Ocurrió un error. Intenta de nuevo."}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
