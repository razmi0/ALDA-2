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
    unobserve?: boolean;
};

const handleIntersection = (
    observer: IntersectionObserver,
    entries: IntersectionObserverEntry[],
    options: HandleIntersectionOptions
) => {
    const { debug = isDev, debugLog, onIntersect, onDisappear, unobserve } = options;
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            debug && console.log(`Element ${debugLog} is intersecting`);
            onIntersect();
            if (unobserve) {
                observer.unobserve(entry.target);
            }
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
    unobserve?: boolean;
};

const voidCb = () => {};

const setupIntersectionObserver = (
    element: HTMLElement,
    {
        debug = isDev,
        debugLog = "",
        threshold = 0.5,
        onIntersect = voidCb,
        onDisappear = voidCb,
        unobserve = true,
    }: SetupObserverProps
) => {
    const options = { debug, debugLog, onIntersect, onDisappear, unobserve };
    const observer = new IntersectionObserver((entry) => handleIntersection(observer, entry, options), {
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

export {
    capitalize,
    cn,
    generateLorem,
    getFromLS,
    hasProp,
    isDev,
    needDOM,
    securePath,
    setToLS,
    setupIntersectionObserver,
};
