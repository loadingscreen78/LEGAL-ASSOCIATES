import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatedLogo } from './AnimatedLogo';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { CartDrawer } from './CartDrawer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Menu, X, LogOut, User, LogIn, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { user, signOut, loading, isAdmin } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/journals', label: 'Journals', icon: '📘' },
    { path: '/books', label: 'Books', icon: '📚' },
    { path: '/founder', label: 'Founder', icon: '⚖️' },
    { path: '/shop', label: 'Shop', icon: '🛍️' },
    { path: '/visit-store', label: 'Visit Store', icon: '📍' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'py-2 backdrop-blur-xl shadow-lg shadow-black/5 border-b' 
            : 'py-4'
        }`}
        style={{
          background: isScrolled 
            ? (isDark ? 'rgba(16, 24, 32, 0.9)' : 'rgba(255, 255, 255, 0.95)') 
            : (isDark ? 'transparent' : 'rgba(45, 62, 80, 0.95)'),
          borderColor: isScrolled ? (isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 0, 0, 0.05)') : 'transparent'
        }}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="relative group">
              <div className="transition-transform duration-300 group-hover:scale-105">
                <AnimatedLogo isScrolled={isScrolled} />
              </div>
              <div className="absolute -inset-2 bg-[#D4AF37]/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="relative"
                >
                  <Button
                    variant="ghost"
                    className="relative px-4 py-2 rounded-full font-medium transition-all duration-300"
                    style={{
                      color: isActive(item.path) 
                        ? '#D4AF37' 
                        : isScrolled 
                          ? (isDark ? '#FFFFFF' : '#2D3E50')
                          : '#FFFFFF'
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <span className="text-sm">{item.icon}</span>
                      {item.label}
                    </span>
                    
                    {/* Active/Hover Indicator */}
                    <span className={`absolute inset-0 rounded-full transition-all duration-300 ${
                      isActive(item.path) 
                        ? 'bg-[#D4AF37]/15' 
                        : hoveredItem === item.path 
                          ? 'bg-[#D4AF37]/10' 
                          : 'bg-transparent'
                    }`} />
                    
                    {/* Bottom Line */}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#D4AF37] rounded-full transition-all duration-300 ${
                      isActive(item.path) ? 'w-6' : 'w-0'
                    }`} />
                  </Button>
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Auth Section */}
              {!loading && (
                <>
                  {user ? (
                    <div className="flex items-center gap-2">
                      {/* User Profile Pill */}
                      <Link to={isAdmin ? '/admin-dashboard' : '/user-dashboard'}>
                        <div 
                          className="flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
                          style={{
                            background: isScrolled 
                              ? (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(45, 62, 80, 0.1)') 
                              : 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(8px)'
                          }}
                        >
                          <div className="relative">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: '#D4AF37', color: '#101820' }}>
                              {(user.email?.charAt(0) || 'U').toUpperCase()}
                            </div>
                            {isAdmin && (
                              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2" style={{ borderColor: isDark ? '#101820' : '#FFFFFF' }} />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span 
                              className="text-sm font-semibold"
                              style={{ color: isScrolled ? (isDark ? '#FFFFFF' : '#2D3E50') : '#FFFFFF' }}
                            >
                              {user.email?.split('@')[0]}
                            </span>
                            <span 
                              className="text-xs"
                              style={{ color: isScrolled ? (isDark ? 'rgba(255,255,255,0.6)' : '#666666') : 'rgba(255,255,255,0.7)' }}
                            >
                              {isAdmin ? 'Admin' : 'Member'}
                            </span>
                          </div>
                          <ChevronRight 
                            className="w-4 h-4" 
                            style={{ color: isScrolled ? (isDark ? 'rgba(255,255,255,0.5)' : '#666666') : 'rgba(255,255,255,0.5)' }} 
                          />
                        </div>
                      </Link>
                      
                      {/* Logout */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSignOut}
                        className="rounded-full hover:bg-red-500/20 hover:text-red-500 transition-colors"
                        style={{ color: isScrolled ? (isDark ? '#FFFFFF' : '#2D3E50') : '#FFFFFF' }}
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Link to="/login">
                      <Button className="h-10 px-6 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#101820] font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#D4AF37]/25">
                        <LogIn className="w-4 h-4 mr-2" />
                        Login
                      </Button>
                    </Link>
                  )}
                </>
              )}
              
              <div 
                className="w-px h-6" 
                style={{ background: isScrolled ? (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)') : 'rgba(255,255,255,0.2)' }} 
              />
              
              <ThemeToggle />
              <CartDrawer />
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle />
              <CartDrawer />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-full"
                style={{ color: isScrolled ? (isDark ? '#FFFFFF' : '#2D3E50') : '#FFFFFF' }}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden absolute top-full left-0 right-0 transition-all duration-500 ${
          isMobileMenuOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
          <div 
            className="backdrop-blur-xl border-b shadow-xl"
            style={{ 
              background: isDark ? 'rgba(16, 24, 32, 0.98)' : 'rgba(255, 255, 255, 0.98)',
              borderColor: isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="animate-slide-up"
                  >
                    <div 
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
                      style={{
                        background: isActive(item.path) ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                        color: isActive(item.path) ? '#D4AF37' : (isDark ? '#FFFFFF' : '#2D3E50')
                      }}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                      {isActive(item.path) && (
                        <div className="ml-auto w-2 h-2 bg-[#D4AF37] rounded-full" />
                      )}
                    </div>
                  </Link>
                ))}
                
                {/* Mobile Auth */}
                {!loading && (
                  <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
                    {user ? (
                      <div className="space-y-3">
                        <Link 
                          to={isAdmin ? '/admin-dashboard' : '/user-dashboard'} 
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div 
                            className="flex items-center gap-3 px-4 py-3 rounded-xl"
                            style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(45, 62, 80, 0.05)' }}
                          >
                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: '#D4AF37', color: '#101820' }}>
                              {(user.email?.charAt(0) || 'U').toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold" style={{ color: isDark ? '#FFFFFF' : '#2D3E50' }}>{user.email?.split('@')[0]}</p>
                              <p className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : '#666666' }}>{isAdmin ? 'Administrator' : 'Member'}</p>
                            </div>
                            <ChevronRight className="w-5 h-5" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#666666' }} />
                          </div>
                        </Link>
                        
                        <Button
                          variant="outline"
                          className="w-full justify-center border-red-500/30 text-red-500 hover:bg-red-500/10"
                          onClick={() => {
                            handleSignOut();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full h-12 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#101820] font-semibold rounded-xl">
                          <LogIn className="w-4 h-4 mr-2" />
                          Login / Sign Up
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
