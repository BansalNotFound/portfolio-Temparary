import React, { useState, useEffect } from "react";
import DesktopApp from "./DesktopApp";
import MobileApp from "./MobileApp";

export default function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <MobileApp /> : <DesktopApp />;
}
