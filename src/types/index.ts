import type { CSSProperty } from "astro/types";

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
    property: CSSProperty;
  }[];
}

export type DebugPanelProps = Prettify<LocalDebugPanelProps>;
