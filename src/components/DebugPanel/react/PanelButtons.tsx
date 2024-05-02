import { Power, RotateCcw } from "lucide-react";
import { useEffect, useId, useState, type ReactNode } from "react";
import type { Target } from "../entry";

type ActivateButtonProps = {
  activate: () => void;
  color: string;
  disabled: boolean;
};

const ResetButton = ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => {
  return (
    <Button click={onClick} disabled={disabled}>
      <RotateCcw className={`h-4 w-4 text-zinc-600`} />
    </Button>
  );
};

const Button = ({ click, children, disabled }: { click: () => void; children: ReactNode; disabled?: boolean }) => {
  return (
    <button
      className="p-1 h-fit horizontal center gap-3hover:bg-zinc-50 rounded-full hover:ring-2 hover:ring-zinc-300 cursor-pointer"
      onClick={click}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const ActivateButton = ({ activate, color }: ActivateButtonProps) => {
  return (
    <Button click={activate}>
      <Power className={`h-4 w-4 text-${color}-600 ${color} `} />
    </Button>
  );
};

const ButtonGroup = ({
  activate,
  resetStyles,
  error,
  targets,
  item,
}: {
  activate: () => void;
  resetStyles: () => void;
  error: false | "tag" | undefined;
  targets: Target[];
  item: { targetTag: string };
}) => {
  const [hide, setHide] = useState(false);
  const id = useId().replace(/:/g, "_");

  const target = targets.find((target) => target?.tag === item.targetTag);
  const disabled = !target || error === "tag";
  const color = error === "tag" ? "red" : disabled ? "grey" : "green";
  const dataFor = `${item.targetTag}-${id}`;

  useEffect(() => {
    const similarElements = document.querySelectorAll(`[data-for]`) as NodeListOf<HTMLElement>;
    const currentElement = document.querySelector(`[data-for=${dataFor}]`) as HTMLElement;
    const isFirst = similarElements[0] === currentElement;
    if (similarElements.length > 1 && !isFirst) setHide(true);
  }, []);

  const FieldState = ({ color }: { color: string }) => {
    return (
      <svg viewBox="0 0 28 28" width={20} height={20} fill={color}>
        <circle cx="15" cy="14" r="8" />
      </svg>
    );
  };

  return (
    <div data-for={dataFor} className={`horizontal center gap-1`}>
      {hide ? (
        <FieldState color={color} />
      ) : (
        <>
          <ActivateButton activate={activate} color={color} disabled={disabled} />
          <ResetButton onClick={resetStyles} disabled={disabled} />
        </>
      )}
    </div>
  );
};

export { ButtonGroup, ResetButton };
