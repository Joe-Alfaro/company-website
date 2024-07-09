"use client";
import { useCallback, useEffect, useState } from "react";
import css from "./styles.module.css";

export default function Path() {
  const [isVisible, setIsVisible] = useState(false);

  const handleResize = useCallback(() => {
    if (typeof window !== "undefined") {
      setIsVisible(window.innerWidth >= 1420);
    }
  }, []);

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  if (!isVisible) {
    return null;
  }

  return (
    <svg
      className={css.path}
      width="1437"
      height="2150"
      viewBox="0 0 1437 2150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M74 0V355C74 378.196 92.804 397 116 397H1307.08C1330.63 397 1349.58 416.365 1349.07 439.913L1342.89 723.913C1342.4 746.748 1323.74 765 1300.9 765H43C19.804 765 1 783.804 1 807V1142C1 1165.2 19.804 1184 43 1184H1394C1417.2 1184 1436 1202.8 1436 1226V1704C1436 1727.2 1417.2 1746 1394 1746H59C35.804 1746 17 1764.8 17 1788V2036C17 2059.2 35.804 2078 59 2078H675C698.196 2078 717 2096.8 717 2120V2150"
        stroke="#A8A8A8"
        strokeWidth="2"
        strokeDasharray="2 3"
      />
    </svg>
  );
}
