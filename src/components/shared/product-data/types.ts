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
