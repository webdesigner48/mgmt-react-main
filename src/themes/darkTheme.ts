// themes/darkTheme.ts
import { Theme } from '../types/theme';

export const darkTheme: Theme = {
  name: 'Dark',
  colors: {
    primary: '#0a0a0a',
    secondary: '#1a1a1a',
    tertiary: '#2a2a2a',
    background: '#0a0a0a',
    surface: '#1a1a1a',
    card: '#1a1a1a',
    
    text: {
      primary: '#ffffff',
      secondary: '#e0e0e0',
      muted: '#808080',
      inverse: '#0a0a0a',
    },
    
    border: {
      primary: 'rgba(255, 255, 255, 0.1)',
      secondary: 'rgba(255, 255, 255, 0.05)',
      muted: 'rgba(255, 255, 255, 0.03)',
    },
    
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    
    interactive: {
      primary: '#60a5fa',
      primaryHover: '#3b82f6',
      secondary: '#2a2a2a',
      secondaryHover: '#404040',
      disabled: '#4a4a4a',
    },
    
    sidebar: {
      background: '#151515',
      text: '#ffffff',
      textSecondary: '#e0e0e0',
      border: 'rgba(255, 255, 255, 0.1)',
      itemHover: 'rgba(255, 255, 255, 0.05)',
      itemActive: 'rgba(255, 255, 255, 0.1)',
    },
  },
  
  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.4)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.6)',
    large: '0 8px 32px rgba(0, 0, 0, 0.8)',
  },
  
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
  },
};