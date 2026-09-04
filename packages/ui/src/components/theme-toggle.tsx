import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./button.js";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  }

  return (
    <Button
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      onClick={toggleTheme}
      size="icon"
      variant="outline"
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
