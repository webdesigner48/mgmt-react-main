export interface Theme {
  name: string;
  colors: {
    // Background colors
    primary: string;
    secondary: string;
    tertiary: string;
    background: string;
    surface: string;
    card: string;
    
    // Text colors
    text: {
      primary: string;
      secondary: string;
      muted: string;
      inverse: string;
    };
    
    // Border colors
    border: {
      primary: string;
      secondary: string;
      muted: string;
    };
    
    // Status colors
    success: string;
    warning: string;
    error: string;
    info: string;
    
    // Interactive colors
    interactive: {
      primary: string;
      primaryHover: string;
      secondary: string;
      secondaryHover: string;
      disabled: string;
    };
    
    // Sidebar specific
    sidebar: {
      background: string;
      text: string;
      textSecondary: string;
      border: string;
      itemHover: string;
      itemActive: string;
    };
  };
  
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
  
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
}

// Fixed to match your actual themes: light, dark, glass
export type ThemeName = 'light' | 'dark' | 'glass';

// Type guard for theme names
export const isValidThemeName = (value: string): value is ThemeName => {
  return ['light', 'dark', 'glass'].includes(value);
};

// Helper type for theme colors
export type ThemeColors = Theme['colors'];

