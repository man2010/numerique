"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("sos-theme", theme);
  window.dispatchEvent(new CustomEvent<Theme>("sos-theme-change", { detail: theme }));
}

export function ThemeRuntime() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("sos-theme") as Theme | null;
    const theme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
  }, []);

  return null;
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(current);
    const syncTheme = (event: Event) => setTheme((event as CustomEvent<Theme>).detail);
    window.addEventListener("sos-theme-change", syncTheme);
    return () => window.removeEventListener("sos-theme-change", syncTheme);
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";

  return <button className={`theme-toggle ${className}`.trim()} type="button" onClick={() => { applyTheme(nextTheme); setTheme(nextTheme); }} aria-label={`Activer le thème ${nextTheme === "dark" ? "sombre" : "clair"}`} aria-pressed={theme === "dark"} title={`Passer au thème ${nextTheme === "dark" ? "sombre" : "clair"}`}>
    {theme === "dark" ? <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.9 13A8.5 8.5 0 0 1 11 3.1 8.5 8.5 0 1 0 20.9 13Z"/></svg>}
  </button>;
}
