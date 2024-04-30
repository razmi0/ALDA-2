// Add your types here
import type { CSSProperties } from "react";

export type Prettify<T> = {
  [K in keyof T]: T[K];
};

interface LocalDebugPanelProps {
  range: {
    targetTag: string;
    label: string;
    min: string;
    max: string;
    value: string;
    step: string;
    unit?: "px" | "%" | "deg" | "em" | "rem";
    property: keyof CSSProperties;
  }[];
}

export type DebugPanelProps = Prettify<LocalDebugPanelProps>;
