
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatedLogo } from './AnimatedLogo';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { CartDrawer } from './CartDrawer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X, LogOut, User, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { user, signOut, loading, isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/journals', label: '📘 Our Journals' },
    { path: '/books', label: '📚 Our Books' },
    { path: '/founder', label: '🧑‍⚖️ Founder\'s Message' },
    { path: '/shop', label: '🛍️ Shop Now' },
    { path: '/visit-store', label: '📍 Visit Store' },
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
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="hover:scale-105 transition-transform">
              <AnimatedLogo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                      isActive(item.path) 
                        ? 'bg-[#3454D1] text-white font-semibold' 
                        : 'text-foreground hover:text-[#3454D1] hover:bg-[#3454D1]/10'
                    }`}
                  >
                    <span className="relative z-10">{item.label}</span>
                  </Button>
                </Link>
              ))}
              
              {/* Auth Section */}
              {!loading && (
                <div className="flex items-center space-x-2">
                  {user ? (
                    <div className="flex items-center space-x-2">
                      {/* User Profile Display - Clickable */}
                      <Link to={isAdmin ? '/admin-dashboard' : '/user-dashboard'}>
                        <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 hover:border-white/40 transition-all duration-200 cursor-pointer">
                          <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-sm border border-white/30" style={{ color: '#FFFFFF' }}>
                              {(user.email?.charAt(0) || 'U').toUpperCase()}
                            </div>
                            {isAdmin && (
                              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-yellow-400 rounded-full border-2 border-background"></div>
                            )}
                          </div>
                          <div className="flex flex-col min-w-[80px]">
                            <span className="text-xs font-bold truncate" style={{ color: '#FFFFFF' }}>
                              {user.email?.split('@')[0] || 'User'}
                            </span>
                            <span className="text-[10px] font-medium" style={{ color: '#FFFFFF', opacity: 0.8 }}>
                              {isAdmin ? 'Admin' : 'Member'}
                            </span>
                          </div>
                        </div>
                      </Link>
                      
                      {/* Dashboard Button */}
                      <Link to={isAdmin ? '/admin-dashboard' : '/user-dashboard'}>
                        <Button
                          size="sm"
                          className="bg-white text-black hover:bg-white/90 font-semibold"
                        >
                          Dashboard
                        </Button>
                      </Link>
                      
                      {/* Logout Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                        className="hover:text-red-400 hover:bg-red-500/20 font-medium"
                        style={{ color: '#FFFFFF' }}
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Link to="/login">
                      <Button
                        size="sm"
                        className="bg-white text-black hover:bg-white/90 font-semibold"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Login
                      </Button>
                    </Link>
                  )}
                </div>
              )}
              
              <ThemeToggle />
              <CartDrawer />
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <ThemeToggle />
              <CartDrawer />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-foreground"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-border">
              <div className="flex flex-col space-y-2 mt-4">
                {navItems.map((item) => (
                  <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        isActive(item.path) 
                          ? 'bg-[#3454D1] text-white' 
                          : 'text-foreground hover:text-[#3454D1] hover:bg-[#3454D1]/10'
                      }`}
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
                
                {/* Mobile Auth Section */}
                {!loading && (
                  <div className="pt-3 border-t border-white/20 mt-3">
                    {user ? (
                      <div className="space-y-2">
                        {/* Mobile User Profile Card - Clickable */}
                        <Link to={isAdmin ? '/admin-dashboard' : '/user-dashboard'} onClick={() => setIsMobileMenuOpen(false)}>
                          <div className="flex items-center space-x-3 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 hover:border-white/40 transition-all cursor-pointer">
                            <div className="relative">
                              <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg border border-white/30" style={{ color: '#FFFFFF' }}>
                                {(user.email?.charAt(0) || 'U').toUpperCase()}
                              </div>
                              {isAdmin && (
                                <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-yellow-400 rounded-full border-2 border-background"></div>
                              )}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="text-sm font-bold truncate" style={{ color: '#FFFFFF' }}>
                                {user.email?.split('@')[0] || 'User'}
                              </span>
                              <span className="text-xs truncate" style={{ color: '#FFFFFF', opacity: 0.8 }}>
                                {user.email}
                              </span>
                              <span className="text-xs font-semibold mt-0.5" style={{ color: '#FCD34D' }}>
                                {isAdmin ? 'Administrator' : 'Member'}
                              </span>
                            </div>
                          </div>
                        </Link>
                        
                        {/* Mobile Dashboard Button */}
                        <Link to={isAdmin ? '/admin-dashboard' : '/user-dashboard'} onClick={() => setIsMobileMenuOpen(false)}>
                          <Button
                            className="w-full justify-start bg-white text-black hover:bg-white/90 font-semibold"
                          >
                            <User className="w-4 h-4 mr-2" />
                            <span>Dashboard</span>
                          </Button>
                        </Link>
                        
                        {/* Mobile Logout Button */}
                        <Button
                          variant="outline"
                          className="w-full justify-start border-white/30 text-white hover:bg-red-500/20 hover:text-red-400 hover:border-red-400 font-semibold"
                          onClick={() => {
                            handleSignOut();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          <span>Logout</span>
                        </Button>
                      </div>
                    ) : (
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button
                          className="w-full justify-start bg-white text-black hover:bg-white/90 font-semibold"
                        >
                          <LogIn className="w-4 h-4 mr-2" />
                          <span>Login</span>
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};
