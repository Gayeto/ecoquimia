import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { VIDEO_CLIPS } from "../data/videos";

const LOGO_SRC = "/images/logo.png";

/**
 * ✅ Ajusta aquí el "close-up":
 * - 1.00 = se ve completo (más barras)
 * - 1.05 = balance pro (menos barras, casi nada de recorte)
 * - 1.10+ = más grande (puede empezar a recortar un poco)
 */
const CONTAIN_SCALE = "scale-[1.09]";

export default function VideoAutoPlay() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const clip = useMemo(() => VIDEO_CLIPS[currentIndex], [currentIndex]);

  const handleVideoEnd = () => {
    setCurrentIndex((prev) => (prev + 1) % VIDEO_CLIPS.length);
  };

  return (
    <section
      id="videos"
      className="relative h-screen w-full overflow-hidden bg-[#e8f4f8]"
      style={{ marginTop: 0, paddingTop: 0 }}
    >
      {/* ✅ margen lateral pequeño */}
      <div className="absolute inset-0 px-3 md:px-6">
        <div className="relative h-full w-full overflow-hidden rounded-[18px] md:rounded-[22px]">
          {/* --- VIDEO + TRANSICIÓN --- */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {/* ✅ Fondo integrado con el color de fondo exterior */}
              <div className="absolute inset-0 bg-[#e8f4f8]" />

              {/* ✅ Video con menos "barras" pero sin close-up agresivo */}
              <video
                src={clip?.src}
                autoPlay
                muted
                playsInline
                preload="metadata"
                onEnded={handleVideoEnd}
                className={[
                  "relative z-10 h-full w-full object-contain",
                  CONTAIN_SCALE, // 👈 ajusta aquí
                ].join(" ")}
              />
            </motion.div>
          </AnimatePresence>

          {/* --- LOGO CENTRADO MÁS GRANDE --- */}
          <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
            <motion.img
              key="main-logo"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              src={LOGO_SRC}
              alt="Ecoquimia"
              className={[
                "select-none",
                "w-[340px] sm:w-[480px] md:w-[620px] lg:w-[720px]",
                "max-w-[88vw] h-auto",
                "drop-shadow-[0_22px_70px_rgba(0,0,0,0.65)]",
              ].join(" ")}
              draggable={false}
            />
          </div>

          {/* --- INDICADORES PRO --- */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-2 backdrop-blur-md">
              {VIDEO_CLIPS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className="group h-4 w-4 grid place-items-center focus:outline-none"
                  aria-label={`Ir al video ${idx + 1}`}
                >
                  <motion.span
                    animate={{
                      width: idx === currentIndex ? 22 : 8,
                      opacity: idx === currentIndex ? 1 : 0.55,
                    }}
                    transition={{ duration: 0.05 }}
                    className="block h-[6px] rounded-full bg-white group-hover:opacity-80"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
