import { useState } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void, () => T, () => void] => {
    const storedValue = localStorage.getItem(key);
    const initial = storedValue ? JSON.parse(storedValue) : initialValue;
    
    const [value, setValue] = useState<T>(initial);
  
    const setValueAndLocalStorage = (newValue: T) => {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    };
  
    const getValueFromLocalStorage = () => {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    };
  
    const removeValueFromLocalStorage = () => {
      localStorage.removeItem(key);
      setValue(initialValue);
    };
  
    return [value, setValueAndLocalStorage, getValueFromLocalStorage, removeValueFromLocalStorage];
  };