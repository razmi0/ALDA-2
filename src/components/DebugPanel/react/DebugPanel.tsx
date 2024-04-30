import { type DebugPanelProps } from "@/types";
import { useState, useSyncExternalStore } from "react";

const DebugPanel = (props: DebugPanelProps) => {
  if (!props.range || props.range.length === 0) return <></>;
  const [target, setTarget] = useState<Element | null>(null);
  const [error, setError] = useState<false | "tag">(false);

  const { range } = props;
  console.log(range);

  useSyncExternalStore();

  const handleActivate = (targetTag: string) => {
    const element = document.querySelector(targetTag);
    if (!element) {
      setError("tag");
      console.error(`[ERROR] : Element with tag ${targetTag} not found`);
      return;
    }
    setTarget(element);
    setError(false);
  };

  return (
    <aside className="fixed absolute-align w-32 h-28 bg-zinc-300 rounded-sm">
      {range.map((item, index) => (
        <div className="flex center w-full h-fit p-3" key={item.label}>
          <div className="vertical center">
            <label htmlFor={`range-${index}`}>{item.label}</label>
            <input
              id={`range-${index}`}
              type="range"
              className="w-full"
              min={item.min}
              max={item.max}
              value={item.value}
            />
          </div>
          <button
            className={`rounded-sm w-9 h-5 
              ${target && "ring-1 ring-green-400"}
              ${error === "tag" && "ring-1 ring-red-400"}
              ${!error && "ring-1 ring-zinc-300"}
              `}
            onClick={() => handleActivate(item.targetTag)}
          >
            Activate
          </button>
        </div>
      ))}
    </aside>
  );
};

export default DebugPanel;
