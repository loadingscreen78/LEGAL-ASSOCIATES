import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, MapPin, ChevronDown } from 'lucide-react';

const heroSlides = [
  {
    image: "/lovable-uploads/10415a62-f1ba-4604-abce-029d57d3c401.png",
    title: "Empowering Legal Minds",
    highlight: "Since 1980",
    subtitle: "Your trusted partner in legal publishing, journals, and law books."
  },
  {
    image: "/lovable-uploads/d90dde4b-fcdf-452e-9612-348fa7878292.png",
    title: "Premium Legal",
    highlight: "Publications",
    subtitle: "Quality content for legal professionals across India"
  },
  {
    image: "/lovable-uploads/20716325-0e93-4a46-bfec-60bd22b17411.png",
    title: "Professional Legal",
    highlight: "Resources",
    subtitle: "Comprehensive collection for legal education and practice"
  },
  {
    image: "/lovable-uploads/ea49d3b2-43d9-4804-a469-5140b187a2cd.png",
    title: "Trusted by Legal",
    highlight: "Professionals",
    subtitle: "Excellence in legal education and professional development"
  }
];

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden">
      {/* Animated Background Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1500 ease-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${slide.image})`,
              transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 8s ease-out'
            }}
          />
        </div>
      ))}
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#101820]/95 via-[#101820]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#101820]/80 via-transparent to-[#101820]/30" />
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#D4AF37]/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl">
            {/* Badge */}
            <div 
              className={`inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/20 backdrop-blur-sm border border-[#D4AF37]/30 rounded-full mb-6 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
              <span className="text-[#D4AF37] text-sm font-medium tracking-wide">
                Established in Cuttack, Odisha
              </span>
            </div>

            {/* Main Title */}
            <h1 
              className={`text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-4 leading-[1.1] transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              {heroSlides[currentSlide].title}
              <br />
              <span className="text-[#D4AF37] relative">
                {heroSlides[currentSlide].highlight}
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M0 4C50 0 150 8 200 4" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" className="animate-draw-line" />
                </svg>
              </span>
            </h1>
            
            {/* Subtitle */}
            <p 
              className={`text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl leading-relaxed transition-all duration-1000 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              {heroSlides[currentSlide].subtitle}
            </p>
            
            {/* CTA Buttons */}
            <div 
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <Link to="/books">
                <Button className="group h-14 px-8 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#101820] font-bold text-lg rounded-full shadow-lg shadow-[#D4AF37]/25 hover:shadow-xl hover:shadow-[#D4AF37]/30 transition-all duration-300 hover:scale-105">
                  <BookOpen className="mr-2 w-5 h-5" />
                  Explore Books
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/visit-store">
                <Button className="group h-14 px-8 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold text-lg rounded-full border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105">
                  <MapPin className="mr-2 w-5 h-5" />
                  Visit Our Store
                </Button>
              </Link>
            </div>

            {/* Stats Row */}
            <div 
              className={`flex flex-wrap gap-8 mt-16 transition-all duration-1000 delay-800 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              {[
                { value: '40+', label: 'Years of Excellence' },
                { value: '500+', label: 'Publications' },
                { value: '10K+', label: 'Happy Customers' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[#D4AF37]">{stat.value}</div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 transition-all duration-500 rounded-full ${
              index === currentSlide 
                ? 'h-12 bg-[#D4AF37]' 
                : 'h-2 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <button 
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer group"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </button>
    </section>
  );
};
