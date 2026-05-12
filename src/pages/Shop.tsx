import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/hooks/useProducts';
import { useTheme } from '@/contexts/ThemeContext';
import { Search, ShoppingCart, Star, Package, Sparkles, Grid, List } from 'lucide-react';
import { MobileShop } from '@/components/mobile/MobileShop';

const fallbackData = [
  { id: 'shop-1', title: "Complete Criminal Law Set", category: "Bundle", price: 2999, originalPrice: 4500, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop", description: "Comprehensive set including IPC, CrPC, and Evidence Act", rating: 4.9, inStock: true, bestseller: true },
  { id: 'shop-2', title: "Civil Law Master Collection", category: "Bundle", price: 3499, originalPrice: 5200, image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=500&fit=crop", description: "Complete civil law collection with CPC and Contract Act", rating: 4.8, inStock: true, featured: true },
  { id: 'shop-3', title: "Odisha Legal Practice Guide", category: "Specialty", price: 1299, originalPrice: 1699, image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=500&fit=crop", description: "Essential guide for practicing law in Odisha courts", rating: 4.7, inStock: true, newArrival: true },
  { id: 'shop-4', title: "Constitutional Law Essentials", category: "Core", price: 899, originalPrice: 1199, image: "https://images.unsplash.com/photo-1589829545856-d10d85525114?w=400&h=500&fit=crop", description: "Must-have constitutional law reference", rating: 4.6, inStock: true },
  { id: 'shop-5', title: "Family & Personal Laws", category: "Specialty", price: 699, originalPrice: 899, image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=500&fit=crop", description: "Comprehensive coverage of all personal laws", rating: 4.5, inStock: true },
  { id: 'shop-6', title: "Tax Law Complete Guide", category: "Specialty", price: 1099, originalPrice: 1399, image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=500&fit=crop", description: "Updated tax laws with GST provisions", rating: 4.4, inStock: false },
];

const Shop = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { products } = useProducts();

  const shopData = products.length > 0 ? products.map(p => ({
    id: p.id, title: p.title, category: p.category || 'books', price: p.price, originalPrice: p.price * 1.3,
    image: p.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    description: p.description || '', rating: 4.5, inStock: p.stock > 0, bestseller: false, featured: false, newArrival: false
  })) : fallbackData;

  const categories = ['All', 'books', 'journals', 'Bundle', 'Specialty', 'Core'];
  const sortOptions = [{ value: 'featured', label: 'Featured' }, { value: 'name', label: 'Name' }, { value: 'price-low', label: 'Price: Low to High' }, { value: 'price-high', label: 'Price: High to Low' }];

  let filteredProducts = shopData.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesStock = !showOnlyInStock || product.inStock;
    return matchesSearch && matchesCategory && matchesStock;
  });

  filteredProducts = filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.title.localeCompare(b.title);
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      default: return 0;
    }
  });

  const handleAddToCart = (product: typeof shopData[0]) => {
    addToCart({ id: product.id, title: product.title, price: product.price, image: product.image, category: product.category });
  };

  const colors = {
    bg: isDark ? '#101820' : '#F8F9FA',
    cardBg: isDark ? '#1a2a3a' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#2D3E50',
    textMuted: isDark ? 'rgba(255,255,255,0.6)' : '#666666',
    inputBg: isDark ? '#0d1117' : '#F8F9FA',
  };

  return (
    <div className="min-h-screen" style={{ background: colors.bg }}>
      <Navigation mobileTitle="Shop" hideMobileSearchIcon />

      {/* Mobile-first shop (< md) */}
      <MobileShop />

      {/* Desktop / tablet (≥ md) — original experience */}
      <main className="hidden md:block pt-24 pb-16">
        <div className="relative py-16 mb-8" style={{ background: 'linear-gradient(135deg, #2D3E50 0%, #101820 100%)' }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(212, 175, 55, 0.2)', border: '1px solid rgba(212, 175, 55, 0.4)' }}>
              <ShoppingCart className="w-4 h-4" style={{ color: '#D4AF37' }} />
              <span className="text-sm font-medium" style={{ color: '#D4AF37' }}>Shop Collection</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4" style={{ color: '#FFFFFF' }}>Legal <span style={{ color: '#D4AF37' }}>Publications</span></h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Complete legal book collections for every professional</p>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="rounded-2xl p-6 mb-8 relative overflow-hidden" style={{ background: isDark ? 'rgba(212, 175, 55, 0.1)' : 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-6 h-6" style={{ color: '#D4AF37' }} />
              <span className="text-lg font-semibold" style={{ color: colors.text }}>Special Offer - Up to 40% Off!</span>
              <Sparkles className="w-6 h-6" style={{ color: '#D4AF37' }} />
            </div>
          </div>

          <div className="rounded-2xl p-6 mb-8" style={{ background: colors.cardBg, boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}` }}>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textMuted }} />
                  <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-300" style={{ background: colors.inputBg, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, color: colors.text }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Category</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl outline-none cursor-pointer" style={{ background: colors.inputBg, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, color: colors.text }}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Sort By</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-4 py-3 rounded-xl outline-none cursor-pointer" style={{ background: colors.inputBg, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, color: colors.text }}>
                  {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showOnlyInStock} onChange={(e) => setShowOnlyInStock(e.target.checked)} className="w-4 h-4 rounded" style={{ accentColor: '#D4AF37' }} />
                  <span className="text-sm" style={{ color: colors.text }}>In Stock</span>
                </label>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setViewMode('grid')} className="p-3 rounded-xl transition-all duration-300" style={{ background: viewMode === 'grid' ? '#D4AF37' : colors.inputBg, color: viewMode === 'grid' ? '#2D3E50' : colors.textMuted }}>
                  <Grid className="w-5 h-5" />
                </button>
                <button onClick={() => setViewMode('list')} className="p-3 rounded-xl transition-all duration-300" style={{ background: viewMode === 'list' ? '#D4AF37' : colors.inputBg, color: viewMode === 'list' ? '#2D3E50' : colors.textMuted }}>
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <p style={{ color: colors.textMuted }}>Showing <span className="font-semibold" style={{ color: colors.text }}>{filteredProducts.length}</span> products</p>
          </div>

          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {filteredProducts.map((product, index) => (
              <div key={product.id} className={`group relative overflow-hidden rounded-2xl transition-all duration-500 ${viewMode === 'list' ? 'flex gap-6' : ''}`}
                style={{ background: colors.cardBg, boxShadow: hoveredProduct === product.id ? (isDark ? '0 20px 40px rgba(0,0,0,0.5)' : '0 20px 40px rgba(45, 62, 80, 0.15)') : isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)', transform: hoveredProduct === product.id ? 'translateY(-8px)' : 'translateY(0)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}` }}
                onMouseEnter={() => setHoveredProduct(product.id)} onMouseLeave={() => setHoveredProduct(null)}>
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                  {product.bestseller && <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#EF4444', color: '#FFFFFF' }}>🔥 Bestseller</span>}
                  {product.featured && <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#3B82F6', color: '#FFFFFF' }}>⭐ Featured</span>}
                  {product.newArrival && <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#10B981', color: '#FFFFFF' }}>🆕 New</span>}
                </div>
                {product.originalPrice > product.price && (
                  <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#D4AF37', color: '#2D3E50' }}>
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </div>
                )}
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                  <img src={product.image} alt={product.title} className={`w-full object-cover transition-transform duration-700 ${viewMode === 'list' ? 'h-full' : 'h-52'}`} style={{ transform: hoveredProduct === product.id ? 'scale(1.1)' : 'scale(1)' }} />
                  {!product.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
                      <span className="px-4 py-2 rounded-full font-bold" style={{ background: '#EF4444', color: '#FFFFFF' }}>Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className={`p-5 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-center' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'rgba(212, 175, 55, 0.15)', color: '#D4AF37' }}>{product.category}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" style={{ color: '#D4AF37', fill: '#D4AF37' }} />
                      <span className="text-sm font-medium" style={{ color: colors.text }}>{product.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-serif font-bold text-lg mb-2 line-clamp-2 transition-colors duration-300" style={{ color: hoveredProduct === product.id ? '#D4AF37' : colors.text }}>{product.title}</h3>
                  <p className="text-sm mb-4 line-clamp-2" style={{ color: colors.textMuted }}>{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold" style={{ color: '#D4AF37' }}>₹{product.price}</span>
                      {product.originalPrice > product.price && <span className="text-sm line-through" style={{ color: colors.textMuted }}>₹{Math.round(product.originalPrice)}</span>}
                    </div>
                  </div>
                  <button onClick={() => handleAddToCart(product)} disabled={!product.inStock} className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: product.inStock ? (isDark ? '#D4AF37' : '#2D3E50') : '#CCCCCC', color: product.inStock ? (isDark ? '#101820' : '#FFFFFF') : '#666666' }}>
                    <ShoppingCart className="w-5 h-5" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto mb-4" style={{ color: colors.textMuted }} />
              <p className="text-xl" style={{ color: colors.textMuted }}>No products found</p>
            </div>
          )}
        </div>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
};

export default Shop;
