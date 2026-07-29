// hooks/useSlider.js
import { useState, useEffect, useCallback, useRef } from "react";

export const useSlider = ({
    total,
    autoplay = true,
    interval = 3000,
    infinite = true,
    initialIndex = 0
}) => {
    const [index, setIndex] = useState(initialIndex);
    const timerRef = useRef(null);

    const next = useCallback(() => {
        if (infinite) {
            setIndex((prev) => (prev + 1) % total);
        } else {
            setIndex((prev) => Math.min(prev + 1, total - 1));
        }
    }, [total, infinite]);

    const prev = useCallback(() => {
        if (infinite) {
            setIndex((prev) => (prev - 1 + total) % total);
        } else {
            setIndex((prev) => Math.max(prev - 1, 0));
        }
    }, [total, infinite]);

    const setIndexDirect = useCallback((newIndex) => {
        if (newIndex >= 0 && newIndex < total) {
            setIndex(newIndex);
        }
    }, [total]);

    useEffect(() => {
        if (autoplay && total > 1) {
            timerRef.current = setInterval(next, interval);
            return () => clearInterval(timerRef.current);
        }
    }, [autoplay, interval, next, total]);

    return {
        index,
        next,
        prev,
        setIndex: setIndexDirect,
        total
    };
};