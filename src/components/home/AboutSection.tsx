import { useEffect, useMemo, useRef, useState } from 'react';
import { Phone, Mail, MapPin, Award, Users, BookOpen, Scale, ArrowRight, Clock, Target, Sparkles, Rocket, Globe, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_OFFICE, buildContactMailto } from '@/lib/contactMail';
import { EditableText } from '@/components/admin/EditableText';
import { useSiteContent } from '@/contexts/SiteContentContext';

/**
 * AboutSection — home page block. Every visible string is sourced from
 * `site_content` via `<EditableText>` so admins can rewrite the page from
 * the landing editor without code edits.
 *
 * Visual seeds (icons, colours) stay in code; admin-editable strings live
 * under the `about.journey.*`, `about.stat*`, `about.visit.*` keys.
 */

const journeySeeds = [
  { keyBase: 'about.journey.m1', icon: Sparkles, color: '#D4AF37' },
  { keyBase: 'about.journey.m2', icon: BookOpen, color: '#3B82F6' },
  { keyBase: 'about.journey.m3', icon: Target,   color: '#10B981' },
  { keyBase: 'about.journey.m4', icon: Globe,    color: '#8B5CF6' },
  { keyBase: 'about.journey.m5', icon: Rocket,   color: '#EC4899' },
] as const;

const bentoSeeds = [
  { icon: Award,    keyBase: 'about.stat1', size: 'large' },
  { icon: BookOpen, keyBase: 'about.stat2', size: 'small' },
  { icon: Users,    keyBase: 'about.stat3', size: 'small' },
  { icon: Scale,    keyBase: 'about.stat4', size: 'medium' },
] as const;

