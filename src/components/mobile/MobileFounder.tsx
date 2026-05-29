import { useEffect, useMemo, useState } from 'react';
import {
  Award, BookOpen, TrendingUp, Trophy, Globe, Rocket,
  ChevronLeft, ChevronRight, Quote, Sparkles,
} from 'lucide-react';
import { EditableText } from '@/components/admin/EditableText';
import { useSiteContent } from '@/contexts/SiteContentContext';

/**
 * MobileFounder — mobile-first rendition of the Founder page.
 *
 * Every text field is read from `site_content` via the same key family
 * (`founderPage.*`) used by the desktop view, so editing the desktop
 * landing-editor automatically updates this view in real time.
 */
const milestoneSeeds = [
  { keyBase: 'founderPage.m1', icon: BookOpen,    tint: '#D4AF37', img: '/lovable-uploads/d90dde4b-fcdf-452e-9612-348fa7878292.png' },
  { keyBase: 'founderPage.m2', icon: Award,       tint: '#3B82F6', img: '/lovable-uploads/ea49d3b2-43d9-4804-a469-5140b187a2cd.png' },
  { keyBase: 'founderPage.m3', icon: TrendingUp,  tint: '#10B981', img: '/lovable-uploads/20716325-0e93-4a46-bfec-60bd22b17411.png' },
  { keyBase: 'founderPage.m4', icon: Trophy,      tint: '#F59E0B', img: '/lovable-uploads/bd9562f0-5286-4441-82a0-f16eac646a5f.png' },
  { keyBase: 'founderPage.m5', icon: Globe,       tint: '#8B5CF6', img: '/lovable-uploads/cef2bd9f-6509-4ace-be37-df626c82073e.png' },
  { keyBase: 'founderPage.m6', icon: Rocket,      tint: '#EC4899', img: '/lovable-uploads/10415a62-f1ba-4604-abce-029d57d3c401.png' },
] as const;

