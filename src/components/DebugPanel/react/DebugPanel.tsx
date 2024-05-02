import type { CSSProperty } from "astro/types";
import { PanelBottomClose } from "lucide-react";
import type { ChangeEvent } from "react";
import React, { useState } from "react";
import { data, type CheckboxOption, type DebugPanelProps } from "../entry";
import { ButtonGroup } from "./Buttons";
import Log from "./Log";

type Target = {
  tag: string;
  element: Element;
} | null;

/**
 *
 */
const hasRanges = "range" in data && data.range.length > 0;
const hasCheckboxes = "checkbox" in data && data.checkbox.length > 0;
const hasData = hasRanges || hasCheckboxes;

const ranges = data.range as DebugPanelProps["range"];
const checkboxes = data.checkbox as DebugPanelProps["checkbox"];

const startingStyles: Record<string, CSSStyleDeclaration | null> = {};
[...(ranges ?? []), ...(checkboxes ?? [])].map((item) => (startingStyles[item.targetTag] = null));

let initRangesValues: string[], initCheckboxesValues: CheckboxOption[][];

if ("range" in data && (ranges?.length ?? 0) > 0) {
  initRangesValues = Array.from(
    { length: (ranges as DebugPanelProps["range"])?.length ?? 0 },
    (_, i) => ranges?.[i]?.value ?? "0"
  );
}

if ("checkbox" in data && (checkboxes?.length ?? 0) > 0) {
  initCheckboxesValues = Array.from({ length: (checkboxes as DebugPanelProps["checkbox"])?.length ?? 0 }, (_, i) => {
    const checkbox = checkboxes?.[i];
    return checkbox?.options ?? [];
  });
}

