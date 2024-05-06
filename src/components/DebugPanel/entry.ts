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

export const data: DebugPanelProps = {};
