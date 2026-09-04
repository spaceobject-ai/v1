import { useEffect, useState } from "react";

const mobileBreakpoint = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>();

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`);
    const updateIsMobile = () => setIsMobile(window.innerWidth < mobileBreakpoint);
    mediaQuery.addEventListener("change", updateIsMobile);
    updateIsMobile();
    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  return Boolean(isMobile);
}