export const MobileFounder = () => {
  const { t } = useSiteContent();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);

  // Same pattern as the desktop page — fixed visual seeds + live text.
  const milestones = useMemo(
    () => milestoneSeeds.map((s) => ({
      ...s,
      year:        t(`${s.keyBase}.year`),
      title:       t(`${s.keyBase}.title`),
      description: t(`${s.keyBase}.description`),
    })),
    [t]
  );

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setActive((i) => (i + 1) % milestoneSeeds.length), 4500);
    return () => clearInterval(id);
  }, [playing]);

  const m = milestones[active];
  const Icon = m.icon;

  return (
    <main
      className="md:hidden pt-14 pb-tabbar"
      style={{ background: 'linear-gradient(180deg, #0B1017 0%, #101820 50%, #0B1017 100%)', minHeight: '100vh' }}
    >
      {/* Hero */}
      <section className="px-4 pt-5">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3"
          style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}
        >
          <Sparkles className="w-3 h-3" style={{ color: '#D4AF37' }} />
          <EditableText keyName="founderPage.eyebrow" className="text-[11px] font-medium tracking-wide" style={{ color: '#D4AF37' }} />
        </div>
        <h1 className="font-serif font-bold text-white leading-tight" style={{ fontSize: 30 }}>
          <EditableText keyName="founderPage.title" />{' '}
          <EditableText keyName="founderPage.titleAccent" style={{ color: '#D4AF37' }} />
        </h1>
      </section>

      {/* Founder quote card */}
      <section className="px-4 mt-5">
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(45,62,80,0.6) 0%, rgba(16,24,32,0.9) 100%)', border: '1px solid rgba(212,175,55,0.2)' }}
        >
          <img
            src="/lovable-uploads/22fb7bfd-70bd-48be-8584-6455e596dd93.png"
            alt="Founder"
            className="w-full h-52 object-cover"
            loading="lazy"
          />
          <div
            className="absolute top-0 left-0 right-0 h-52 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent 45%, rgba(16,24,32,0.95) 100%)' }}
          />
          <div className="relative -mt-10 px-5 pb-5">
            <Quote className="w-8 h-8 mb-3 opacity-40" style={{ color: '#D4AF37' }} />
            <EditableText
              keyName="founderPage.card.quote"
              as="blockquote"
              multiline
              className="font-serif text-[17px] leading-snug text-white"
            />
            <div className="flex items-center gap-3 mt-4">
              <span className="w-10 h-0.5 rounded-full" style={{ background: '#D4AF37' }} />
              <div>
                <EditableText keyName="founderPage.card.name" as="p" className="font-semibold text-[13px]" style={{ color: '#D4AF37' }} />
                <EditableText keyName="founderPage.card.role" as="p" className="text-[11px]" style={{ color: 'rgba(255,255,255,0.6)' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-4 mt-7">
        <h2 className="font-serif font-bold text-white text-[20px] mb-3">
          <EditableText keyName="founderPage.timeline.title" />{' '}
          <EditableText keyName="founderPage.timeline.titleAccent" style={{ color: '#D4AF37' }} />
        </h2>

        <div
          className="rounded-3xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${m.tint}35` }}
          onTouchStart={() => setPlaying(false)}
        >
          <div className="relative h-48 overflow-hidden">
            {milestones.map((s, i) => (
              <img
                key={i}
                src={s.img}
                alt={s.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                style={{ opacity: i === active ? 1 : 0 }}
              />
            ))}
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${m.tint}20 0%, rgba(0,0,0,0.7) 100%)` }} />
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${m.tint}28`, border: `1px solid ${m.tint}50` }}
              >
                <Icon className="w-4 h-4" style={{ color: m.tint }} />
              </span>
              <span
                className="px-3 py-1 rounded-full text-[12px] font-bold"
                style={{ background: m.tint, color: '#101820' }}
              >
                <EditableText keyName={`${milestoneSeeds[active].keyBase}.year`} />
              </span>
            </div>
          </div>
          <div className="p-4">
            <EditableText
              keyName={`${milestoneSeeds[active].keyBase}.title`}
              as="h3"
              className="font-serif font-bold text-white text-[17px]"
            />
            <EditableText
              keyName={`${milestoneSeeds[active].keyBase}.description`}
              as="p"
              multiline
              className="mt-1 text-[13px] leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => { setPlaying(false); setActive((i) => (i - 1 + milestoneSeeds.length) % milestoneSeeds.length); }}
            className="w-10 h-10 rounded-full flex items-center justify-center tap-fade"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}
            aria-label="Previous milestone"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {milestoneSeeds.map((_, i) => (
              <button
                key={i}
                onClick={() => { setPlaying(false); setActive(i); }}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === active ? 22 : 8,
                  background: i === active ? '#D4AF37' : 'rgba(255,255,255,0.25)',
                }}
                aria-label={`Jump to ${milestones[i].year}`}
              />
            ))}
          </div>
          <button
            onClick={() => { setPlaying(false); setActive((i) => (i + 1) % milestoneSeeds.length); }}
            className="w-10 h-10 rounded-full flex items-center justify-center tap-fade"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}
            aria-label="Next milestone"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 mt-7">
        <div className="grid grid-cols-2 gap-3">
          {([
            { v: 'founderPage.stat1.value', l: 'founderPage.stat1.label', c: '#D4AF37' },
            { v: 'founderPage.stat2.value', l: 'founderPage.stat2.label', c: '#3B82F6' },
            { v: 'founderPage.stat3.value', l: 'founderPage.stat3.label', c: '#10B981' },
            { v: 'founderPage.stat4.value', l: 'founderPage.stat4.label', c: '#8B5CF6' },
          ]).map((s, i) => (
            <div
              key={i}
              className="rounded-2xl p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <EditableText keyName={s.v} as="div" className="text-[22px] font-bold" style={{ color: s.c }} />
              <EditableText keyName={s.l} as="div" className="text-[11px]" style={{ color: 'rgba(255,255,255,0.65)' }} />
            </div>
          ))}
        </div>
      </section>

      {/* Vision */}
      <section className="px-4 mt-7">
        <div
          className="rounded-3xl p-5"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.14) 0%, rgba(212,175,55,0.03) 100%)',
            border: '1px solid rgba(212,175,55,0.25)',
          }}
        >
          <Rocket className="w-6 h-6 mb-3" style={{ color: '#D4AF37' }} />
          <EditableText
            keyName="founderPage.vision.title"
            as="h3"
            className="font-serif font-bold text-[18px] mb-2"
            style={{ color: '#D4AF37' }}
          />
          <EditableText
            keyName="founderPage.vision.body"
            as="p"
            multiline
            className="text-[13px] leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.8)' }}
          />
        </div>
      </section>
    </main>
  );
};
