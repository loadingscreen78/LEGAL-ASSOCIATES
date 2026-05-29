import { useEffect, useRef, useState } from 'react';
import { Quote, Award, BookOpen, Users, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditableText } from '@/components/admin/EditableText';

export const FounderQuote = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left - rect.width / 2) / 50,
      y: (e.clientY - rect.top - rect.height / 2) / 50,
    });
  };

  const achievements = [
    { icon: BookOpen, vKey: 'fq.stat1.value', lKey: 'fq.stat1.label' },
    { icon: Users,    vKey: 'fq.stat2.value', lKey: 'fq.stat2.label' },
    { icon: Award,    vKey: 'fq.stat3.value', lKey: 'fq.stat3.label' },
  ];

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden" onMouseMove={handleMouseMove} style={{ background: 'linear-gradient(135deg, #101820 0%, #1a2a3a 50%, #2D3E50 100%)' }}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-float"
            style={{
              background: '#D4AF37',
              opacity: 0.2 + Math.random() * 0.3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
        
        {/* Glowing Orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)', transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)` }} />
        <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)', transform: `translate(${-mousePosition.x * 2}px, ${-mousePosition.y * 2}px)` }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className={`grid lg:grid-cols-2 gap-16 items-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Image Column - Premium Design */}
            <div className="relative flex justify-center order-2 lg:order-1">
              <div className="relative" style={{ transform: `perspective(1000px) rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg)` }}>
                {/* Outer Decorative Rings */}
                <div className="absolute -inset-8 rounded-full animate-spin-slow" style={{ border: '1px dashed rgba(212, 175, 55, 0.3)', animationDuration: '20s' }} />
                <div className="absolute -inset-16 rounded-full animate-spin-slow" style={{ border: '1px solid rgba(212, 175, 55, 0.1)', animationDuration: '30s', animationDirection: 'reverse' }} />
                
                {/* Glowing Background */}
                <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                
                {/* Main Image Container */}
                <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden" style={{ border: '4px solid #D4AF37', boxShadow: '0 0 60px rgba(212, 175, 55, 0.3), inset 0 0 60px rgba(0,0,0,0.5)' }}>
                  <img src="/lovable-uploads/22fb7bfd-70bd-48be-8584-6455e596dd93.png" alt="Akshaya Kumar Mohanty - Founder" className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(16, 24, 32, 0.8) 0%, transparent 50%)' }} />
                </div>

                {/* Floating Achievement Cards */}
                <div className="absolute -top-4 -right-4 p-4 rounded-2xl animate-float" style={{ background: 'rgba(212, 175, 55, 0.95)', boxShadow: '0 10px 40px rgba(212, 175, 55, 0.3)' }}>
                  <Award className="w-8 h-8" style={{ color: '#2D3E50' }} />
                </div>
                
                <div className="absolute -bottom-4 -left-4 px-4 py-3 rounded-xl animate-float" style={{ background: '#FFFFFF', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', animationDelay: '1s' }}>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5" style={{ color: '#D4AF37', fill: '#D4AF37' }} />
                    <EditableText keyName="fq.badge.years" className="font-bold" style={{ color: '#2D3E50' }} />
                  </div>
                </div>

                {/* Name Badge */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #c9a030 100%)', boxShadow: '0 10px 30px rgba(212, 175, 55, 0.4)' }}>
                  <EditableText keyName="fq.badge.title" className="font-bold" style={{ color: '#101820' }} />
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              {/* Section Label */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                <Quote className="w-4 h-4" style={{ color: '#D4AF37' }} />
                <EditableText keyName="fq.eyebrow" className="text-sm font-medium" style={{ color: '#D4AF37' }} />
              </div>

              {/* Quote */}
              <div className="relative mb-8">
                <Quote className="absolute -top-4 -left-4 w-16 h-16 opacity-20" style={{ color: '#D4AF37' }} />
                <EditableText
                  keyName="fq.quote"
                  as="blockquote"
                  multiline
                  className="text-2xl md:text-3xl lg:text-4xl font-serif leading-relaxed relative z-10"
                  style={{ color: '#FFFFFF' }}
                />
              </div>

              {/* Author Info */}
              <div className="mb-10">
                <EditableText keyName="fq.author" as="h3" className="text-2xl font-serif font-bold mb-2" style={{ color: '#FFFFFF' }} />
                <EditableText keyName="fq.role" as="p" className="text-lg" style={{ color: '#D4AF37' }} />
              </div>

              {/* Achievement Stats */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                {achievements.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="text-center p-4 rounded-xl transition-all duration-300 hover:scale-105" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: '#D4AF37' }} />
                      <EditableText keyName={item.vKey} as="div" className="text-2xl font-bold" style={{ color: '#FFFFFF' }} />
                      <EditableText keyName={item.lKey} as="div" className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                    </div>
                  );
                })}
              </div>

              {/* CTA Button */}
              <Link to="/founder" className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 group" style={{ background: '#D4AF37', color: '#101820', boxShadow: '0 10px 40px rgba(212, 175, 55, 0.3)' }}>
                <EditableText keyName="fq.cta" />
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animation */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </section>
  );
};
