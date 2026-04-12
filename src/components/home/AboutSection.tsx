import { useEffect, useRef, useState } from 'react';
import { Phone, Mail, MapPin, Award, Users, BookOpen, Scale, ArrowRight, Clock, Target, Sparkles, Rocket, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

const timelineEvents = [
  { year: '1980', title: 'The Beginning', description: 'Founded a small bookstore in Cuttack with just 50 law books and a vision to serve legal professionals', icon: Sparkles, color: '#D4AF37' },
  { year: '1992', title: 'First Publication', description: 'Published our first legal commentary on Odisha laws, marking our entry into publishing', icon: BookOpen, color: '#3B82F6' },
  { year: '2005', title: 'Major Expansion', description: 'Expanded to cover all major areas of Indian law with 500+ titles in our catalog', icon: Target, color: '#10B981' },
  { year: '2015', title: 'Digital Revolution', description: 'Launched online presence and digital catalog reaching customers across India', icon: Globe, color: '#8B5CF6' },
  { year: '2024', title: 'Modern Era', description: 'State-of-the-art e-commerce platform with 50,000+ satisfied customers nationwide', icon: Rocket, color: '#EC4899' },
];

const bentoItems = [
  { icon: Award, value: '40+', label: 'Years of Excellence', description: 'Trusted since 1980', size: 'large' },
  { icon: BookOpen, value: '500+', label: 'Publications', description: 'Legal literature', size: 'small' },
  { icon: Users, value: '50K+', label: 'Happy Customers', description: 'Across India', size: 'small' },
  { icon: Scale, value: '100%', label: 'Quality Assured', description: 'Expert reviewed', size: 'medium' },
];

export const AboutSection = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isVisible, setIsVisible] = useState(false);
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [hoveredBento, setHoveredBento] = useState<number | null>(null);
  const [hoveredTimeline, setHoveredTimeline] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => setActiveTimeline((prev) => (prev + 1) % timelineEvents.length), 4000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  // Theme-aware colors
  const colors = {
    bg: isDark ? '#101820' : '#F8F9FA',
    cardBg: isDark ? '#1a2a3a' : '#FFFFFF',
    cardHoverBg: isDark ? '#D4AF37' : '#2D3E50',
    text: isDark ? '#FFFFFF' : '#2D3E50',
    textMuted: isDark ? 'rgba(255,255,255,0.6)' : '#666666',
    border: isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(212, 175, 55, 0.1)',
  };

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden" style={{ background: colors.bg }}>
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />
      <div className="absolute top-40 right-0 w-96 h-96 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)' }} />
      <div className="absolute bottom-40 left-0 w-64 h-64 rounded-full opacity-30" style={{ background: isDark ? 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(45, 62, 80, 0.1) 0%, transparent 70%)' }} />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
            <Scale className="w-4 h-4" style={{ color: '#D4AF37' }} />
            <span className="text-sm font-medium" style={{ color: '#D4AF37' }}>About Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6" style={{ color: colors.text }}>
            Legal <span style={{ color: '#D4AF37' }}>Associates</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.textMuted }}>
            A cornerstone of legal education and professional development in India since 1980
          </p>
        </div>

        {/* Bento Grid */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-32 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {bentoItems.map((item, index) => {
            const Icon = item.icon;
            const isLarge = item.size === 'large';
            const isMedium = item.size === 'medium';
            const isHovered = hoveredBento === index;
            return (
              <div
                key={index}
                className={`relative p-6 md:p-8 rounded-3xl transition-all duration-500 cursor-pointer ${isLarge ? 'col-span-2 row-span-2' : isMedium ? 'col-span-2' : ''}`}
                style={{
                  background: isHovered ? colors.cardHoverBg : colors.cardBg,
                  boxShadow: isHovered ? '0 25px 50px rgba(45, 62, 80, 0.2)' : isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)',
                  transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                  border: `1px solid ${colors.border}`
                }}
                onMouseEnter={() => setHoveredBento(index)}
                onMouseLeave={() => setHoveredBento(null)}
              >
                <div className={`${isLarge ? 'w-16 h-16' : 'w-12 h-12'} rounded-2xl flex items-center justify-center mb-4 transition-all duration-300`} style={{ background: isHovered ? 'rgba(212, 175, 55, 0.3)' : 'rgba(212, 175, 55, 0.15)' }}>
                  <Icon className={`${isLarge ? 'w-8 h-8' : 'w-6 h-6'}`} style={{ color: '#D4AF37' }} />
                </div>
                <div className={`${isLarge ? 'text-5xl md:text-6xl' : 'text-3xl md:text-4xl'} font-bold mb-2 transition-colors duration-300`} style={{ color: isHovered ? (isDark ? '#101820' : '#FFFFFF') : colors.text }}>{item.value}</div>
                <div className={`${isLarge ? 'text-xl' : 'text-lg'} font-semibold mb-1 transition-colors duration-300`} style={{ color: '#D4AF37' }}>{item.label}</div>
                <p className="text-sm transition-colors duration-300" style={{ color: isHovered ? (isDark ? 'rgba(16,24,32,0.7)' : 'rgba(255,255,255,0.7)') : colors.textMuted }}>{item.description}</p>
                {isLarge && <div className="absolute bottom-6 right-6 w-24 h-24 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)' }} />}
              </div>
            );
          })}
        </div>

        {/* Interactive Curved Timeline */}
        <div className={`mb-32 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: colors.text }}>
              Our Journey <span style={{ color: '#D4AF37' }}>Through Time</span>
            </h3>
            <p style={{ color: colors.textMuted }}>Four decades of excellence in legal publishing</p>
          </div>

          {/* Desktop Curved Timeline */}
          <div className="hidden lg:block relative" style={{ minHeight: '500px' }}>
            {/* SVG Curved Path */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 500" preserveAspectRatio="none">
              <defs>
                <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.2" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              
              {/* Main Curved Path */}
              <path
                d="M 50,250 C 200,100 300,400 500,250 C 700,100 800,400 1000,250 C 1100,180 1150,250 1150,250"
                stroke="url(#curveGradient)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                filter="url(#glow)"
              />
              
              {/* Animated Particle */}
              <circle r="8" fill="#D4AF37" filter="url(#glow)">
                <animateMotion dur="10s" repeatCount="indefinite" path="M 50,250 C 200,100 300,400 500,250 C 700,100 800,400 1000,250 C 1100,180 1150,250 1150,250" />
              </circle>
            </svg>

            {/* Timeline Points */}
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              const isActive = activeTimeline === index;
              const isHovered = hoveredTimeline === index;
              
              const positions = [
                { x: '8%', y: '50%', cardY: '70%' },
                { x: '28%', y: '20%', cardY: '35%' },
                { x: '48%', y: '70%', cardY: '0%' },
                { x: '68%', y: '25%', cardY: '40%' },
                { x: '88%', y: '50%', cardY: '65%' },
              ];

              return (
                <div key={index}>
                  {/* Milestone Point */}
                  <div
                    className="absolute cursor-pointer transition-all duration-500 z-20"
                    style={{ left: positions[index].x, top: positions[index].y, transform: 'translate(-50%, -50%)' }}
                    onMouseEnter={() => { setHoveredTimeline(index); setActiveTimeline(index); }}
                    onMouseLeave={() => setHoveredTimeline(null)}
                    onClick={() => setActiveTimeline(index)}
                  >
                    {/* Pulse Ring */}
                    {(isActive || isHovered) && (
                      <div className="absolute inset-0 rounded-full animate-ping" style={{ width: '70px', height: '70px', background: `${event.color}30`, transform: 'translate(-50%, -50%) translate(35px, 35px)' }} />
                    )}
                    
                    {/* Circle */}
                    <div
                      className="relative rounded-full flex items-center justify-center transition-all duration-500"
                      style={{
                        width: isActive || isHovered ? '70px' : '56px',
                        height: isActive || isHovered ? '70px' : '56px',
                        background: isActive || isHovered ? event.color : colors.cardBg,
                        boxShadow: isActive || isHovered ? `0 0 40px ${event.color}60` : isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.1)',
                        border: `3px solid ${event.color}`
                      }}
                    >
                      <Icon style={{ width: isActive || isHovered ? '32px' : '26px', height: isActive || isHovered ? '32px' : '26px', color: isActive || isHovered ? '#FFFFFF' : event.color }} />
                    </div>
                    
                    {/* Year */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 font-bold text-lg whitespace-nowrap" style={{ color: isActive || isHovered ? event.color : colors.textMuted }}>
                      {event.year}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div
                    className="absolute transition-all duration-500 z-10"
                    style={{
                      left: `calc(${positions[index].x} - 140px)`,
                      top: positions[index].cardY,
                      width: '280px',
                      opacity: isActive || isHovered ? 1 : 0.5,
                      transform: isActive || isHovered ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    <div
                      className="p-6 rounded-2xl transition-all duration-500"
                      style={{
                        background: isActive || isHovered ? (isDark ? '#1a2a3a' : '#2D3E50') : colors.cardBg,
                        boxShadow: isActive || isHovered ? `0 20px 40px rgba(0,0,0,0.3), 0 0 0 2px ${event.color}` : isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)',
                        borderLeft: `4px solid ${event.color}`
                      }}
                    >
                      <h4 className="font-serif font-bold text-xl mb-2" style={{ color: isActive || isHovered ? '#FFFFFF' : colors.text }}>{event.title}</h4>
                      <p className="text-sm leading-relaxed" style={{ color: isActive || isHovered ? 'rgba(255,255,255,0.8)' : colors.textMuted }}>{event.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Timeline */}
          <div className="lg:hidden relative pl-20">
            <svg className="absolute left-8 top-0 w-4 h-full" viewBox="0 0 16 100" preserveAspectRatio="none">
              <path d="M 8,0 Q 2,25 8,50 Q 14,75 8,100" stroke="#D4AF37" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
            
            <div className="space-y-8">
              {timelineEvents.map((event, index) => {
                const Icon = event.icon;
                const isActive = activeTimeline === index;
                return (
                  <div key={index} className="relative" onClick={() => setActiveTimeline(index)}>
                    <div className="absolute -left-12 top-6 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer" style={{ background: isActive ? event.color : colors.cardBg, border: `3px solid ${event.color}`, boxShadow: isActive ? `0 0 20px ${event.color}50` : isDark ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.1)' }}>
                      <Icon className="w-5 h-5" style={{ color: isActive ? '#FFFFFF' : event.color }} />
                    </div>
                    <div className="p-5 rounded-2xl transition-all duration-300" style={{ background: isActive ? (isDark ? '#1a2a3a' : '#2D3E50') : colors.cardBg, boxShadow: isActive ? '0 15px 30px rgba(0,0,0,0.2)' : isDark ? '0 4px 15px rgba(0,0,0,0.2)' : '0 4px 15px rgba(0,0,0,0.05)', borderLeft: `4px solid ${event.color}` }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-lg" style={{ color: event.color }}>{event.year}</span>
                      </div>
                      <h4 className="font-serif font-bold text-lg mb-2" style={{ color: isActive ? '#FFFFFF' : colors.text }}>{event.title}</h4>
                      <p className="text-sm" style={{ color: isActive ? 'rgba(255,255,255,0.8)' : colors.textMuted }}>{event.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {timelineEvents.map((event, index) => (
              <button key={index} onClick={() => setActiveTimeline(index)} className="relative transition-all duration-300" style={{ width: activeTimeline === index ? '40px' : '12px', height: '12px', borderRadius: '6px', background: activeTimeline === index ? event.color : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(45, 62, 80, 0.2)' }}>
                {activeTimeline === index && <span className="absolute inset-0 rounded-full animate-ping" style={{ background: `${event.color}40` }} />}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Card */}
        <div className={`relative overflow-hidden rounded-3xl p-8 md:p-12 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ background: 'linear-gradient(135deg, #2D3E50 0%, #101820 100%)' }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)' }} />

          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: '#FFFFFF' }}>Visit Our <span style={{ color: '#D4AF37' }}>Store</span></h3>
              <p className="mb-6" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Experience our extensive collection of legal publications in person.</p>
              <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105" style={{ background: '#D4AF37', color: '#101820' }}>
                Browse Collection <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { icon: MapPin, title: 'Location', text: 'High Court Road, Cuttack - 753002, Odisha' },
                { icon: Phone, title: 'Phone', text: '0671-2910130 | 94370-19131' },
                { icon: Mail, title: 'Email', text: 'legalassociates.ocr@gmail.com' },
                { icon: Clock, title: 'Hours', text: 'Mon-Sat: 10:00 AM - 8:00 PM' },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212, 175, 55, 0.2)' }}>
                      <Icon className="w-5 h-5" style={{ color: '#D4AF37' }} />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: '#FFFFFF' }}>{item.title}</p>
                      <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
