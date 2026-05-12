import { Phone, MapPin, Mail, Clock, Navigation as NavIcon, BookOpen, Truck, ClipboardList, CreditCard } from 'lucide-react';

/**
 * MobileVisitStore — thumb-friendly "Visit Us" page.
 * - Tap-to-call and tap-to-directions buttons up top (primary actions)
 * - Address / phone / email / hours on clean stacked cards
 * - Google Map embed constrained to a phone-sized aspect ratio
 * - Photo strip (horizontal scroller) instead of a wide 2-col grid
 */

const images = [
  { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop', caption: 'Our main store in Cuttack' },
  { src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop', caption: 'Extensive law book collection' },
  { src: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=600&fit=crop', caption: 'Comfortable reading area' },
  { src: 'https://images.unsplash.com/photo-1589829545856-d10d85525114?w=800&h=600&fit=crop', caption: 'Customer service desk' },
];

const services = [
  { icon: BookOpen, label: 'Book consultation' },
  { icon: Truck, label: 'Home delivery' },
  { icon: ClipboardList, label: 'Custom orders' },
  { icon: CreditCard, label: 'Multiple payments' },
];

export const MobileVisitStore = () => {
  return (
    <main
      className="md:hidden pt-14 pb-tabbar"
      style={{ background: '#0B1017', minHeight: '100vh' }}
    >
      {/* Hero */}
      <section className="px-4 pt-5">
        <h1 className="font-serif font-bold text-white leading-tight" style={{ fontSize: 28 }}>
          Visit our <span style={{ color: '#D4AF37' }}>store</span>
        </h1>
        <p className="mt-2 text-[14px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Browse the collection in person — our team will help you find the right publication.
        </p>

        {/* Primary actions */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <a
            href="tel:+916712910130"
            className="h-12 rounded-full flex items-center justify-center gap-2 font-semibold text-[13px] tap-fade"
            style={{ background: '#10B981', color: '#FFFFFF' }}
          >
            <Phone className="w-4 h-4" /> Call store
          </a>
          <a
            href="https://maps.google.com/?q=High+Court+Road+Cuttack+Odisha"
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 rounded-full flex items-center justify-center gap-2 font-semibold text-[13px] tap-fade"
            style={{ background: '#D4AF37', color: '#101820' }}
          >
            <NavIcon className="w-4 h-4" /> Directions
          </a>
        </div>
      </section>

      {/* Store info cards */}
      <section className="px-4 mt-6 space-y-3">
        <InfoCard icon={<MapPin className="w-4 h-4" />} title="Address">
          LEGAL ASSOCIATES<br />
          (Law Book Sellers, Publishers &amp; Suppliers)<br />
          High Court Road, Cuttack – 753002, Odisha
        </InfoCard>

        <InfoCard icon={<Phone className="w-4 h-4" />} title="Phone">
          <a href="tel:+916712910130" className="block underline-offset-2 hover:underline">0671-2910130 (Office)</a>
          <a href="tel:+919437019131" className="block underline-offset-2 hover:underline">+91 94370 19131 (Mobile)</a>
        </InfoCard>

        <InfoCard icon={<Mail className="w-4 h-4" />} title="Email">
          <a href="mailto:legalassociates.ocr@gmail.com" className="block truncate">legalassociates.ocr@gmail.com</a>
          <a href="mailto:akshaya.ocr@gmail.com" className="block truncate">akshaya.ocr@gmail.com</a>
        </InfoCard>

        <InfoCard icon={<Clock className="w-4 h-4" />} title="Store hours">
          <div className="flex items-center justify-between">
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Mon – Fri</span>
            <span className="font-semibold">10 AM – 8 PM</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Saturday</span>
            <span className="font-semibold">10 AM – 6 PM</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Sunday</span>
            <span className="font-semibold" style={{ color: '#D4AF37' }}>11 AM – 5 PM</span>
          </div>
        </InfoCard>
      </section>

      {/* Map */}
      <section className="px-4 mt-6">
        <h2 className="font-serif font-bold text-white text-[18px] mb-3">Find us here</h2>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <iframe
            title="Legal Associates store location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58874.08683982052!2d85.77406543125!3d20.462520599999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa5%3A0xfc580e2b68b33fa8!2sCuttack%2C%20Odisha!5e0!3m2!1sen!2sin!4v1639476543210!5m2!1sen!2sin"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
            style={{ height: 240, border: 0 }}
            allowFullScreen
          />
        </div>
      </section>

      {/* Services */}
      <section className="px-4 mt-6">
        <h2 className="font-serif font-bold text-white text-[18px] mb-3">Services</h2>
        <ul className="grid grid-cols-2 gap-2">
          {services.map((s) => {
            const Ic = s.icon;
            return (
              <li
                key={s.label}
                className="flex items-center gap-3 p-3 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(212,175,55,0.15)' }}
                >
                  <Ic className="w-4 h-4" style={{ color: '#D4AF37' }} />
                </span>
                <span className="text-[13px] text-white">{s.label}</span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Gallery */}
      <section className="mt-7">
        <h2 className="font-serif font-bold text-white text-[18px] mb-3 px-4">Inside our store</h2>
        <ul className="scroll-x flex gap-3 px-4 pb-2">
          {images.map((img) => (
            <li key={img.src} className="snap-start-mx shrink-0 w-[240px]">
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <img src={img.src} alt={img.caption} loading="lazy" className="w-full h-[140px] object-cover" />
                <div className="p-3 text-[12px]" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {img.caption}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}
        >
          {icon}
        </span>
        <span className="text-[12px] uppercase tracking-wide" style={{ color: '#D4AF37' }}>{title}</span>
      </div>
      <div className="text-[13px] leading-relaxed text-white">{children}</div>
    </div>
  );
}
