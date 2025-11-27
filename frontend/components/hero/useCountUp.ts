"use client";

import { useEffect, useRef, useState } from "react";

export function useCountUp(target: number, shouldAnimate: boolean, duration = 1200) {
  const [value, setValue] = useState(shouldAnimate ? 0 : target);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!shouldAnimate) {
      setValue(target);
      return;
    }

    const startValue = 0;
    const range = Math.max(target - startValue, 0);
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(Math.floor(startValue + progress * range));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step);
      }
    };

    animationRef.current = requestAnimationFrame(step);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [target, shouldAnimate, duration]);

  return value;
}

