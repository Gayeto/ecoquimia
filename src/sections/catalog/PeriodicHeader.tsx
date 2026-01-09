import { useMemo, useRef } from "react";

type CategoryDef = {
  key: string;
  label: string;
  dot: string;
  bgSoft: string;
  border: string;
  text: string;
  bgs: string[];
};

type Suggestion = {
  label: string;
  sub?: string;
  onPick: () => void;
};

type Props = {
  categories: CategoryDef[];
  activeKey: string;
  onSelectCategory: (key: string) => void;

  query: string;
  onQueryChange: (v: string) => void;
  suggestions: Suggestion[];
  onSubmitSearch: () => void;
};

export default function PeriodicHeader({
  categories,
  activeKey,
  onSelectCategory,
  query,
  onQueryChange,
  suggestions,
  onSubmitSearch,
}: Props) {
  const hasSuggestions = suggestions.length > 0 && query.trim().length > 0;
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const active = useMemo(
    () => categories.find((c) => c.key === activeKey),
    [categories, activeKey]
  );

  return (
    <header className="cat-header">
      <p className="cat-kicker">
  <span className="cat-kicker-ic" aria-hidden="true">🧪</span>
  <span>Catálogo</span>
</p>

      <h2 className="cat-title">Nuestros Productos</h2>
      <p className="cat-subtitle">
        Busca un producto. Al buscar, se enfocará{" "}
        <b>solo el producto</b> encontrado.
      </p>

     {/* Chips */}
<div className="cat-chips" ref={wrapRef}>
  <div className="cat-chipsTrack">
    {categories.map((c) => {
      const isActive = c.key === activeKey;

      const style =
        c.key === "all"
          ? undefined
          : ({
              background: c.bgSoft,
              borderColor: c.border,
              color: c.text,
            } as React.CSSProperties);

      return (
        <button
          key={c.key}
          type="button"
          className={`cat-chip ${isActive ? "is-active" : ""} ${
            c.key === "all" ? "is-all" : ""
          }`}
          onClick={() => onSelectCategory(c.key)}
          aria-pressed={isActive}
          style={style}
        >
          <span
            className="cat-chipDot"
            style={{ background: c.dot, boxShadow: `0 0 0 6px ${c.bgSoft}` }}
          />
          <span className="cat-chipKey">{c.key === "all" ? "Todos" : c.key}</span>
          {c.key !== "all" && <span className="cat-chipLabel">{c.label}</span>}
        </button>
      );
    })}

    {/* DUPLICADO para carrusel infinito (solo se muestra en móvil por CSS) */}
    {categories.map((c) => {
      const isActive = c.key === activeKey;

      const style =
        c.key === "all"
          ? undefined
          : ({
              background: c.bgSoft,
              borderColor: c.border,
              color: c.text,
            } as React.CSSProperties);

      return (
        <button
          key={`${c.key}-dup`}
          type="button"
          className={`cat-chip is-dup ${isActive ? "is-active" : ""} ${
            c.key === "all" ? "is-all" : ""
          }`}
          onClick={() => onSelectCategory(c.key)}
          aria-pressed={isActive}
          tabIndex={-1}
          style={style}
        >
          <span
            className="cat-chipDot"
            style={{ background: c.dot, boxShadow: `0 0 0 6px ${c.bgSoft}` }}
          />
          <span className="cat-chipKey">{c.key === "all" ? "Todos" : c.key}</span>
          {c.key !== "all" && <span className="cat-chipLabel">{c.label}</span>}
        </button>
      );
    })}
  </div>
</div>


      {/* Search debajo y centrada */}
      <div className="cat-searchWrap">
        <div className="cat-searchBox">
          <form
            className="cat-search"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmitSearch();
            }}
          >
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="cat-searchInput"
              placeholder="Buscar productos..."
              aria-label="Buscar productos"
              name="q"
              autoComplete="off"
            />
            <button className="cat-searchBtn" type="submit" aria-label="Buscar">
              🔍
            </button>
          </form>

          {/* Sugerencias */}
          {hasSuggestions && (
            <div className="cat-suggest">
              {suggestions.map((s, idx) => (
                <button
                  key={`${s.label}-${idx}`}
                  type="button"
                  className="cat-suggestItem"
                  onMouseDown={(e) => e.preventDefault()} // ✅ evita blur raro
                  onClick={s.onPick}
                >
                  <div className="cat-suggestMain">{s.label}</div>
                  {s.sub ? <div className="cat-suggestSub">{s.sub}</div> : null}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hint opcional (si hay categoría activa) */}
      {active && active.key !== "all" ? (
        <p className="cat-hint">
          Mostrando: <b>{active.label}</b>
        </p>
      ) : null}
    </header>
  );
}
