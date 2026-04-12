
import { useTheme } from '@/contexts/ThemeContext';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface AnimatedLogoProps {
  isScrolled?: boolean;
}

export const AnimatedLogo = ({ isScrolled = false }: AnimatedLogoProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();
  
  // Hide text on login and signup pages
  const hideText = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/verify-email';

  // Determine text color based on scroll state and theme
  const getTextColor = () => {
    if (isScrolled) {
      // When scrolled: dark mode = white, light mode = dark navy
      return isDark ? '#FFFFFF' : '#2D3E50';
    } else {
      // When not scrolled: always white (navbar is dark in both themes)
      return '#FFFFFF';
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="relative group">
        {/* LA Logo - PNG image with filter to make it visible */}
        <div className="transform-gpu transition-all duration-500 hover:scale-110">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, #2D3E50 0%, #101820 100%)',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
              border: '2px solid #D4AF37'
            }}
          >
            <img 
              src="/logo.png" 
              alt="Legal Associates Logo" 
              className="w-10 h-10 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
        </div>
        
        {/* Glow effect on hover */}
        <div className="absolute -inset-2 bg-[#D4AF37]/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
      </div>
      
      {/* Animated Text - Hidden on login/signup pages */}
      {!hideText && (
        <div className="logo-text hidden sm:block">
          <h1 
            className="text-xl md:text-2xl font-serif font-bold animate-fade-in transition-colors duration-300"
            style={{ color: getTextColor() }}
          >
            Legal Associates
          </h1>
          <div className="h-0.5 bg-gradient-to-r from-[#D4AF37] to-transparent animate-[slide-in-right_1s_ease-out]"></div>
        </div>
      )}
    </div>
  );
};
