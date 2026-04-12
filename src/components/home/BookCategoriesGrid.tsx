import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Scale, FileText, Gavel, BookMarked, Library, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const categories = [
  { id: 1, title: 'Law Journals', description: 'Comprehensive legal journals covering all aspects of Indian law', icon: BookOpen, link: '/journals', count: '50+', color: '#3B82F6' },
  { id: 2, title: 'Bare Acts', description: 'Complete collection of Indian bare acts and statutes', icon: FileText, link: '/books', count: '200+', color: '#10B981' },
  { id: 3, title: 'Case Reports', description: 'Detailed case reports from High Courts and Supreme Court', icon: Gavel, link: '/orissa-criminal-reports', count: '100+', color: '#F59E0B' },
  { id: 4, title: 'Legal Digests', description: 'Comprehensive digests for quick legal reference', icon: BookMarked, link: '/books', count: '75+', color: '#8B5CF6' },
  { id: 5, title: 'Commentaries', description: 'Expert commentaries on various legal subjects', icon: Scale, link: '/books', count: '50+', color: '#EC4899' },
  { id: 6, title: 'Reference Books', description: 'Essential reference materials for legal professionals', icon: Library, link: '/books', count: '25+', color: '#06B6D4' },
];

export const BookCategoriesGrid = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const colors = {
    bg: isDark ? '#101820' : '#FFFFFF',
    cardBg: isDark ? '#1a2a3a' : '#F8F9FA',
    cardHoverBg: isDark ? '#D4AF37' : '#2D3E50',
    text: isDark ? '#FFFFFF' : '#2D3E50',
    textMuted: isDark ? 'rgba(255,255,255,0.6)' : '#666666',
  };

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden" style={{ background: colors.bg }}>
      <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />
      <div className="absolute top-40 left-0 w-96 h-96 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
              <Sparkles className="w-4 h-4" style={{ color: '#D4AF37' }} />
              <span className="text-sm font-medium" style={{ color: '#D4AF37' }}>Our Collection</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4" style={{ color: colors.text }}>
              Browse by <span style={{ color: '#D4AF37' }}>Category</span>
            </h2>
            <p className="text-lg max-w-xl" style={{ color: colors.textMuted }}>Explore our extensive collection of legal publications</p>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 group" style={{ background: isDark ? '#D4AF37' : '#2D3E50', color: isDark ? '#101820' : '#FFFFFF' }}>
            View All Books <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isHovered = hoveredCard === category.id;
            return (
              <Link key={category.id} to={category.link} onMouseEnter={() => setHoveredCard(category.id)} onMouseLeave={() => setHoveredCard(null)}
                className={`group relative overflow-hidden rounded-3xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}>
                <div className="relative h-[280px] p-8 transition-all duration-500"
                  style={{ background: isHovered ? colors.cardHoverBg : colors.cardBg, boxShadow: isHovered ? '0 25px 50px rgba(0,0,0,0.2)' : isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)', transform: isHovered ? 'translateY(-8px)' : 'translateY(0)', border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(212, 175, 55, 0.1)'}` }}>
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${category.color}20 0%, transparent 70%)`, opacity: isHovered ? 0.5 : 0.3 }} />
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-auto">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300" style={{ background: isHovered ? 'rgba(212, 175, 55, 0.3)' : `${category.color}15`, transform: isHovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0)' }}>
                        <Icon className="w-8 h-8" style={{ color: isHovered ? '#D4AF37' : category.color }} />
                      </div>
                      <span className="px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300" style={{ background: isHovered ? 'rgba(212, 175, 55, 0.3)' : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(45, 62, 80, 0.1)', color: isHovered ? '#D4AF37' : colors.text }}>{category.count}</span>
                    </div>
                    <div className="mt-auto">
                      <h3 className="text-2xl font-serif font-bold mb-3 transition-colors duration-300" style={{ color: isHovered ? (isDark ? '#101820' : '#FFFFFF') : colors.text }}>{category.title}</h3>
                      <p className="text-sm line-clamp-2 transition-colors duration-300" style={{ color: isHovered ? (isDark ? 'rgba(16,24,32,0.7)' : 'rgba(255,255,255,0.7)') : colors.textMuted }}>{category.description}</p>
                    </div>
                    <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300" style={{ background: '#D4AF37', transform: isHovered ? 'translateX(0) scale(1)' : 'translateX(20px) scale(0)', opacity: isHovered ? 1 : 0 }}>
                      <ArrowRight className="w-5 h-5" style={{ color: '#2D3E50' }} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
