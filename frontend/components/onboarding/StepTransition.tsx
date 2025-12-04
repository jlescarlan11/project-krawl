"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type StepTransitionProps = {
  children: React.ReactNode;
  stepIndex: number;
  direction?: "forward" | "backward";
  className?: string;
};

/**
 * StepTransition component
 *
 * Wraps step content with smooth fade and slide animations.
 * Animates when step changes, with different directions for forward/backward navigation.
 */
export function StepTransition({
  children,
  stepIndex,
  direction = "forward",
  className,
}: StepTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount and step change
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, [stepIndex]);

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-in-out",
        isVisible
          ? "opacity-100 translate-x-0"
          : direction === "forward"
            ? "opacity-0 translate-x-4"
            : "opacity-0 -translate-x-4",
        className
      )}
    >
      {children}
    </div>
  );
}

















