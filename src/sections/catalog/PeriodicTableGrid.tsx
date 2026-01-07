import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { CELLS } from "../../data/catalogSkeleton";
import "../../styles/periodic-table.css";

type Cell = (typeof CELLS)[number];

type CategoryDef = {
  key: string;
  label: string;
  dot: string;
  bgSoft: string;
  border: string;
  text: string;
  bgs: string[];
};

type Props = {
  activeCategoryKey: string;
  focusedCellKey: string | null;
  categories: CategoryDef[];
  viewMode?: "colors" | "photos";
};

function renderSubscripts(value: string) {
  const parts = value.split(/(\d+)/);
  return parts.map((part, i) =>
    /\d+/.test(part) ? (
      <sub
        key={i}
        style={{
          fontSize: "0.7em",
          bottom: "-0.2em",
          position: "relative",
        }}
      >
        {part}
      </sub>
    ) : (
      part
    )
  );
}

export default function PeriodicTableGrid({
  activeCategoryKey,
  focusedCellKey,
  categories,
  viewMode = "colors",
}: Props) {
  const [hoveredCell, setHoveredCell] = useState<Cell | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [wrapWidth, setWrapWidth] = useState<number>(1200);

  const realCells = useMemo(
    () => CELLS.filter((c) => c.bg !== "bg-transparent"),
    []
  );

  const colSpanOf = (c: Cell) => c.span ?? 1;
  const rowSpanOf = (c: Cell) => c.h ?? 1;

  const maxCol = Math.max(...realCells.map((c) => c.col + colSpanOf(c) - 1));
  const maxRow = Math.max(...realCells.map((c) => c.row + rowSpanOf(c) - 1));

  const colLabels = useMemo(() => {
    const labels: Array<{ col: number; rowTop: number; text: number }> = [];
    for (let col = 2; col <= maxCol; col++) {
      const candidates = realCells.filter(
        (c) => col >= c.col && col <= c.col + (c.span ?? 1) - 1
      );
      if (candidates.length > 0) {
        const top = Math.min(...candidates.map((c) => c.row));
        labels.push({ col, rowTop: top, text: col - 1 });
      }
    }
    return labels;
  }, [realCells, maxCol]);

  const rowLabels = useMemo(() => {
    const labels: Array<{ row: number; colLeft: number; text: number }> = [];
    for (let row = 2; row <= maxRow; row++) {
      const candidates = realCells.filter(
        (c) => row >= c.row && row <= c.row + (c.h ?? 1) - 1
      );
      if (candidates.length > 0) {
        const left = Math.min(...candidates.map((c) => c.col));
        labels.push({ row, colLeft: left, text: row - 1 });
      }
    }
    return labels;
  }, [realCells, maxRow]);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver((entries) =>
      setWrapWidth(entries[0]?.contentRect?.width ?? 1200)
    );
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const cellSize = useMemo(() => {
    const usable = Math.max(320, wrapWidth - 24);
    return Math.max(56, Math.min(110, usable / (maxCol - 1)));
  }, [wrapWidth, maxCol]);

  const idxWidth = Math.max(22, cellSize * 0.2);
  const idxHeight = Math.max(18, cellSize * 0.16);
  const gridWidth = idxWidth + (maxCol - 1) * cellSize;
  const gridHeight = idxHeight + (maxRow - 1) * cellSize;

  const renumberMap = useMemo(() => {
    const anchors = [...realCells].sort((a, b) =>
      a.row !== b.row ? a.row - b.row : a.col - b.col
    );
    const map = new Map<string, number>();
    anchors.forEach((cell, i) => map.set(`${cell.row}-${cell.col}-${cell.n}`, i + 1));
    return map;
  }, [realCells]);

  const cornerClassFor = (idx: number) => {
    const classes: string[] = [];
    if (idx === 1 || idx === 2) classes.push("pt-tl-extra", "pt-tr-extra");
    if (idx === 4) classes.push("pt-tr-extra");
    if (idx === 5) classes.push("pt-tl-extra");
    if (idx === 15) classes.push("pt-curve-right");
    if (idx === 16) classes.push("pt-curve-left");
    return classes.join(" ");
  };

  const activeCellForPanel = useMemo(() => {
    if (focusedCellKey) {
      return realCells.find((c) => `${c.row}-${c.col}-${String(c.n)}` === focusedCellKey);
    }
    if (hoveredCell && (hoveredCell as any).name) return hoveredCell;
    return null;
  }, [focusedCellKey, hoveredCell, realCells]);

  const getCellImageForMode = (cell: Cell) => {
    if (viewMode === "photos") {
      if ((cell as any).cellImg) return (cell as any).cellImg;
      if ((cell as any).img && (cell as any).name) return (cell as any).img;
    }
    return null;
  };

  const getFallbackColor = (bgClass: string) => {
    const match = bgClass.match(/bg-\[(#[\w\d]{6})\]/);
    return match ? match[1] : "#f0f0f0";
  };

  const panelH = 1.5 * cellSize;
  const holeH = 3 * cellSize;
  const panelTop = idxHeight + (holeH - panelH) / 2;

  return (
    <div className="pt-wrap mt-10">
      <div className="w-full px-0 md:px-4 lg:px-6">
        <div ref={wrapRef} className="pt-scroll">
          <div className="pt-board" style={{ width: gridWidth, height: gridHeight }}>

            {/* LABELS COLUMNAS */}
            {colLabels.map((lab) => (
              <div
                key={`c-${lab.col}`}
                className="pt-col-label"
                style={{
                  fontSize: cellSize < 70 ? 11 : 13,
                  left: idxWidth + (lab.col - 2) * cellSize + cellSize / 2,
                  top: Math.max(0, idxHeight + (lab.rowTop - 2) * cellSize - (cellSize < 70 ? 18 : 20)),
                }}
              >
                {lab.text}
              </div>
            ))}

            {/* LABELS FILAS */}
            {rowLabels.map((lab) => (
              <div
                key={`r-${lab.row}`}
                className="pt-row-label"
                style={{
                  fontSize: cellSize < 70 ? 11 : 13,
                  left: idxWidth + (lab.colLeft - 2) * cellSize - 6,
                  top: idxHeight + (lab.row - 2) * cellSize + cellSize / 2,
                }}
              >
                {lab.text}
              </div>
            ))}

            {/* PANEL CENTRAL FLOTANTE */}
            <AnimatePresence mode="wait">
              {activeCellForPanel && (
                <motion.div
                  key="panel"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="pt-panel-integrated"
                  style={{
                    left: idxWidth + 2.5 * cellSize,
                    top: panelTop,
                    width: 10 * cellSize,
                    height: panelH,
                  }}
                >
                  {/* Celda Grande: Cambia entre cellImg (Fotos) y bg color (Colores) */}
                  <div
                    className={`pt-preview-box ${activeCellForPanel.bg}`}
                    style={{
                      backgroundImage: viewMode === "photos" && (activeCellForPanel as any).cellImg
                        ? `url(${(activeCellForPanel as any).cellImg})`
                        : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      position: "relative"
                    }}
                  >
                    {/* Overlay para legibilidad en modo fotos */}
                    {viewMode === "photos" && (activeCellForPanel as any).cellImg && (
                      <div className="absolute inset-0 bg-black/20 z-0" />
                    )}

                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <span className="pt-preview-idx">
                        {renumberMap.get(`${activeCellForPanel.row}-${activeCellForPanel.col}-${activeCellForPanel.n}`)}
                      </span>
                      <div className="pt-preview-sym">
                        {renderSubscripts(String((activeCellForPanel as any).symbol || activeCellForPanel.n))}
                      </div>
                      <div className="pt-preview-name">{(activeCellForPanel as any).name}</div>
                    </div>
                  </div>

                  {/* Bloque de Información Derecha */}
                  <div className="pt-preview-info">
                    {(activeCellForPanel as any).img && (
                      <div className="pt-preview-img">
                        <img src={(activeCellForPanel as any).img} alt={(activeCellForPanel as any).name} />
                      </div>
                    )}

                    <div className="pt-preview-text">
                      <h3 className="text-xl font-black text-slate-800">
                        {(activeCellForPanel as any).name}
                        {(activeCellForPanel as any).meta && (
                          <span className="pt-badge ml-2 text-xs uppercase bg-slate-100 px-1 rounded">
                            {(activeCellForPanel as any).meta}
                          </span>
                        )}
                      </h3>

                      <div className="pt-kv mt-2">
                        <span className="pt-k font-bold">Uso: </span>
                        <span className="pt-v">{(activeCellForPanel as any).uso || "Producto industrial"}</span>
                      </div>

                      {(activeCellForPanel as any).estructura && (
                        <div className="pt-kv">
                          <span className="pt-k font-bold">Estructura: </span>
                          <span className="pt-v">{renderSubscripts(String((activeCellForPanel as any).estructura))}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* GRID DE CELDAS */}
            {realCells.map((cell) => {
              const internalIdx = renumberMap.get(`${cell.row}-${cell.col}-${cell.n}`) ?? 0;
              const cellKey = `${cell.row}-${cell.col}-${String(cell.n)}`;
              const cat = categories.find((c) => c.key === activeCategoryKey);

              const isCategoryMatch = activeCategoryKey !== "all" &&
                (cat?.bgs.includes(cell.bg) || String((cell as any).symbol ?? cell.n) === activeCategoryKey);
              const isFocused = focusedCellKey === cellKey;
              const isHighlight = isFocused || isCategoryMatch;
              const isDimmed = (focusedCellKey || activeCategoryKey !== "all") && !isHighlight;

              const cellImageUrl = getCellImageForMode(cell);
              const hasImage = viewMode === "photos" && cellImageUrl;
              const isCategoryCell = !(cell as any).name && (cell as any).symbol;

              return (
                <motion.div
                  key={cellKey}
                  onMouseEnter={() => (cell as any).name && setHoveredCell(cell)}
                  onMouseLeave={() => setHoveredCell(null)}
                  className={`pt-cell ${viewMode === "photos" ? "pt-cell-photo-mode" : cell.bg} ${cornerClassFor(internalIdx)} ${isDimmed ? "is-dimmed" : ""} ${isHighlight ? "is-highlight" : ""} ${viewMode === "photos" && isHighlight ? "pt-photo-highlight" : ""}`}
                  style={{
                    left: idxWidth + (cell.col - 2) * cellSize,
                    top: idxHeight + (cell.row - 2) * cellSize,
                    width: (cell.span ?? 1) * cellSize,
                    height: (cell.h ?? 1) * cellSize,
                    ...(hasImage ? {
                      backgroundImage: `url(${cellImageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    } : viewMode === "photos" && !isCategoryCell ? {
                      backgroundColor: getFallbackColor(cell.bg),
                    } : {}),
                  }}
                >
                  {viewMode === "colors" && <div className="pt-internal-index">{internalIdx}</div>}

                  <div className="pt-content">
                    {viewMode === "colors" ? (
                      <>
                        <div className="pt-symbol">{renderSubscripts(String((cell as any).symbol ?? cell.n))}</div>
                        {(cell as any).name && <div className="pt-name">{(cell as any).name}</div>}
                      </>
                    ) : (
                      <div className="pt-photo-content">
                        {hasImage ? (
                          <div className="pt-photo-overlay">
                            <div className="pt-photo-symbol">{renderSubscripts(String((cell as any).symbol ?? cell.n))}</div>
                            {(cell as any).name && <div className="pt-photo-name">{(cell as any).name}</div>}
                          </div>
                        ) : (
                          <>
                            <div className={`pt-symbol ${isCategoryCell ? '' : 'pt-photo-fallback-symbol'}`}>
                              {renderSubscripts(String((cell as any).symbol ?? cell.n))}
                            </div>
                            {(cell as any).name && <div className="pt-name">{(cell as any).name}</div>}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
