export interface ProductType {
  id: number;
  name: string;
  title: string;
  description: DescriptionType;
  price: string;
  unit: UnitType;
  rating: RatingType;
  stats: StatType[];

  tags: string[];
  footerText: string;
}

export type StatType = {
  label: "courage" | "agilite" | "experience";
  value: string;
};

type RatingType = "1" | "2" | "3" | "4" | "5";

type DescriptionType = {
  short: string;
  long: string;
};

type UnitType = "group" | "person" | "enfant" | "nuit" | "journée";
