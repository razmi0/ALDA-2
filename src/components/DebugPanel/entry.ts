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
    options: RadioOption[];
    unit?: Unit;
  }[];
}

export type RadioOption = {
  label: string;
  value: string;
  checked?: boolean;
};

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

  radio: [
    {
      targetTag: "hero-image",
      label: "image blur",
      property: "filter",
      options: [
        { label: "sm", value: "blur(5px)" },
        { label: "lg", value: "blur(50px)" },
        { label: "xl", value: "blur(200px)" },
      ],
    },
    {
      targetTag: "hero-image",
      label: "image contrast",
      property: "filter",
      options: [
        { label: "low", value: "contrast(0.5)" },
        { label: "normal", value: "contrast(1)" },
        { label: "high", value: "contrast(2)" },
      ],
    },
    {
      targetTag: "hero-image",
      label: "image brightness",
      property: "filter",
      options: [
        { label: "low", value: "brightness(0.5)" },
        { label: "normal", value: "brightness(1)" },
        { label: "high", value: "brightness(2)" },
      ],
    },
    {
      targetTag: "hero-image",
      label: "image grayscale",
      property: "filter",
      options: [
        { label: "0%", value: "grayscale(0)" },
        { label: "50%", value: "grayscale(0.5)" },
        { label: "100%", value: "grayscale(1)" },
      ],
    },
  ],
} as DebugPanelProps;
