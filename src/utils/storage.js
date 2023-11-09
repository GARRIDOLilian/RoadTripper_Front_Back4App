import { useState, useEffect, useReducer } from 'react';

// TODO: Switch la local storage if "Remember me" is checked
export const useStateWithSessionStorage = (storageKey, defaultValue = null) => {
  const [value, setValue] = useState(
    JSON.parse(sessionStorage.getItem(storageKey)) || defaultValue
  );

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);
  return [value, setValue];
};

export const useStateWithLocalStorage = (storageKey, defaultValue = null) => {
  const [value, setValue] = useState(
    JSON.parse(localStorage.getItem(storageKey)) || defaultValue
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);
  return [value, setValue];
};

export const useReducerWithSessionStorage = (
  storageKey,
  reducer,
  defaultValue
) => {
  const [value, dispatch] = useReducer(
    reducer,
    JSON.parse(sessionStorage.getItem(storageKey)) || defaultValue
  );

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);
  return [value, dispatch];
};

export const useStateWithDynamicStorage = (useLocalStorage, storageKey) => {
  const [value, setValue] = useState(
    JSON.parse(
      useLocalStorage
        ? localStorage.getItem(storageKey)
        : sessionStorage.getItem(storageKey)
    )
  );

  useEffect(() => {
    if (useLocalStorage) {
      localStorage.setItem(storageKey, JSON.stringify(value));
      sessionStorage.removeItem(storageKey);
    } else {
      sessionStorage.setItem(storageKey, JSON.stringify(value));
      localStorage.removeItem(storageKey);
    }
  }, [value, storageKey, useLocalStorage]);
  return [value, setValue];
};
