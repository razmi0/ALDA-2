export interface ProductType {
  id: number;
  name: string;
  title: string;
  description: DescriptionType;
  price: string;
  unit: UnitType;
  stats: StatType[];

  tags: string[];
  footerText: string;
  locations: string[];
  materials: string[];
  public: string;
  tasks: string[];
  duration: "string";
}

export type StatType = {
  label: "difficulté";
  value: string;
};

type DescriptionType = {
  short: string;
  long: string;
};

export type UnitType = "group" | "person" | "enfant" | "nuit" | "journée";

export interface ProductData {
  poles: Poles;
  products: Product[];
}

export interface Poles {
  available: number[];
  simple: number[];
  complex: number[];
  all: All[];
}

export interface All {
  id: number;
  label: string;
}

export interface Product {
  id: number;
  title: string;
  pole: string;
  tags?: string[];
  description?: string;
  price?: string;
  program?: string;
  audience?: string;
  locations?: string;
}

export interface ComplexProduct extends Product {
  data: Datum[];
}

export interface Datum {
  id: number;
  title: string;
  subtitle: string;
  objectifs: string[];
  ateliers: Atelier[];
}

export interface Atelier {
  title: string;
  duration: string;
  activities?: string[];
}
