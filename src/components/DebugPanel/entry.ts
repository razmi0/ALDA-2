import type { CSSProperty } from "astro/types";

type Unit = "px" | "%" | "deg" | "em" | "rem";

export type Target = {
  tag: string;
  element: Element;
} | null;

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
    options: CheckboxOption[];
    unit?: Unit;
  }[];
}

export type CheckboxOption = {
  label: string;
  value: string;
  checked?: boolean;
};

export const data: DebugPanelProps = {
  range: [
    // {
    //   targetTag: "bird",
    //   label: "opacity",
    //   min: "0",
    //   max: "1",
    //   value: "0.1",
    //   step: "0.01",
    //   property: "opacity",
    // },
  ],

  checkbox: [
    // {
    //   targetTag: "bird",
    //   property: "display",
    //   label: "display",
    //   options: [
    //     {
    //       label: "hidden",
    //       value: "none",
    //     },
    //   ],
    // },
    // {
    //   targetTag: "section-bird",
    //   label: "layout",
    //   property: "display",
    //   options: [
    //     { label: "flex", value: "flex" },
    //     { label: "grid", value: "grid" },
    //     { label: "block", value: "block" },
    //     { label: "inline-block", value: "inline-block" },
    //     { label: "inline", value: "inline" },
    //     { label: "none", value: "none" },
    //   ],
    // },
    // {
    //   targetTag: "bird",
    //   label: "blend-mode",
    //   property: "mix-blend-mode",
    //   options: [
    //     { label: "normal", value: "normal" },
    //     { label: "multiply", value: "multiply" },
    //     { label: "screen", value: "screen" },
    //     { label: "overlay", value: "overlay" },
    //     { label: "darken", value: "darken" },
    //     { label: "lighten", value: "lighten" },
    //     { label: "color-dodge", value: "color-dodge" },
    //     { label: "color-burn", value: "color-burn" },
    //     { label: "hard-light", value: "hard-light" },
    //     { label: "soft-light", value: "soft-light" },
    //     { label: "difference", value: "difference" },
    //     { label: "exclusion", value: "exclusion" },
    //     { label: "hue", value: "hue" },
    //     { label: "saturation", value: "saturation" },
    //     { label: "color", value: "color" },
    //     { label: "luminosity", value: "luminosity" },
    //   ],
    // },
    // {
    //   targetTag: "bird",
    //   label: "filter",
    //   property: "filter",
    //   options: [
    //     { label: "none", value: "none" },
    //     { label: "blur", value: "blur(10px)" },
    //     { label: "brightness", value: "brightness(0.5)" },
    //     { label: "contrast", value: "contrast(200%)" },
    //     { label: "grayscale", value: "grayscale(100%)" },
    //     { label: "invert", value: "invert(100%)" },
    //     { label: "opacity", value: "opacity(50%)" },
    //     { label: "saturate", value: "saturate(200%)" },
    //     { label: "sepia", value: "sepia(100%)" },
    //   ],
    // },
  ],
};
