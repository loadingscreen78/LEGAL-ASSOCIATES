import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Scale,
  FileText,
  Gavel,
  Library,
  BookMarked,
  MapPin,
  Phone,
  Sparkles,
  Search,
  Star,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';

/**
 * MobileHome — redesigned home page for mobile users.
 * Priorities (from mobile ecommerce UX research):
 *  - Key info (what we sell, search, featured items, CTAs) above the fold
 *  - Horizontal chip scrollers for categories (thumb-friendly)
 *  - Tight 2-col product grid (not 3 — 3 is too cramped on phones)
 *  - Generous tap targets, sticky-style CTAs, readable type
 *  - No giant 100vh hero: we earn the second screen with progressive content
 */
export const MobileHome = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const isDark = theme === 'dark';

  const journals = useMemo(
    () =>
      products
        .filter((p) => p.category === 'journals' && p.is_active)
        .slice(0, 8),
    [products]
  );
  const featured = useMemo(
    () => products.filter((p) => p.is_active).slice(0, 6),
    [products]
  );

  const colors = {
    bg: isDark ? '#0B1017' : '#F6F7FB',
    card: isDark ? '#151D28' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#1F2937',
    muted: isDark ? 'rgba(255,255,255,0.65)' : '#64748B',
    border: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)',
  };

  const categories = [
    { id: 'journals', label: 'Journals', icon: BookOpen, to: '/journals', tint: '#3B82F6' },
    { id: 'books', label: 'Books', icon: FileText, to: '/books', tint: '#10B981' },
    { id: 'reports', label: 'Reports', icon: Gavel, to: '/orissa-criminal-reports', tint: '#F59E0B' },
    { id: 'digests', label: 'Digests', icon: BookMarked, to: '/books', tint: '#8B5CF6' },
    { id: 'commentaries', label: 'Notes', icon: Scale, to: '/books', tint: '#EC4899' },
    { id: 'reference', label: 'Reference', icon: Library, to: '/books', tint: '#06B6D4' },
  ];

  return (
    <main className="md:hidden pt-14 pb-tabbar" style={{ background: colors.bg, minHeight: '100vh' }}>
      {/* Hero — compact, content-first */}
      <section
        className="relative px-4 pt-5 pb-6 rounded-b-[32px] overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #2D3E50 0%, #101820 100%)',
        }}
      >
        {/* Decorative */}
        <div
          className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-30 blur-3xl"
          style={{ background: '#D4AF37' }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-20 blur-3xl"
          style={{ background: '#3B82F6' }}
        />

        <div className="relative">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3"
            style={{ background: 'rgba(212,175,55,0.18)', border: '1px solid rgba(212,175,55,0.35)' }}
          >
            <Sparkles className="w-3 h-3" style={{ color: '#D4AF37' }} />
            <span className="text-[11px] font-medium tracking-wide" style={{ color: '#D4AF37' }}>
              Since 1980 · Cuttack, Odisha
            </span>
          </div>

          <h1 className="font-serif font-bold leading-tight text-white" style={{ fontSize: 28 }}>
            Empowering <br />
            <span style={{ color: '#D4AF37' }}>Legal Minds</span>
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Journals, bare acts, and legal publications trusted by professionals.
          </p>

          {/* Inline search "chip" that routes to shop */}
          <button
            onClick={() => navigate('/shop')}
            className="mt-4 w-full h-12 px-4 rounded-full flex items-center gap-3 tap-fade"
            style={{
              background: 'rgba(255,255,255,0.95)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              color: '#64748B',
            }}
            aria-label="Search books, journals, and publications"
          >
            <Search className="w-4 h-4" style={{ color: '#2D3E50' }} />
            <span className="text-[14px]">Search books, journals…</span>
            <span className="ml-auto text-[11px] font-semibold px-2 py-1 rounded-full" style={{ background: '#D4AF37', color: '#101820' }}>
              Go
            </span>
          </button>

          {/* Quick actions */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              to="/shop"
              className="h-11 rounded-full flex items-center justify-center gap-2 text-[14px] font-semibold tap-fade"
              style={{ background: '#D4AF37', color: '#101820' }}
            >
              <BookOpen className="w-4 h-4" /> Explore
            </Link>
            <Link
              to="/visit-store"
              className="h-11 rounded-full flex items-center justify-center gap-2 text-[14px] font-medium tap-fade"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.22)' }}
            >
              <MapPin className="w-4 h-4" /> Visit Store
            </Link>
          </div>

          {/* Stats strip */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { v: '40+', l: 'Years' },
              { v: '500+', l: 'Titles' },
              { v: '10K+', l: 'Customers' },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="font-bold text-[18px]" style={{ color: '#D4AF37' }}>{s.v}</div>
                <div className="text-[10px] tracking-wide uppercase" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category chips (horizontal, thumb-friendly) */}
      <section className="mt-5">
        <div className="px-4 mb-3 flex items-center justify-between">
          <h2 className="font-serif font-bold text-[18px]" style={{ color: colors.text }}>
            Browse categories
          </h2>
          <Link to="/shop" className="text-[13px] font-medium flex items-center gap-1" style={{ color: '#D4AF37' }}>
            All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <ul className="scroll-x flex gap-3 px-4 pb-2">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <li key={c.id} className="snap-start-mx shrink-0">
                <Link
                  to={c.to}
                  className="w-[92px] h-[92px] rounded-2xl flex flex-col items-center justify-center gap-1.5 tap-fade"
                  style={{
                    background: colors.card,
                    border: `1px solid ${colors.border}`,
                    boxShadow: isDark ? '0 6px 20px rgba(0,0,0,0.35)' : '0 6px 20px rgba(15,23,42,0.05)',
                  }}
                >
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${c.tint}18` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: c.tint }} />
                  </span>
                  <span className="text-[12px] font-medium" style={{ color: colors.text }}>{c.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Featured journals rail */}
      {journals.length > 0 && (
        <section className="mt-6">
          <div className="px-4 mb-3 flex items-center justify-between">
            <h2 className="font-serif font-bold text-[18px]" style={{ color: colors.text }}>
              Top journals
            </h2>
            <Link to="/journals" className="text-[13px] font-medium flex items-center gap-1" style={{ color: '#D4AF37' }}>
              See all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ul className="scroll-x flex gap-3 px-4 pb-2">
            {journals.map((j) => (
              <li key={j.id} className="snap-start-mx shrink-0 w-[160px]">
                <button
                  onClick={() => navigate(`/journal/${j.id}`)}
                  className="w-full text-left rounded-2xl overflow-hidden tap-fade"
                  style={{
                    background: colors.card,
                    border: `1px solid ${colors.border}`,
                    boxShadow: isDark ? '0 8px 22px rgba(0,0,0,0.4)' : '0 8px 22px rgba(15,23,42,0.06)',
                  }}
                >
                  <div className="relative w-full aspect-[3/4] overflow-hidden">
                    <img
                      src={j.image_url || '/lovable-uploads/bd9562f0-5286-4441-82a0-f16eac646a5f.png'}
                      alt={j.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/lovable-uploads/bd9562f0-5286-4441-82a0-f16eac646a5f.png';
                      }}
                    />
                    <span
                      className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: '#D4AF37', color: '#101820' }}
                    >
                      Journal
                    </span>
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-[13px] leading-snug line-clamp-2" style={{ color: colors.text }}>
                      {j.title}
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="font-bold text-[14px]" style={{ color: '#D4AF37' }}>
                        ₹{j.price.toFixed(0)}
                      </span>
                      <span className="flex items-center gap-0.5 text-[11px]" style={{ color: colors.muted }}>
                        <Star className="w-3 h-3" style={{ color: '#D4AF37', fill: '#D4AF37' }} /> 4.8
                      </span>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Promo card */}
      <section className="px-4 mt-6">
        <div
          className="relative rounded-3xl p-5 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #B98C12 100%)',
            boxShadow: '0 16px 40px rgba(212,175,55,0.25)',
          }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30" style={{ background: '#fff' }} />
          <div className="relative">
            <div className="text-[11px] font-bold tracking-widest uppercase" style={{ color: 'rgba(16,24,32,0.65)' }}>
              Limited offer
            </div>
            <h3 className="mt-1 font-serif font-bold text-[22px] leading-tight" style={{ color: '#101820' }}>
              Up to 40% off <br />bundles
            </h3>
            <p className="text-[13px] mt-1" style={{ color: 'rgba(16,24,32,0.75)' }}>
              Complete legal sets curated for practice.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 mt-3 h-10 px-4 rounded-full font-semibold text-[13px] tap-fade"
              style={{ background: '#101820', color: '#D4AF37' }}
            >
              Shop deals <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured products (2-col grid, sized for thumbs) */}
      {featured.length > 0 && (
        <section className="mt-7 px-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif font-bold text-[18px]" style={{ color: colors.text }}>
              Popular picks
            </h2>
            <Link to="/shop" className="text-[13px] font-medium flex items-center gap-1" style={{ color: '#D4AF37' }}>
              All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {featured.map((p) => (
              <li key={p.id}>
                <div
                  className="rounded-2xl overflow-hidden flex flex-col h-full"
                  style={{
                    background: colors.card,
                    border: `1px solid ${colors.border}`,
                    boxShadow: isDark ? '0 8px 22px rgba(0,0,0,0.4)' : '0 8px 22px rgba(15,23,42,0.06)',
                  }}
                >
                  <button
                    onClick={() => navigate(p.category === 'journals' ? `/journal/${p.id}` : '/shop')}
                    className="relative w-full aspect-[4/5] overflow-hidden tap-fade"
                  >
                    <img
                      src={p.image_url || '/lovable-uploads/bd9562f0-5286-4441-82a0-f16eac646a5f.png'}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/lovable-uploads/bd9562f0-5286-4441-82a0-f16eac646a5f.png';
                      }}
                    />
                    {p.stock === 0 && (
                      <span
                        className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: '#EF4444', color: '#fff' }}
                      >
                        Out of stock
                      </span>
                    )}
                  </button>
                  <div className="p-3 flex-1 flex flex-col">
                    <div className="font-semibold text-[13px] leading-snug line-clamp-2" style={{ color: colors.text }}>
                      {p.title}
                    </div>
                    <div className="mt-auto pt-2 flex items-center justify-between">
                      <span className="font-bold text-[14px]" style={{ color: '#D4AF37' }}>
                        ₹{p.price.toFixed(0)}
                      </span>
                      <button
                        disabled={p.stock === 0}
                        onClick={() =>
                          addToCart({
                            id: p.id,
                            title: p.title,
                            price: p.price,
                            image: p.image_url || '/lovable-uploads/bd9562f0-5286-4441-82a0-f16eac646a5f.png',
                            category: p.category || 'books',
                          })
                        }
                        className="min-w-[72px] h-8 px-3 rounded-full text-[12px] font-semibold tap-fade disabled:opacity-40"
                        style={{
                          background: '#2D3E50',
                          color: '#FFFFFF',
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Visit store / contact strip */}
      <section className="px-4 mt-7">
        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            boxShadow: isDark ? '0 6px 20px rgba(0,0,0,0.35)' : '0 6px 20px rgba(15,23,42,0.05)',
          }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(212,175,55,0.15)' }}
          >
            <MapPin className="w-5 h-5" style={{ color: '#D4AF37' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[14px]" style={{ color: colors.text }}>Visit our store</div>
            <div className="text-[12px] truncate" style={{ color: colors.muted }}>
              High Court Road, Cuttack 753002
            </div>
          </div>
          <a
            href="tel:+919437019131"
            className="w-10 h-10 rounded-full flex items-center justify-center tap-fade"
            style={{ background: '#D4AF37', color: '#101820' }}
            aria-label="Call Legal Associates"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Minimal footer content (big footer lives on desktop) */}
      <section className="px-4 mt-8 mb-4 text-center">
        <p className="text-[11px]" style={{ color: colors.muted }}>
          © 2024 Legal Associates · Cuttack, Odisha
        </p>
      </section>
    </main>
  );
};
