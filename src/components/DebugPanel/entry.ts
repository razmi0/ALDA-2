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
    {
      targetTag: "hero-image",
      label: "image sepia",
      property: "filter",
      options: [
        { label: "0%", value: "sepia(0)" },
        { label: "50%", value: "sepia(0.5)" },
        { label: "100%", value: "sepia(1)" },
      ],
    },
    {
      targetTag: "hero-image",
      label: "image hue-rotate",
      property: "filter",
      options: [
        { label: "0deg", value: "hue-rotate(0deg)" },
        { label: "15deg", value: "hue-rotate(15deg)" },
        { label: "30deg", value: "hue-rotate(30deg)" },
        { label: "45deg", value: "hue-rotate(45deg)" },
        { label: "60deg", value: "hue-rotate(60deg)" },
        { label: "80deg", value: "hue-rotate(80deg)" },
        { label: "90deg", value: "hue-rotate(90deg)" },
        { label: "120deg", value: "hue-rotate(120deg)" },
        { label: "150deg", value: "hue-rotate(150deg)" },
        { label: "180deg", value: "hue-rotate(180deg)" },
      ],
    },
    {
      targetTag: "hero-image",
      label: "image saturate",
      property: "filter",
      options: [
        { label: "0%", value: "saturate(0)" },
        { label: "50%", value: "saturate(0.5)" },
        { label: "100%", value: "saturate(1)" },
      ],
    },
    {
      targetTag: "hero-image",
      label: "image invert",
      property: "filter",
      options: [
        { label: "0%", value: "invert(0)" },
        { label: "50%", value: "invert(0.5)" },
        { label: "100%", value: "invert(1)" },
      ],
    },
  ],
};
