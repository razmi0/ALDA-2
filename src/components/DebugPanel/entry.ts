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
  checkbox: [
    {
      targetTag: "fade-out-map",
      label: "Fadeout map H",
      property: "filter",
      options: [
        { label: "0", value: "contrast(0)" },
        { label: "1", value: "contrast(1)" },
        { label: "2", value: "contrast(2)" },
        { label: "3", value: "contrast(3)" },
        { label: "4", value: "contrast(4)" },
        { label: "5", value: "contrast(5)" },
        { label: "6", value: "contrast(6)" },
        { label: "7", value: "contrast(7)" },
        { label: "8", value: "contrast(8)" },
        { label: "9", value: "contrast(9)" },
        { label: "10", value: "contrast(10)" },
      ],
    },
  ],
};
