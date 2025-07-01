// components/ThemeToggle.tsx - Simplified for your 3 themes
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeName } from '../types/theme';

// Simple theme toggle that just exports the hook usage
export const useThemeToggle = () => {
  const { themeName, setTheme } = useTheme();
  
  const handleThemeChange = (theme: ThemeName) => {
    setTheme(theme);
  };
  
  return {
    currentTheme: themeName,
    setTheme: handleThemeChange,
  };
};

// If you need a simple button component
export const ThemeToggleButton: React.FC<{ className?: string }> = ({ className }) => {
  const { themeName, toggleTheme } = useTheme();
  
  return (
    <button
      className={className}
      onClick={toggleTheme}
      aria-label={`Current theme: ${themeName}`}
    >
      Theme: {themeName}
    </button>
  );
};