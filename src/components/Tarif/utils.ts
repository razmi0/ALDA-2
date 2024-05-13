const getFromLS = (key: string) => {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(key);
};

const setToLS = (key: string, value: string): null | void => {
  if (typeof window === "undefined") {
    return null;
  }
  localStorage.setItem(key, value);
};

export { getFromLS, setToLS };
