import { useState, useEffect, useRef } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Quote, Award, BookOpen, TrendingUp, Trophy, Globe, Rocket, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { MobileFounder } from '@/components/mobile/MobileFounder';

const milestones = [
  { year: "1985", title: "The Beginning", description: "Started with a small bookstore in Cuttack with just 50 law books and a dream to serve legal professionals", icon: BookOpen, color: "#D4AF37", image: "/lovable-uploads/d90dde4b-fcdf-452e-9612-348fa7878292.png" },
  { year: "1992", title: "First Publication", description: "Published our first legal commentary on Odisha Land Laws, marking our entry into legal publishing", icon: Award, color: "#3B82F6", image: "/lovable-uploads/ea49d3b2-43d9-4804-a469-5140b187a2cd.png" },
  { year: "2000", title: "Major Expansion", description: "Expanded to cover all major areas of Indian law with 500+ titles in our growing catalog", icon: TrendingUp, color: "#10B981", image: "/lovable-uploads/20716325-0e93-4a46-bfec-60bd22b17411.png" },
  { year: "2010", title: "State Recognition", description: "Received prestigious state recognition for outstanding contribution to legal education", icon: Trophy, color: "#F59E0B", image: "/lovable-uploads/bd9562f0-5286-4441-82a0-f16eac646a5f.png" },
  { year: "2020", title: "Digital Revolution", description: "Launched online platform to serve legal professionals across India with modern e-commerce", icon: Globe, color: "#8B5CF6", image: "/lovable-uploads/cef2bd9f-6509-4ace-be37-df626c82073e.png" },
  { year: "2024", title: "Legacy Continues", description: "Serving 50,000+ legal professionals across India with 500+ quality publications", icon: Rocket, color: "#EC4899", image: "/lovable-uploads/10415a62-f1ba-4604-abce-029d57d3c401.png" }
];

