import React, { createContext, useState, useEffect, useContext } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

type DarkModeContextType = {
  isDarkMode: boolean;
  themeMode: ThemeMode;
  toggleDarkMode: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  applyThemeClass: (immediate?: boolean) => void;
};

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

// Add CSS to head for smooth transitions
const addTransitionStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    html.transitioning * {
      transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease, fill 0.5s ease, stroke 0.5s ease !important;
    }
  `;
  document.head.appendChild(style);
};

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  // Initialize transition styles
  useEffect(() => {
    addTransitionStyles();
  }, []);

  // Setup system preference media query
  useEffect(() => {
    const isDarkOS = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check if theme preference is stored
    const storedThemeMode = localStorage.getItem('themeMode') as ThemeMode || 'system';
    setThemeMode(storedThemeMode);
    
    // Determine if dark mode should be active
    let shouldBeDark = false;
    if (storedThemeMode === 'system') {
      shouldBeDark = isDarkOS;
    } else {
      shouldBeDark = storedThemeMode === 'dark';
    }
    
    setIsDarkMode(shouldBeDark);
    applyThemeClass(true)(shouldBeDark);
    
    // Listen for OS theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (themeMode === 'system') {
        setIsDarkMode(e.matches);
        applyThemeClass()(e.matches);
      }
    };
    
    // Add event listener for theme changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Older browsers support
      mediaQuery.addListener(handleChange);
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Older browsers support
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Apply theme with transition
  const applyThemeClass = (immediate = false) => (dark: boolean) => {
    if (!immediate) {
      document.documentElement.classList.add('transitioning');
    }
    
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    if (!immediate) {
      // Remove transition class after animation completes
      setTimeout(() => {
        document.documentElement.classList.remove('transitioning');
      }, 500);
    }
  };

  const toggleDarkMode = () => {
    const newThemeMode = isDarkMode ? 'light' : 'dark';
    updateTheme(newThemeMode);
  };

  const updateTheme = (newMode: ThemeMode) => {
    setThemeMode(newMode);
    localStorage.setItem('themeMode', newMode);
    
    let newDarkMode: boolean;
    if (newMode === 'system') {
      const isOSDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      newDarkMode = isOSDark;
    } else {
      newDarkMode = newMode === 'dark';
    }
    
    setIsDarkMode(newDarkMode);
    applyThemeClass()(newDarkMode);
  };

  return (
    <DarkModeContext.Provider value={{ 
      isDarkMode, 
      themeMode, 
      toggleDarkMode, 
      setThemeMode: updateTheme,
      applyThemeClass
    }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = (): DarkModeContextType => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}; 