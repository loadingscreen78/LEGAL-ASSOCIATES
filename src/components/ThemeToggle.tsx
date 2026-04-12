
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine icon color based on scroll state and theme
  const getIconColor = () => {
    if (isScrolled) {
      // When scrolled: dark mode = white, light mode = dark
      return isDark ? '#FFFFFF' : '#2D3E50';
    } else {
      // When not scrolled: always white (navbar is dark in both themes)
      return '#FFFFFF';
    }
  };

  const getBackgroundColor = () => {
    if (isScrolled) {
      return isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(45, 62, 80, 0.1)';
    } else {
      return 'rgba(255, 255, 255, 0.1)';
    }
  };

  const getBorderColor = () => {
    if (isScrolled) {
      return isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(45, 62, 80, 0.2)';
    } else {
      return 'rgba(255, 255, 255, 0.2)';
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-9 h-9 rounded-full transition-all duration-300 hover:scale-110"
      style={{ 
        color: getIconColor(),
        background: getBackgroundColor(),
        border: `1px solid ${getBorderColor()}`
      }}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
