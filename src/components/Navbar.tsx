import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/navbar.css";

type LinkDef = {
  id: string;
  label: string;
  icon: string;
};

const links: LinkDef[] = [
  { id: "inicio", label: "Inicio", icon: "🏠" },
  { id: "videos", label: "Videos", icon: "🎬" },
  { id: "catalogo", label: "Catálogo", icon: "🧪" },
  { id: "cobertura", label: "Cobertura", icon: "🗺️" },
  { id: "contacto", label: "Contacto", icon: "✉️" },
];

type NavbarProps = {
  logoSrc?: string;
  brandText?: string;
};

export default function Navbar({
  logoSrc = "/images/logo-circulo.png",
  brandText = "ECOQUIMIA",
}: NavbarProps) {
  const headerRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const leftLinks = useMemo(() => links.filter((l) => l.id !== "contacto"), []);
  const contactLink = useMemo(
    () => links.find((l) => l.id === "contacto")!,
    []
  );

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const headerH = headerRef.current?.offsetHeight ?? 120;
    const y = el.getBoundingClientRect().top + window.scrollY - headerH + 1;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const onNavClick = (id: string) => {
    scrollToId(id);
    setMenuOpen(false);
  };

  // Cierra menú con ESC o click fuera
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);

    const onClickOutside = (e: MouseEvent) => {
      if (!menuOpen) return;
      const t = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(t)) setMenuOpen(false);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClickOutside);
    };
  }, [menuOpen]);

  return (
    <header ref={headerRef} className="sw-header">
      {/* Barra superior */}
      <div className="sw-topbar" />

      {/* ===== DESKTOP ===== */}
      <div className="sw-shell sw-desktop">
        <nav className="sw-nav">
          <div className="sw-left">
            {leftLinks.map((l) => (
              <button
                key={l.id}
                className="sw-link"
                type="button"
                onClick={() => onNavClick(l.id)}
              >
                <span className="sw-link-ic" aria-hidden="true">
                  {l.icon}
                </span>
                <span className="sw-link-txt">{l.label}</span>
              </button>
            ))}
          </div>

          <button
            className="sw-center"
            type="button"
            onClick={() => onNavClick("inicio")}
            aria-label="Ir a inicio"
          >
            <img className="sw-logo" src={logoSrc} alt={brandText} />
            <span className="sw-brand">{brandText}</span>
          </button>

          <div className="sw-right">
            <button
              className="sw-cta"
              type="button"
              onClick={() => onNavClick(contactLink.id)}
            >
              <span className="sw-cta-ic" aria-hidden="true">
                {contactLink.icon}
              </span>
              <span className="sw-cta-txt">{contactLink.label}</span>
            </button>
          </div>
        </nav>
      </div>

      {/* ===== MOBILE ===== */}
      <div className="sw-shell sw-mobile">
        <div className="sw-m-row">
          <button
            className="sw-burger"
            type="button"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <button
            className="sw-m-brand"
            type="button"
            onClick={() => onNavClick("inicio")}
            aria-label="Ir a inicio"
          >
            <img className="sw-logo sw-logo--mobile" src={logoSrc} alt={brandText} />
            <span className="sw-brand sw-brand--mobile">{brandText}</span>
          </button>

          <button
            className="sw-cta sw-cta--mobile"
            type="button"
            onClick={() => onNavClick(contactLink.id)}
            aria-label="Ir a contacto"
          >
            {contactLink.icon}
          </button>
        </div>

        {/* Menú desplegable móvil */}
        <div
          ref={menuRef}
          className={`sw-mobile-menu ${menuOpen ? "open" : ""}`}
          role="dialog"
          aria-label="Menú"
        >
          {links.map((l) => (
            <button
              key={l.id}
              className={`sw-mobile-link ${
                l.id === "contacto" ? "sw-mobile-link--cta" : ""
              }`}
              type="button"
              onClick={() => onNavClick(l.id)}
            >
              <span className="sw-link-ic" aria-hidden="true">
                {l.icon}
              </span>
              <span className="sw-link-txt">{l.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