export const AboutSection = () => {
  const { theme } = useTheme();
  const { t } = useSiteContent();
  const isDark = theme === 'dark';
  const [isVisible, setIsVisible] = useState(false);
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [hoveredBento, setHoveredBento] = useState<number | null>(null);
  const [hoveredTimeline, setHoveredTimeline] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const journey = useMemo(
    () => journeySeeds.map((s) => ({
      ...s,
      year:        t(`${s.keyBase}.year`),
      title:       t(`${s.keyBase}.title`),
      description: t(`${s.keyBase}.description`),
    })),
    [t]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => setActiveTimeline((p) => (p + 1) % journeySeeds.length), 4000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

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
      <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />
      <div className="absolute top-40 right-0 w-96 h-96 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)' }} />
      <div className="absolute bottom-40 left-0 w-64 h-64 rounded-full opacity-30" style={{ background: isDark ? 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(45, 62, 80, 0.1) 0%, transparent 70%)' }} />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
            <Scale className="w-4 h-4" style={{ color: '#D4AF37' }} />
            <EditableText keyName="about.eyebrow" className="text-sm font-medium" style={{ color: '#D4AF37' }} />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6" style={{ color: colors.text }}>
            <EditableText keyName="about.title" />{' '}
            <EditableText keyName="about.titleAccent" style={{ color: '#D4AF37' }} />
          </h2>
          <EditableText keyName="about.subtitle" as="p" multiline className="text-lg max-w-2xl mx-auto" style={{ color: colors.textMuted }} />
        </div>

        {/* Bento Grid */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-32 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {bentoSeeds.map((item, index) => {
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
                <EditableText
                  keyName={`${item.keyBase}.value`}
                  as="div"
                  className={`${isLarge ? 'text-5xl md:text-6xl' : 'text-3xl md:text-4xl'} font-bold mb-2 transition-colors duration-300`}
                  style={{ color: isHovered ? (isDark ? '#101820' : '#FFFFFF') : colors.text }}
                />
                <EditableText
                  keyName={`${item.keyBase}.label`}
                  as="div"
                  className={`${isLarge ? 'text-xl' : 'text-lg'} font-semibold mb-1 transition-colors duration-300`}
                  style={{ color: '#D4AF37' }}
                />
                <EditableText
                  keyName={`${item.keyBase}.description`}
                  as="p"
                  className="text-sm transition-colors duration-300"
                  style={{ color: isHovered ? (isDark ? 'rgba(16,24,32,0.7)' : 'rgba(255,255,255,0.7)') : colors.textMuted }}
                />
                {isLarge && <div className="absolute bottom-6 right-6 w-24 h-24 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)' }} />}
              </div>
            );
          })}
        </div>

        {/* Journey Timeline */}
        <div className={`mb-32 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: colors.text }}>
              <EditableText keyName="about.journey.title" />{' '}
              <EditableText keyName="about.journey.titleAccent" style={{ color: '#D4AF37' }} />
            </h3>
            <EditableText keyName="about.journey.subtitle" as="p" style={{ color: colors.textMuted }} />
          </div>

          {/* Desktop Curved Timeline */}
          <div className="hidden lg:block relative" style={{ minHeight: '500px' }}>
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
              <path
                d="M 50,250 C 200,100 300,400 500,250 C 700,100 800,400 1000,250 C 1100,180 1150,250 1150,250"
                stroke="url(#curveGradient)" strokeWidth="4" fill="none" strokeLinecap="round" filter="url(#glow)"
              />
              <circle r="8" fill="#D4AF37" filter="url(#glow)">
                <animateMotion dur="10s" repeatCount="indefinite" path="M 50,250 C 200,100 300,400 500,250 C 700,100 800,400 1000,250 C 1100,180 1150,250 1150,250" />
              </circle>
            </svg>

            {journey.map((event, index) => {
              const Icon = event.icon;
              const isActive = activeTimeline === index;
              const isHovered = hoveredTimeline === index;

              const positions = [
                { x: '8%',  y: '50%', cardY: '70%' },
                { x: '28%', y: '20%', cardY: '35%' },
                { x: '48%', y: '70%', cardY: '0%' },
                { x: '68%', y: '25%', cardY: '40%' },
                { x: '88%', y: '50%', cardY: '65%' },
              ];

              return (
                <div key={index}>
                  <div
                    className="absolute cursor-pointer transition-all duration-500 z-20"
                    style={{ left: positions[index].x, top: positions[index].y, transform: 'translate(-50%, -50%)' }}
                    onMouseEnter={() => { setHoveredTimeline(index); setActiveTimeline(index); }}
                    onMouseLeave={() => setHoveredTimeline(null)}
                    onClick={() => setActiveTimeline(index)}
                  >
                    {(isActive || isHovered) && (
                      <div className="absolute inset-0 rounded-full animate-ping" style={{ width: '70px', height: '70px', background: `${event.color}30`, transform: 'translate(-50%, -50%) translate(35px, 35px)' }} />
                    )}
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
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 font-bold text-lg whitespace-nowrap" style={{ color: isActive || isHovered ? event.color : colors.textMuted }}>
                      <EditableText keyName={`${event.keyBase}.year`} />
                    </div>
                  </div>

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
                      <EditableText
                        keyName={`${event.keyBase}.title`}
                        as="h4"
                        className="font-serif font-bold text-xl mb-2"
                        style={{ color: isActive || isHovered ? '#FFFFFF' : colors.text }}
                      />
                      <EditableText
                        keyName={`${event.keyBase}.description`}
                        as="p"
                        multiline
                        className="text-sm leading-relaxed"
                        style={{ color: isActive || isHovered ? 'rgba(255,255,255,0.8)' : colors.textMuted }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile timeline */}
          <div className="lg:hidden relative pl-20">
            <svg className="absolute left-8 top-0 w-4 h-full" viewBox="0 0 16 100" preserveAspectRatio="none">
              <path d="M 8,0 Q 2,25 8,50 Q 14,75 8,100" stroke="#D4AF37" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
            <div className="space-y-8">
              {journey.map((event, index) => {
                const Icon = event.icon;
                const isActive = activeTimeline === index;
                return (
                  <div key={index} className="relative" onClick={() => setActiveTimeline(index)}>
                    <div className="absolute -left-12 top-6 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer" style={{ background: isActive ? event.color : colors.cardBg, border: `3px solid ${event.color}`, boxShadow: isActive ? `0 0 20px ${event.color}50` : isDark ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.1)' }}>
                      <Icon className="w-5 h-5" style={{ color: isActive ? '#FFFFFF' : event.color }} />
                    </div>
                    <div className="p-5 rounded-2xl transition-all duration-300" style={{ background: isActive ? (isDark ? '#1a2a3a' : '#2D3E50') : colors.cardBg, boxShadow: isActive ? '0 15px 30px rgba(0,0,0,0.2)' : isDark ? '0 4px 15px rgba(0,0,0,0.2)' : '0 4px 15px rgba(0,0,0,0.05)', borderLeft: `4px solid ${event.color}` }}>
                      <div className="flex items-center gap-2 mb-2">
                        <EditableText keyName={`${event.keyBase}.year`} as="span" className="font-bold text-lg" style={{ color: event.color }} />
                      </div>
                      <EditableText keyName={`${event.keyBase}.title`} as="h4" className="font-serif font-bold text-lg mb-2" style={{ color: isActive ? '#FFFFFF' : colors.text }} />
                      <EditableText keyName={`${event.keyBase}.description`} as="p" multiline className="text-sm" style={{ color: isActive ? 'rgba(255,255,255,0.8)' : colors.textMuted }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-12">
            {journey.map((event, index) => (
              <button key={index} onClick={() => setActiveTimeline(index)} className="relative transition-all duration-300" style={{ width: activeTimeline === index ? '40px' : '12px', height: '12px', borderRadius: '6px', background: activeTimeline === index ? event.color : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(45, 62, 80, 0.2)' }}>
                {activeTimeline === index && <span className="absolute inset-0 rounded-full animate-ping" style={{ background: `${event.color}40` }} />}
              </button>
            ))}
          </div>
        </div>

        {/* Visit-store contact card */}
        <div className={`relative overflow-hidden rounded-3xl p-8 md:p-12 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ background: 'linear-gradient(135deg, #2D3E50 0%, #101820 100%)' }}>
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)' }} />
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: '#FFFFFF' }}>
                <EditableText keyName="about.visit.title" />{' '}
                <EditableText keyName="about.visit.titleAccent" style={{ color: '#D4AF37' }} />
              </h3>
              <EditableText keyName="about.visit.subtitle" as="p" multiline className="mb-6" style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105" style={{ background: '#D4AF37', color: '#101820' }}>
                  <EditableText keyName="about.visit.cta" /> <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href={buildContactMailto('general')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                  style={{ background: 'rgba(212, 175, 55, 0.12)', border: '1px solid rgba(212, 175, 55, 0.4)', color: '#D4AF37' }}
                  title="Send us an email — opens your mail client with a prefilled message"
                >
                  <Send className="w-4 h-4" /> <EditableText keyName="about.visit.contactBtn" />
                </a>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { icon: MapPin, title: 'Location', text: 'High Court Road, Cuttack – 753002, Odisha', href: 'https://maps.google.com/?q=High+Court+Road+Cuttack+753002' },
                { icon: Phone,  title: 'Phone',    text: `${CONTACT_PHONE_OFFICE} · ${CONTACT_PHONE}`, href: `tel:${CONTACT_PHONE_OFFICE.replace(/[^\d+]/g, '')}` },
                { icon: Mail,   title: 'Email',    text: CONTACT_EMAIL, href: buildContactMailto('general') },
                { icon: Clock,  title: 'Hours',    text: t('about.visit.hours') },
              ].map((item, index) => {
                const Icon = item.icon;
                const inner = (
                  <div className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:translate-x-1" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212, 175, 55, 0.2)' }}>
                      <Icon className="w-5 h-5" style={{ color: '#D4AF37' }} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold" style={{ color: '#FFFFFF' }}>{item.title}</p>
                      <p className="text-sm break-words" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{item.text}</p>
                    </div>
                  </div>
                );
                return item.href ? (
                  <a
                    key={index}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={index}>{inner}</div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
