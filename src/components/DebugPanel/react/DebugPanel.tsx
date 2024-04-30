import { type DebugPanelProps } from "@/types";
import { PanelBottomClose } from "lucide-react";
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
  const [open, setOpen] = useState(false);

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
    <>
      <aside
        className={`fixed absolute-align w-fit h-fit mt-5 ml-5 ${
          open ? "bg-zinc-300/90" : "bg-transparent"
        }  rounded-sm z-50`}
      >
        <div
          className={`w-full h-fit py-1 px-1 ${open ? "bg-zinc-50/90" : "bg-transparent"} flex items-center rounded-sm`}
          tabIndex={-1}
        >
          <button onClick={() => setOpen((p) => !p)} className={"hover:ring-1 ring-zinc-300 cursor-pointer"}>
            <PanelBottomClose className="text-zinc-800" />
          </button>
        </div>

        <div className={`${open ? "inline-block" : "hidden"}`}>
          {range.map((item, index) => {
            const disabled = !targets[index] || errors[index] === "tag";

            const buttonRingColor = errors[index] === "tag" ? "ring-red-400" : "ring-zinc-300";

            return (
              <div key={item.label}>
                <label
                  className="horizontal justify-between px-3 py-2 pt-3 text-zinc-500 text-sm"
                  htmlFor={`range-${index}`}
                >
                  {item.label}
                  <span className="horizontal center w-[5ch] text-sm">{ranges[index]}</span>
                </label>
                <div className="horizontal center w-full h-fit px-3 gap-3">
                  <div className="vertical gap-3">
                    <input
                      id={`range-${index}`}
                      type="range"
                      min={item.min}
                      step={item.step}
                      max={item.max}
                      value={ranges[index]}
                      onChange={(e) => rangeOnChange(e, index, item.property)}
                      disabled={disabled}
                      data-content={"0"}
                    />
                  </div>
                  <button
                    className={`rounded-sm ring-2 bg-zinc-100 hover:bg-zinc-50 px-3 py-1 h-fit ${buttonRingColor} horizontal center gap-3`}
                    onClick={() => handleActivateElement(item.targetTag, index)}
                  >
                    Activate
                    <svg
                      viewBox="0 0 28 28"
                      width={20}
                      height={20}
                      fill={disabled ? "red" : errors[index] === "tag" ? "orange" : "green"}
                    >
                      <circle cx="8" cy="14" r="8" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default DebugPanel;
