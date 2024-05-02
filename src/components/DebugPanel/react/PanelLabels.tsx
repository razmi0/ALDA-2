type LabelProps = {
  children: React.ReactNode;
  id: string;
  value?: string;
};

const LabelValue = ({
  children,
  selected,
  className,
}: {
  children: React.ReactNode;
  selected?: boolean;
  className?: string;
}) => {
  const highlightColor = selected ? "bg-zinc-100 ring-1 ring-stone-300 shadow-sm shadow-stone-500/90" : "";
  return (
    <span
      className={`inline-block horizontal center text-xs tabular-nums w-fit py-1 px-2 rounded-md transition-all ${className} ${highlightColor}`}
    >
      {children}
    </span>
  );
};

const Label = ({ children, value }: LabelProps) => {
  return (
    <span className="horizontal items-center justify-between text-sm font-semibold text-stone-600">
      {children}
      {value && <LabelValue>{value}</LabelValue>}
    </span>
  );
};

export { Label, LabelValue };
