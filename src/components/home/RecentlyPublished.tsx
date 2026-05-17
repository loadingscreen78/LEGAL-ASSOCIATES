import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, ChevronLeft, ChevronRight, Clock, Sparkles, BookOpen,
  Loader2,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useTheme } from '@/contexts/ThemeContext';
import { EditableText } from '@/components/admin/EditableText';

/**
 * RecentlyPublished — themed slideshow of the latest catalog additions.
 *
 *  • Real-time: useProducts() already subscribes to the Supabase `products`
 *    table. Whenever an admin creates / updates / deletes a product through
 *    the admin panel, this carousel rebuilds itself within a heartbeat.
 *
 *  • Auto-play with pause on hover / focus / touch.
 *  • Keyboard arrows + swipe on touch devices.
 *  • A pulsing "NEW" pip lights up on items added in the last 7 days.
 *  • Theme-aware (dark + light) and ships a `compact` mode the mobile home
 *    page uses so the slideshow fits cleanly inside the phone layout.
 */

type Props = {
  /** When true, renders at a smaller height with shrunk paddings. */
  compact?: boolean;
  /** How many of the latest products to feature. Defaults to 10. */
  limit?: number;
};

const FALLBACK_IMAGE = '/lovable-uploads/bd9562f0-5286-4441-82a0-f16eac646a5f.png';

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch { return iso; }
};

const isFresh = (iso: string) => {
  try {
    const ageMs = Date.now() - new Date(iso).getTime();
    return ageMs < 7 * 24 * 60 * 60 * 1000;
  } catch { return false; }
};

const categoryLabel = (cat: string) => {
  if (cat === 'journals') return 'Journal';
  if (cat === 'books') return 'Book';
  if (cat === 'catalogs') return 'Catalog';
  return 'Publication';
};

