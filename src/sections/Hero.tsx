import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const header = document.querySelector(".sw-header") as HTMLElement | null;
  const navOffset = header?.offsetHeight ?? 110;

  const y = el.getBoundingClientRect().top + window.scrollY - navOffset;
  window.scrollTo({ top: y, behavior: "smooth" });
}

type Slide = {
  key: string;
  image: string;
  kicker: string;
  title: string;
  highlight: string;
  desc: string;
};

const FlaskIcon = ({ active }: { active: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    style={{
      opacity: active ? 1 : 0.35,
      transition: "opacity 160ms ease, transform 160ms ease",
      transform: active ? "scale(1.02)" : "scale(1)",
    }}
  >
    <path
      d="M10 2h4M12 2v6l5.6 9.7A3 3 0 0 1 15 22H9a3 3 0 0 1-2.6-4.3L12 8V2"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 14h5"
      stroke="white"
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity={active ? 0.9 : 0.45}
    />
  </svg>
);

export default function Hero() {
  const slides: Slide[] = useMemo(
    () => [
      {
        key: "s1",
        image: "/images/hero1.png",
        kicker: "Suministro químico para industria y negocio",
        title: "Químicos y materias primas",
        highlight: "confiables",
        desc: "Ácidos, alcoholes, bases, tensioactivos, solventes y más. Entrega en CDMX y zona centro con atención profesional.",
      },
      {
        key: "s2",
        image: "/images/hero2.png",
        kicker: "Calidad, trazabilidad y asesoría técnica",
        title: "Soluciones para",
        highlight: "procesos",
        desc: "Apoyamos tu operación con productos consistentes, fichas técnicas y atención personalizada para cada aplicación.",
      },
      {
        key: "s3",
        image: "/images/hero3.png",
        kicker: "Entrega rápida y catálogo amplio",
        title: "Compra fácil y",
        highlight: "segura",
        desc: "Explora el catálogo por categorías, encuentra lo que necesitas y cotiza o compra con confianza.",
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const interactedRef = useRef(false);

  const goTo = (next: number) => {
    if (next === index) return;
    setDir(next > index ? 1 : -1);
    setIndex(next);
    interactedRef.current = true;
  };

  // Autoplay cada 5s (se pausa si el usuario interactúa)
  useEffect(() => {
    const t = window.setInterval(() => {
      if (interactedRef.current) return;
      setDir(1);
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(t);
  }, [slides.length]);

  const slide = slides[index];

  const variants = {
    enter: (d: 1 | -1) => ({
      y: d === 1 ? "12%" : "-12%",
      opacity: 0,
      scale: 1.02,
    }),
    center: { y: "0%", opacity: 1, scale: 1 },
    exit: (d: 1 | -1) => ({
      y: d === 1 ? "-12%" : "12%",
      opacity: 0,
      scale: 1.02,
    }),
  };

  return (
    <section
      id="inicio"
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        marginTop: "calc(-1 * var(--sw-header-h, 96px))",
        paddingTop: "var(--sw-header-h, 96px)",
      }}
    >
      {/* Fondo carrusel */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={slide.key}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </AnimatePresence>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-black/10" />
      </div>

      {/* Indicadores derecha */}
      <div className="absolute right-6 top-1/2 z-20 -translate-y-1/2">
        <div className="flex flex-col gap-3 rounded-full border border-white/10 bg-white/5 p-2 backdrop-blur">
          {slides.map((s, i) => {
            const active = i === index;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir a slide ${i + 1}`}
                className={[
                  "grid h-10 w-10 place-items-center rounded-full transition",
                  active ? "bg-white/18" : "bg-white/0 hover:bg-white/10",
                ].join(" ")}
              >
                <FlaskIcon active={active} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-120px)] max-w-6xl items-center px-6 py-14">
        <motion.div
          key={slide.key + "-text"}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="w-full"
        >
          {/* Kicker */}
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-white/85 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-eco-green" />
            {slide.kicker}
          </div>

          {/* Título */}
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white md:text-6xl">
            {slide.title}{" "}
            <span className="text-eco-green">{slide.highlight}</span> para tu
            operación
          </h1>

          {/* Descripción */}
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/80 md:text-lg">
            {slide.desc}
          </p>

          {/* ✅ Botón único centrado (Tailwind, no depende de global.css) */}
          <div className="mt-10 flex w-full justify-center">
            <button
              onClick={() => scrollToId("catalogo")}
              className="inline-flex items-center justify-center rounded-full border border-white/85 bg-transparent px-6 py-3 text-sm font-semibold text-white transition
                         hover:bg-white hover:text-black hover:border-white active:translate-y-0
                         hover:-translate-y-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40 focus-visible:outline-offset-4"
            >
              Ver catálogo
            </button>
          </div>

          {/* Bullets centrados */}
          <div className="mt-10 flex w-full justify-center">
            <div className="flex items-center gap-6 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                Servicio
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                Calidad
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                Experiencia
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hint */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-xs text-white/70">
        Desliza para explorar ↓
      </div>
    </section>
  );
}
