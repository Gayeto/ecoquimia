// src/data/videos.ts
export type VideoClip = {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  poster?: string;
};

export const VIDEO_CLIPS: VideoClip[] = [
  {
    id: "clip-1",
    title: "Calidad y control",
    subtitle: "Procesos consistentes y trazabilidad en cada entrega.",
    src: "/video/clip-1.mp4",
    poster: "/images/poster-1.jpg",
  },
  {
    id: "clip-2",
    title: "Análisis y seguridad",
    subtitle: "Manejo responsable y soporte para tu operación.",
    src: "/video/clip-2.mp4",
    poster: "/images/poster-2.jpg",
  },
  {
    id: "clip-3",
    title: "Formulación y reacción",
    subtitle: "Soluciones a la medida para cada industria.",
    src: "/video/clip-3.mp4",
    poster: "/images/poster-3.jpg",
  },
  {
    id: "clip-4",
    title: "Cobertura regional",
    subtitle: "Entregas en CDMX y zona centro con atención profesional.",
    src: "/video/clip-4.mp4",
    poster: "/images/poster-4.jpg",
  },
];
