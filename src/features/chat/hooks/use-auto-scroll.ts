import { useEffect, useRef } from "react";

export function useAutoScroll<T>(dependency: T) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight;
    }
  }, [dependency]);

  return containerRef;
}