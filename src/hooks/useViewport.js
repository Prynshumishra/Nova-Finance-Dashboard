import { useEffect, useState } from "react";

const getViewportWidth = () => {
  if (typeof window === "undefined") {
    return 1440;
  }

  return window.innerWidth;
};

export const useViewportWidth = () => {
  const [width, setWidth] = useState(getViewportWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};
