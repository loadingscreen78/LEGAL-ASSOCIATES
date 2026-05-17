import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useProducts } from '@/hooks/useProducts';
import { EditableText } from '@/components/admin/EditableText';

export const TopJournalsCarousel = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { products, loading } = useProducts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const navigate = useNavigate();

  // Filter only journals and get latest 10
  const journals = useMemo(() => {
    const journalProducts = products
      .filter(p => p.category === 'journals' && p.is_active)
      .slice(0, 10)
      .map(p => {
        console.log('Journal product:', p.title, 'Image URL:', p.image_url);
        return {
          id: p.id,
          title: p.title,
          image: p.image_url && p.image_url.trim() !== '' 
            ? p.image_url 
            : '/lovable-uploads/bd9562f0-5286-4441-82a0-f16eac646a5f.png',
          description: p.description || 'Legal journal publication',
          year: new Date(p.created_at).getFullYear().toString(),
          category: 'Journal',
          author: p.author || '',
          price: p.price,
          stock: p.stock
        };
      });
    console.log('Total journals found:', journalProducts.length);
    return journalProducts;
  }, [products]);

  useEffect(() => {
    if (!isAutoPlaying || journals.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % journals.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, journals.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    if (journals.length > 0) {
      goToSlide((currentIndex + 1) % journals.length);
    }
  };

  const prevSlide = () => {
    if (journals.length > 0) {
      goToSlide((currentIndex - 1 + journals.length) % journals.length);
    }
  };

  const getVisibleJournals = () => {
    if (journals.length === 0) return [];
    const visible = [];
    for (let i = -1; i <= 2; i++) {
      const index = (currentIndex + i + journals.length) % journals.length;
      visible.push({ ...journals[index], position: i });
    }
    return visible;
  };

  const colors = {
    bg: isDark ? '#101820' : '#F8F9FA',
    cardBg: isDark ? '#1a2a3a' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#2D3E50',
    textMuted: isDark ? 'rgba(255,255,255,0.6)' : '#666666',
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-24 relative overflow-hidden" style={{ background: isDark ? 'linear-gradient(180deg, #101820 0%, #1a2a3a 50%, #101820 100%)' : 'linear-gradient(180deg, #F8F9FA 0%, #FFFFFF 50%, #F8F9FA 100%)' }}>
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="w-12 h-12 mx-auto animate-spin" style={{ color: '#D4AF37' }} />
          <p className="mt-4" style={{ color: colors.textMuted }}>Loading journals...</p>
        </div>
      </section>
    );
  }

  // No journals state
  if (journals.length === 0) {
    return (
      <section className="py-24 relative overflow-hidden" style={{ background: isDark ? 'linear-gradient(180deg, #101820 0%, #1a2a3a 50%, #101820 100%)' : 'linear-gradient(180deg, #F8F9FA 0%, #FFFFFF 50%, #F8F9FA 100%)' }}>
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
            <BookOpen className="w-4 h-4" style={{ color: '#D4AF37' }} />
            <span className="text-sm font-medium" style={{ color: '#D4AF37' }}>Featured Publications</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4" style={{ color: colors.text }}>
            Top Legal <span style={{ color: '#D4AF37' }}>Journals</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: colors.textMuted }}>
            No journals available yet. Check back soon!
          </p>
          <button 
            onClick={() => navigate('/shop')} 
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105" 
            style={{ background: '#D4AF37', color: '#2D3E50' }}
          >
            Browse Shop <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: isDark ? 'linear-gradient(180deg, #101820 0%, #1a2a3a 50%, #101820 100%)' : 'linear-gradient(180deg, #F8F9FA 0%, #FFFFFF 50%, #F8F9FA 100%)' }}>
      <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)' }} />
      <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full opacity-10" style={{ background: isDark ? 'radial-gradient(circle, #D4AF37 0%, transparent 70%)' : 'radial-gradient(circle, #2D3E50 0%, transparent 70%)' }} />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
            <BookOpen className="w-4 h-4" style={{ color: '#D4AF37' }} />
            <EditableText keyName="topJournals.eyebrow" className="text-sm font-medium" style={{ color: '#D4AF37' }} />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4" style={{ color: colors.text }}>
            <EditableText keyName="topJournals.title" />{' '}
            <EditableText keyName="topJournals.titleAccent" style={{ color: '#D4AF37' }} />
          </h2>
          <EditableText keyName="topJournals.subtitle" as="p" multiline className="text-lg max-w-2xl mx-auto" style={{ color: colors.textMuted }} />
        </div>

        <div className="relative h-[500px] md:h-[550px]" onMouseEnter={() => setIsAutoPlaying(false)} onMouseLeave={() => setIsAutoPlaying(true)}>
          <div className="absolute inset-0 flex items-center justify-center">
            {getVisibleJournals().map((journal, idx) => {
              const isCenter = journal.position === 0;
              const isLeft = journal.position === -1;
              const isRight = journal.position === 1;
              const isFar = journal.position === 2;
              
              let transform = '', zIndex = 0, opacity = 1;
              if (isCenter) { transform = 'translateX(0) scale(1)'; zIndex = 30; }
              else if (isLeft) { transform = 'translateX(-120%) scale(0.85)'; zIndex = 20; opacity = 0.7; }
              else if (isRight) { transform = 'translateX(120%) scale(0.85)'; zIndex = 20; opacity = 0.7; }
              else if (isFar) { transform = 'translateX(240%) scale(0.7)'; zIndex = 10; opacity = 0.4; }

              return (
                <div 
                  key={`${journal.id}-${idx}`} 
                  className="absolute w-[300px] md:w-[350px] transition-all duration-700 ease-out cursor-pointer" 
                  style={{ transform, zIndex, opacity }}
                  onClick={() => isCenter && navigate(`/journal/${journal.id}`)}
                  onMouseEnter={() => isCenter && setHoveredCard(journal.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div 
                    className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${isCenter ? 'shadow-2xl' : 'shadow-lg'}`}
                    style={{ 
                      background: colors.cardBg, 
                      transform: hoveredCard === journal.id && isCenter ? 'translateY(-10px)' : 'translateY(0)', 
                      boxShadow: isCenter 
                        ? (isDark ? '0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(212, 175, 55, 0.2)' : '0 25px 50px rgba(45, 62, 80, 0.25), 0 0 0 1px rgba(212, 175, 55, 0.1)') 
                        : isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.1)' 
                    }}
                  >
                    {/* Image */}
                    <div className="relative h-[280px] overflow-hidden">
                      <img 
                        src={journal.image} 
                        alt={journal.title} 
                        className="w-full h-full object-cover transition-transform duration-700" 
                        style={{ transform: hoveredCard === journal.id ? 'scale(1.1)' : 'scale(1)' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/lovable-uploads/bd9562f0-5286-4441-82a0-f16eac646a5f.png';
                        }}
                      />
                      <div 
                        className="absolute inset-0 transition-opacity duration-500" 
                        style={{ background: 'linear-gradient(to top, rgba(45, 62, 80, 0.9) 0%, transparent 60%)', opacity: isCenter ? 1 : 0.5 }} 
                      />
                      
                      {/* Category Badge */}
                      <div 
                        className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold" 
                        style={{ background: '#D4AF37', color: '#2D3E50' }}
                      >
                        {journal.category}
                      </div>
                      
                      {/* Year Badge */}
                      <div 
                        className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1" 
                        style={{ background: isDark ? 'rgba(26,42,58,0.9)' : 'rgba(255,255,255,0.9)', color: colors.text }}
                      >
                        <Calendar className="w-3 h-3" />{journal.year}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-serif font-bold text-xl mb-2 line-clamp-2" style={{ color: colors.text }}>
                        {journal.title}
                      </h3>
                      {journal.author && (
                        <p className="text-sm mb-2" style={{ color: '#D4AF37' }}>
                          by {journal.author}
                        </p>
                      )}
                      <p className="text-sm mb-4 line-clamp-2" style={{ color: colors.textMuted }}>
                        {journal.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold" style={{ color: '#D4AF37' }}>
                          ₹{journal.price.toFixed(2)}
                        </span>
                        {isCenter && (
                          <div 
                            className="flex items-center gap-1 text-sm font-semibold transition-all duration-300" 
                            style={{ 
                              color: colors.text, 
                              transform: hoveredCard === journal.id ? 'translateX(5px)' : 'translateX(0)' 
                            }}
                          >
                            View Details <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide} 
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" 
            style={{ 
              background: colors.cardBg, 
              boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.1)', 
              border: '1px solid rgba(212, 175, 55, 0.3)' 
            }}
          >
            <ChevronLeft className="w-6 h-6" style={{ color: colors.text }} />
          </button>
          <button 
            onClick={nextSlide} 
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" 
            style={{ 
              background: colors.cardBg, 
              boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.1)', 
              border: '1px solid rgba(212, 175, 55, 0.3)' 
            }}
          >
            <ChevronRight className="w-6 h-6" style={{ color: colors.text }} />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-3 mt-8">
          {journals.map((_, index) => (
            <button 
              key={index} 
              onClick={() => goToSlide(index)} 
              className="relative w-3 h-3 rounded-full transition-all duration-300" 
              style={{ 
                background: index === currentIndex ? '#D4AF37' : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(45, 62, 80, 0.2)', 
                transform: index === currentIndex ? 'scale(1.3)' : 'scale(1)' 
              }}
            >
              {index === currentIndex && (
                <span className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(212, 175, 55, 0.4)' }} />
              )}
            </button>
          ))}
        </div>

        {/* Browse All Button */}
        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/journals')} 
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg" 
            style={{ 
              background: isDark ? '#D4AF37' : '#2D3E50', 
              color: isDark ? '#101820' : '#FFFFFF', 
              boxShadow: isDark ? '0 4px 20px rgba(212, 175, 55, 0.3)' : '0 4px 20px rgba(45, 62, 80, 0.3)' 
            }}
          >
            <EditableText keyName="topJournals.cta" /> <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
