import { useMemo, useState } from "react";
import { CELLS } from "../data/catalogSkeleton";
import "../styles/catalog-periodic.css";
import PeriodicHeader from "./catalog/PeriodicHeader";
import PeriodicTableGrid from "./catalog/PeriodicTableGrid";

type Cell = (typeof CELLS)[number];

type CategoryDef = {
  key: "all" | string;
  label: string;
  dot: string;
  bgSoft: string;
  border: string;
  text: string;
  bgs: string[];
};

type ViewMode = "colors" | "photos";

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default function CatalogPeriodic() {
  // ✅ Puedes DEJAR esto si tu grid lo usa para colorear/mapeos internos
  // (aunque ya no se mostrará en el header)
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
      {
        key: "AyD",
        label: "Ácidos y derivados",
        dot: "#8FC3FA",
        bgSoft: "rgba(99, 176, 248, 0.12)",
        border: "rgba(99, 176, 248, 0.45)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#8FC3FA]", "bg-[#BBDAFC]"],
      },
      {
        key: "AySA",
        label: "Alcoholes y soluciones alcohólicas",
        dot: "#6FCA63",
        bgSoft: "rgba(68, 173, 37, 0.12)",
        border: "rgba(68, 173, 37, 0.45)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#6FCA63]", "bg-[#8FD585]"],
      },
      {
        key: "SyCS",
        label: "Sales y compuestos de sodio",
        dot: "#F3D839",
        bgSoft: "rgba(249, 226, 52, 0.14)",
        border: "rgba(249, 226, 52, 0.55)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#F3D839]", "bg-[#F9E990]"],
      },
      {
        key: "TyS",
        label: "Tensioactivos y surfactantes",
        dot: "#FA9B52",
        bgSoft: "rgba(250, 155, 82, 0.14)",
        border: "rgba(250, 155, 82, 0.50)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#FA9B52]", "bg-[#FBBD8D]"],
      },
      {
        key: "SyD",
        label: "Solventes y disolventes",
        dot: "#D09DF2",
        bgSoft: "rgba(208, 157, 242, 0.14)",
        border: "rgba(208, 157, 242, 0.55)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#D09DF2]", "bg-[#E1C0F7]"],
      },
      {
        key: "PQPT",
        label: "Productos químicos para textiles",
        dot: "#72DFF7",
        bgSoft: "rgba(111, 207, 236, 0.14)",
        border: "rgba(111, 207, 236, 0.55)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#72DFF7]", "bg-[#90E5F9]"],
      },
      {
        key: "MPPDyL",
        label: "Materia prima para detergentes y limpiadores",
        dot: "#CDA58E",
        bgSoft: "rgba(205, 165, 142, 0.14)",
        border: "rgba(205, 165, 142, 0.55)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#CDA58E]", "bg-[#DBBEAD]"],
      },
      {
        key: "PPC",
        label: "Productos para construcción",
        dot: "#AFACAC",
        bgSoft: "rgba(148, 137, 136, 0.14)",
        border: "rgba(148, 137, 136, 0.50)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#AFACAC]", "bg-[#C6C3C3]"],
      },
      {
        key: "AByD",
        label: "Agentes blanqueadores y desinfectantes",
        dot: "#E7A2DA",
        bgSoft: "rgba(231, 162, 218, 0.16)",
        border: "rgba(231, 162, 218, 0.55)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#E7A2DA]", "bg-[#F0C6E9]"],
      },
      {
        key: "OQI",
        label: "Otros químicos industriales",
        dot: "#8EACCD",
        bgSoft: "rgba(142, 172, 205, 0.16)",
        border: "rgba(142, 172, 205, 0.55)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#8EACCD]", "bg-[#ADC4DB]"],
      },
      {
        key: "ByA",
        label: "Bases y álcalis",
        dot: "#65ABF6",
        bgSoft: "rgba(101, 171, 246, 0.14)",
        border: "rgba(101, 171, 246, 0.55)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#65ABF6]", "bg-[#90C3F9]"],
      },
      {
        key: "EAA",
        label: "Edulcorantes y aditivos alimentarios",
        dot: "#B2EA43",
        bgSoft: "rgba(69, 156, 7, 0.14)",
        border: "rgba(69, 156, 7, 0.55)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#B2EA43]", "bg-[#C3EF6C]"],
      },
      {
        key: "PyA",
        label: "Preservantes y aditivos",
        dot: "#F5275B",
        bgSoft: "rgba(245, 39, 91, 0.14)",
        border: "rgba(245, 39, 91, 0.55)",
        text: "rgba(15, 23, 42, 0.92)",
        bgs: ["bg-[#F5275B]", "bg-[#F86388]"],
      },
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

  // ✅ Ya NO hay categoría activa (se queda fijo en "all")
  const activeCat = "all";

  const [query, setQuery] = useState("");
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("colors");

  // Esto lo puedes conservar para que en el buscador NO salgan celdas “header” de categoría
  const categoryKeys = useMemo(
    () => new Set(CATEGORIES.filter((c) => c.key !== "all").map((c) => c.key)),
    [CATEGORIES]
  );

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

        let score = 0;
        const ns = normalize(sym);
        const nn = normalize(name);

        if (ns.startsWith(q)) score += 4;
        if (nn.startsWith(q)) score += 3;
        if (ns.includes(q)) score += 2;
        if (nn.includes(q)) score += 1;

        return { cell: c, sym, name, meta, score };
      })
      .filter(Boolean) as Array<{
      cell: Cell;
      sym: string;
      name: string;
      meta: string;
      score: number;
    }>;

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 7);
  }, [query, productCells]);

  const focusCell = (cell: Cell, forceQuery?: string) => {
    const k = `${cell.row}-${cell.col}-${String(cell.n)}`;
    setFocusedKey(k);
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
        // ✅ IMPORTANTÍSIMO: esto “mata” la UI de categorías (si tu header las pinta a partir del array)
        categories={[] as CategoryDef[]}
        activeKey={activeCat}
        onSelectCategory={() => {}}
        query={query}
        onQueryChange={(v) => {
          setQuery(v);
          setFocusedKey(null);
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
            className={`cat-view-mode-btn ${
              viewMode === "colors" ? "cat-view-mode-btn-active" : ""
            }`}
            onClick={() => setViewMode("colors")}
          >
            <span className="cat-view-mode-icon">🎨</span>
            <span>Colores</span>
          </button>

          <button
            className={`cat-view-mode-btn ${
              viewMode === "photos" ? "cat-view-mode-btn-active" : ""
            }`}
            onClick={() => setViewMode("photos")}
          >
            <span className="cat-view-mode-icon">📷</span>
            <span>Fotos</span>
          </button>
        </div>
      </div>

      <PeriodicTableGrid
        activeCategoryKey={activeCat} // ✅ fijo en "all"
        focusedCellKey={focusedKey}
        categories={CATEGORIES} // ✅ se mantiene para que el grid tenga el mapeo de colores si lo usa
        viewMode={viewMode}
      />
    </section>
  );
}
