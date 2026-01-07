import { useMemo, useState } from "react";
import { CELLS } from "../data/catalogSkeleton";
import "../styles/catalog-periodic.css";
import PeriodicHeader from "./catalog/PeriodicHeader";
import PeriodicTableGrid from "./catalog/PeriodicTableGrid";

type Cell = (typeof CELLS)[number];

type CategoryDef = {
  key: "all" | string;
  label: string;
  dot: string;          // color del punto
  bgSoft: string;       // fondo suave chip
  border: string;       // borde chip
  text: string;         // texto chip
  // bg classes que pertenecen a la categoría (header + items)
  bgs: string[];
};

// Añadir tipo para el modo de visualización
type ViewMode = "colors" | "photos";

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default function CatalogPeriodic() {
  // ✅ Define aquí tus categorías (keys = abreviaturas)
  const CATEGORIES: CategoryDef[] = useMemo(
    () => [
      {
        key: "all",
        label: "Todos",
        dot: "#111827",
        bgSoft: "rgba(15, 23, 42, 0.92)",
        border: "rgba(15, 23, 42, 0.92)",
        text: "#ffffff",
        bgs: [],
      },

      // AyD
      {
        key: "AyD",
        label: "Ácidos y derivados",
        dot: "#8FC3FA",
        bgSoft: "rgba(99, 176, 248, 0.12)",
        border: "rgba(99, 176, 248, 0.45)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#8FC3FA]", "bg-[#BBDAFC]"],
      },

      // AySA
      {
        key: "AySA",
        label: "Alcoholes y soluciones alcohólicas",
        dot: "#6FCA63",
        bgSoft: "rgba(68, 173, 37, 0.12)",
        border: "rgba(68, 173, 37, 0.45)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#6FCA63]", "bg-[#8FD585]"],
      },

      // SyCS
      {
        key: "SyCS",
        label: "Sales y compuestos de sodio",
        dot: "#F3D839",
        bgSoft: "rgba(249, 226, 52, 0.14)",
        border: "rgba(249, 226, 52, 0.55)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#F3D839]", "bg-[#F9E990]"],
      },

      // TyS
      {
        key: "TyS",
        label: "Tensioactivos y surfactantes",
        dot: "#FA9B52",
        bgSoft: "rgba(250, 155, 82, 0.14)",
        border: "rgba(250, 155, 82, 0.50)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#FA9B52]", "bg-[#FBBD8D]"],
      },

      // SyD
      {
        key: "SyD",
        label: "Solventes y disolventes",
        dot: "#D09DF2",
        bgSoft: "rgba(208, 157, 242, 0.14)",
        border: "rgba(208, 157, 242, 0.55)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#D09DF2]", "bg-[#E1C0F7]"],
      },

      // PQPT
      {
        key: "PQPT",
        label: "Productos químicos para textiles",
        dot: "#72DFF7",
        bgSoft: "rgba(111, 207, 236, 0.14)",
        border: "rgba(111, 207, 236, 0.55)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#72DFF7]", "bg-[#90E5F9]"],
      },

      // MPPDyL
      {
        key: "MPPDyL",
        label: "Materia prima para detergentes y limpiadores",
        dot: "#CDA58E",
        bgSoft: "rgba(205, 165, 142, 0.14)",
        border: "rgba(205, 165, 142, 0.55)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#CDA58E]", "bg-[#DBBEAD]"],
      },

      // PPC
      {
        key: "PPC",
        label: "Productos para construcción",
        dot: "#AFACAC",
        bgSoft: "rgba(148, 137, 136, 0.14)",
        border: "rgba(148, 137, 136, 0.50)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#AFACAC]", "bg-[#C6C3C3]"],
      },

      // AByD
      {
        key: "AByD",
        label: "Agentes blanqueadores y desinfectantes",
        dot: "#E7A2DA",
        bgSoft: "rgba(231, 162, 218, 0.16)",
        border: "rgba(231, 162, 218, 0.55)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#E7A2DA]", "bg-[#F0C6E9]"],
      },

      // OQI
      {
        key: "OQI",
        label: "Otros químicos industriales",
        dot: "#8EACCD",
        bgSoft: "rgba(142, 172, 205, 0.16)",
        border: "rgba(142, 172, 205, 0.55)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#8EACCD]", "bg-[#ADC4DB]"],
      },

      // ByA
      {
        key: "ByA",
        label: "Bases y álcalis",
        dot: "#65ABF6",
        bgSoft: "rgba(101, 171, 246, 0.14)",
        border: "rgba(101, 171, 246, 0.55)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#65ABF6]", "bg-[#90C3F9]"],
      },

      // EAA
      {
        key: "EAA",
        label: "Edulcorantes y aditivos alimentarios",
        dot: "#B2EA437",
        bgSoft: "rgba(69, 156, 7, 0.14)",
        border: "rgba(69, 156, 7, 0.55)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#B2EA43]", "bg-[#C3EF6C]"],
      },

      // PA
      {
        key: "PyA",
        label: "Preservantes y aditivos",
        dot: "#F5275B",
        bgSoft: "rgba(245, 39, 91, 0.14)",
        border: "rgba(245, 39, 91, 0.55)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#F5275B]", "bg-[#F86388]"],
      },

      // PNE
      {
        key: "PNE",
        label: "Productos naturales y extractos",
        dot: "#8F91FA",
        bgSoft: "rgba(143, 145, 250, 0.14)",
        border: "rgba(143, 145, 250, 0.55)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#8F91FA]", "bg-[#BBBCFC]"],
      },
    ],
    []
  );

  const [activeCat, setActiveCat] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  // Añadir estado para el modo de visualización
  const [viewMode, setViewMode] = useState<ViewMode>("colors");

  const categoryKeys = useMemo(
    () => new Set(CATEGORIES.filter((c) => c.key !== "all").map((c) => c.key)),
    [CATEGORIES]
  );

  // Productos (no headers de categoría)
  const productCells = useMemo(() => {
    return CELLS.filter((c) => c.bg !== "bg-transparent").filter((c) => {
      const key = String((c as any).symbol ?? c.n);
      return !categoryKeys.has(key);
    });
  }, [categoryKeys]);

  const suggestions = useMemo(() => {
    const q = normalize(query);
    if (!q) return [];

    const scored = productCells
      .map((c) => {
        const sym = String((c as any).symbol ?? c.n);
        const name = String((c as any).name ?? "");
        const meta = String((c as any).meta ?? "");

        const hay = normalize(`${sym} ${name} ${meta}`);
        if (!hay.includes(q)) return null;

        // score simple: prioriza match en símbolo y al inicio
        let score = 0;
        const ns = normalize(sym);
        const nn = normalize(name);

        if (ns.startsWith(q)) score += 4;
        if (nn.startsWith(q)) score += 3;
        if (ns.includes(q)) score += 2;
        if (nn.includes(q)) score += 1;

        return { cell: c, sym, name, meta, score };
      })
      .filter(Boolean) as Array<{ cell: Cell; sym: string; name: string; meta: string; score: number }>;

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 7);
  }, [query, productCells]);

  const setCategory = (key: string) => {
    setActiveCat(key);
    setFocusedKey(null);     // ✅ ya no hay foco de búsqueda
    // opcional: mantener lo escrito o limpiarlo
    // setQuery("");
  };

  const focusCell = (cell: Cell, forceQuery?: string) => {
    const k = `${cell.row}-${cell.col}-${String(cell.n)}`;
    setFocusedKey(k);
    setActiveCat("all"); // ✅ al buscar, NO queda categoría activa
    if (typeof forceQuery === "string") setQuery(forceQuery);
  };

  const submitSearch = () => {
    if (suggestions.length === 0) return;
    const top = suggestions[0].cell;
    const show = String((top as any).name ?? (top as any).symbol ?? top.n);
    focusCell(top, show);
  };

  return (
    <section id="catalogo" className="cat-section">
      <PeriodicHeader
        categories={CATEGORIES}
        activeKey={activeCat}
        onSelectCategory={setCategory}
        query={query}
        onQueryChange={(v) => {
          setQuery(v);
          setFocusedKey(null); // ✅ mientras escribe, no "amarra" un foco viejo
        }}
        suggestions={suggestions.map((s) => ({
          label: s.name || s.sym,
          sub: s.name ? s.sym : s.meta || "",
          onPick: () => focusCell(s.cell, s.name || s.sym),
        }))}
        onSubmitSearch={submitSearch}
      />

      {/* Botones de modo de visualización */}
      <div className="cat-view-mode-wrapper">
        <div className="cat-view-mode-buttons">
          <button
            className={`cat-view-mode-btn ${viewMode === "colors" ? "cat-view-mode-btn-active" : ""}`}
            onClick={() => setViewMode("colors")}
          >
            <span className="cat-view-mode-icon">🎨</span>
            <span>Colores</span>
          </button>
          <button
            className={`cat-view-mode-btn ${viewMode === "photos" ? "cat-view-mode-btn-active" : ""}`}
            onClick={() => setViewMode("photos")}
          >
            <span className="cat-view-mode-icon">📷</span>
            <span>Fotos</span>
          </button>
        </div>
      </div>

      <PeriodicTableGrid
        activeCategoryKey={activeCat}
        focusedCellKey={focusedKey}
        categories={CATEGORIES}
        viewMode={viewMode} // Pasar el modo de visualización
      />
    </section>
  );
}
