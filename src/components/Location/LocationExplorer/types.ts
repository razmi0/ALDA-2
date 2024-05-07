export interface Location {
  title: string; // location name
  subtitle: string; // location type
  coordinates: [number, number];
  page?: number;
  labelPage?: `${this["page"]}` & string;
  label?: string | undefined; // location label on map
  selected?: boolean | undefined;
}