export const RecentlyPublished = ({ compact = false, limit = 10 }: Props) => {
  const { products, loading } = useProducts();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  // Latest active products, newest first.
  const items = useMemo(
    () =>
      [...products]
        .filter((p) => p.is_active)
        .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
        .slice(0, limit),
    [products, limit]
  );

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Reset to first slide whenever the data shape shrinks (admin deletion etc).
  useEffect(() => {
    if (idx >= items.length) setIdx(0);
  }, [items.length, idx]);

  // Auto-advance.
  useEffect(() => {
    if (paused || items.length < 2) return;
    const t = window.setInterval(
      () => setIdx((i) => (i + 1) % items.length),
      4500
    );
    return () => window.clearInterval(t);
  }, [paused, items.length]);

  // Keyboard nav when section has focus.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % Math.max(1, items.length));
      if (e.key === 'ArrowLeft')  setIdx((i) => (i - 1 + items.length) % Math.max(1, items.length));
    };
    node.addEventListener('keydown', onKey);
    return () => node.removeEventListener('keydown', onKey);
  }, [items.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) setIdx((i) => (i + 1) % items.length);
      else setIdx((i) => (i - 1 + items.length) % items.length);
    }
    touchStart.current = null;
  };

  const colors = {
    sectionBg: isDark
      ? 'linear-gradient(180deg, #0B1017 0%, #101820 50%, #0B1017 100%)'
      : 'linear-gradient(180deg, #F8F9FA 0%, #FFFFFF 50%, #F8F9FA 100%)',
    cardBg:    isDark ? '#1a2a3a' : '#FFFFFF',
    cardLow:   isDark ? '#101820' : '#F8F9FA',
    text:      isDark ? '#F2F4F8' : '#101820',
    muted:     isDark ? 'rgba(242,244,248,0.7)' : '#475569',
    dim:       isDark ? 'rgba(242,244,248,0.45)' : '#94A3B8',
    border:    isDark ? 'rgba(212,175,55,0.18)' : 'rgba(45,62,80,0.10)',
    chip:      isDark ? 'rgba(212,175,55,0.12)' : 'rgba(212,175,55,0.16)',
  };

  const heightClass = compact ? 'h-[300px]' : 'h-[460px] md:h-[500px]';
  const sectionPadding = compact ? 'py-0' : 'py-20 md:py-24';

  // ---- Loading / empty states ----------------------------------------------

  if (loading && items.length === 0) {
    return (
      <section
        className={`relative overflow-hidden ${sectionPadding} ${compact ? 'px-4' : 'px-4'}`}
        style={{ background: compact ? 'transparent' : colors.sectionBg }}
      >
        <div className={`flex flex-col items-center justify-center ${heightClass}`}>
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#D4AF37' }} />
          <p className="mt-3 text-sm" style={{ color: colors.muted }}>
            Loading the latest publications…
          </p>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section
        className={`relative overflow-hidden ${sectionPadding} ${compact ? 'px-4' : 'px-4'}`}
        style={{ background: compact ? 'transparent' : colors.sectionBg }}
      >
        <div
          className={`relative rounded-3xl flex flex-col items-center justify-center text-center px-6 ${heightClass}`}
          style={{
            background: colors.cardBg,
            border: `1px dashed ${colors.border}`,
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: colors.chip }}
          >
            <Sparkles className="w-6 h-6" style={{ color: '#D4AF37' }} />
          </div>
          <h3 className="font-serif font-bold text-xl mb-1" style={{ color: colors.text }}>
            Recently Published
          </h3>
          <p className="text-sm max-w-md" style={{ color: colors.muted }}>
            New titles will appear here automatically the moment our team adds them. Check back soon.
          </p>
        </div>
      </section>
    );
  }

  // ---- Slideshow -----------------------------------------------------------

  const active = items[idx];

  return (
    <section
      className={`relative overflow-hidden ${sectionPadding} ${compact ? 'px-0' : 'px-4'}`}
      style={{ background: compact ? 'transparent' : colors.sectionBg }}
    >
      {!compact && (
        <>
          <div
            className="absolute top-0 left-0 w-full h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }}
          />
          <div
            className="absolute top-20 left-10 w-40 h-40 rounded-full opacity-10 blur-3xl"
            style={{ background: '#D4AF37' }}
          />
          <div
            className="absolute bottom-20 right-10 w-56 h-56 rounded-full opacity-10 blur-3xl"
            style={{ background: isDark ? '#D4AF37' : '#2D3E50' }}
          />
        </>
      )}

      <div className={compact ? 'mx-auto' : 'container mx-auto'}>
        {/* Header */}
        {!compact && (
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
              style={{ background: colors.chip, border: '1px solid rgba(212,175,55,0.3)' }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
              <EditableText
                keyName="recentlyPublished.eyebrow"
                className="text-xs font-semibold tracking-wider uppercase"
                style={{ color: '#D4AF37' }}
              />
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-3" style={{ color: colors.text }}>
              <EditableText keyName="recentlyPublished.title" />{' '}
              <EditableText keyName="recentlyPublished.titleAccent" style={{ color: '#D4AF37' }} />
            </h2>
            <EditableText
              keyName="recentlyPublished.subtitle"
              as="p"
              multiline
              className="text-sm md:text-base max-w-xl mx-auto"
              style={{ color: colors.muted }}
            />
          </div>
        )}

        {compact && (
          <div className="px-4 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: '#D4AF37' }} />
              <EditableText keyName="recentlyPublished.mobileTitle" as="h2" className="font-serif font-bold text-[18px]" style={{ color: colors.text }} />
            </div>
            <button
              onClick={() => navigate('/shop')}
              className="text-[13px] font-medium flex items-center gap-1"
              style={{ color: '#D4AF37' }}
            >
              All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Slideshow stage */}
        <div
          ref={sectionRef}
          tabIndex={0}
          aria-roledescription="carousel"
          aria-label="Recently published publications"
          className={`relative outline-none mx-auto ${heightClass} ${compact ? 'rounded-2xl px-4' : 'max-w-5xl rounded-3xl'} `}
          style={{
            // give the focused slideshow a soft gold ring
            boxShadow: 'none',
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Card stack — each slide is a positioned absolute layer that
              fades + scales between active and resting state. This avoids
              re-mounting images so the browser can keep the decoded bitmap. */}
          <div
            className={`relative w-full overflow-hidden ${compact ? 'rounded-2xl' : 'rounded-3xl'}`}
            style={{
              height: '100%',
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
              boxShadow: isDark
                ? '0 30px 60px rgba(0,0,0,0.5)'
                : '0 30px 60px rgba(45,62,80,0.18)',
            }}
          >
            {items.map((p, i) => {
              const isActive = i === idx;
              return (
                <button
                  key={p.id}
                  onClick={() =>
                    navigate(p.category === 'journals' ? `/journal/${p.id}` : '/shop')
                  }
                  aria-label={`Open ${p.title}`}
                  aria-hidden={!isActive}
                  tabIndex={isActive ? 0 : -1}
                  className={`absolute inset-0 text-left transition-all duration-700 ease-out ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.985] pointer-events-none'
                  }`}
                  style={{ background: colors.cardBg }}
                >
                  <div className={`grid ${compact ? 'grid-cols-[44%_56%]' : 'md:grid-cols-[42%_58%]'} h-full`}>
                    {/* Image side */}
                    <div className="relative h-full overflow-hidden bg-black/20">
                      <img
                        src={p.image_url && p.image_url.trim() ? p.image_url : FALLBACK_IMAGE}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-[6000ms] ease-out"
                        style={{ transform: isActive ? 'scale(1.06)' : 'scale(1)' }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background: isDark
                            ? 'linear-gradient(180deg, rgba(11,16,23,0) 35%, rgba(11,16,23,0.85) 100%)'
                            : 'linear-gradient(180deg, rgba(255,255,255,0) 30%, rgba(248,249,250,0.85) 100%)',
                        }}
                      />

                      {/* Floating gold accent ring */}
                      {!compact && (
                        <div
                          className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full opacity-30 blur-2xl"
                          style={{ background: '#D4AF37' }}
                        />
                      )}

                      {/* "NEW" pip */}
                      {isFresh(p.created_at) && (
                        <span
                          className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
                          style={{
                            background: '#D4AF37',
                            color: '#101820',
                            boxShadow: '0 8px 18px rgba(212,175,55,0.45)',
                          }}
                        >
                          <span
                            className="inline-block w-1.5 h-1.5 rounded-full animate-ping"
                            style={{ background: '#101820' }}
                          />
                          New
                        </span>
                      )}

                      {/* Category chip */}
                      <span
                        className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase"
                        style={{
                          background: isDark ? 'rgba(11,16,23,0.7)' : 'rgba(255,255,255,0.85)',
                          color: isDark ? '#F4D47E' : '#2D3E50',
                          backdropFilter: 'blur(6px)',
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        {categoryLabel(p.category)}
                      </span>
                    </div>

                    {/* Copy side */}
                    <div className={`flex flex-col justify-between ${compact ? 'p-4' : 'p-6 md:p-10'}`}>
                      <div>
                        <div
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide uppercase mb-3"
                          style={{ background: colors.chip, color: '#D4AF37' }}
                        >
                          <Clock className="w-3 h-3" /> Added {formatDate(p.created_at)}
                        </div>

                        <h3
                          className={`font-serif font-bold leading-tight line-clamp-3 ${
                            compact ? 'text-[18px]' : 'text-2xl md:text-4xl'
                          }`}
                          style={{ color: colors.text }}
                        >
                          {p.title}
                        </h3>

                        {p.author && (
                          <p
                            className={`mt-2 ${compact ? 'text-[12px]' : 'text-sm md:text-base'}`}
                            style={{ color: '#D4AF37' }}
                          >
                            by {p.author}
                          </p>
                        )}

                        {p.description && (
                          <p
                            className={`mt-3 ${compact ? 'text-[12px] line-clamp-2' : 'text-sm md:text-base line-clamp-4'}`}
                            style={{ color: colors.muted }}
                          >
                            {p.description}
                          </p>
                        )}
                      </div>

                      <div className={`flex items-center justify-between ${compact ? 'mt-3' : 'mt-6'}`}>
                        <span
                          className={`font-bold ${compact ? 'text-[18px]' : 'text-2xl md:text-3xl'}`}
                          style={{ color: '#D4AF37' }}
                        >
                          ₹{Number(p.price || 0).toFixed(0)}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 font-semibold ${
                            compact ? 'text-[12px]' : 'text-sm'
                          }`}
                          style={{ color: colors.text }}
                        >
                          <BookOpen className="w-4 h-4" style={{ color: '#D4AF37' }} />
                          View details
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Prev / Next */}
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous publication"
                  onClick={() => setIdx((i) => (i - 1 + items.length) % items.length)}
                  className={`absolute top-1/2 -translate-y-1/2 ${compact ? 'left-2 w-8 h-8' : 'left-3 md:left-4 w-10 h-10'} rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110`}
                  style={{
                    background: isDark ? 'rgba(11,16,23,0.7)' : 'rgba(255,255,255,0.85)',
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <ChevronLeft className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
                </button>
                <button
                  type="button"
                  aria-label="Next publication"
                  onClick={() => setIdx((i) => (i + 1) % items.length)}
                  className={`absolute top-1/2 -translate-y-1/2 ${compact ? 'right-2 w-8 h-8' : 'right-3 md:right-4 w-10 h-10'} rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110`}
                  style={{
                    background: isDark ? 'rgba(11,16,23,0.7)' : 'rgba(255,255,255,0.85)',
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <ChevronRight className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
                </button>
              </>
            )}

            {/* Auto-play progress bar (resets on slide change). */}
            {items.length > 1 && !paused && (
              <div
                key={idx}
                className="absolute bottom-0 left-0 h-0.5"
                style={{
                  width: '100%',
                  background: 'transparent',
                }}
              >
                <div
                  className="h-full"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(90deg, #D4AF37, #F4D47E)',
                    transformOrigin: 'left center',
                    animation: 'rp-progress 4500ms linear forwards',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Dots */}
        {items.length > 1 && (
          <div className={`flex items-center justify-center gap-2 ${compact ? 'mt-3' : 'mt-6'}`}>
            {items.map((_, i) => {
              const isActive = i === idx;
              return (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIdx(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: isActive ? 22 : 8,
                    height: 8,
                    background: isActive ? '#D4AF37' : isDark ? 'rgba(255,255,255,0.25)' : 'rgba(45,62,80,0.25)',
                    boxShadow: isActive ? '0 0 12px rgba(212,175,55,0.6)' : 'none',
                  }}
                />
              );
            })}
          </div>
        )}

        {/* "Browse all" CTA on the desktop view */}
        {!compact && (
          <div className="text-center mt-10">
            <button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: '#D4AF37',
                color: '#101820',
                boxShadow: '0 14px 32px rgba(212,175,55,0.32)',
              }}
            >
              <EditableText keyName="recentlyPublished.cta" /> <ArrowRight className="w-5 h-5" />
            </button>
            <p className="mt-3 text-xs" style={{ color: colors.dim }}>
              Live feed · synced from the admin panel in real time.
            </p>
          </div>
        )}
      </div>

      {/* Local keyframes for the progress bar */}
      <style>{`
        @keyframes rp-progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
};

export default RecentlyPublished;
