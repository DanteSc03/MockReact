import { useState, useEffect } from 'react';

const getLocalValue = (key, initValue) => {
    // SSR check for Next.js
    if (typeof window === 'undefined') return initValue;

    try {
        const item = localStorage.getItem(key);
        // If item exists, try to parse it
        return item ? JSON.parse(item) : initValue;
    } catch (error) {
        console.error("Error parsing localStorage item:", error);
        return initValue; // Return the initial value in case of an error
    }
}

const useLocalStorage = (key, initValue) => {
    const [value, setValue] = useState(() => getLocalValue(key, initValue));

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error setting localStorage item:", error);
        }
    }, [key, value]);

    return [value, setValue];
}

export default useLocalStorage;
