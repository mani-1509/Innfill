"use client";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <button
      className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-light transition"
      onClick={() => setIsDark((d) => !d)}
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
