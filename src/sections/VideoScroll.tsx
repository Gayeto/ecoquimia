import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import { VIDEO_CLIPS } from "../data/videos";
import { useIsMobile } from "../utils/useIsMobile";

const LOGO_SRC = "/images/logo.png"; // Asegúrate de que esta ruta sea correcta

export default function VideoScroll() {
  const isMobile = useIsMobile(900);
  const sectionRef = useRef<HTMLElement>(null);

  // Controlamos el scroll de toda la sección
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const clips = useMemo(() => VIDEO_CLIPS, []);

  // --- 1. ANIMACIÓN DEL LOGO INICIAL ---
  // El logo se desvanece y sube ligeramente al empezar el scroll
  const logoOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const logoScale = useTransform(scrollYProgress, [0, 0.05], [1, 0.95]);
  const logoY = useTransform(scrollYProgress, [0, 0.05], [0, -20]);

  // --- 2. LÓGICA DE VIDEOS FULL SCREEN ---
  // Función para crear la transición de cada video (Entrada -> Visible -> Salida)
  const createVideoStyle = (start: number, end: number) => {
    const fadeInEnd = start + 0.05;
    const fadeOutStart = end - 0.05;

    return {
      opacity: useTransform(
        scrollYProgress,
        [start, fadeInEnd, fadeOutStart, end],
        [0, 1, 1, 0]
      ),
      scale: useTransform(
        scrollYProgress,
        [start, fadeInEnd],
        [1.1, 1] // Ligero zoom out al entrar para efecto cinematográfico
      ),
    };
  };

  // Dividimos el scroll (del 0.05 al 1.0) entre los clips disponibles
  const v1 = createVideoStyle(0.05, 0.30);
  const v2 = createVideoStyle(0.30, 0.55);
  const v3 = createVideoStyle(0.55, 0.80);
  const v4 = createVideoStyle(0.80, 1.0);

  // Sub-componente para el video en pantalla completa
  const FullScreenVideo = ({ src, motionStyle }: { src: string; motionStyle: any }) => (
    <motion.div
      style={motionStyle}
      className="absolute inset-0 h-screen w-screen overflow-hidden bg-black"
    >
      <video
        className="h-full w-full object-cover"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
    </motion.div>
  );

  return (
    <section
      id="videos"
      ref={sectionRef}
      className="relative bg-white"
    >
      {/* h-[500vh] da suficiente espacio para que el scroll no sea demasiado rápido */}
      <div className={`relative ${isMobile ? "h-[400vh]" : "h-[500vh]"}`}>

        <div className="sticky top-0 h-screen w-full overflow-hidden">

          {/* --- CAPA 1: PANTALLA DE BIENVENIDA (Logo arriba) --- */}
          <motion.div
            style={{ opacity: logoOpacity, scale: logoScale, y: logoY }}
            className={[
              "absolute inset-0 z-50 flex flex-col items-center bg-white px-4",
              "pt-20 md:pt-28" // Controla qué tan cerca de la navbar está el logo
            ].join(" ")}
          >
            <img
              src={LOGO_SRC}
              alt="Ecoquimia"
              className="w-[280px] sm:w-[380px] md:w-[500px] h-auto drop-shadow-sm"
              draggable={false}
            />

            <motion.div
              className="mt-12 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.p
                className="text-sm md:text-base text-black/40 font-light tracking-widest"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                Desliza para explorar ↓
              </motion.p>
            </motion.div>
          </motion.div>

          {/* --- CAPA 2: VIDEOS EN FULL SCREEN --- */}
          <div className="relative z-40 h-full w-full">
            {clips[0] && <FullScreenVideo src={clips[0].src} motionStyle={v1} />}
            {clips[1] && <FullScreenVideo src={clips[1].src} motionStyle={v2} />}
            {clips[2] && <FullScreenVideo src={clips[2].src} motionStyle={v3} />}
            {clips[3] && <FullScreenVideo src={clips[3].src} motionStyle={v4} />}
          </div>

          {/* Overlay sutil para mejorar la visibilidad si decides poner texto encima */}
          <div className="pointer-events-none absolute inset-0 z-45 bg-black/10" />

        </div>
      </div>
    </section>
  );
}
