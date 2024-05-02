import type { Target } from "../entry";
import { LabelValue } from "./Labels";

export type CheckboxProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selected?: boolean | undefined;
  targets: Target[];
  value: string;
  errors: { tag: string; error: false | "tag" }[];
  item: { targetTag: string };
  name: string;
  id: string;
};

const Checkbox = ({ onChange, selected, targets, value, errors, item, name, id }: CheckboxProps) => {
  const target = targets.find((target) => target?.tag === item.targetTag);
  const error = errors.find((error) => error.tag === item.targetTag)?.error;
  const disabled = !target || error === "tag";

  return (
    <div className="horizontal justify-start items-center gap-3">
      <label className={`checkbox-label ${disabled ? "cursor-not-allowed" : "cursor-pointer"} `}>
        <input
          onChange={onChange}
          type="checkbox"
          value={value}
          name={name}
          id={id}
          disabled={disabled}
          checked={selected || false}
        />
        <div className="transition"></div>
      </label>
      <LabelValue selected={selected || false}>{value}</LabelValue>
    </div>
  );
};

interface RangeProps extends React.HTMLProps<HTMLInputElement> {}

const Range = ({ ...rest }: RangeProps) => {
  return <input type="range" className={`w-full ${rest.className}`} {...rest} />;
};

export { Checkbox, Range };
