import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * True if DEV env
 */
const isDev = import.meta.env.DEV;

const generateLorem = (length: number): string => {
  let i = length;
  const lorem = (
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam voluptates odit ducimus, " +
    "eos quod nulla commodi minima, maiores illum consectetur itaque quis, quisquam distinctio autem " +
    "ex tenetur perferendis enim. Tempora?"
  ).split(" ");
  let generatedText = "";
  // --
  while (i > 0) {
    generatedText += lorem[(i + Math.floor(Math.random() * 100)) % lorem.length] + " ";
    i--;
  }
  return generatedText.charAt(0).toUpperCase() + generatedText.slice(1).toLowerCase();
};

const needDOM = <T>(selector: string, multiple: { multiple?: boolean | undefined } = { multiple: false }) => {
  const elements = multiple
    ? (Array.from(document.querySelectorAll(selector)) as T[])
    : (document.querySelector(selector) as T);
  if (!elements) throw new Error(`Element not found: ${selector}`);
  return elements as typeof multiple extends { multiple: true } ? T[] : T;
};

const getFromLS = (key: string) => {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(key);
};

const setToLS = (key: string, value: string) => {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(key, value);
};

const regs = {
  tel: {
    fr: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/g,
  },
  email: /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
};

const credibilyScore = (data: { [key: string]: unknown }) => {
  const validEmail = data.email ? regs.email.test(data.email as string) : false;
  const validTel = data.tel ? regs.tel.fr.test(data.tel as string) : false;
  const arr = Object.values(data);
  const rawScore: number = arr.reduce((acc: number, curr: unknown) => (!curr ? acc : acc + 1), 0);
  const percentage = (rawScore * 100) / arr.length;
  return `score : ${percentage.toFixed(2)}, valid-email : ${validEmail}, valid-tel : ${validTel}`;
};

const hasProp = <T extends object, K extends PropertyKey>(
  obj: T,
  prop: K
): obj is Extract<T, { [P in K]?: unknown }> => {
  return prop in obj;
};

export { cn, credibilyScore, generateLorem, getFromLS, hasProp, isDev, needDOM, setToLS };
