import { createContext, useContext, useState } from "react";

// أنشئ الـ Context مرة واحدة
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook لاستخدام الـ ThemeContext بسهولة
export const useTheme = () => useContext(ThemeContext);

// تصدير الـ Context إذا احتجنا له في أماكن أخرى
export { ThemeContext };
