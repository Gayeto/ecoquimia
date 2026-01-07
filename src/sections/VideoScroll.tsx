import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import { VIDEO_CLIPS } from "../data/videos";
import { useIsMobile } from "../utils/useIsMobile";

type CardMotion = {
  x: any;
  y: any;
  scale: any;
  opacity: any;
  rotation?: any;
};

type ExitDir = "bottomLeft" | "bottomRight";

const LOGO_SRC = "/images/logo.png"; // <-- CAMBIA ESTO si tu logo está en otra ruta

function makeCardMotion(
  scrollYProgress: any,
  start: number,
  end: number,
  exit: ExitDir,
  isMobile: boolean = false
): CardMotion {
  const span = end - start;
  const middle = start + span * 0.5;

  const desktopMultiplier = 1.15;
  const mobileMultiplier = 0.65;
  const multiplier = isMobile ? mobileMultiplier : desktopMultiplier;

  const map = {
    bottomLeft: { xEnd: -900 * multiplier, yEnd: 1050 * multiplier },
    bottomRight: { xEnd: 900 * multiplier, yEnd: 1050 * multiplier },
  }[exit];

  const x = useTransform(
    scrollYProgress,
    [start, middle, end],
    [0, map.xEnd * 0.7, map.xEnd]
  );

  const y = useTransform(
    scrollYProgress,
    [start, middle, end],
    [0, map.yEnd * 0.7, map.yEnd]
  );

  const scale = useTransform(
    scrollYProgress,
    [start, middle, end],
    isMobile ? [0.18, 0.62, 0.78] : [0.32, 0.92, 1.05]
  );

  const opacity = useTransform(
    scrollYProgress,
    [start - 0.06, start, end - 0.18, end + 0.06],
    [0, 1, 1, 0]
  );

  const rotation = useTransform(
    scrollYProgress,
    [start, end],
    exit === "bottomLeft" ? [0, -10] : [0, 10]
  );

  return { x, y, scale, opacity, rotation };
}

