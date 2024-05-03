import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Label } from "./PanelLabels";

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
  const [expandElement, setExpandElement] = useState<[SVGElement, HTMLElement] | null>(null);

  const handlerToggleItem = () => {
    if (!expandElement) return;
    const [chevron, target] = expandElement;
    chevron.classList.toggle("rotate-90");
    target.classList.toggle("hidden");
  };

  useEffect(() => {
    const buttonLike = document.querySelector(`[data-is='button-expand-${id}']`) as HTMLElement;
    setExpandElement([
      document.querySelector(`[data-is='label-icon-${id}']`) as SVGElement,
      buttonLike?.parentNode?.nextSibling as HTMLElement,
    ]);
  }, []);

  return (
    <div className={`horizontal gap-5 justify-between w-full ${className} `}>
      <div
        className="cursor-pointer horizontal items-center justify-between w-full"
        tabIndex={0}
        role="button"
        // onClick={handlerToggleItem || (() => {})}
        onClick={handlerToggleItem}
        data-is={`button-expand-${id}`}
      >
        <Label id={id}>
          <ChevronUp className={`rotate-90 h-4 w-4 transition-transform mr-1`} data-is={`label-icon-${id}`} />
          {label}
        </Label>
      </div>
      {children}
    </div>
  );
};
export { Item, ItemHeader };