const DebugPanel = () => {
  if (!hasData) return <></>;

  const [open, setOpen] = useState(false);

  const togglePanel = () => setOpen(!open);

  const [errors, setErrors] = useState<{ tag: string; error: false | "tag" }[]>([]);
  const [infos, setInfos] = useState<{ tag: string; info: false | "tag" | "reset" }[]>([]);
  const [success, setSuccess] = useState<{ tag: string; success: false | "tag" | "reset" }[]>([]);

  const [targets, setTargets] = useState<Target[]>([null]);

  const [rangesValues, setRangesValues] = useState<string[]>(initRangesValues);
  const [checkboxesValues, setCheckboxesValues] = useState<CheckboxOption[][]>(initCheckboxesValues);

  const reset = {
    info: () => setInfos([]),
    success: () => setSuccess([]),
    error: () => setErrors([]),
    targets: () => setTargets([null]),
    rangesValues: () => setRangesValues(initRangesValues),
    checkboxesValues: () => setCheckboxesValues(initCheckboxesValues),
  };

  const handleActivateElement = (targetTag: string) => {
    const isTagged = targets.find((target) => target?.tag === targetTag);

    if (!isTagged) {
      const tag = `[data-debug="${targetTag}"]`;
      const element = document.querySelector(tag);
      if (!element) {
        console.error(`[ERROR] : Element with tag ${tag} not found`);
        setErrors([...errors, { tag: targetTag, error: "tag" as const }]);
        return;
      }

      setTargets([...targets, { tag: targetTag, element }]);
      setSuccess([...success, { tag: targetTag, success: "tag" }]);

      startingStyles[targetTag] = (element as HTMLElement).style;
    } else {
      console.log(`[INFO] : Element ${targetTag} already tagged and activated`);
      setInfos([...infos, { tag: targetTag, info: "tag" as const }]);

      const errorIdx = errors.findIndex((error) => error.tag === targetTag);
      const error = errors[errorIdx];

      if (error?.error === "tag") {
        const newError = [...errors];
        newError[errorIdx] = { tag: targetTag, error: false };
        setErrors(newError);

        console.log(`[INFO] : Error removed for ${targetTag}`);
        setInfos([...infos, { tag: targetTag, info: "tag" as const }]);
      } else if (!error) {
        setErrors([...errors, { tag: targetTag, error: false }]);
        console.warn(`[WARN] : Error not found and was added for ${targetTag}`);
        setInfos([...infos, { tag: targetTag, info: "tag" as const }]);
      }
    }
  };

  const handleReset = (tag: string) => {
    const target = targets.find((target) => target?.tag === tag);
    if (!target) {
      console.log(`[INFO] : Activating element ${tag} before reset`);
      setInfos([...infos, { tag: tag, info: "reset" }]);
      return;
    }

    const element = target.element as HTMLElement;

    if (!startingStyles[tag]) {
      console.log(`[INFO] : No starting styles found for ${tag}`);
      setInfos([...infos, { tag: tag, info: "reset" }]);

      return;
    }

    // string = CSSStyleDeclaration here
    element.style.cssText = startingStyles[tag] as unknown as string;
    reset.targets();
    reset.rangesValues();
    reset.checkboxesValues();

    setSuccess([...success, { tag: tag, success: "reset" }]);
  };

  const rangeOnChange = (e: ChangeEvent<HTMLInputElement>, index: number, property: CSSProperty) => {
    const target = targets.find((target) => target?.tag === ranges?.[index]?.targetTag);
    const newValue = e.target.value;
    const newRangesValues = [...rangesValues];

    if (!target) {
      console.error(`[ERROR] : Element not found`);
      setErrors([...errors, { tag: ranges?.[index]?.targetTag as string, error: "tag" }]);
      return;
    }
    /*
     * store value
     */
    newRangesValues[index] = newValue;
    setRangesValues(newRangesValues);
    /*
     * apply value
     */
    const style = (target.element as HTMLElement).style;
    style.setProperty(property, newValue.toString() + (ranges?.[index]?.unit || ""));
  };

  const checkboxOnChange = (e: ChangeEvent<HTMLInputElement>, fieldIndex: number, property: CSSProperty) => {
    const target = targets.find((target) => target?.tag === checkboxes?.[fieldIndex]?.targetTag);

    if (!target) {
      console.error(`[ERROR] : Element not found`);
      setErrors([...errors, { tag: checkboxes?.[fieldIndex]?.targetTag as string, error: "tag" }]);
      return;
    }
    const newcheckboxesValues = [...checkboxesValues] as CheckboxOption[][];

    const option = (newcheckboxesValues[fieldIndex] as CheckboxOption[]).find((option) => option.label === e.target.id);

    let newCheckedState = option?.checked;
    (newcheckboxesValues[fieldIndex] as CheckboxOption[]).forEach((option) => {
      console.log(option.label === e.target.id, option.label, e.target.id);
      if (option.label === e.target.id) {
        newCheckedState = !option.checked;
        option.checked = newCheckedState;
        console.log(`[INFO] : ${option.label} checked state changed to ${newCheckedState}`);
      }
    });

    setCheckboxesValues(newcheckboxesValues);

    const style = (target.element as HTMLElement).style;
    /*
     * apply value
     */
    newCheckedState ? style.setProperty(property, e.target.value) : style.removeProperty(property);
    // style.setProperty(property, e.target.value);
  };

  const containerColor = open ? "bg-zinc-100/90" : "bg-transparent";
  const headerColor = open ? "bg-zinc-100/90" : "bg-transparent";
  const bodyDisplay = open ? "inline-block" : "hidden";

  // RENDER
  // RENDER
  // RENDER
  // RENDER
  // RENDER

  return (
    <>
      <Container className={containerColor}>
        <Header classNames={headerColor}>
          <Trigger setOpen={togglePanel}>
            <PanelBottomClose className="text-zinc-800" />
          </Trigger>
          <Log errors={errors} success={success} infos={infos} reset={reset} />
        </Header>
        <Body className={bodyDisplay}>
          {ranges &&
            ranges.map((item, index) => {
              const error = errors.find((error) => error.tag === item.targetTag)?.error;

              const target = targets.find((target) => target?.tag === item.targetTag);

              const resetStyles = () => handleReset(item.targetTag);

              const disabled = !target || error === "tag";

              const activate = () => handleActivateElement(item.targetTag);

              const labelValue = `${rangesValues[index]} ${ranges[index]?.unit || ""}`;

              const id = `range-${index}`;

              return (
                <Item key={item.label}>
                  <div className="horizontal justify-between ml-2">
                    <Label id={id}>{item.label}</Label>
                    <ButtonGroup
                      activate={activate}
                      error={error}
                      resetStyles={resetStyles}
                      targets={targets}
                      item={item}
                    />
                  </div>
                  <Field className="flex-row">
                    <Range
                      id={id}
                      min={item.min}
                      step={item.step}
                      max={item.max}
                      value={rangesValues?.[index] || ""}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => rangeOnChange(e, index, item.property)}
                      disabled={disabled}
                    />
                    <LabelValue className="w-10">{labelValue}</LabelValue>
                  </Field>
                </Item>
              );
            })}

          {checkboxes &&
            checkboxes.map((item, index) => {
              const error = errors.find((error) => error.tag === item.targetTag)?.error;

              const resetStyles = () => handleReset(item.targetTag);

              const activate = () => handleActivateElement(item.targetTag);

              const id = `range-${index}`;

              return (
                <Item key={item.label} className="py-1">
                  <div className="horizontal justify-between ml-2">
                    <Label id={id}>{item.label}</Label>
                    <ButtonGroup
                      activate={activate}
                      error={error}
                      resetStyles={resetStyles}
                      targets={targets}
                      item={item}
                    />
                  </div>
                  <Field>
                    {checkboxesValues?.[index]?.map((option) => {
                      return (
                        <div key={option.label}>
                          <Checkbox
                            name={id}
                            id={option.label}
                            value={option.value}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => checkboxOnChange(e, index, item.property)}
                            targets={targets}
                            selected={option.checked}
                            errors={errors}
                            item={item}
                          />
                        </div>
                      );
                    })}
                  </Field>
                </Item>
              );
            })}
        </Body>
      </Container>
    </>
  );
};

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
      className={`bg-zinc-200 m-2 mx-4 p-1 rounded-md ring-1 ring-stone-300 shadow-sm shadow-stone-500/90 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

type LabelProps = {
  children: React.ReactNode;
  id: string;
  value?: string;
};

interface RangeProps extends React.HTMLProps<HTMLInputElement> {
  // onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Range = ({ ...rest }: RangeProps) => {
  return <input type="range" className={`max-w-40 ${rest.className}`} {...rest} />;
};

type CheckboxProps = {
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

const LabelValue = ({
  children,
  selected,
  className,
}: {
  children: React.ReactNode;
  selected?: boolean;
  className?: string;
}) => {
  const highlightColor = selected ? "ring-1 ring-stone-400 shadow-inset shadow-stone-400 shadow-sm" : "";
  return (
    <span
      className={`inline-block horizontal center text-xs tabular-nums w-fit py-1 px-2 rounded-md ${className} ${highlightColor}`}
    >
      {children}
    </span>
  );
};

const Label = ({ children, id, value }: LabelProps) => {
  return (
    <label className="horizontal items-center justify-between text-sm font-semibold text-stone-600" htmlFor={id}>
      {children}
      {value && <LabelValue>{value}</LabelValue>}
    </label>
  );
};

const Field = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`relative vertical items-start full px-3 py-2 flex-wrap ${className}`}>{children}</div>;
};

type HeaderProps = {
  classNames?: string;
  children: React.ReactNode;
};

const Header = ({ children, classNames }: HeaderProps) => {
  return (
    <>
      <div className={`w-full h-fit py-1 px-1 horizontal items-center justify-between rounded-lg ${classNames}`}>
        {children}
      </div>
    </>
  );
};

type TriggerProps = {
  setOpen: () => void;
  children: React.ReactNode;
};

const Trigger = ({ setOpen, children }: TriggerProps) => {
  return (
    <button onClick={setOpen} className={"hover:ring-1 ring-zinc-300 cursor-pointer"}>
      {children}
    </button>
  );
};

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

const Container = ({ children, className }: ContainerProps) => {
  return (
    <aside className={`fixed absolute-align w-fit h-fit mt-5 ml-5 rounded-lg z-50 ${className}`}>{children}</aside>
  );
};

const Body = ({ children, className }: { children: React.ReactNode; className: string }) => {
  return <div className={`py-2 grid grid-cols-2 ${className}`}>{children}</div>;
};

export default DebugPanel;
