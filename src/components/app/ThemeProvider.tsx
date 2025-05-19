
import { ReactNode, useEffect, useState } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return { theme, toggleTheme };
};

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme } = useTheme();
  
  return (
    <div className={theme}>
      {children}
    </div>
  );
};

export default ThemeProvider;
