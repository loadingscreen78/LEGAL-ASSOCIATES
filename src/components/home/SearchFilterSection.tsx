import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Scale, FileText, TrendingUp, Sparkles, Book } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useProducts, Product } from '@/hooks/useProducts';

export const SearchFilterSection = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { products, loading: productsLoading } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [typingText, setTypingText] = useState('');
  const navigate = useNavigate();

  const placeholders = ["Search for legal books...", "Find journals...", "Browse catalogs..."];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Calculate category counts from real products
  const categoryCounts = useMemo(() => {
    const counts = {
      all: products.length,
      books: products.filter(p => p.category === 'books').length,
      journals: products.filter(p => p.category === 'journals').length,
      catalogs: products.filter(p => p.category === 'catalogs').length,
    };
    return counts;
  }, [products]);

  const categories = [
    { id: 'all', label: 'All', icon: BookOpen, count: categoryCounts.all },
    { id: 'books', label: 'Books', icon: Book, count: categoryCounts.books },
    { id: 'journals', label: 'Journals', icon: FileText, count: categoryCounts.journals },
    { id: 'catalogs', label: 'Catalogs', icon: Scale, count: categoryCounts.catalogs },
  ];

  // Get recently added products (last 3)
  const recentProducts = useMemo(() => {
    return products.slice(0, 3).map(p => ({
      id: p.id,
      title: p.title,
      category: p.category
    }));
  }, [products]);

  // Filter products based on search term for suggestions
  const filteredSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return products
      .filter(p => 
        p.title.toLowerCase().includes(term) || 
        p.author?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
      )
      .slice(0, 6);
  }, [searchTerm, products]);

  // Get popular product titles for quick search
  const popularSearches = useMemo(() => {
    return products.slice(0, 4).map(p => p.title);
  }, [products]);

  useEffect(() => {
    if (isSearchFocused) return;
    let charIndex = 0;
    const currentPlaceholder = placeholders[placeholderIndex];
    const typeInterval = setInterval(() => {
      if (charIndex <= currentPlaceholder.length) {
        setTypingText(currentPlaceholder.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => setPlaceholderIndex((prev) => (prev + 1) % placeholders.length), 2000);
      }
    }, 100);
    return () => clearInterval(typeInterval);
  }, [placeholderIndex, isSearchFocused]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm);
    if (activeCategory !== 'all') params.set('category', activeCategory);
    navigate(`/shop?${params.toString()}`);
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (categoryId !== 'all') {
      navigate(`/shop?category=${categoryId}`);
    }
  };

  const handleSuggestionClick = (product: Product) => {
    navigate(`/shop?search=${encodeURIComponent(product.title)}`);
  };

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: isDark ? '#101820' : '#2D3E50' }}>
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full animate-float" style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)' }} />
      <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full animate-float" style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)', animationDelay: '2s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(212, 175, 55, 0.2)', border: '1px solid rgba(212, 175, 55, 0.4)' }}>
            <Sparkles className="w-4 h-4" style={{ color: '#D4AF37' }} />
            <span className="text-sm font-medium" style={{ color: '#D4AF37' }}>Smart Search</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4" style={{ color: '#FFFFFF' }}>
            Find Your <span style={{ color: '#D4AF37' }}>Legal Resources</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Search through our collection of {products.length > 0 ? products.length : '500'}+ legal publications
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="relative mb-8 transition-all duration-500" style={{ transform: isSearchFocused ? 'scale(1.02)' : 'scale(1)' }}>
            <div 
              className="relative rounded-2xl overflow-hidden transition-all duration-300" 
              style={{ 
                background: isDark ? '#1a2a3a' : '#FFFFFF', 
                boxShadow: isSearchFocused ? '0 20px 60px rgba(0,0,0,0.3), 0 0 0 2px #D4AF37' : '0 10px 40px rgba(0,0,0,0.2)' 
              }}
            >
              <div className="flex items-center">
                <div className="pl-6">
                  <Search className="w-6 h-6" style={{ color: isSearchFocused ? '#D4AF37' : (isDark ? '#D4AF37' : '#2D3E50') }} />
                </div>
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  onFocus={() => { setIsSearchFocused(true); setShowSuggestions(true); }} 
                  onBlur={() => { setIsSearchFocused(false); setTimeout(() => setShowSuggestions(false), 200); }} 
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
                  placeholder={isSearchFocused ? "Type to search..." : typingText} 
                  className="flex-1 px-4 py-5 text-lg bg-transparent outline-none" 
                  style={{ color: isDark ? '#FFFFFF' : '#2D3E50' }} 
                />
                <button 
                  onClick={handleSearch} 
                  className="m-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105" 
                  style={{ background: '#D4AF37', color: '#2D3E50' }}
                >
                  Search
                </button>
              </div>
            </div>

            {/* Live Suggestions from Firebase */}
            {showSuggestions && searchTerm && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-50 animate-slide-up" 
                style={{ 
                  background: isDark ? '#1a2a3a' : '#FFFFFF', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)' 
                }}
              >
                {productsLoading ? (
                  <div className="px-6 py-4 text-center" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : '#666666' }}>
                    Searching...
                  </div>
                ) : filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((product) => (
                    <div 
                      key={product.id} 
                      className="px-6 py-4 cursor-pointer transition-all duration-200 flex items-center gap-3" 
                      style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)' }} 
                      onMouseDown={() => handleSuggestionClick(product)}
                      onMouseEnter={(e) => e.currentTarget.style.background = isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(212, 175, 55, 0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <Search className="w-4 h-4" style={{ color: '#D4AF37' }} />
                      <div className="flex-1">
                        <span style={{ color: isDark ? '#FFFFFF' : '#2D3E50' }}>{product.title}</span>
                        {product.author && (
                          <span className="ml-2 text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#999999' }}>
                            by {product.author}
                          </span>
                        )}
                      </div>
                      <span 
                        className="text-xs px-2 py-1 rounded-full capitalize" 
                        style={{ background: 'rgba(212, 175, 55, 0.2)', color: '#D4AF37' }}
                      >
                        {product.category}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-4" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : '#666666' }}>
                    No products found for "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <button 
                  key={category.id} 
                  onClick={() => handleCategoryClick(category.id)} 
                  className="flex items-center gap-2 px-5 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105" 
                  style={{ 
                    background: isActive ? '#D4AF37' : 'rgba(255, 255, 255, 0.1)', 
                    color: isActive ? '#2D3E50' : '#FFFFFF', 
                    border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.2)' 
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.label}</span>
                  <span 
                    className="text-xs px-2 py-0.5 rounded-full" 
                    style={{ 
                      background: isActive ? 'rgba(45, 62, 80, 0.2)' : 'rgba(212, 175, 55, 0.3)', 
                      color: isActive ? '#2D3E50' : '#D4AF37' 
                    }}
                  >
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Popular Searches & Recently Added */}
          <div className="grid md:grid-cols-2 gap-6">
            <div 
              className="p-6 rounded-2xl" 
              style={{ 
                background: isDark ? 'rgba(26, 42, 58, 0.5)' : 'rgba(255, 255, 255, 0.05)', 
                border: isDark ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)' 
              }}
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#D4AF37' }}>
                <TrendingUp className="w-5 h-5" />Popular Products
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.length > 0 ? popularSearches.map((term, index) => (
                  <button 
                    key={index} 
                    onClick={() => { setSearchTerm(term); navigate(`/shop?search=${encodeURIComponent(term)}`); }} 
                    className="px-4 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105" 
                    style={{ 
                      background: isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255, 255, 255, 0.1)', 
                      color: '#FFFFFF', 
                      border: isDark ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)' 
                    }}
                  >
                    {term.length > 25 ? term.substring(0, 25) + '...' : term}
                  </button>
                )) : (
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>No products yet</span>
                )}
              </div>
            </div>

            <div 
              className="p-6 rounded-2xl" 
              style={{ 
                background: isDark ? 'rgba(26, 42, 58, 0.5)' : 'rgba(255, 255, 255, 0.05)', 
                border: isDark ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)' 
              }}
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#D4AF37' }}>
                <Sparkles className="w-5 h-5" />Recently Added
              </h3>
              <div className="space-y-3">
                {recentProducts.length > 0 ? recentProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="flex items-center justify-between p-3 rounded-lg transition-all duration-300 cursor-pointer hover:bg-white/10" 
                    onClick={() => navigate(`/shop?search=${encodeURIComponent(product.title)}`)}
                  >
                    <span style={{ color: '#FFFFFF' }}>
                      {product.title.length > 30 ? product.title.substring(0, 30) + '...' : product.title}
                    </span>
                    <span 
                      className="text-xs px-2 py-1 rounded-full capitalize" 
                      style={{ background: 'rgba(212, 175, 55, 0.2)', color: '#D4AF37' }}
                    >
                      {product.category}
                    </span>
                  </div>
                )) : (
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>No products yet</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
