import type { CSSProperty } from "astro/types";
import { ChevronUp } from "lucide-react";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { data, type CheckboxOption, type DebugPanelProps, type Target } from "../entry";
import { ButtonGroup } from "./PanelButtons";
import { Checkbox, Range } from "./PanelInputs";
import { Item, ItemHeader } from "./PanelItem";
import { LabelValue } from "./PanelLabels";
import { Body, Container, Field, Header, Trigger } from "./PanelLayout";

import Log from "./PanelLog";

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
  };

  const containerClass = open ? "bg-zinc-100/90 overflow-y-auto" : "bg-transparent overflow-y-visible";
  const headerColor = open ? "bg-zinc-100/90" : "bg-transparent";
  const bodyDisplay = open ? "inline-block" : "hidden";

  return (
    <>
      <Container className={containerClass}>
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
              const handleRange = (e: ChangeEvent<HTMLInputElement>) => rangeOnChange(e, index, item.property);
              const { min, max, step, label } = item;

              return (
                <Item key={label}>
                  <ItemHeader id={id} label={label}>
                    <ButtonGroup
                      activate={activate}
                      error={error}
                      resetStyles={resetStyles}
                      targets={targets}
                      item={item}
                    />
                  </ItemHeader>
                  <Field className="flex-row">
                    <Range
                      id={id}
                      min={min}
                      step={step}
                      max={max}
                      value={rangesValues[index]}
                      onChange={handleRange}
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
              const id = `checkbox-${index}`;
              const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => checkboxOnChange(e, index, item.property);
              const { label } = item;
              return (
                <Item key={label}>
                  <ItemHeader id={id} label={label}>
                    <ButtonGroup
                      activate={activate}
                      error={error}
                      resetStyles={resetStyles}
                      targets={targets}
                      item={item}
                    />
                  </ItemHeader>
                  <Field>
                    {checkboxesValues?.[index]?.map((option) => {
                      const { label, value, checked } = option;
                      return (
                        <Checkbox
                          key={label}
                          name={id}
                          id={label}
                          value={value}
                          onChange={handleCheckbox}
                          targets={targets}
                          selected={checked}
                          errors={errors}
                          item={item}
                        />
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

export default DebugPanel;
