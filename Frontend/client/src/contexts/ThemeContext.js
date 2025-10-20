import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('ascend-theme');
    // **THE FIX**: Only accept 'light' or 'dark'. If the saved value is anything else (null, empty, corrupted), default to 'light'.
    return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'light';
  });

  useEffect(() => {
    // Apply theme to the document's root element
    document.documentElement.setAttribute('data-theme', theme);
    // Save the valid theme to local storage
    localStorage.setItem('ascend-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);