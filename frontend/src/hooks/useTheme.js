import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// موفر الثيم
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // محاولة تحميل الثيم من localStorage
    const savedTheme = localStorage.getItem("app-theme");
    if (savedTheme) {
      return JSON.parse(savedTheme);
    }

    // الثيم الافتراضي
    return {
      primaryColor: "#1a3a6c",
      secondaryColor: "#e9b949",
      backgroundColor: "#f8f9fa",
      textColor: "#333333",
      fontFamily: "Tajawal, sans-serif",
      fontSize: "medium",
      themeMode: "light",
    };
  });

  useEffect(() => {
    // حفظ الثيم في localStorage عند التغيير
    localStorage.setItem("app-theme", JSON.stringify(theme));

    // تطبيق الثيم على عناصر CSS المخصصة
    document.documentElement.style.setProperty(
      "--primary-color",
      theme.primaryColor
    );
    document.documentElement.style.setProperty(
      "--secondary-color",
      theme.secondaryColor
    );
    document.documentElement.style.setProperty(
      "--bg-color",
      theme.backgroundColor
    );
    document.documentElement.style.setProperty("--text-color", theme.textColor);

    // تطبيق نمط الثيم (فاتح/داكن)
    if (theme.themeMode === "dark") {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [theme]);

  const updateTheme = (newTheme) => {
    setTheme((prev) => ({ ...prev, ...newTheme }));
  };

  const value = {
    theme,
    updateTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
