import type { ComplexProduct, Product, ProductData } from "@/components/shared/product-data/types";
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

type HandleIntersectionOptions = {
  debug?: boolean;
  debugLog?: string;
  onIntersect: () => void;
  onDisappear: () => void;
};

const handleIntersection = (entries: IntersectionObserverEntry[], options: HandleIntersectionOptions) => {
  const { debug = isDev, debugLog, onIntersect, onDisappear } = options;
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      debug && console.log(`Element ${debugLog} is intersecting`);
      onIntersect();
    } else {
      onDisappear();
      debug && console.log(`Element ${debugLog} is not intersecting`);
    }
  });
};

type SetupObserverProps = {
  debug?: boolean;
  debugLog?: string;
  threshold?: number;
  onIntersect?: () => void;
  onDisappear?: () => void;
};

const voidCb = () => {};

const setupIntersectionObserver = (
  element: HTMLElement,
  { debug = isDev, debugLog = "", threshold = 0.5, onIntersect = voidCb, onDisappear = voidCb }: SetupObserverProps
) => {
  const options = { debug, debugLog, onIntersect, onDisappear };
  const observer = new IntersectionObserver((entry) => handleIntersection(entry, options), {
    threshold: threshold,
  });

  observer.observe(element);
};

const securePath = (e: Event, allowedPath: string[]) => {
  const path = (e.target as Window).location.pathname as string;
  if (!allowedPath.includes(path)) return false;
  return true;
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * @description Filter available products
 * - simpleProducts: products that doesn't contain data
 * - complexProducts: extends the simpleProducts with data
 */
const buildProducts = (data: ProductData): { simpleProducts: Product[]; complexProducts: ComplexProduct[] } => {
  const { poles, products } = data;
  const availableProducts = products.filter((p) => poles.available.includes(p.id));
  const simpleProducts = availableProducts.filter((p) => poles.simple.includes(p.id));
  const complexProducts = availableProducts.filter((p) => poles.complex.includes(p.id)) as ComplexProduct[];
  return { simpleProducts, complexProducts };
};

export {
  capitalize,
  cn,
  credibilyScore,
  generateLorem,
  getFromLS,
  hasProp,
  isDev,
  needDOM,
  securePath,
  setToLS,
  setupIntersectionObserver,
  buildProducts,
};
