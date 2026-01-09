import "../styles/footer.css";

type FooterProps = {
  logoSrc?: string;
  brandText?: string;
  whatsappHref?: string;
  contactEmail?: string;
};

export default function Footer({
  logoSrc = "/images/logo-circulo.png",
  brandText = "ECOQUIMIA",
  whatsappHref = "https://wa.me/5215548009797?text=Hola%20Ecoquimia,%20quiero%20informes",
  contactEmail = "hector.andrade@ecoquimia.com",
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <>
      {/* ✅ Botón flotante WhatsApp */}
      <a
        className="wa-float"
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        title="WhatsApp"
      >
        <span className="wa-float__pulse" aria-hidden="true" />
        <span className="wa-float__pulse wa-float__pulse--2" aria-hidden="true" />
        <span className="wa-float__icon" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
            <path
              fill="white"
              d="M16.02 5.33c-5.86 0-10.62 4.74-10.62 10.6 0 1.87.5 3.7 1.45 5.3L5.33 26.67l5.6-1.46c1.54.84 3.28 1.28 5.09 1.28h.01c5.86 0 10.62-4.74 10.62-10.6 0-2.84-1.11-5.52-3.12-7.53a10.57 10.57 0 0 0-7.5-3.03Zm6.2 15.08c-.26.74-1.5 1.42-2.07 1.51-.52.08-1.18.11-1.9-.12-.44-.14-1-.33-1.73-.65-3.04-1.32-5.02-4.4-5.17-4.6-.15-.2-1.24-1.65-1.24-3.14 0-1.49.78-2.22 1.06-2.52.28-.3.6-.38.8-.38h.58c.18 0 .44-.07.68.52.26.62.9 2.14.98 2.3.08.16.13.36.03.58-.1.22-.15.36-.3.55-.15.2-.32.43-.46.58-.15.15-.3.31-.13.6.17.29.77 1.27 1.65 2.06 1.13 1 2.09 1.31 2.41 1.46.32.15.5.13.68-.08.19-.21.78-.91.99-1.22.21-.31.41-.26.7-.15.29.1 1.84.87 2.15 1.03.31.16.52.24.6.38.08.14.08.81-.18 1.55Z"
            />
          </svg>
        </span>
      </a>

      <footer className="ft" aria-label="Footer">
        <div className="ft-inner">
          {/* Top brand */}
          <div className="ft-top">
            <div className="ft-brandRow">
              <img className="ft-logo" src={logoSrc} alt={brandText} />
              <div className="ft-brandBlock">
                <div className="ft-brand">{brandText}</div>
                <div className="ft-tagline">
                  Química industrial • Limpieza • Materias primas
                </div>
              </div>
            </div>

            <div className="ft-social" aria-label="Redes sociales">
              <a className="ft-socialBtn" href="#" aria-label="Facebook">f</a>
              <a className="ft-socialBtn" href="#" aria-label="Instagram">⌁</a>
              <a
                className="ft-socialBtn"
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                ⦿
              </a>
            </div>
          </div>

          <div className="ft-divider" />

          {/* Columnas */}
          <div className="ft-grid">
            <div className="ft-col">
              <h4 className="ft-title">
                <span className="ft-ic" aria-hidden="true">📞</span> Contacto
              </h4>
              <a className="ft-link" href="#contacto">Formulario</a>
              <a className="ft-link" href="#cobertura">Cobertura</a>
              <a className="ft-link" href="#videos">Videos</a>

              {/* ✅ Correo agregado */}
              <a
                className="ft-link ft-link--email"
                href={`mailto:${contactEmail}`}
                aria-label={`Enviar correo a ${contactEmail}`}
              >
                <span className="ft-mailIc" aria-hidden="true">✉️</span>
                {contactEmail}
              </a>
            </div>

            <div className="ft-col">
              <h4 className="ft-title">
                <span className="ft-ic" aria-hidden="true">🧪</span> Catálogo
              </h4>
              <a className="ft-link" href="#catalogo">Ver categorías</a>
              <a className="ft-link" href="#catalogo">Productos</a>
              <a className="ft-link" href="#catalogo">Cotizaciones</a>
            </div>

            <div className="ft-col">
              <h4 className="ft-title">
                <span className="ft-ic" aria-hidden="true">📄</span> Enlaces útiles
              </h4>
              <button className="ft-link ft-btn" type="button">FAQ</button>
              <button className="ft-link ft-btn" type="button">Términos</button>
              <button className="ft-link ft-btn" type="button">Privacidad</button>
            </div>

            <div className="ft-col">
              <h4 className="ft-title">
                <span className="ft-ic" aria-hidden="true">🏢</span> Empresa
              </h4>
              <button className="ft-link ft-btn" type="button">Nosotros</button>
              <button className="ft-link ft-btn" type="button">Calidad</button>
              <button className="ft-link ft-btn" type="button">Sustentabilidad</button>
            </div>

            <div className="ft-col">
              <h4 className="ft-title">
                <span className="ft-ic" aria-hidden="true">🕒</span> Horarios
              </h4>
              <div className="ft-muted">Lun – Vie: 9:00 – 18:00</div>
              <div className="ft-muted">Sábado: 10:00 – 14:00</div>
              <div className="ft-muted">Domingo: Cerrado</div>
            </div>
          </div>

          {/* Bottom */}
          <div className="ft-bottom">
            <div className="ft-copy">
              © {year} {brandText}. Todos los derechos reservados.
            </div>

            <div className="ft-miniLinks">
              <button className="ft-miniLink" type="button">Privacidad</button>
              <span className="ft-dot" aria-hidden="true">•</span>
              <button className="ft-miniLink" type="button">Términos</button>
              <span className="ft-dot" aria-hidden="true">•</span>
              <a className="ft-miniLink" href="#inicio">Ir arriba</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
