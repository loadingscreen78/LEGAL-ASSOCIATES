import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, Package, X, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/hooks/useProducts';
import { useTheme } from '@/contexts/ThemeContext';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';

/**
 * MobileShop — mobile-native shop experience.
 * - Sticky search + filter button in thumb-reach
 * - Horizontal category chips
 * - 2-column product grid (ideal on phones)
 * - Filters live in a bottom sheet (vaul) instead of an inline form
 */
interface MobileShopProps {
  initialCategory?: 'All' | 'journals' | 'books';
  /** Hide the category chips (useful when the route already scopes category). */
  lockCategory?: boolean;
}

export const MobileShop = ({ initialCategory = 'All', lockCategory = false }: MobileShopProps = {}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { products } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [q, setQ] = useState('');
  const [category, setCategory] = useState<'All' | 'journals' | 'books'>(initialCategory);
  const [sort, setSort] = useState<'featured' | 'price-low' | 'price-high' | 'name'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const colors = {
    bg: isDark ? '#0B1017' : '#F6F7FB',
    card: isDark ? '#151D28' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#1F2937',
    muted: isDark ? 'rgba(255,255,255,0.6)' : '#64748B',
    border: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)',
    input: isDark ? '#0F1620' : '#FFFFFF',
  };

  const items = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = products.filter((p) => {
      if (category !== 'All' && p.category !== category) return false;
      if (inStockOnly && p.stock <= 0) return false;
      if (term) {
        const haystack = `${p.title} ${p.description ?? ''} ${p.author ?? ''}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
    list = list.slice().sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });
    return list;
  }, [products, q, category, sort, inStockOnly]);

  const chips: { id: 'All' | 'journals' | 'books'; label: string }[] = [
    { id: 'All', label: 'All' },
    { id: 'journals', label: 'Journals' },
    { id: 'books', label: 'Books' },
  ];

  const sortOptions: { id: typeof sort; label: string }[] = [
    { id: 'featured', label: 'Featured' },
    { id: 'price-low', label: 'Price: low to high' },
    { id: 'price-high', label: 'Price: high to low' },
    { id: 'name', label: 'Name (A–Z)' },
  ];

  return (
    <main className="md:hidden pt-14 pb-tabbar" style={{ background: colors.bg, minHeight: '100vh' }}>
      {/* Sticky search + filter */}
      <div
        className="sticky top-14 z-30 px-4 pt-3 pb-3 -mt-1 surface-blur"
        style={{
          background: isDark ? 'rgba(11,16,23,0.8)' : 'rgba(246,247,251,0.85)',
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div className="flex gap-2">
          <label className="flex-1 relative flex items-center">
            <Search className="absolute left-3 w-4 h-4" style={{ color: colors.muted }} />
            <input
              type="search"
              inputMode="search"
              enterKeyHint="search"
              placeholder="Search legal publications"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full h-11 pl-9 pr-9 rounded-full outline-none"
              style={{
                background: colors.input,
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
            />
            {q && (
              <button
                onClick={() => setQ('')}
                className="absolute right-2 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.06)', color: colors.muted }}
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </label>
          <Drawer open={sheetOpen} onOpenChange={setSheetOpen}>
            <DrawerTrigger asChild>
              <button
                className="w-11 h-11 rounded-full flex items-center justify-center tap-fade relative"
                style={{
                  background: colors.card,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                }}
                aria-label="Filters"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {(sort !== 'featured' || inStockOnly || category !== 'All') && (
                  <span
                    className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                    style={{ background: '#D4AF37' }}
                  />
                )}
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filters</DrawerTitle>
              </DrawerHeader>
              <div className="px-4 pb-6 space-y-6">
                <section>
                  <h3 className="text-sm font-semibold mb-2">Sort by</h3>
                  <ul className="space-y-1">
                    {sortOptions.map((o) => (
                      <li key={o.id}>
                        <button
                          onClick={() => setSort(o.id)}
                          className="w-full flex items-center justify-between h-11 px-3 rounded-xl tap-fade"
                          style={{
                            background: sort === o.id ? 'rgba(212,175,55,0.12)' : 'transparent',
                            color: sort === o.id ? '#D4AF37' : undefined,
                          }}
                        >
                          <span className="text-sm">{o.label}</span>
                          {sort === o.id && <Check className="w-4 h-4" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="text-sm font-semibold mb-2">Availability</h3>
                  <button
                    onClick={() => setInStockOnly((v) => !v)}
                    className="w-full flex items-center justify-between h-11 px-3 rounded-xl tap-fade"
                    style={{
                      background: inStockOnly ? 'rgba(212,175,55,0.12)' : 'transparent',
                      color: inStockOnly ? '#D4AF37' : undefined,
                    }}
                  >
                    <span className="text-sm">In stock only</span>
                    <span
                      className="relative w-10 h-6 rounded-full transition-colors"
                      style={{ background: inStockOnly ? '#D4AF37' : 'rgba(100,116,139,0.3)' }}
                    >
                      <span
                        className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                        style={{ left: inStockOnly ? '18px' : '2px' }}
                      />
                    </span>
                  </button>
                </section>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSort('featured');
                      setInStockOnly(false);
                      setCategory('All');
                    }}
                    className="flex-1 h-12 rounded-full font-medium text-sm tap-fade"
                    style={{ border: `1px solid ${colors.border}`, color: colors.text }}
                  >
                    Reset
                  </button>
                  <DrawerClose asChild>
                    <button
                      className="flex-1 h-12 rounded-full font-semibold text-sm tap-fade"
                      style={{ background: '#D4AF37', color: '#101820' }}
                    >
                      Apply
                    </button>
                  </DrawerClose>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Chips */}
        {!lockCategory && (
          <ul className="scroll-x flex gap-2 mt-3 -mx-1 px-1">
            {chips.map((c) => (
              <li key={c.id} className="snap-start-mx shrink-0">
                <button
                  onClick={() => setCategory(c.id)}
                  className="h-9 px-4 rounded-full text-[13px] font-medium tap-fade"
                  style={{
                    background: category === c.id ? '#D4AF37' : colors.card,
                    color: category === c.id ? '#101820' : colors.text,
                    border: `1px solid ${category === c.id ? '#D4AF37' : colors.border}`,
                  }}
                >
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Result count */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-[12px]" style={{ color: colors.muted }}>
          {items.length} {items.length === 1 ? 'result' : 'results'}
        </p>
      </div>

      {/* Product grid */}
      {items.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <Package className="w-10 h-10 mx-auto mb-3" style={{ color: colors.muted }} />
          <p className="text-sm" style={{ color: colors.muted }}>
            No publications match your search.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 px-4 pt-2">
          {items.map((p) => (
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
                  aria-label={`View ${p.title}`}
                >
                  <img
                    src={p.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop'}
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
                  <span
                    className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize"
                    style={{ background: 'rgba(255,255,255,0.92)', color: '#2D3E50' }}
                  >
                    {p.category || 'book'}
                  </span>
                </button>
                <div className="p-3 flex-1 flex flex-col">
                  <div className="font-semibold text-[13px] leading-snug line-clamp-2" style={{ color: colors.text }}>
                    {p.title}
                  </div>
                  <div className="mt-1 flex items-center gap-0.5 text-[11px]" style={{ color: colors.muted }}>
                    <Star className="w-3 h-3" style={{ color: '#D4AF37', fill: '#D4AF37' }} /> 4.7
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
                      className="min-w-[64px] h-8 px-3 rounded-full text-[12px] font-semibold tap-fade disabled:opacity-40"
                      style={{ background: '#2D3E50', color: '#FFFFFF' }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};
