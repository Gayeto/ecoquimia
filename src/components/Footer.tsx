import "../styles/footer.css";

type FooterProps = {
  logoSrc?: string;
  brandText?: string;
};

export default function Footer({
  logoSrc = "/images/logo-circulo.png",
  brandText = "ECOQUIMIA",
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
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

          {/* Redes (opcional) */}
          <div className="ft-social" aria-label="Redes sociales">
            <a className="ft-socialBtn" href="#" aria-label="Facebook">
              f
            </a>
            <a className="ft-socialBtn" href="#" aria-label="Instagram">
              ⌁
            </a>
            <a className="ft-socialBtn" href="#" aria-label="WhatsApp">
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
  );
}
