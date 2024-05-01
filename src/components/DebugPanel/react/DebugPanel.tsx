import type { CSSProperty } from "astro/types";
import { CircleAlert, CircleCheck, Info, PanelBottomClose, Power, RotateCcw } from "lucide-react";
import type { ChangeEvent } from "react";
import React, { useEffect, useState } from "react";
import { data, type DebugPanelProps, type RadioOption } from "../entry";

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

let startingStyles: Record<string, CSSStyleDeclaration | null> = {};
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
  };

  const [targets, setTargets] = useState<({ tag: string; element: Element } | null)[]>([null]);

  const [rangesValues, setRangesValues] = useState<string[]>(initRangesValues);
  const [checkboxesValues, _] = useState<string[]>(initCheckboxesValues);
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

    // @ts-ignore
    element.style.cssText = startingStyles[tag] as string;

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

  return (
    <>
      <Container className={"scale-95 " + containerColor}>
        <Header classNames={headerColor}>
          <Trigger setOpen={togglePanel}>
            <PanelBottomClose className="text-zinc-800" />
          </Trigger>
          <LogEvent errors={errors} success={success} infos={infos} reset={reset} />
        </Header>
        <Body className={bodyDisplay}>
          {ranges &&
            ranges.map((item, index) => {
              const error = errors.find((error) => error.tag === item.targetTag)?.error;

              const target = targets.find((target) => target?.tag === item.targetTag);

              const resetStyles = () => handleReset(item.targetTag);

              const disabled = !target || error === "tag";

              const buttonRingColor = error === "tag" ? "ring-red-400" : "ring-zinc-300";

              const activate = () => handleActivateElement(item.targetTag);

              const labelValue = `${rangesValues[index]} ${ranges[index]?.unit || ""}`;

              const id = `range-${index}`;

              return (
                <Item key={item.label}>
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
                    <div>
                      <ActivateButton
                        activate={activate}
                        buttonColor={buttonRingColor}
                        error={error}
                        disabled={disabled}
                      />
                      <ResetButton onClick={resetStyles} />
                    </div>
                  </Field>
                </Item>
              );
            })}
          {checkboxes &&
            checkboxes.map((item, index) => {
              const error = errors.find((error) => error.tag === item.targetTag)?.error;

              const target = targets.find((target) => target?.tag === item.targetTag);

              const resetStyles = () => handleReset(item.targetTag);

              const disabled = !target || error === "tag";

              const buttonRingColor = error === "tag" ? "ring-red-400" : "ring-zinc-300";

              const activate = () => handleActivateElement(item.targetTag);

              const id = `range-${index}`;

              return (
                <Item key={item.label}>
                  <Label id={id}>{item.label}</Label>
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
                    <ResetButton onClick={resetStyles} />
                  </Field>
                </Item>
              );
            })}
          {radios &&
            radios.map((item, index) => {
              const error = errors.find((error) => error.tag === item.targetTag)?.error;

              const target = targets.find((target) => target?.tag === item.targetTag);

              const resetStyles = () => handleReset(item.targetTag);

              const disabled = !target || error === "tag";

              const buttonRingColor = error === "tag" ? "ring-red-400" : "ring-zinc-300";

              const activate = () => handleActivateElement(item.targetTag);

              const id = `range-${index}`;

              return (
                <Item key={item.label} className="py-1">
                  <Label id={id}>{item.label}</Label>
                  <Field>
                    {radiosOptions?.[index]?.map((option) => {
                      return (
                        <div key={option.label}>
                          <Radio
                            name={id}
                            id={option.label}
                            value={option.value}
                            onChange={(e) => radioOnChange(e, index, item.property)}
                            disabled={disabled}
                            selected={option.checked}
                          />
                        </div>
                      );
                    })}

                    <ActivateButton
                      activate={activate}
                      buttonColor={buttonRingColor}
                      error={error}
                      disabled={disabled}
                    />
                    <ResetButton onClick={resetStyles} />
                  </Field>
                </Item>
              );
            })}
        </Body>
      </Container>
    </>
  );
};

const ResetButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 h-fit horizontal center gap-3 bg-zinc-100 hover:bg-zinc-50 rounded-sm ring-2 ring-zinc-300"
    >
      <RotateCcw className="h-5 w-5 text-zinc-500" />
    </button>
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
      className={`bg-zinc-200 m-2 mx-4 rounded-md ring-1 ring-stone-300 shadow-sm shadow-stone-500/90 ${className}`}
      {...rest}
    >
      {children}
    </div>
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
  value?: string;
};

