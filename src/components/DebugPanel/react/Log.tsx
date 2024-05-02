import { CircleAlert, CircleCheck, Info } from "lucide-react";
import { useEffect, useState } from "react";

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

const Log = ({ errors, infos, success, reset }: LogInfoProps) => {
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

export default Log;
