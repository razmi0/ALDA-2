import type { CSSProperty } from "astro/types";

type Unit = "px" | "%" | "deg" | "em" | "rem";

export interface DebugPanelProps {
  range?: {
    targetTag: string;
    label: string;
    min: string;
    max: string;
    value: string;
    step: string;
    unit?: Unit;
    property: CSSProperty & string;
  }[];
  checkbox?: {
    targetTag: string;
    label: string;
    property: CSSProperty & string;
    value: string;
    isChecked: boolean;
  }[];
  radio?: {
    targetTag: string;
    label: string;
    property: CSSProperty & string;
    options: {
      label: string;
      value: string;
    }[];
    unit?: Unit;
  }[];
}

export const data = {
  range: [
    {
      targetTag: "hero-image",
      label: "image opacity",
      min: "0",
      max: "1",
      value: "0.5",
      property: "opacity",
      step: "0.01",
    },
  ],
  checkbox: [
    {
      targetTag: "header",
      label: "image blur",
      property: "filter",
      value: "blur(5px)",
    },
  ],
  radio: [
    {
      targetTag: "hero-image",
      label: "image position",
      property: "object-position",
      options: [
        { label: "top", value: "top" },
        { label: "center", value: "center" },
        { label: "bottom", value: "bottom" },
      ],
    },
  ],
} as DebugPanelProps;
