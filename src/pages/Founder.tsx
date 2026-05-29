import { useState, useEffect, useMemo, useRef } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Quote, Award, BookOpen, TrendingUp, Trophy, Globe, Rocket, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { MobileFounder } from '@/components/mobile/MobileFounder';
import { EditableText } from '@/components/admin/EditableText';
import { useSiteContent } from '@/contexts/SiteContentContext';

/**
 * The structural data for the timeline (icons / colours / images) is fixed,
 * but every text field — year, title, description — is loaded from
 * site_content via the SiteContent context, so admins can rewrite it from
 * the landing editor.
 */
const milestoneSeeds = [
  { keyBase: 'founderPage.m1', icon: BookOpen,    color: '#D4AF37', image: '/lovable-uploads/d90dde4b-fcdf-452e-9612-348fa7878292.png' },
  { keyBase: 'founderPage.m2', icon: Award,       color: '#3B82F6', image: '/lovable-uploads/ea49d3b2-43d9-4804-a469-5140b187a2cd.png' },
  { keyBase: 'founderPage.m3', icon: TrendingUp,  color: '#10B981', image: '/lovable-uploads/20716325-0e93-4a46-bfec-60bd22b17411.png' },
  { keyBase: 'founderPage.m4', icon: Trophy,      color: '#F59E0B', image: '/lovable-uploads/bd9562f0-5286-4441-82a0-f16eac646a5f.png' },
  { keyBase: 'founderPage.m5', icon: Globe,       color: '#8B5CF6', image: '/lovable-uploads/cef2bd9f-6509-4ace-be37-df626c82073e.png' },
  { keyBase: 'founderPage.m6', icon: Rocket,      color: '#EC4899', image: '/lovable-uploads/10415a62-f1ba-4604-abce-029d57d3c401.png' },
] as const;

