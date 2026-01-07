// src/App.tsx
import AppLayout from "./components/AppLayout";
import Footer from "./components/Footer";
import CatalogPeriodic from "./sections/CatalogPeriodic";
import ContactSection from "./sections/ContactSection";
import CoverageMap from "./sections/CoverageMapLeaflet";
import VideoScroll from "./sections/VideoScroll";



export default function App() {
  return (
    <AppLayout>

      {/* Sección de videos con scroll */}
      <VideoScroll />

      {/* Fase 4 — Catálogo tipo tabla periódica */}
      <CatalogPeriodic />

           <CoverageMap />

     <ContactSection />

<Footer />
    </AppLayout>
  );
}
