import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light theme' : 'Dark theme'}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};