const Founder = () => {
  const { t } = useSiteContent();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  /**
   * Resolved milestones: marries the fixed visual seeds with the editable
   * text from site_content. We re-compute on every render so admin edits
   * appear immediately while the editor is open.
   */
  const milestones = useMemo(
    () => milestoneSeeds.map((seed) => ({
      ...seed,
      year:        t(`${seed.keyBase}.year`),
      title:       t(`${seed.keyBase}.title`),
      description: t(`${seed.keyBase}.description`),
    })),
    [t]
  );

  useEffect(() => { setIsVisible(true); }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % milestoneSeeds.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const goTo = (index: number) => { setActiveIndex(index); setIsPlaying(false); };
  const next = () => goTo((activeIndex + 1) % milestoneSeeds.length);
  const prev = () => goTo((activeIndex - 1 + milestoneSeeds.length) % milestoneSeeds.length);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #101820 0%, #1a2a3a 50%, #0d1117 100%)' }}>
      <Navigation mobileTitle="Founder" mobileShowBack />

      {/* Mobile view (< md) */}
      <MobileFounder />

      {/* Desktop / tablet (≥ md) */}
      <main className="hidden md:block pt-24 pb-16">
        <div className="container mx-auto px-4">

          {/* Hero */}
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
              <Award className="w-4 h-4" style={{ color: '#D4AF37' }} />
              <EditableText keyName="founderPage.eyebrow" className="text-sm font-medium" style={{ color: '#D4AF37' }} />
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6" style={{ color: '#FFFFFF' }}>
              <EditableText keyName="founderPage.title" />{' '}
              <EditableText keyName="founderPage.titleAccent" style={{ color: '#D4AF37' }} />
            </h1>
          </div>

          {/* Founder Card */}
          <div className={`max-w-6xl mx-auto mb-24 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(45, 62, 80, 0.5) 0%, rgba(16, 24, 32, 0.8) 100%)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-[400px] lg:h-auto">
                  <img src="/lovable-uploads/22fb7bfd-70bd-48be-8584-6455e596dd93.png" alt="Founder" className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 0%, rgba(16, 24, 32, 1) 100%)' }} />
                  <div className="absolute inset-0 lg:hidden" style={{ background: 'linear-gradient(to top, rgba(16, 24, 32, 1) 0%, transparent 50%)' }} />
                </div>

                <div className="relative p-8 lg:p-12 flex flex-col justify-center">
                  <Quote className="w-16 h-16 mb-6 opacity-30" style={{ color: '#D4AF37' }} />
                  <EditableText
                    keyName="founderPage.card.quote"
                    as="blockquote"
                    multiline
                    className="text-2xl md:text-3xl font-serif leading-relaxed mb-8"
                    style={{ color: '#FFFFFF' }}
                  />
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-1 rounded-full" style={{ background: '#D4AF37' }} />
                    <div>
                      <EditableText keyName="founderPage.card.name" as="p" className="font-bold text-lg" style={{ color: '#D4AF37' }} />
                      <EditableText keyName="founderPage.card.role" as="p" style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div ref={timelineRef} className={`mb-24 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4" style={{ color: '#FFFFFF' }}>
                <EditableText keyName="founderPage.timeline.title" />{' '}
                <EditableText keyName="founderPage.timeline.titleAccent" style={{ color: '#D4AF37' }} />
              </h2>
              <EditableText keyName="founderPage.timeline.subtitle" as="p" style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
            </div>

            <div className="relative max-w-6xl mx-auto">
              {/* Large Year Display */}
              <div className="text-center mb-8">
                <div className="inline-block relative">
                  <span className="text-8xl md:text-[150px] font-serif font-bold transition-all duration-500" style={{ color: 'rgba(212, 175, 55, 0.1)' }}>
                    {milestones[activeIndex].year}
                  </span>
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl md:text-6xl font-serif font-bold" style={{ color: milestones[activeIndex].color }}>
                    <EditableText keyName={`${milestoneSeeds[activeIndex].keyBase}.year`} />
                  </span>
                </div>
              </div>

              {/* Content card */}
              <div className="relative rounded-3xl overflow-hidden mb-12" style={{ background: 'rgba(255, 255, 255, 0.03)', border: `2px solid ${milestones[activeIndex].color}40` }}>
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-[300px] md:h-[400px] overflow-hidden">
                    {milestones.map((m, i) => (
                      <img
                        key={i}
                        src={m.image}
                        alt={m.title}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                        style={{ opacity: activeIndex === i ? 1 : 0, transform: activeIndex === i ? 'scale(1)' : 'scale(1.1)' }}
                      />
                    ))}
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${milestones[activeIndex].color}30 0%, transparent 50%)` }} />
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    {milestones.map((m, i) => {
                      const Icon = m.icon;
                      const visible = activeIndex === i;
                      return (
                        <div
                          key={i}
                          className="transition-all duration-500"
                          style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? 'translateY(0)' : 'translateY(20px)',
                            position: visible ? 'relative' : 'absolute',
                            pointerEvents: visible ? 'auto' : 'none',
                          }}
                        >
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${m.color}20` }}>
                              <Icon className="w-7 h-7" style={{ color: m.color }} />
                            </div>
                            <div className="h-1 flex-1 rounded-full" style={{ background: `linear-gradient(to right, ${m.color}, transparent)` }} />
                          </div>
                          <EditableText keyName={`${milestoneSeeds[i].keyBase}.title`} as="h3" className="text-3xl md:text-4xl font-serif font-bold mb-4" style={{ color: '#FFFFFF' }} />
                          <EditableText keyName={`${milestoneSeeds[i].keyBase}.description`} as="p" multiline className="text-lg leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Track */}
              <div className="relative py-8">
                <svg className="w-full h-24" viewBox="0 0 1200 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  <path d="M 0,50 Q 200,20 400,50 T 800,50 T 1200,50" stroke="url(#trackGradient)" strokeWidth="4" fill="none" strokeLinecap="round" />
                  <path
                    d="M 0,50 Q 200,20 400,50 T 800,50 T 1200,50"
                    stroke={milestones[activeIndex].color}
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="2000"
                    strokeDashoffset={2000 - (activeIndex / (milestoneSeeds.length - 1)) * 2000}
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                  />
                </svg>

                <div className="absolute inset-0 flex items-center justify-between px-4 md:px-12">
                  {milestones.map((m, i) => {
                    const Icon = m.icon;
                    const isActive = activeIndex === i;
                    const isPast = i < activeIndex;
                    return (
                      <button key={i} onClick={() => goTo(i)} className="relative group" style={{ transform: `translateY(${i % 2 === 0 ? '-15px' : '15px'})` }}>
                        {isActive && (
                          <div className="absolute inset-0 rounded-full animate-ping" style={{ background: `${m.color}40`, width: '60px', height: '60px', transform: 'translate(-50%, -50%) translate(30px, 30px)' }} />
                        )}
                        <div
                          className="relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer"
                          style={{
                            background: isActive ? m.color : isPast ? `${m.color}80` : 'rgba(255, 255, 255, 0.1)',
                            border: `3px solid ${m.color}`,
                            boxShadow: isActive ? `0 0 30px ${m.color}60` : 'none',
                            transform: isActive ? 'scale(1.2)' : 'scale(1)',
                          }}
                        >
                          <Icon className="w-6 h-6 md:w-7 md:h-7" style={{ color: isActive || isPast ? '#FFFFFF' : m.color }} />
                        </div>
                        <div
                          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-bold transition-all duration-300"
                          style={{
                            top: i % 2 === 0 ? '100%' : 'auto',
                            bottom: i % 2 === 0 ? 'auto' : '100%',
                            marginTop: i % 2 === 0 ? '8px' : '0',
                            marginBottom: i % 2 === 0 ? '0' : '8px',
                            color: isActive ? m.color : 'rgba(255, 255, 255, 0.5)',
                            fontSize: isActive ? '1.1rem' : '0.9rem',
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

              <div className="flex justify-center gap-2 mt-6">
                {milestones.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ width: activeIndex === i ? '32px' : '8px', background: activeIndex === i ? m.color : 'rgba(255, 255, 255, 0.2)' }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-24 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {([
              { v: 'founderPage.stat1.value', l: 'founderPage.stat1.label', color: '#D4AF37' },
              { v: 'founderPage.stat2.value', l: 'founderPage.stat2.label', color: '#3B82F6' },
              { v: 'founderPage.stat3.value', l: 'founderPage.stat3.label', color: '#10B981' },
              { v: 'founderPage.stat4.value', l: 'founderPage.stat4.label', color: '#8B5CF6' },
            ]).map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl text-center transition-all duration-300 hover:scale-105" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <EditableText keyName={stat.v} as="div" className="text-4xl md:text-5xl font-bold mb-2" style={{ color: stat.color }} />
                <EditableText keyName={stat.l} as="div" style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
              </div>
            ))}
          </div>

          {/* Vision */}
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="p-8 md:p-12 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.02) 100%)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <Rocket className="w-12 h-12 mx-auto mb-6" style={{ color: '#D4AF37' }} />
              <EditableText keyName="founderPage.vision.title" as="h2" className="text-3xl font-serif font-bold mb-6" style={{ color: '#D4AF37' }} />
              <EditableText keyName="founderPage.vision.body" as="p" multiline className="text-xl leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
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
