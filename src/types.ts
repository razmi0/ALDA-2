export interface DebugPanelProps {
  range: {
    targetTag: `[data-debug="${string}"]`;
    label: string;
    min: number;
    max: number;
    value: number;
  }[];
}