const Founder = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % milestones.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const goTo = (index: number) => {
    setActiveIndex(index);
    setIsPlaying(false);
  };

  const next = () => goTo((activeIndex + 1) % milestones.length);
  const prev = () => goTo((activeIndex - 1 + milestones.length) % milestones.length);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #101820 0%, #1a2a3a 50%, #0d1117 100%)' }}>
      <Navigation mobileTitle="Founder" mobileShowBack />

      {/* Mobile view (< md) */}
      <MobileFounder />

      {/* Desktop / tablet (≥ md) */}
      <main className="hidden md:block pt-24 pb-16">
        <div className="container mx-auto px-4">
          
          {/* Hero Section */}
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
              <Award className="w-4 h-4" style={{ color: '#D4AF37' }} />
              <span className="text-sm font-medium" style={{ color: '#D4AF37' }}>Our Legacy</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6" style={{ color: '#FFFFFF' }}>
              Founder's <span style={{ color: '#D4AF37' }}>Vision</span>
            </h1>
          </div>

          {/* Founder Card */}
          <div className={`max-w-6xl mx-auto mb-24 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(45, 62, 80, 0.5) 0%, rgba(16, 24, 32, 0.8) 100%)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
              
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Image Side */}
                <div className="relative h-[400px] lg:h-auto">
                  <img src="/lovable-uploads/22fb7bfd-70bd-48be-8584-6455e596dd93.png" alt="Founder" className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 0%, rgba(16, 24, 32, 1) 100%)' }} />
                  <div className="absolute inset-0 lg:hidden" style={{ background: 'linear-gradient(to top, rgba(16, 24, 32, 1) 0%, transparent 50%)' }} />
                </div>
                
                {/* Content Side */}
                <div className="relative p-8 lg:p-12 flex flex-col justify-center">
                  <Quote className="w-16 h-16 mb-6 opacity-30" style={{ color: '#D4AF37' }} />
                  <blockquote className="text-2xl md:text-3xl font-serif leading-relaxed mb-8" style={{ color: '#FFFFFF' }}>
                    My mission was never to sell books—it was to <span style={{ color: '#D4AF37' }}>shape the legal future</span> of Odisha and empower every legal mind with knowledge.
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-1 rounded-full" style={{ background: '#D4AF37' }} />
                    <div>
                      <p className="font-bold text-lg" style={{ color: '#D4AF37' }}>Akshaya Kumar Mohanty</p>
                      <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Founder & Chairman</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Curved Timeline */}
          <div ref={timelineRef} className={`mb-24 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4" style={{ color: '#FFFFFF' }}>
                Our Journey <span style={{ color: '#D4AF37' }}>Through Time</span>
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Four decades of excellence in legal publishing</p>
            </div>

            {/* Main Timeline Display */}
            <div className="relative max-w-6xl mx-auto">
              {/* Large Year Display */}
              <div className="text-center mb-8">
                <div className="inline-block relative">
                  <span className="text-8xl md:text-[150px] font-serif font-bold transition-all duration-500" style={{ color: 'rgba(212, 175, 55, 0.1)' }}>
                    {milestones[activeIndex].year}
                  </span>
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl md:text-6xl font-serif font-bold" style={{ color: milestones[activeIndex].color }}>
                    {milestones[activeIndex].year}
                  </span>
                </div>
              </div>

              {/* Content Card */}
              <div className="relative rounded-3xl overflow-hidden mb-12" style={{ background: 'rgba(255, 255, 255, 0.03)', border: `2px solid ${milestones[activeIndex].color}40` }}>
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative h-[300px] md:h-[400px] overflow-hidden">
                    {milestones.map((m, i) => (
                      <img
                        key={i}
                        src={m.image}
                        alt={m.title}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                        style={{
                          opacity: activeIndex === i ? 1 : 0,
                          transform: activeIndex === i ? 'scale(1)' : 'scale(1.1)'
                        }}
                      />
                    ))}
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${milestones[activeIndex].color}30 0%, transparent 50%)` }} />
                  </div>
                  
                  {/* Content */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    {milestones.map((m, i) => {
                      const Icon = m.icon;
                      return (
                        <div
                          key={i}
                          className="transition-all duration-500"
                          style={{
                            opacity: activeIndex === i ? 1 : 0,
                            transform: activeIndex === i ? 'translateY(0)' : 'translateY(20px)',
                            position: activeIndex === i ? 'relative' : 'absolute',
                            pointerEvents: activeIndex === i ? 'auto' : 'none'
                          }}
                        >
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${m.color}20` }}>
                              <Icon className="w-7 h-7" style={{ color: m.color }} />
                            </div>
                            <div className="h-1 flex-1 rounded-full" style={{ background: `linear-gradient(to right, ${m.color}, transparent)` }} />
                          </div>
                          <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: '#FFFFFF' }}>{m.title}</h3>
                          <p className="text-lg leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{m.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Curved Timeline Track */}
              <div className="relative py-8">
                {/* SVG Curved Path */}
                <svg className="w-full h-24" viewBox="0 0 1200 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0,50 Q 200,20 400,50 T 800,50 T 1200,50"
                    stroke="url(#trackGradient)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Progress indicator */}
                  <path
                    d="M 0,50 Q 200,20 400,50 T 800,50 T 1200,50"
                    stroke={milestones[activeIndex].color}
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="2000"
                    strokeDashoffset={2000 - (activeIndex / (milestones.length - 1)) * 2000}
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                  />
                </svg>

                {/* Timeline Points */}
                <div className="absolute inset-0 flex items-center justify-between px-4 md:px-12">
                  {milestones.map((m, i) => {
                    const Icon = m.icon;
                    const isActive = activeIndex === i;
                    const isPast = i < activeIndex;
                    
                    return (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        className="relative group"
                        style={{ transform: `translateY(${i % 2 === 0 ? '-15px' : '15px'})` }}
                      >
                        {/* Glow Effect */}
                        {isActive && (
                          <div className="absolute inset-0 rounded-full animate-ping" style={{ background: `${m.color}40`, width: '60px', height: '60px', transform: 'translate(-50%, -50%) translate(30px, 30px)' }} />
                        )}
                        
                        {/* Point */}
                        <div
                          className="relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer"
                          style={{
                            background: isActive ? m.color : isPast ? `${m.color}80` : 'rgba(255, 255, 255, 0.1)',
                            border: `3px solid ${m.color}`,
                            boxShadow: isActive ? `0 0 30px ${m.color}60` : 'none',
                            transform: isActive ? 'scale(1.2)' : 'scale(1)'
                          }}
                        >
                          <Icon className="w-6 h-6 md:w-7 md:h-7" style={{ color: isActive || isPast ? '#FFFFFF' : m.color }} />
                        </div>
                        
                        {/* Year Label */}
                        <div
                          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-bold transition-all duration-300"
                          style={{
                            top: i % 2 === 0 ? '100%' : 'auto',
                            bottom: i % 2 === 0 ? 'auto' : '100%',
                            marginTop: i % 2 === 0 ? '8px' : '0',
                            marginBottom: i % 2 === 0 ? '0' : '8px',
                            color: isActive ? m.color : 'rgba(255, 255, 255, 0.5)',
                            fontSize: isActive ? '1.1rem' : '0.9rem'
                          }}
                        >
                          {m.year}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <button onClick={prev} className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <ChevronLeft className="w-6 h-6" style={{ color: '#FFFFFF' }} />
                </button>
                
                <button onClick={() => setIsPlaying(!isPlaying)} className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ background: '#D4AF37' }}>
                  {isPlaying ? <Pause className="w-6 h-6" style={{ color: '#101820' }} /> : <Play className="w-6 h-6 ml-1" style={{ color: '#101820' }} />}
                </button>
                
                <button onClick={next} className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <ChevronRight className="w-6 h-6" style={{ color: '#FFFFFF' }} />
                </button>
              </div>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {milestones.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: activeIndex === i ? '32px' : '8px',
                      background: activeIndex === i ? m.color : 'rgba(255, 255, 255, 0.2)'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-24 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { value: '40+', label: 'Years of Excellence', color: '#D4AF37' },
              { value: '500+', label: 'Publications', color: '#3B82F6' },
              { value: '50K+', label: 'Happy Customers', color: '#10B981' },
              { value: '100%', label: 'Quality Assured', color: '#8B5CF6' },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl text-center transition-all duration-300 hover:scale-105" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: stat.color }}>{stat.value}</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Vision Statement */}
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="p-8 md:p-12 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.02) 100%)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <Rocket className="w-12 h-12 mx-auto mb-6" style={{ color: '#D4AF37' }} />
              <h2 className="text-3xl font-serif font-bold mb-6" style={{ color: '#D4AF37' }}>Our Vision for the Future</h2>
              <p className="text-xl leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                To continue being the cornerstone of legal education in Odisha and beyond, providing accessible, comprehensive, and up-to-date legal resources that empower the next generation of legal professionals to build a just society.
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
};

export default Founder;
