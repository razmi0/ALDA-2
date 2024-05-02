import type { CSSProperty } from "astro/types";
import { PanelBottomClose } from "lucide-react";
import type { ChangeEvent } from "react";
import React, { useState } from "react";
import { data, type DebugPanelProps, type RadioOption } from "../entry";
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
const hasRadio = "radio" in data && data.radio.length > 0;
const hasData = hasRanges || hasRadio || hasCheckboxes;

const ranges = data.range as DebugPanelProps["range"];
const checkboxes = data.checkbox as DebugPanelProps["checkbox"];
const radios = data.radio as DebugPanelProps["radio"];

const startingStyles: Record<string, CSSStyleDeclaration | null> = {};
[...(ranges ?? []), ...(checkboxes ?? []), ...(radios ?? [])].map((item) => (startingStyles[item.targetTag] = null));

let initRangesValues: string[], initCheckboxesValues: string[], initRadiosOptions: RadioOption[][];

if ("range" in data && (ranges?.length ?? 0) > 0) {
  initRangesValues = Array.from(
    { length: (ranges as DebugPanelProps["range"])?.length ?? 0 },
    (_, i) => ranges?.[i]?.value ?? "0"
  );
}

if ("checkbox" in data && (checkboxes?.length ?? 0) > 0) {
  initCheckboxesValues = Array.from(
    { length: (checkboxes as DebugPanelProps["checkbox"])?.length ?? 0 },
    (_, i) => checkboxes?.[i]?.value ?? "0"
  );
}

if ("radio" in data && (radios?.length ?? 0) > 0) {
  initRadiosOptions = Array.from({ length: (radios as DebugPanelProps["radio"])?.length ?? 0 }, (_, i) => {
    const radio = radios?.[i];
    return radio?.options ?? [];
  });
}

const DebugPanel = () => {
  if (!hasData) return <></>;

  const [open, setOpen] = useState(false);

  const togglePanel = () => setOpen(!open);

  const [errors, setErrors] = useState<{ tag: string; error: false | "tag" }[]>([]);
  const [infos, setInfos] = useState<{ tag: string; info: false | "tag" | "reset" }[]>([]);
  const [success, setSuccess] = useState<{ tag: string; success: false | "tag" | "reset" }[]>([]);

  const reset = {
    info: () => setInfos([]),
    success: () => setSuccess([]),
    error: () => setErrors([]),
    targets: () => setTargets([null]),
    rangesValues: () => setRangesValues(initRangesValues),
    checkboxesValues: () => setCheckboxesValues(initCheckboxesValues),
    radiosOptions: () => setRadiosOptions(initRadiosOptions),
  };

  const [targets, setTargets] = useState<Target[]>([null]);

  const [rangesValues, setRangesValues] = useState<string[]>(initRangesValues);
  const [checkboxesValues, setCheckboxesValues] = useState<string[]>(initCheckboxesValues);
  const [radiosOptions, setRadiosOptions] = useState<RadioOption[][]>(initRadiosOptions);

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
    reset.radiosOptions();

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

  const checkboxOnChange = (e: ChangeEvent<HTMLInputElement>, index: number, property: CSSProperty) => {
    const target = targets.find((target) => target?.tag === checkboxes?.[index]?.targetTag);
    const value = e.target.value;

    if (!target) {
      console.error(`[ERROR] : Element not found`);
      setErrors([...errors, { tag: checkboxes?.[index]?.targetTag as string, error: "tag" }]);
      return;
    }

    const style = (target.element as HTMLElement).style;
    if (e.target.checked) {
      /*
       * apply value
       */

      style.setProperty(property, value);
    } else {
      /*
       * remove value
       */
      style.removeProperty(property);
    }
  };

  const radioOnChange = (e: ChangeEvent<HTMLInputElement>, fieldIndex: number, property: CSSProperty) => {
    const target = targets.find((target) => target?.tag === radios?.[fieldIndex]?.targetTag);

    if (!target) {
      console.error(`[ERROR] : Element not found`);
      setErrors([...errors, { tag: radios?.[fieldIndex]?.targetTag as string, error: "tag" }]);
      return;
    }
    const newRadiosOptions = [...radiosOptions];

    (newRadiosOptions[fieldIndex] as RadioOption[]).forEach((option) => {
      option.label === e.target.id ? (option.checked = true) : (option.checked = false);
    });

    setRadiosOptions(newRadiosOptions);

    const style = (target.element as HTMLElement).style;
    /*
     * apply value
     */
    style.setProperty(property, e.target.value);
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
              const error = errors.find((error) => error.tag === item.targetTag)?.error; //error

              const target = targets.find((target) => target?.tag === item.targetTag); //target

              const resetStyles = () => handleReset(item.targetTag); // onClick tag

              const disabled = !target || error === "tag"; // error

              const activate = () => handleActivateElement(item.targetTag); // onclick tag

              const id = `range-${index}`;

              return (
                <Item key={item.label}>
                  <Label id={id}>{item.label}</Label>
                  <Field>
                    <Checkbox
                      id={id}
                      checked={item.isChecked}
                      value={checkboxesValues?.[index] || ""}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => checkboxOnChange(e, index, item.property)}
                      disabled={disabled}
                    />

                    <ButtonGroup
                      activate={activate}
                      error={error}
                      resetStyles={resetStyles}
                      targets={targets}
                      item={item}
                    />
                  </Field>
                </Item>
              );
            })}
          {radios &&
            radios.map((item, index) => {
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
                    {radiosOptions?.[index]?.map((option) => {
                      console.log(option);
                      return (
                        <div key={option.label}>
                          <Radio
                            name={id}
                            id={option.label}
                            value={option.value}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => radioOnChange(e, index, item.property)}
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

interface CheckboxProps extends React.HTMLProps<HTMLInputElement> {
  // onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({ ...rest }: CheckboxProps) => {
  return (
    <div className="horizontal center gap-3">
      <label className={`checkbox-label ${rest.disabled ? "cursor-not-allowed" : "cursor-pointer"} `}>
        <input type="checkbox" {...rest} />
        <div className="transition"></div>
      </label>
      <LabelValue>{rest.value}</LabelValue>
    </div>
  );
};

type RadioProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selected?: boolean | undefined;
  targets: Target[];
  value: string;
  errors: { tag: string; error: false | "tag" }[];
  item: { targetTag: string };
  name: string;
  id: string;
};

const Radio = ({ onChange, selected, targets, value, errors, item, name, id }: RadioProps) => {
  const target = targets.find((target) => target?.tag === item.targetTag);
  const error = errors.find((error) => error.tag === item.targetTag)?.error;
  const disabled = !target || error === "tag";
  return (
    <div className="horizontal justify-start items-center gap-3">
      <label className={`checkbox-label ${disabled ? "cursor-not-allowed" : "cursor-pointer"} `}>
        <input onChange={onChange} type="radio" value={value} name={name} id={id} disabled={disabled} />
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
  return (
    <div className={`relative vertical items-start w-full h-fit px-3 py-2 flex-wrap ${className}`}>{children}</div>
  );
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
  return <div className={`py-2 ${className}`}>{children}</div>;
};

export default DebugPanel;
