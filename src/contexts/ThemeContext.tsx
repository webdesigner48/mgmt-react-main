import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, ThemeName } from '../types/theme';
import { lightTheme } from '../themes/lightTheme';
import { darkTheme } from '../themes/darkTheme';
import { glassTheme } from '../themes/glassTheme';


interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  toggleTheme: () => void;
  setTheme: (themeName: ThemeName) => void;
  availableThemes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Define your 3 themes
const themes: Record<ThemeName, Theme> = {
  light: lightTheme,
  dark: darkTheme,
  glass: glassTheme,
};

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'dark' // Changed default to dark as per your settings
}) => {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    // Check localStorage first
    const saved = localStorage.getItem('theme') as ThemeName | null;
    if (saved && themes[saved]) return saved;
    return defaultTheme;
  });

  const theme = themes[themeName] || themes.dark;
  const availableThemes: ThemeName[] = Object.keys(themes) as ThemeName[];

  // Cycle through available themes
  const toggleTheme = () => {
    const themeOrder: ThemeName[] = ['light', 'dark', 'glass'];
    const currentIndex = themeOrder.indexOf(themeName);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    const nextTheme = themeOrder[nextIndex];
    setThemeName(nextTheme);
  };

  const setTheme = (newThemeName: ThemeName) => {
    if (themes[newThemeName]) {
      setThemeName(newThemeName);
    }
  };

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('theme', themeName);
    
    // Apply theme class to body
    document.body.className = document.body.className.replace(/\b(light|dark|glass)-theme\b/g, '');
    document.body.classList.add(`${themeName}-theme`);
    
    // Apply CSS variables if needed
    const root = document.documentElement;
    
    // Example of applying CSS variables (customize based on your theme structure)
    if (theme.colors) {
      root.style.setProperty('--color-primary', theme.colors.primary);
      root.style.setProperty('--color-background', theme.colors.background);
      // Add more as needed
    }
  }, [theme, themeName]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      themeName, 
      toggleTheme, 
      setTheme, 
      availableThemes 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

