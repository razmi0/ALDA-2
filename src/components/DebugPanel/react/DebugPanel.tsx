import { type DebugPanelProps } from "@/types";
import type { CSSProperties, ChangeEvent } from "react";
import { useState } from "react";

type Props = {
  range: {
    range: DebugPanelProps["range"];
  };
};

const DebugPanel = (props: Props) => {
  if (!props.range.range || props.range.range.length === 0) return <></>;
  const range = props.range.range;
  const [targets, setTargets] = useState<(Element | null)[]>([null]);
  const [ranges, setRanges] = useState<string[]>(
    Array.from({ length: range.length }, (_, i) => range[i]?.value || "0")
  );

  const [errors, setErrors] = useState<(false | "tag")[]>([false]);

  const handleActivateElement = (targetTag: string, index: number) => {
    const tag = `[data-debug="${targetTag}"]`;
    const element = document.querySelector(tag);

    if (!element) {
      const newErrors = [...errors];
      newErrors[index] = "tag";
      setErrors(newErrors);
      console.error(`[ERROR] : Element with tag ${tag} not found index : ${index}`);
      return;
    }
    const newTargets = [...targets];
    newTargets[index] = element;
    setTargets(newTargets);

    const newErrors = [...errors];
    newErrors[index] = false;
    setErrors(newErrors);
  };

  const rangeOnChange = (e: ChangeEvent<HTMLInputElement>, index: number, property: keyof CSSProperties) => {
    const target = targets[index];
    const newValue = e.target.value;
    const newRanges = [...ranges];

    console.log(`[INFO] : ${property} : ${newValue}`);

    if (!target) {
      console.error(`[ERROR] : Element not found index : ${index}`);
      return;
    }
    newRanges[index] = newValue;
    setRanges(newRanges);
    const style = (target as HTMLElement).style;
    style.setProperty(property, newValue.toString());
  };

  return (
    <aside className="fixed absolute-align w-fit h-fit mt-5 ml-5 bg-zinc-300 rounded-sm z-50">
      {range.map((item, index) => {
        const disabled = !targets[index] || errors[index] === "tag";

        const buttonRingColor = targets[index]
          ? "ring-green-400"
          : errors[index] === "tag"
          ? "ring-red-400"
          : "ring-zinc-300";

        return (
          <div className="flex center w-full h-fit p-3 gap-3" key={item.label}>
            <div className="vertical">
              <label className="font-bold" htmlFor={`range-${index}`}>
                {item.label}
              </label>
              <input
                id={`range-${index}`}
                type="range"
                className="w-40 accent-current cursor-pointer"
                min={item.min}
                step={item.step}
                max={item.max}
                value={ranges[index]}
                onChange={(e) => rangeOnChange(e, index, item.property)}
                disabled={disabled}
              />
            </div>
            <button
              className={`rounded-sm ring-2 bg-zinc-100 hover:bg-zinc-50 p-3 ${buttonRingColor}`}
              onClick={() => handleActivateElement(item.targetTag, index)}
            >
              Activate {ranges[index]}
            </button>
          </div>
        );
      })}
    </aside>
  );
};

export default DebugPanel;