interface RangeProps extends React.HTMLProps<HTMLInputElement> {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Range = ({ ...rest }: RangeProps) => {
  return <input type="range" {...rest} className="max-w-[65%]" />;
};

interface CheckboxProps extends React.HTMLProps<HTMLInputElement> {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({ ...rest }: CheckboxProps) => {
  return (
    <div className="horizontal center gap-3">
      <label className={`checkbox-label ${rest.disabled ? "cursor-not-allowed" : "cursor-pointer"} `}>
        <input {...rest} type="checkbox" />
        <div className="transition"></div>
      </label>
      <LabelValue>{rest.value}</LabelValue>
    </div>
  );
};

interface RadioProps extends React.HTMLProps<HTMLInputElement> {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  selected?: boolean | undefined;
}

const Radio = ({ selected, ...rest }: RadioProps) => {
  return (
    <div className="vertical center gap-3">
      <label className={`checkbox-label ${rest.disabled ? "cursor-not-allowed" : "cursor-pointer"} `}>
        <input {...rest} type="radio" />
        <div className="transition"></div>
      </label>
      <LabelValue selected={selected || false}>{rest.value}</LabelValue>
    </div>
  );
};

const LabelValue = ({ children, selected }: { children: React.ReactNode; selected?: boolean }) => {
  const highlightColor = selected ? "ring-1 ring-stone-400" : "";
  return (
    <span className={`inline-block horizontal center text-xs tabular-nums py-1 px-2 rounded-md ${highlightColor}`}>
      {children}
    </span>
  );
};

const Label = ({ children, id, value }: LabelProps) => {
  return (
    <label
      className="horizontal items-center justify-between px-3 py-2 pt-3 text-sm font-semibold text-stone-600"
      htmlFor={id}
    >
      {children}
      {value && <LabelValue>{value}</LabelValue>}
    </label>
  );
};

const Field = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="horizontal justify-between items-center w-full h-fit px-3 py-2 gap-3 flex-wrap">{children}</div>
  );
};

const ActivateButton = ({ activate, buttonColor, error, disabled }: ActivateButtonProps) => {
  const color = error === "tag" ? "red" : disabled ? "grey" : "green";

  return (
    <button
      className={`px-3 py-1 h-fit horizontal center gap-3 ${buttonColor} bg-zinc-100 hover:bg-zinc-50 rounded-sm ring-2`}
      onClick={activate}
    >
      <Power className={`h-5 w-5 text-${color}-600`} />
    </button>
  );
};

const debugMsgs = {
  info: {
    color: "blue",
    prefix: "[INFO]",
    type: {
      tag: (tag: string) => `already activated ${tag}`,
      reset: (tag: string) => `${tag} not activated`,
    },
    icon: <Info className="h-4 w-4" />,
  },
  success: {
    color: "green",
    prefix: "[SUCCESS]",
    type: {
      tag: (tag: string) => `${tag} activated`,
      reset: (tag: string) => `${tag} reset`,
    },
    icon: <CircleCheck className="h-4 w-4" />,
  },
  warn: {
    color: "orange",
    prefix: "[WARN]",
    icon: <CircleAlert className="h-4 w-4" />,
  },
  error: {
    color: "red",
    prefix: "[ERROR]",
    type: {
      tag: (tag: string) => `${tag} not found`,
    },
    icon: <CircleAlert className="h-4 w-4" />,
  },
};

type LogInfoProps = {
  errors: { tag: string; error: false | "tag" }[];
  success: { tag: string; success: false | "tag" | "reset" }[];
  infos: { tag: string; info: false | "tag" | "reset" }[];
  reset: {
    info: () => void;
    success: () => void;
    error: () => void;
  };
};

const LogEvent = ({ errors, infos, success, reset }: LogInfoProps) => {
  const [displayed, setDisplayed] = useState<string>("");
  const [type, setType] = useState<("info" | "success" | "warn" | "error") & keyof typeof debugMsgs>("info");

  // ERRORS
  // --

  useEffect(() => {
    const idxErr = errors.findIndex((error) => error.error);

    if (idxErr === -1) return;

    setType("error");
    const error = errors[idxErr];
    if (error && error.error === "tag") {
      const msg = `${debugMsgs.error.type.tag(error.tag)}`;
      setDisplayed(msg);
    }

    const timeoutId = setTimeout(() => {
      setDisplayed("");
      clearTimeout(timeoutId);
      reset.error();
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
      reset.error();
    };
  }, [errors]);

  // INFOS
  // --

  useEffect(() => {
    const idxInfo = infos.findIndex((info) => info.info);

    if (idxInfo === -1) return;

    setType("info");
    const info = infos[idxInfo];

    if (info && info.info) {
      const msg = `${debugMsgs.info.type[info.info](info.tag)}`;
      setDisplayed(msg);
    }

    const timeoutId = setTimeout(() => {
      setDisplayed("");
      clearTimeout(timeoutId);
      reset.info();
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
      reset.info();
    };
  }, [infos]);

  // SUCCESS
  // --

  useEffect(() => {
    const idxSuccess = success.findIndex((success) => success.success);

    if (idxSuccess === -1) return;

    setType("success");
    const successMsg = success[idxSuccess];
    if (successMsg && successMsg.success) {
      const msg = `${debugMsgs.success.type[successMsg.success](successMsg.tag)}`;
      setDisplayed(msg);
    }

    const timeoutId = setTimeout(() => {
      setDisplayed("");
      clearTimeout(timeoutId);
      reset.success();
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
      reset.success();
    };
  }, [success]);

  return (
    <div className="text-xs font-semibold ps-1">
      {displayed && (
        <div className={`horizontal center text-${debugMsgs[type].color}-600 gap-1 log`}>
          {debugMsgs[type].icon}
          <div className="translate-y-[2px]">{displayed}</div>
        </div>
      )}
    </div>
  );
};

type HeaderProps = {
  classNames?: string;
  children: React.ReactNode;
};

const Header = ({ children, classNames }: HeaderProps) => {
  return (
    <>
      <div className={`w-full h-fit py-1 px-1 horizontal items-center justify-between rounded-sm ${classNames}`}>
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
    <aside className={`fixed absolute-align w-fit h-fit mt-5 ml-5 rounded-sm z-50 ${className}`}>{children}</aside>
  );
};

const Body = ({ children, className }: { children: React.ReactNode; className: string }) => {
  return <div className={`py-2 ${className}`}>{children}</div>;
};

export default DebugPanel;
