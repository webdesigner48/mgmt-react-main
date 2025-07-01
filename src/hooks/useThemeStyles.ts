// hooks/useThemeStyles.ts
import { useTheme } from '../contexts/ThemeContext';

export const useThemeStyles = () => {
  const { theme } = useTheme();
  
  return {
    // Helper functions for common style patterns
    getButtonStyles: (variant: 'primary' | 'secondary' = 'primary') => ({
      backgroundColor: variant === 'primary' 
        ? theme.colors.interactive.primary 
        : theme.colors.interactive.secondary,
      color: variant === 'primary' 
        ? theme.colors.text.inverse 
        : theme.colors.text.primary,
      border: `1px solid ${theme.colors.border.primary}`,
      borderRadius: theme.borderRadius.medium,
      boxShadow: theme.shadows.small,
    }),
    
    getCardStyles: () => ({
      backgroundColor: theme.colors.card,
      color: theme.colors.text.primary,
      border: `1px solid ${theme.colors.border.primary}`,
      borderRadius: theme.borderRadius.medium,
      boxShadow: theme.shadows.medium,
    }),
    
    getSidebarStyles: () => ({
      backgroundColor: theme.colors.sidebar.background,
      color: theme.colors.sidebar.text,
      borderRight: `1px solid ${theme.colors.sidebar.border}`,
    }),
    
    // Add glass-specific styles
    getGlassStyles: () => ({
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    }),
  };
};