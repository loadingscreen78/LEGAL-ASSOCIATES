import { useState, useEffect, useRef } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const testimonials = [
  { id: 1, name: 'Advocate Rajesh Kumar', role: 'Senior Advocate, High Court', image: '/lovable-uploads/10415a62-f1ba-4604-abce-029d57d3c401.png', content: 'Legal Associates has been my go-to source for legal publications for over 15 years. Their collection is comprehensive and the quality is unmatched.', rating: 5 },
  { id: 2, name: 'Dr. Priya Sharma', role: 'Law Professor, NLU', image: '/lovable-uploads/d90dde4b-fcdf-452e-9612-348fa7878292.png', content: 'The Orissa Criminal Reports series is an invaluable resource for legal research. I recommend Legal Associates to all my students.', rating: 5 },
  { id: 3, name: 'Advocate Suresh Patel', role: 'District Court Lawyer', image: '/lovable-uploads/20716325-0e93-4a46-bfec-60bd22b17411.png', content: 'Excellent service and prompt delivery. The team at Legal Associates truly understands the needs of legal professionals.', rating: 5 },
  { id: 4, name: 'Justice (Retd.) M.K. Das', role: 'Former High Court Judge', image: '/lovable-uploads/ea49d3b2-43d9-4804-a469-5140b187a2cd.png', content: 'A trusted name in legal publishing. Their commitment to quality and accuracy is commendable.', rating: 5 },
];

const stats = [
  { value: '4.9/5', label: 'Average Rating' },
  { value: '50K+', label: 'Happy Customers' },
  { value: '40+', label: 'Years of Trust' },
  { value: '500+', label: 'Publications' },
];

export const TestimonialsSection = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) { setIsAnimating(true); setCurrentIndex((prev) => (prev + 1) % testimonials.length); setTimeout(() => setIsAnimating(false), 500); }
    }, 5000);
    return () => clearInterval(interval);
  }, [isAnimating]);

  const navigate = (direction: 'prev' | 'next') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => direction === 'next' ? (prev + 1) % testimonials.length : (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const colors = {
    bg: isDark ? '#101820' : '#F8F9FA',
    cardBg: isDark ? '#1a2a3a' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#2D3E50',
    textMuted: isDark ? 'rgba(255,255,255,0.6)' : '#666666',
  };

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden" style={{ background: isDark ? 'linear-gradient(180deg, #101820 0%, #1a2a3a 50%, #101820 100%)' : 'linear-gradient(180deg, #F8F9FA 0%, #FFFFFF 50%, #F8F9FA 100%)' }}>
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)' }} />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-30" style={{ background: isDark ? 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(45, 62, 80, 0.1) 0%, transparent 70%)' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
            <Users className="w-4 h-4" style={{ color: '#D4AF37' }} />
            <span className="text-sm font-medium" style={{ color: '#D4AF37' }}>Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4" style={{ color: colors.text }}>
            What Our <span style={{ color: '#D4AF37' }}>Clients Say</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.textMuted }}>Trusted by thousands of legal professionals across India</p>
        </div>

        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative">
            <div className="absolute -top-6 left-8 w-14 h-14 rounded-2xl flex items-center justify-center z-10" style={{ background: '#D4AF37', boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)' }}>
              <Quote className="w-7 h-7" style={{ color: '#2D3E50' }} />
            </div>
            <div className="rounded-3xl p-8 md:p-12 relative overflow-hidden" style={{ background: colors.cardBg, boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.4)' : '0 20px 60px rgba(0,0,0,0.08)', border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(212, 175, 55, 0.1)'}` }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)' }} />
              <div className="relative z-10">
                <div className="min-h-[220px] flex flex-col justify-center">
                  {testimonials.map((testimonial, index) => (
                    <div key={testimonial.id} className={`transition-all duration-500 ${index === currentIndex ? 'opacity-100 translate-x-0' : 'opacity-0 absolute translate-x-10 pointer-events-none'}`}>
                      {index === currentIndex && (
                        <>
                          <div className="flex gap-1 mb-6">
                            {[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="w-5 h-5" style={{ color: '#D4AF37', fill: '#D4AF37' }} />))}
                          </div>
                          <p className="text-xl md:text-2xl leading-relaxed mb-8 font-serif italic" style={{ color: colors.text }}>"{testimonial.content}"</p>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden" style={{ border: '3px solid #D4AF37' }}>
                              <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg" style={{ color: colors.text }}>{testimonial.name}</h4>
                              <p className="text-sm" style={{ color: '#D4AF37' }}>{testimonial.role}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-8 pt-8" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}` }}>
                  <div className="flex gap-2">
                    {testimonials.map((_, index) => (<button key={index} onClick={() => !isAnimating && setCurrentIndex(index)} className="h-2 rounded-full transition-all duration-300" style={{ width: index === currentIndex ? '32px' : '8px', background: index === currentIndex ? '#D4AF37' : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(45, 62, 80, 0.2)' }} />))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => navigate('prev')} className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : '#F8F9FA', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                      <ChevronLeft className="w-5 h-5" style={{ color: colors.text }} />
                    </button>
                    <button onClick={() => navigate('next')} className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ background: '#D4AF37' }}>
                      <ChevronRight className="w-5 h-5" style={{ color: '#2D3E50' }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 rounded-2xl transition-all duration-300 hover:scale-105" style={{ background: colors.cardBg, boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)', border: `1px solid ${isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(212, 175, 55, 0.1)'}` }}>
              <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#D4AF37' }}>{stat.value}</div>
              <div className="text-sm" style={{ color: colors.textMuted }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
