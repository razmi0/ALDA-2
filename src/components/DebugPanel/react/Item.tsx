import { ChevronUp } from "lucide-react";
import { Label } from "./Labels";
import type { MouseEventHandler } from "react";

const Item = ({
  children,
  className,
  rest,
}: {
  children: React.ReactNode;
  className?: string;
  rest?: React.HTMLProps<HTMLDivElement>;
}) => {
  return (
    <div
      className={`bg-zinc-200 has-[*:hover]:has-[.hidden]:bg-zinc-100 transition-colors m-2 mx-4 p-3 rounded-md ring-1 ring-stone-300 shadow-sm shadow-stone-500/90 h-fit w-56 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

type ItemHeaderProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
  label: string;
};

const ItemHeader = ({ children, className, id, label }: ItemHeaderProps) => {
  const handlerToggleItem: MouseEventHandler<HTMLDivElement> = (e) => {
    const currentTarget = e.currentTarget;
    if (!currentTarget) return;
    const target = currentTarget.parentNode?.nextSibling as HTMLElement;
    const chevron = currentTarget.querySelector("[data-is='label-icon']") as SVGElement;
    if (!target && !chevron) return;
    chevron.classList.toggle("rotate-90");
    target.classList.toggle("hidden");
  };

  return (
    <div className={`horizontal gap-5 justify-between w-full ${className} `}>
      <div
        className="cursor-pointer horizontal items-center justify-between w-full"
        tabIndex={0}
        role="button"
        onClick={handlerToggleItem}
      >
        <Label id={id}>
          <ChevronUp className={`rotate-90 h-4 w-4 transition-transform mr-1`} data-is="label-icon" />
          {label}
        </Label>
      </div>
      {children}
    </div>
  );
};
export { Item, ItemHeader };
