import type { DebugPanelProps } from "@/types";

export const range: DebugPanelProps = {
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
};
