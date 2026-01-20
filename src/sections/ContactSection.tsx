import { useState } from "react";
import "../styles/contact.css";

type FormState = {
  empresa: string;
  nombre: string;
  correo: string;
  telefono: string;
  material: string;
  "bot-field": string;
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.detail || "Error desconocido");
      }

      setStatus("success");
      setForm(initialState);
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err: any) {
      console.error("Form error:", err);
      setStatus("error");
      setErrorMsg(err.message);
      setTimeout(() => setStatus("idle"), 6000);
    }
  };

  return (
    <section id="contacto" className="ct-section">
      <div className="ct-wrap">
        <div className="ct-header">
          <div className="ct-kicker">
            <span className="ct-kickerIc">📩</span>
            <span>Contacto</span>
          </div>
          <h2 className="ct-title">Cotiza rápido tu material</h2>
          <p className="ct-subtitle">
            Te respondemos con disponibilidad y costo estimado.
          </p>
        </div>

        <div className="ct-card">
          <form className="ct-form" onSubmit={onSubmit}>
            {/* Honeypot */}
            <input
              type="text"
              name="bot-field"
              value={form["bot-field"]}
              onChange={onChange("bot-field")}
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="ct-grid">
              <label className="ct-field">
                <span className="ct-label">Empresa *</span>
                <input
                  value={form.empresa}
                  onChange={onChange("empresa")}
                  className="ct-input"
                  required
                  disabled={status === "sending"}
                />
              </label>

              <label className="ct-field">
                <span className="ct-label">Nombre *</span>
                <input
                  value={form.nombre}
                  onChange={onChange("nombre")}
                  className="ct-input"
                  required
                  disabled={status === "sending"}
                />
              </label>

              <label className="ct-field">
                <span className="ct-label">Correo *</span>
                <input
                  type="email"
                  value={form.correo}
                  onChange={onChange("correo")}
                  className="ct-input"
                  required
                  disabled={status === "sending"}
                />
              </label>

              <label className="ct-field">
                <span className="ct-label">Teléfono *</span>
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={onChange("telefono")}
                  className="ct-input"
                  required
                  disabled={status === "sending"}
                />
              </label>
            </div>

            <label className="ct-field ct-fieldFull">
              <span className="ct-label">Material requerido *</span>
              <textarea
                value={form.material}
                onChange={onChange("material")}
                className="ct-textarea"
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
              </button>
            </div>

            {status === "success" && (
              <div className="ct-toast success">
                ✅ Mensaje enviado correctamente.
              </div>
            )}

            {status === "error" && (
              <div className="ct-toast error">❌ {errorMsg}</div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
