import type { CSSProperty } from "astro/types";
import { PanelBottomClose } from "lucide-react";
import type { ChangeEvent } from "react";
import React, { useState } from "react";
import { data, type DebugPanelProps } from "../entry";

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

let initRangesValues: string[], initCheckboxesValues: string[], initRadiosOptions: { label: string; value: string }[][];

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

  const [targets, setTargets] = useState<({ tag: string; element: Element } | null)[]>([null]);

  const [rangesValues, setRangesValues] = useState<string[]>(initRangesValues);
  const [checkboxesValues, _] = useState<string[]>(initCheckboxesValues);
  const [radiosOptions, setRadiosOptions] = useState<{ label: string; value: string }[][]>(initRadiosOptions);

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
    } else {
      console.log(`[INFO] : Element ${targetTag} already tagged and activated`);
      const errorIdx = errors.findIndex((error) => error.tag === targetTag);
      const error = errors[errorIdx];
      if (error?.error === "tag") {
        const newError = [...errors];
        newError[errorIdx] = { tag: targetTag, error: false };
        setErrors(newError);
        console.log(`[INFO] : Error removed for ${targetTag}`);
      } else if (!error) {
        setErrors([...errors, { tag: targetTag, error: false }]);
        console.warn(`[WARN] : Error not found and was added for ${targetTag}`);
      }
    }
  };

  const rangeOnChange = (e: ChangeEvent<HTMLInputElement>, index: number, property: CSSProperty) => {
    const target = targets.find((target) => target?.tag === ranges?.[index]?.targetTag);
    const newValue = e.target.value;
    const newRangesValues = [...rangesValues];

    if (!target) {
      console.error(`[ERROR] : Element not found`);
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
    console.log("checkboxOnChange");
    console.log("check ", e.target.checked);
    console.log("value", e.target.value);
    console.log("property", property);

    const target = targets.find((target) => target?.tag === checkboxes?.[index]?.targetTag);
    const value = e.target.value;

    if (!target) {
      console.error(`[ERROR] : Element not found`);
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

  const containerColor = open ? "bg-zinc-300/90" : "bg-transparent";
  const headerColor = open ? "bg-zinc-50/90" : "bg-transparent";
  const bodyDisplay = open ? "inline-block" : "hidden";

  return (
    <>
      <Container className={containerColor}>
        <Header classNames={headerColor}>
          <Trigger setOpen={togglePanel}>
            <PanelBottomClose className="text-zinc-800" />
          </Trigger>
        </Header>
        <Body className={bodyDisplay}>
          {ranges &&
            ranges.map((item, index) => {
              const error = errors.find((error) => error.tag === item.targetTag)?.error;

              const target = targets.find((target) => target?.tag === item.targetTag);

              const disabled = !target || error === "tag";

              const buttonRingColor = error === "tag" ? "ring-red-400" : "ring-zinc-300";

              const activate = () => handleActivateElement(item.targetTag);

              const labelValue = `${rangesValues[index]} ${ranges[index]?.unit || ""}`;

              const id = `range-${index}`;

              return (
                <div key={item.label}>
                  <Label id={id} value={labelValue}>
                    {item.label}
                  </Label>
                  <Field>
                    <Range
                      id={id}
                      min={item.min}
                      step={item.step}
                      max={item.max}
                      value={rangesValues?.[index] || ""}
                      onChange={(e) => rangeOnChange(e, index, item.property)}
                      disabled={disabled}
                    />
                    <ActivateButton
                      activate={activate}
                      buttonColor={buttonRingColor}
                      error={error}
                      disabled={disabled}
                    />
                  </Field>
                </div>
              );
            })}
          {checkboxes &&
            checkboxes.map((item, index) => {
              const error = errors.find((error) => error.tag === item.targetTag)?.error;

              const target = targets.find((target) => target?.tag === item.targetTag);

              const disabled = !target || error === "tag";

              const buttonRingColor = error === "tag" ? "ring-red-400" : "ring-zinc-300";

              const activate = () => handleActivateElement(item.targetTag);

              const labelValue = `${checkboxesValues[index]}`;

              const id = `range-${index}`;

              console.log();

              return (
                <div key={item.label}>
                  <Label id={id} value={labelValue}>
                    {item.label}
                  </Label>
                  <Field>
                    <Checkbox
                      id={id}
                      checked={item.isChecked}
                      value={checkboxesValues?.[index] || ""}
                      onChange={(e) => checkboxOnChange(e, index, item.property)}
                      disabled={disabled}
                    />
                    <ActivateButton
                      activate={activate}
                      buttonColor={buttonRingColor}
                      error={error}
                      disabled={disabled}
                    />
                  </Field>
                </div>
              );
            })}
        </Body>
      </Container>
    </>
  );
};

type ActivateButtonProps = {
  activate: () => void;
  buttonColor: string;
  error: false | "tag" | undefined;
  disabled: boolean;
};

type LabelProps = {
  children: React.ReactNode;
  id: string;
  value: string;
};

interface RangeProps extends React.HTMLProps<HTMLInputElement> {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Range = ({ ...rest }: RangeProps) => {
  return <input type="range" {...rest} />;
};

interface CheckboxProps extends React.HTMLProps<HTMLInputElement> {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({ ...rest }: CheckboxProps) => {
  return (
    <div>
      <label className="checkbox-label">
        <input {...rest} />
        <div className="transition"></div>
      </label>
    </div>
  );
};

const Label = ({ children, id, value }: LabelProps) => {
  return (
    <label className="horizontal justify-between px-3 py-2 pt-3 text-zinc-500 text-sm" htmlFor={id}>
      {children}
      <span className="horizontal center text-sm tabular-nums">{value}</span>
    </label>
  );
};

const Field = ({ children }: { children: React.ReactNode }) => {
  return <div className="horizontal center w-full h-fit px-3 gap-3">{children}</div>;
};

const ActivateButton = ({ activate, buttonColor, error, disabled }: ActivateButtonProps) => {
  return (
    <button
      className={`px-3 py-1 h-fit horizontal center gap-3 ${buttonColor} bg-zinc-100 hover:bg-zinc-50 rounded-sm ring-2`}
      onClick={activate}
    >
      Activate
      <svg viewBox="0 0 28 28" width={20} height={20} fill={disabled ? "grey" : error === "tag" ? "red" : "green"}>
        <circle cx="15" cy="14" r="8" />
      </svg>
    </button>
  );
};

type HeaderProps = {
  classNames?: string;
  children: React.ReactNode;
};

const Header = ({ children, classNames }: HeaderProps) => {
  return (
    <div className={`w-full h-fit py-1 px-1 flex items-center rounded-sm ${classNames}`} tabIndex={-1}>
      {children}
    </div>
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
    <aside className={`fixed absolute-align w-fit h-fit mt-5 ml-5 rounded-sm z-50 ${className}`}>{children}</aside>
  );
};

const Body = ({ children, className }: { children: React.ReactNode; className: string }) => {
  return <div className={className}>{children}</div>;
};

export default DebugPanel;
