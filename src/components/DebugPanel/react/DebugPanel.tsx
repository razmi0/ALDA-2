import type { CSSProperty } from "astro/types";
import { ChevronUp } from "lucide-react";
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

    console.log("here");

    if (!target) {
      console.error(`[ERROR] : Element not found`);
      setErrors([...errors, { tag: checkboxes?.[fieldIndex]?.targetTag as string, error: "tag" }]);
      return;
    }
    const newcheckboxesValues = [...checkboxesValues] as CheckboxOption[][];

    const checkbox = newcheckboxesValues?.[fieldIndex] as CheckboxOption[];

    if (!checkbox) {
      console.error(`[ERROR] : Checkbox not found`);
      return;
    }

    // const option = checkbox.find((option) => option.label === e.target.id);
    let newChecked = false;
    const options = checkbox.map((option: CheckboxOption) => {
      if (option.label === e.target.id) {
        newChecked = !option.checked;
        return { ...option, checked: newChecked };
      }
      return { ...option, checked: false };
    });

    newcheckboxesValues[fieldIndex] = options;

    setCheckboxesValues(newcheckboxesValues);

    const style = (target.element as HTMLElement).style;
    /*
     * apply value
     */
    newChecked ? style.setProperty(property, e.target.value) : style.removeProperty(property);
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
            <ChevronUp
              className={`h-5 w-5 ${open ? "rotate-180 text-zinc-500" : "text-white"} transition-transform `}
            />
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
                  <div className="horizontal gap-5 justify-between w-full">
                    <div
                      className="cursor-pointer horizontal items-center justify-between w-full"
                      tabIndex={0}
                      role="button"
                      onClick={(_e) => {
                        const currentTarget = _e.currentTarget;
                        const target = currentTarget.parentNode?.nextSibling as HTMLElement;
                        const chevron = currentTarget.querySelector("[data-is='label-icon']") as SVGElement;
                        if (!target && !chevron) return;
                        chevron.classList.toggle("rotate-90");
                        target.classList.toggle("hidden");
                      }}
                    >
                      <Label id={id}>
                        <ChevronUp className={`rotate-90 h-4 w-4 transition-transform mr-1`} data-is="label-icon" />
                        {item.label}
                      </Label>
                    </div>
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
                    <LabelValue className="w-10 text-center" selected>
                      {labelValue}
                    </LabelValue>
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
                <Item key={item.label}>
                  <div className="horizontal gap-5 justify-between w-full">
                    <div
                      className="cursor-pointer horizontal items-center justify-between w-full"
                      tabIndex={0}
                      role="button"
                      onClick={(_e) => {
                        const currentTarget = _e.currentTarget;
                        const target = currentTarget.parentNode?.nextSibling as HTMLElement;
                        const chevron = currentTarget.querySelector("[data-is='label-icon']") as SVGElement;
                        if (!target && !chevron) return;
                        chevron.classList.toggle("rotate-90");
                        target.classList.toggle("hidden");
                      }}
                    >
                      <Label id={id}>
                        <ChevronUp className={`rotate-90 h-4 w-4 transition-transform mr-1`} data-is="label-icon" />
                        {item.label}
                      </Label>
                    </div>
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
                        // <div key={option.label}>
                        <Checkbox
                          key={option.label}
                          name={id}
                          id={option.label}
                          value={option.value}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => checkboxOnChange(e, index, item.property)}
                          targets={targets}
                          selected={option.checked}
                          errors={errors}
                          item={item}
                        />
                        // </div>
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
      className={`bg-zinc-200 m-2 mx-4 p-3 rounded-md ring-1 ring-stone-300 shadow-sm shadow-stone-500/90 h-fit w-56 ${className}`}
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
  return <input type="range" className={`w-full ${rest.className}`} {...rest} />;
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

const Field = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`relative vertical items-start gap-2 full pb-2 pt-4 flex-wrap ${className}`}>{children}</div>;
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
    <button
      onClick={setOpen}
      className={
        "relative hover:bg-slate-100/50 hover:ring-1 hover:ring-slate-100 cursor-pointer rounded-full p-1 group"
      }
    >
      <div className="hidden center group-hover:horizontal absolute translate-x-[50%]" data-tooltip>
        <small className="text-zinc-100 font-semibold">DebugPanel</small>
      </div>
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
    <aside
      className={`fixed absolute-align w-fit h-fit mt-5 ml-5 rounded-lg z-50  max-h-[95%] overflow-y-auto ${className}`}
    >
      {children}
    </aside>
  );
};

const Body = ({ children, className }: { children: React.ReactNode; className: string }) => {
  return <div className={`py-2 grid grid-cols-2 ${className}`}>{children}</div>;
};

export default DebugPanel;
