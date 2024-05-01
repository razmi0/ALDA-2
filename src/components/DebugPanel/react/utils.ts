//Array.from({ length: range.length }, (_, i) => range[i]?.value || "0")
export const initArr = <T>(arr: T[], key: keyof T): T[keyof T][] => {
  return Array.from({ length: arr.length }, (_, i) => {
    let val: T[keyof T];
    val = arr[i] && key ? (arr[i]?.[key] as T[keyof T]) : ("0" as T[keyof T]);
    return val;
  });
};
