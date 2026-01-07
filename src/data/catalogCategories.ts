// src/data/catalogCategories.ts
export type CatalogCategory = {
  key: string;
  label: string;
  accent: string; // color principal (header)
  bgs: string[];  // backgrounds que pertenecen a esta categoría (header + items)
};

export const CATEGORIES: CatalogCategory[] = [
  {
    key: "AyD",
    label: "Ácidos y derivados",
    accent: "#8FC3FA",
    bgs: ["bg-[#8FC3FA]", "bg-[#BBDAFC]"],
  },
  {
    key: "AySA",
    label: "Alcoholes y soluciones alcohólicas",
    accent: "#6FCA63",
    bgs: ["bg-[#6FCA63]", "bg-[#8FD585]"],
  },
  {
    key: "SyCS",
    label: "Sales y compuestos de sodio",
    accent: "#F3D839",
    bgs: ["#F3D839", "bg-[#F9E990]"],
  },
  {
    key: "TyS",
    label: "Tensioactivos y surfactantes",
    accent: "#FA9B52",
    bgs: ["bg-[#FA9B52]", "bg-[#FBBD8D]"],
  },
  {
    key: "SyD",
    label: "Solventes y disolventes",
    accent: "#D09DF2",
    bgs: ["bg-[#D09DF2]", "bg-[#E1C0F7]"],
  },
  {
    key: "PQPT",
    label: "Productos químicos para textiles",
    accent: "#72DFF7",
    bgs: ["bg-[#72DFF7]", "bg-[#90E5F9]"],
  },
  {
    key: "MPPDyL",
    label: "Materia prima para detergentes y limpiadores",
    accent: "#CDA58E",
    bgs: ["bg-[#CDA58E]", "bg-[#DBBEAD]"],
  },
  {
    key: "PPC",
    label: "Productos para construcción",
    accent: "#AFACAC",
    bgs: ["bg-[#AFACAC]", "bg-[#C6C3C3]"],
  },
  {
    key: "AByD",
    label: "Agentes blanqueadores y desinfectantes",
    accent: "#E7A2DA",
    bgs: ["bg-[#E7A2DA]", "bg-[#F0C6E9]"],
  },
  {
    key: "OQI",
    label: "Otros químicos industriales",
    accent: "#8EACCD",
    bgs: ["bg-[#8EACCD]", "bg-[#ADC4DB]"],
  },
  {
    key: "ByA",
    label: "Bases y álcalis",
    accent: "#65ABF6",
    bgs: ["bg-[#65ABF6]", "bg-[#90C3F9]"],
  },
  {
    key: "EAA",
    label: "Edulcorantes y aditivos alimentarios",
    accent: "#B2EA43",
    bgs: ["bg-[#B2EA43]", "bg-[#C3EF6C]"],
  },
  {
    key: "PyA",
    label: "Preservantes y aditivos",
    accent: "#F5275B",
    bgs: ["bg-[#F5275B]", "bg-[#F86388]"],
  },
  {
    key: "PNE",
    label: "Productos naturales y extractos",
    accent: "#8F91FA",
    bgs: ["bg-[#8F91FA]", "bg-[#BBBCFC]"],
  },
];
