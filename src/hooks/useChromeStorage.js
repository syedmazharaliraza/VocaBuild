/* global chrome */

import { useEffect, useState } from "react";

const useChromeStorage = (key, initialValue) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    chrome?.storage?.local.get(key, ({ [key]: storedValue }) => {
      if (storedValue !== undefined) {
        setValue(storedValue);
      }
    });
  }, [key]);

  const setChromeStorageValue = (newValue) => {
    chrome?.storage?.local.set({ [key]: newValue });
    setValue(newValue);
  };

  return [value, setChromeStorageValue];
};

export default useChromeStorage;
