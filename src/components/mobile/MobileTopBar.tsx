import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ArrowLeft, ShoppingBag, Bell } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '../ThemeToggle';

interface MobileTopBarProps {
  /** Optional page title. If omitted, shows logo lockup. */
  title?: string;
  /** If true, shows a back chevron that navigates -1. */
  showBack?: boolean;
  /** Hides the search affordance (e.g. on the search page itself). */
  hideSearch?: boolean;
  /** Custom right-side slot (overrides cart + theme icons). */
  rightSlot?: React.ReactNode;
  /** When true, bar is always solid (no transparent-on-hero state). */
  alwaysSolid?: boolean;
}

/**
 * MobileTopBar — slim, single-row app bar. Pairs with MobileBottomNav.
 * Left: back chevron OR logo. Center: page title when provided. Right:
 * theme toggle + cart (with badge). A search "chip" lives under the bar on
 * the home route only to keep the rest of the app focused.
 */
export const MobileTopBar = ({ title, showBack = false, hideSearch = false, rightSlot, alwaysSolid = false }: MobileTopBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { getTotalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = alwaysSolid || scrolled || !!title || location.pathname !== '/';
  const cartCount = getTotalItems();

  return (
    <header
      className="md:hidden fixed top-0 left-0 right-0 z-50 pt-safe transition-colors duration-300"
      style={{
        background: solid
          ? isDark
            ? 'rgba(16, 24, 32, 0.92)'
            : 'rgba(255, 255, 255, 0.95)'
          : 'transparent',
        backdropFilter: solid ? 'saturate(180%) blur(20px)' : undefined,
        WebkitBackdropFilter: solid ? 'saturate(180%) blur(20px)' : undefined,
        borderBottom: solid
          ? `1px solid ${isDark ? 'rgba(212, 175, 55, 0.12)' : 'rgba(0,0,0,0.06)'}`
          : '1px solid transparent',
      }}
    >
      <div className="h-14 px-3 flex items-center gap-2">
        {/* Leading */}
        {showBack ? (
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="w-11 h-11 rounded-full flex items-center justify-center tap-fade"
            style={{
              background: solid
                ? isDark ? 'rgba(255,255,255,0.08)' : 'rgba(45,62,80,0.06)'
                : 'rgba(255,255,255,0.15)',
              color: solid ? (isDark ? '#FFFFFF' : '#2D3E50') : '#FFFFFF',
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <Link
            to="/"
            aria-label="Go to home"
            className="flex items-center gap-2 tap-fade"
          >
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #2D3E50 0%, #101820 100%)', border: '2px solid #D4AF37' }}
            >
              <img src="/logo.png" alt="" className="w-7 h-7 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
            </span>
            {!title && (
              <span
                className="font-serif font-bold text-[15px] leading-tight"
                style={{ color: solid ? (isDark ? '#FFFFFF' : '#2D3E50') : '#FFFFFF' }}
              >
                Legal&nbsp;Associates
              </span>
            )}
          </Link>
        )}

        {/* Title (center-ish) */}
        {title && (
          <h1
            className="flex-1 text-center font-serif font-bold text-[17px] truncate px-2"
            style={{ color: solid ? (isDark ? '#FFFFFF' : '#2D3E50') : '#FFFFFF' }}
          >
            {title}
          </h1>
        )}

        {/* Filler to push trailing content right when no title */}
        {!title && <div className="flex-1" />}

        {/* Trailing */}
        <div className="flex items-center gap-1">
          {rightSlot ?? (
            <>
              {!hideSearch && (
                <Link
                  to="/shop"
                  aria-label="Search products"
                  className="w-11 h-11 rounded-full flex items-center justify-center tap-fade"
                  style={{
                    background: solid
                      ? isDark ? 'rgba(255,255,255,0.08)' : 'rgba(45,62,80,0.06)'
                      : 'rgba(255,255,255,0.15)',
                    color: solid ? (isDark ? '#FFFFFF' : '#2D3E50') : '#FFFFFF',
                  }}
                >
                  <Search className="w-5 h-5" />
                </Link>
              )}
              <ThemeToggle />
              <Link
                to="/checkout"
                aria-label={`Open cart${cartCount ? ` (${cartCount} items)` : ''}`}
                className="relative w-11 h-11 rounded-full flex items-center justify-center tap-fade"
                style={{
                  background: solid
                    ? isDark ? 'rgba(255,255,255,0.08)' : 'rgba(45,62,80,0.06)'
                    : 'rgba(255,255,255,0.15)',
                  color: solid ? (isDark ? '#FFFFFF' : '#2D3E50') : '#FFFFFF',
                }}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span
                    className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold leading-none"
                    style={{ background: '#EF4444', color: '#fff', boxShadow: '0 2px 6px rgba(239,68,68,0.4)' }}
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