export default function VideoScroll() {
  const isMobile = useIsMobile(900);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const clips = useMemo(() => VIDEO_CLIPS, []);

  /**
   * ✅ FIX “tarda en aparecer”:
   * Hacemos que el logo esté visible desde progress 0.
   */
  const logoOpacity = useTransform(
    scrollYProgress,
    [-0.02, 0, 0.72, 1],
    [0, 1, 1, 0]
  );

  const logoY = useTransform(scrollYProgress, [0, 0.12, 0.35], [18, 0, -10]);
  const logoScale = useTransform(scrollYProgress, [0, 0.12], [0.98, 1]);

  /**
   * Timings (más fluidos)
   * Videos empiezan un poquito antes que antes.
   */
  const s1 = 0.10,
    e1 = 0.42;
  const s2 = 0.20,
    e2 = 0.54;
  const s3 = 0.30,
    e3 = 0.66;
  const s4 = 0.40,
    e4 = 0.78;

  const m1 = makeCardMotion(scrollYProgress, s1, e1, "bottomLeft", isMobile);
  const m2 = makeCardMotion(scrollYProgress, s2, e2, "bottomRight", isMobile);
  const m3 = makeCardMotion(scrollYProgress, s3, e3, "bottomLeft", isMobile);
  const m4 = makeCardMotion(scrollYProgress, s4, e4, "bottomRight", isMobile);

  const DesktopCard = ({
    src,
    poster,
    motionStyle,
  }: {
    src: string;
    poster?: string;
    motionStyle: any;
  }) => {
    return (
      <motion.div
        style={motionStyle}
        className={[
          "pointer-events-auto",
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "overflow-hidden rounded-[34px]",
          "border-[3px] border-white/25 bg-white/95",
          "shadow-[0_40px_120px_rgba(0,0,0,0.35)]",
          // ✅ un poco más grande
          "w-[920px] h-[540px]",
          "max-w-[94vw] max-h-[86vh]",
          "will-change-transform transform-gpu",
          "z-30",
        ].join(" ")}
      >
        <video
          className="h-full w-full object-cover"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 rounded-[32px] pointer-events-none border-2 border-white/15" />
      </motion.div>
    );
  };

  const MobileCard = ({
    src,
    poster,
    motionStyle,
    title,
    subtitle,
  }: {
    src: string;
    poster?: string;
    motionStyle: any;
    title?: string;
    subtitle?: string;
  }) => {
    return (
      <motion.div
        style={motionStyle}
        className={[
          "pointer-events-auto",
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "overflow-hidden rounded-2xl",
          "border-2 border-white/30 bg-white/92",
          "shadow-[0_26px_70px_rgba(0,0,0,0.30)]",
          // ✅ un poco más grande
          "w-[380px] h-[235px]",
          "max-w-[92vw] max-h-[58vh]",
          "will-change-transform transform-gpu",
          "z-30",
        ].join(" ")}
      >
        <video
          className="h-full w-full object-cover"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent p-4 pt-8">
          <div className="text-sm font-bold text-white">{title}</div>
          <div className="text-xs text-white/85 mt-1">{subtitle}</div>
        </div>
        <div className="absolute inset-0 rounded-2xl pointer-events-none border border-white/20" />
      </motion.div>
    );
  };

  return (
    <section
      id="videos"
      ref={sectionRef}
      // ✅ adiós crema: fondo frío/azulado limpio
      className="relative bg-gradient-to-b from-[#F7FBFF] via-[#EEF5FF] to-white"
    >
      <div className={`relative ${isMobile ? "h-[380vh]" : "h-[520vh]"}`}>
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Fondo dentro del sticky (también sin crema) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F9FCFF] via-[#EFF6FF] to-[#EAF2FF]" />

          {/* Glows (más ligeros) */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-[920px] w-[920px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-white/18 via-transparent to-transparent blur-3xl" />
          {!isMobile && (
            <div className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-sky-200/20 via-transparent to-transparent blur-3xl" />
          )}

          {/* ✅ LOGO (en vez de texto) */}
          <motion.div
            style={{ opacity: logoOpacity, y: logoY, scale: logoScale }}
            className="absolute inset-0 z-20 flex items-center justify-center px-4"
          >
            <div className="flex flex-col items-center">
              <img
  src={LOGO_SRC}
  alt="Ecoquimia"
  className={[
    "select-none",
    // ✅ MÁS GRANDE (responsive)
    "w-[260px] sm:w-[340px] md:w-[460px] lg:w-[560px]",
    "h-auto",
    // ✅ que no se pase de la pantalla
    "max-w-[90vw]",
    // ✅ sombra más notoria
    "drop-shadow-[0_30px_80px_rgba(0,0,0,0.18)]",
  ].join(" ")}
  draggable={false}
/>


              <motion.p
                className="mt-10 text-sm md:text-base text-black/45"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              >
                Desliza para explorar ↓
              </motion.p>
            </div>
          </motion.div>

          {/* VIDEOS */}
          <div className="relative z-30 h-full w-full">
            {!isMobile ? (
              <>
                <DesktopCard
                  src={clips[0]?.src}
                  poster={clips[0]?.poster}
                  motionStyle={{
                    x: m1.x,
                    y: m1.y,
                    scale: m1.scale,
                    opacity: m1.opacity,
                    rotate: m1.rotation,
                  }}
                />
                <DesktopCard
                  src={clips[1]?.src}
                  poster={clips[1]?.poster}
                  motionStyle={{
                    x: m2.x,
                    y: m2.y,
                    scale: m2.scale,
                    opacity: m2.opacity,
                    rotate: m2.rotation,
                  }}
                />
                <DesktopCard
                  src={clips[2]?.src}
                  poster={clips[2]?.poster}
                  motionStyle={{
                    x: m3.x,
                    y: m3.y,
                    scale: m3.scale,
                    opacity: m3.opacity,
                    rotate: m3.rotation,
                  }}
                />
                <DesktopCard
                  src={clips[3]?.src}
                  poster={clips[3]?.poster}
                  motionStyle={{
                    x: m4.x,
                    y: m4.y,
                    scale: m4.scale,
                    opacity: m4.opacity,
                    rotate: m4.rotation,
                  }}
                />
              </>
            ) : (
              <>
                <MobileCard
                  src={clips[0]?.src}
                  poster={clips[0]?.poster}
                  motionStyle={{
                    x: m1.x,
                    y: m1.y,
                    scale: m1.scale,
                    opacity: m1.opacity,
                    rotate: m1.rotation,
                  }}
                  title={clips[0]?.title}
                  subtitle={clips[0]?.subtitle}
                />
                <MobileCard
                  src={clips[1]?.src}
                  poster={clips[1]?.poster}
                  motionStyle={{
                    x: m2.x,
                    y: m2.y,
                    scale: m2.scale,
                    opacity: m2.opacity,
                    rotate: m2.rotation,
                  }}
                  title={clips[1]?.title}
                  subtitle={clips[1]?.subtitle}
                />
                <MobileCard
                  src={clips[2]?.src}
                  poster={clips[2]?.poster}
                  motionStyle={{
                    x: m3.x,
                    y: m3.y,
                    scale: m3.scale,
                    opacity: m3.opacity,
                    rotate: m3.rotation,
                  }}
                  title={clips[2]?.title}
                  subtitle={clips[2]?.subtitle}
                />
                <MobileCard
                  src={clips[3]?.src}
                  poster={clips[3]?.poster}
                  motionStyle={{
                    x: m4.x,
                    y: m4.y,
                    scale: m4.scale,
                    opacity: m4.opacity,
                    rotate: m4.rotation,
                  }}
                  title={clips[3]?.title}
                  subtitle={clips[3]?.subtitle}
                />
              </>
            )}
          </div>

          {/* Indicadores de esquina (solo desktop) */}
          {!isMobile && (
            <>
              <div className="absolute bottom-4 left-4 z-10 opacity-15">
                <div className="h-1 w-48 bg-gradient-to-r from-black/35 to-transparent rotate-45 origin-bottom-left" />
              </div>
              <div className="absolute bottom-4 right-4 z-10 opacity-15">
                <div className="h-1 w-48 bg-gradient-to-l from-black/35 to-transparent -rotate-45 origin-bottom-right" />
              </div>
            </>
          )}

          {/* ✅ Quité el blur final que era pesado (causaba “lag”) */}
        </div>
      </div>
    </section>
  );
}

