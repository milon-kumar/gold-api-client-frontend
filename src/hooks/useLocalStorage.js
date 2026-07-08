import { useState } from "react";

export const useLocalStorage = (key, initialValue = null) => {

    const readValue = () => {
        try {
            const item = window.localStorage.getItem(key);

            if (!item) return initialValue;

            try {
                return JSON.parse(item);
            } catch {
                // if not JSON return raw value
                return item;
            }

        } catch (error) {
            console.error("LocalStorage read error:", error);
            return initialValue;
        }
    };

    const [storedValue, setStoredValue] = useState(readValue);

    const setValue = (value) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            console.log("Saving", key, valueToStore);
            setStoredValue(valueToStore);

            window.localStorage.setItem(key, JSON.stringify(valueToStore));

        } catch (error) {
            console.error("LocalStorage write error:", error);
        }
    };

    const remove = () => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(null);
        } catch (error) {
            console.error("LocalStorage remove error:", error);
        }
    };

    return [storedValue, setValue, remove];
};
