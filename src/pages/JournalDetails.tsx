import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, Minus, Plus, Loader2 } from 'lucide-react';
import { useProducts, Product } from '@/hooks/useProducts';
import { useTheme } from '@/contexts/ThemeContext';

const JournalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [quantity, setQuantity] = useState(1);
  const [journal, setJournal] = useState<Product | null>(null);

  useEffect(() => {
    if (!id || loading) return;
    
    // Find journal by Firebase document ID
    const foundJournal = products.find(p => p.id === id && p.category === 'journals');
    
    if (foundJournal) {
      setJournal(foundJournal);
    } else {
      // Try to find by index for backward compatibility
      const journals = products.filter(p => p.category === 'journals');
      const indexId = parseInt(id);
      if (!isNaN(indexId) && indexId > 0 && indexId <= journals.length) {
        setJournal(journals[indexId - 1]);
      }
    }
  }, [id, products, loading]);

  const colors = {
    bg: isDark ? '#101820' : '#F8F9FA',
    cardBg: isDark ? '#1a2a3a' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#2D3E50',
    textMuted: isDark ? 'rgba(255,255,255,0.6)' : '#666666',
    border: isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0,0,0,0.1)',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto animate-spin" style={{ color: '#D4AF37' }} />
          <p className="mt-4" style={{ color: colors.textMuted }}>Loading journal...</p>
        </div>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: colors.text }}>Journal Not Found</h1>
          <p className="mb-6" style={{ color: colors.textMuted }}>The journal you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/journals')}
            className="px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
            style={{ background: '#D4AF37', color: '#2D3E50' }}
          >
            Back to Journals
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: journal.id,
        title: journal.title,
        price: journal.price,
        image: journal.image_url || '/lovable-uploads/bd9562f0-5286-4441-82a0-f16eac646a5f.png',
        category: 'journals'
      });
    }
    setQuantity(1);
  };

  return (
    <div className="min-h-screen" style={{ background: colors.bg }}>
      <Navigation mobileTitle="Journal" mobileShowBack />
      
      <main className="pt-20 md:pt-24 pb-32 md:pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back Button - desktop only (mobile uses top-bar back) */}
          <div className="hidden md:flex items-center mb-8">
            <button 
              onClick={() => navigate('/journals')}
              className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(45, 62, 80, 0.1)', color: colors.text }}
            >
              <ArrowLeft size={20} />
              Back to Journals
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Journal Image */}
            <div className="animate-fade-in">
              <div className="relative group">
                <img 
                  src={journal.image_url || '/lovable-uploads/bd9562f0-5286-4441-82a0-f16eac646a5f.png'} 
                  alt={journal.title}
                  className="w-full max-w-md mx-auto rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  style={{ boxShadow: isDark ? '0 25px 50px rgba(0,0,0,0.5)' : '0 25px 50px rgba(0,0,0,0.15)' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/lovable-uploads/bd9562f0-5286-4441-82a0-f16eac646a5f.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Journal Details */}
            <div className="space-y-6">
              {/* Title and Description */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ background: 'rgba(212, 175, 55, 0.2)' }}>
                  <span className="text-sm font-medium" style={{ color: '#D4AF37' }}>Journal</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: colors.text }}>
                  {journal.title}
                </h1>
                {journal.author && (
                  <p className="text-lg mb-4" style={{ color: '#D4AF37' }}>
                    by {journal.author}
                  </p>
                )}
                <p className="text-lg mb-6" style={{ color: colors.textMuted }}>
                  {journal.description || 'Comprehensive legal resource for professionals and students.'}
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <span 
                    className="px-4 py-2 rounded-full text-sm font-semibold"
                    style={{ background: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)' }}
                  >
                    Edition {new Date(journal.created_at).getFullYear()}
                  </span>
                  <span 
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${journal.stock > 0 ? '' : ''}`}
                    style={{ 
                      background: journal.stock > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                      color: journal.stock > 0 ? '#10B981' : '#EF4444',
                      border: `1px solid ${journal.stock > 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                    }}
                  >
                    {journal.stock > 0 ? `${journal.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>

              {/* Price Card */}
              <div 
                className="p-6 rounded-2xl"
                style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg" style={{ color: colors.textMuted }}>Price</span>
                  <span className="text-3xl font-bold" style={{ color: '#D4AF37' }}>
                    ₹{journal.price.toFixed(2)}
                  </span>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between mb-6">
                  <span style={{ color: colors.text }}>Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                      style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', color: '#D4AF37' }}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-bold text-xl" style={{ color: colors.text }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(journal.stock, quantity + 1))}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                      style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', color: '#D4AF37' }}
                      disabled={quantity >= journal.stock}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div 
                  className="flex items-center justify-between p-4 rounded-xl mb-6"
                  style={{ background: isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(212, 175, 55, 0.05)' }}
                >
                  <span className="text-lg font-semibold" style={{ color: colors.text }}>Total</span>
                  <span className="text-2xl font-bold" style={{ color: '#D4AF37' }}>
                    ₹{(journal.price * quantity).toFixed(2)}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={journal.stock === 0}
                  className="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    background: journal.stock > 0 ? '#D4AF37' : '#666666', 
                    color: '#2D3E50',
                    boxShadow: journal.stock > 0 ? '0 4px 20px rgba(212, 175, 55, 0.3)' : 'none'
                  }}
                >
                  {journal.stock > 0 ? `🛒 Add to Cart (${quantity} ${quantity === 1 ? 'copy' : 'copies'})` : 'Out of Stock'}
                </button>

                <p className="text-sm text-center mt-4" style={{ color: colors.textMuted }}>
                  📦 Free shipping on orders above ₹500
                </p>
              </div>

              {/* Description Card */}
              {journal.description && (
                <div 
                  className="p-6 rounded-2xl"
                  style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)' }}
                >
                  <h3 className="text-xl font-serif font-bold mb-4 flex items-center gap-2" style={{ color: '#D4AF37' }}>
                    📖 About This Journal
                  </h3>
                  <p className="leading-relaxed" style={{ color: colors.textMuted }}>
                    {journal.description}
                  </p>
                </div>
              )}

              {/* Author Card */}
              {journal.author && (
                <div 
                  className="p-6 rounded-2xl"
                  style={{ background: colors.cardBg, border: `1px solid ${colors.border}`, boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)' }}
                >
                  <h3 className="text-xl font-serif font-bold mb-4 flex items-center gap-2" style={{ color: '#D4AF37' }}>
                    👤 Author / Editor
                  </h3>
                  <p style={{ color: colors.text }}>{journal.author}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sticky Add-to-Cart bar — sits above the tab bar */}
      <div
        className="md:hidden fixed left-0 right-0 z-40 px-4 pt-3 pb-safe surface-blur"
        style={{
          bottom: 'calc(64px + env(safe-area-inset-bottom))',
          background: isDark ? 'rgba(11,16,23,0.88)' : 'rgba(246,247,251,0.94)',
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wide" style={{ color: colors.textMuted }}>
              {journal.stock > 0 ? 'Total' : 'Status'}
            </div>
            <div className="font-bold text-[18px]" style={{ color: '#D4AF37' }}>
              {journal.stock > 0 ? `₹${(journal.price * quantity).toFixed(2)}` : 'Out of stock'}
            </div>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full flex items-center justify-center tap-fade"
              style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37' }}
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-semibold" style={{ color: colors.text }}>
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(Math.max(1, journal.stock), quantity + 1))}
              className="w-10 h-10 rounded-full flex items-center justify-center tap-fade disabled:opacity-40"
              disabled={quantity >= journal.stock}
              style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37' }}
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={journal.stock === 0}
            className="h-11 px-5 rounded-full font-semibold text-[13px] tap-fade disabled:opacity-50"
            style={{
              background: '#D4AF37',
              color: '#101820',
              boxShadow: '0 10px 24px rgba(212,175,55,0.35)',
            }}
          >
            Add to cart
          </button>
        </div>
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
};

export default JournalDetails;
