import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

// The two allowed values for our theme - keeps things type-safe
// instead of allowing any arbitrary string
type Theme = 'light' | 'dark';

// Shape of the data/functions our context will expose to consumers
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

// Key used to persist the theme choice in localStorage across page reloads
const THEME_KEY = 'ims_theme';

// Create the context with an initial value of `undefined`.
// We use `undefined` (rather than a fake default) so we can detect
// if someone tries to use this context outside of a ThemeProvider.
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Figures out what theme to start with when the app first loads
const getInitialTheme = (): Theme => {
  // Guard for server-side rendering (SSR) - `window` doesn't exist on the server,
  // so default to 'light' to avoid crashing
  if (typeof window === 'undefined') {
    return 'light';
  }

  // Check localStorage for a previously saved theme
  const storedTheme = localStorage.getItem(THEME_KEY);

  // Only trust the stored value if it's exactly 'dark', otherwise fall back to 'light'
  return storedTheme === 'dark' ? 'dark' : 'light';
};

// The provider component - wraps part (or all) of the app and gives
// every descendant component access to the theme state via context
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // The actual state lives here, initialized lazily using getInitialTheme
  // (passing a function to useState means it only runs once, on mount)
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Side effect that runs whenever `theme` changes
  useEffect(() => {
    // Toggle the 'dark' class on the <html> element - this is what
    // lets CSS/Tailwind dark-mode styles kick in
    document.documentElement.classList.toggle('dark', theme === 'dark');

    // Persist the current theme choice so it survives page reloads
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Function to flip between light and dark themes
  // Wrapped in useCallback so the function reference stays stable
  // across re-renders (avoids unnecessary re-renders of consumers)
  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  // Bundle the state and updater function into one object.
  // useMemo ensures this object is only recreated when theme or
  // toggleTheme actually change, rather than on every render
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  // Provide the value to all descendant components in the tree
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Custom hook for consuming the theme context.
// This is the API components will actually use, e.g. `const { theme } = useTheme();`
export const useTheme = () => {
  const context = useContext(ThemeContext);

  // If context is undefined, it means this hook was called outside
  // of a <ThemeProvider> - throw an error early to catch bugs
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};