import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, User, LayoutGrid } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * MobileBottomNav — the thumb-zone tab bar.
 * Mobile ecommerce conversion improves when primary actions sit in the
 * natural bottom third of the screen. This is the core mobile nav.
 *
 * 5 destinations: Home, Shop, Search, Cart, Profile.
 * Hidden on md+ where the top nav takes over.
 */
export const MobileBottomNav = () => {
  const location = useLocation();
  const { getTotalItems } = useCart();
  const { user, isAdmin } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cartCount = getTotalItems();

  const profilePath = user ? (isAdmin ? '/admin-dashboard' : '/user-dashboard') : '/login';

  const items = [
    { path: '/', label: 'Home', icon: Home, match: (p: string) => p === '/' },
    { path: '/shop', label: 'Shop', icon: LayoutGrid, match: (p: string) => p === '/shop' || p === '/books' },
    { path: '/journals', label: 'Search', icon: Search, match: (p: string) => p === '/journals' },
    { path: '/checkout', label: 'Cart', icon: ShoppingBag, match: (p: string) => p === '/checkout' || p === '/payment', badge: cartCount },
    { path: profilePath, label: user ? 'Profile' : 'Login', icon: User, match: (p: string) => p.startsWith('/user-dashboard') || p.startsWith('/admin-dashboard') || p === '/login' },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe surface-blur"
      role="navigation"
      aria-label="Primary"
      style={{
        background: isDark ? 'rgba(16, 24, 32, 0.92)' : 'rgba(255, 255, 255, 0.95)',
        borderTop: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0, 0, 0, 0.06)'}`,
        boxShadow: isDark
          ? '0 -8px 30px rgba(0,0,0,0.4)'
          : '0 -8px 30px rgba(45, 62, 80, 0.08)',
      }}
    >
      <ul className="grid grid-cols-5 h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.match(location.pathname);
          return (
            <li key={item.label} className="flex">
              <Link
                to={item.path}
                aria-current={active ? 'page' : undefined}
                aria-label={item.label}
                className="relative flex-1 flex flex-col items-center justify-center gap-0.5 tap-fade"
                style={{
                  color: active ? '#D4AF37' : isDark ? 'rgba(255,255,255,0.6)' : '#6B7280',
                }}
              >
                {/* Active pill behind icon */}
                <span
                  className="relative flex items-center justify-center w-12 h-7 rounded-full transition-all duration-300"
                  style={{
                    background: active ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                  }}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : ''}`}
                    strokeWidth={active ? 2.4 : 1.8}
                  />
                  {/* Cart badge */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold leading-none"
                      style={{ background: '#EF4444', color: '#fff', boxShadow: '0 2px 6px rgba(239,68,68,0.4)' }}
                      aria-label={`${item.badge} items in cart`}
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </span>
                <span className={`text-[10px] tracking-wide ${active ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
                {/* Top-edge indicator (subtle, iOS-style) */}
                {active && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b-full"
                    style={{ background: '#D4AF37' }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
