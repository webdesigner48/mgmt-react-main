// themes/blueTheme.ts (or customTheme.ts)
import { Theme } from '../types/theme';

export const glassTheme: Theme = {
  name: 'Glass',
  colors: {
    primary: 'rgba(255, 255, 255, 0.1)',
    secondary: 'rgba(255, 255, 255, 0.15)',
    tertiary: 'rgba(255, 255, 255, 0.2)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    surface: 'rgba(255, 255, 255, 0.1)',
    card: 'rgba(255, 255, 255, 0.1)',
    
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.9)',
      muted: 'rgba(255, 255, 255, 0.7)',
      inverse: '#2d3748',
    },
    
    border: {
      primary: 'rgba(255, 255, 255, 0.3)',
      secondary: 'rgba(255, 255, 255, 0.2)',
      muted: 'rgba(255, 255, 255, 0.1)',
    },
    
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    
    interactive: {
      primary: 'rgba(255, 255, 255, 0.2)',
      primaryHover: 'rgba(255, 255, 255, 0.3)',
      secondary: 'rgba(255, 255, 255, 0.1)',
      secondaryHover: 'rgba(255, 255, 255, 0.15)',
      disabled: 'rgba(255, 255, 255, 0.05)',
    },
    
    sidebar: {
      background: 'rgba(255, 255, 255, 0.1)',
      text: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.9)',
      border: 'rgba(255, 255, 255, 0.2)',
      itemHover: 'rgba(255, 255, 255, 0.1)',
      itemActive: 'rgba(255, 255, 255, 0.15)',
    },
  },
  
  shadows: {
    small: '0 4px 16px rgba(31, 38, 135, 0.1)',
    medium: '0 8px 32px rgba(31, 38, 135, 0.2)',
    large: '0 8px 32px rgba(31, 38, 135, 0.37)',
  },
  
  borderRadius: {
    small: '6px',
    medium: '10px',
    large: '16px',
  },
};