import { Theme } from '../types/theme';
export const lightTheme: Theme = {
  name: 'Light',
  colors: {
    primary: '#f5f5f5',
    secondary: '#ffffff',
    tertiary: '#e8e8e8',
    background: '#f5f5f5',
    surface: '#ffffff',
    card: '#ffffff',
    
    text: {
      primary: '#2d3748',
      secondary: '#4a5568',
      muted: '#a0aec0',
      inverse: '#ffffff',
    },
    
    border: {
      primary: 'rgba(0, 0, 0, 0.1)',
      secondary: 'rgba(0, 0, 0, 0.05)',
      muted: 'rgba(0, 0, 0, 0.03)',
    },
    
    success: '#38a169',
    warning: '#d69e2e',
    error: '#e53e3e',
    info: '#3182ce',
    
    interactive: {
      primary: '#3182ce',
      primaryHover: '#2c5aa0',
      secondary: '#e8e8e8',
      secondaryHover: '#d0d0d0',
      disabled: '#a0aec0',
    },
    
    sidebar: {
      background: '#f0f0f0',
      text: '#2d3748',
      textSecondary: '#4a5568',
      border: 'rgba(0, 0, 0, 0.1)',
      itemHover: 'rgba(0, 0, 0, 0.05)',
      itemActive: 'rgba(0, 0, 0, 0.08)',
    },
  },
  
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.06)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.08)',
    large: '0 8px 24px rgba(0, 0, 0, 0.1)',
  },
  
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
  },
};