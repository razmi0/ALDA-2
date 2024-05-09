export interface ProductType {
  id: number;
  name: string;
  title: string;
  description: DescriptionType;
  price: string;
  unit: UnitType;
  rating: RatingType;
  stats: StatsType;

  tags: string[];
  footerText: string;
}

type StatsType = [
  { label: "courage"; value: string },
  { label: "agilite"; value: string },
  { label: "experience"; value: string }
];

type RatingType = "1" | "2" | "3" | "4" | "5";

type DescriptionType = {
  short: string;
  long: string;
};

type UnitType = "group" | "person" | "enfant" | "nuit" | "journée";
