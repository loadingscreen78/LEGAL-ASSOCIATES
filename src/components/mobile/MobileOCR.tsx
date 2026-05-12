import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Shield, Minus, Plus, Mail, Phone, MapPin } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

/**
 * MobileOCR — Mobile view for the Orissa Criminal Reports subscription page.
 * Same flow as desktop: pick yearly vs. single part, choose quantity, add to
 * cart or proceed straight to checkout. Fits on a phone without horizontal
 * scrolling; primary CTAs sit in the thumb-zone via a sticky bar.
 */

const journal = {
  title: 'Orissa Criminal Reports',
  subtitle: 'A Monthly Criminal Law Journal · Published on the 1st',
  image: '/lovable-uploads/441f5d29-2c1e-4b01-8bf0-1ec3f24cc58d.png',
  yearlyPrice: 3200,
  partPrice: 450,
  citation: '[2025] 99 OCR',
  edition: 'July 2025',
  years: 38,
};

export const MobileOCR = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'yearly' | 'part'>('yearly');
  const [qty, setQty] = useState(1);

  const unit = mode === 'yearly' ? journal.yearlyPrice : journal.partPrice;
  const total = unit * qty;

  const doAdd = () => {
    const title = mode === 'yearly'
      ? `${journal.title} – Yearly Subscription`
      : `${journal.title} – Single Part`;
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: `ocr-${mode}-${Date.now()}-${i}`,
        title,
        price: unit,
        image: journal.image,
        category: 'Journal Subscription',
      });
    }
    setQty(1);
  };

  const checkout = () => {
    doAdd();
    navigate('/checkout');
  };

  return (
    <main
      className="md:hidden pt-14 pb-40"
      style={{ background: '#F6F7FB', minHeight: '100vh' }}
    >
      {/* Cover + badges */}
      <section className="px-4 pt-4">
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(15,23,42,0.08)',
            boxShadow: '0 8px 28px rgba(15,23,42,0.06)',
          }}
        >
          <div className="relative h-64 bg-[#101820] flex items-center justify-center">
            <img
              src={journal.image}
              alt={journal.title}
              loading="lazy"
              className="max-h-full max-w-[70%] object-contain"
            />
            <span
              className="absolute top-3 left-3 w-11 h-11 rounded-full flex items-center justify-center font-bold text-white"
              style={{ background: '#F97316', boxShadow: '0 4px 12px rgba(249,115,22,0.4)' }}
            >
              LA
            </span>
            <div
              className="absolute top-3 right-3 w-16 h-16 rounded-full flex flex-col items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #B98C12 100%)',
                boxShadow: '0 6px 20px rgba(212,175,55,0.4)',
              }}
            >
              <span className="text-xl font-bold text-[#101820] leading-none">{journal.years}</span>
              <span className="text-[9px] font-semibold text-[#101820]">YEARS</span>
            </div>
          </div>

          <div className="p-4">
            <h1 className="font-serif font-bold text-[22px] leading-tight" style={{ color: '#1F2937' }}>
              {journal.title}
            </h1>
            <p className="mt-1 text-[12px]" style={{ color: '#64748B' }}>{journal.subtitle}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37' }}>
                Edition · {journal.edition}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ background: 'rgba(45,62,80,0.08)', color: '#2D3E50' }}>
                Cite · {journal.citation}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="px-4 mt-4">
        <Card title="Overview">
          Reporting every criminal judgement (reportable and unreported) from the Orissa High
          Court and Supreme Court, plus important decisions from other High Courts.
        </Card>
      </section>

      {/* Editorial team */}
      <section className="px-4 mt-3">
        <Card title="Editorial team">
          <Row k="Chief Editor (in charge)" v="Justice M. M. Das (Retd.)" />
          <Row k="Associate Chief Editor" v="Justice Dr. D. P. Choudhury (Retd.)" />
          <Row k="Printed, Published, Edited & Owned by" v="Mr. Akshaya Kumar Deo" />
          <Row k="Associate Editors" v="Mr. Debiprasad Dhal, Mr. Manoranjan Acharya" />
        </Card>
      </section>

      {/* Pricing */}
      <section className="px-4 mt-3">
        <div
          className="rounded-2xl p-4"
          style={{ background: '#FFFFFF', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 6px 20px rgba(15,23,42,0.05)' }}
        >
          <h3 className="font-serif font-bold text-[16px] mb-3" style={{ color: '#1F2937' }}>
            Subscription options
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'yearly' as const, title: 'Yearly', price: journal.yearlyPrice, sub: '12 issues' },
              { id: 'part' as const, title: 'Single part', price: journal.partPrice, sub: '1 issue' },
            ].map((opt) => {
              const active = mode === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setMode(opt.id)}
                  className="text-left p-3 rounded-xl tap-fade"
                  style={{
                    background: active ? 'rgba(212,175,55,0.12)' : '#F8FAFC',
                    border: `1.5px solid ${active ? '#D4AF37' : 'rgba(15,23,42,0.08)'}`,
                  }}
                >
                  <div className="text-[12px] font-medium" style={{ color: active ? '#D4AF37' : '#64748B' }}>
                    {opt.title}
                  </div>
                  <div className="text-[18px] font-bold" style={{ color: active ? '#D4AF37' : '#1F2937' }}>
                    ₹{opt.price.toLocaleString()}
                  </div>
                  <div className="text-[11px]" style={{ color: '#64748B' }}>{opt.sub}</div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-[13px] font-medium" style={{ color: '#1F2937' }}>Quantity</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-full flex items-center justify-center tap-fade"
                style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-semibold" style={{ color: '#1F2937' }}>{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-9 h-9 rounded-full flex items-center justify-center tap-fade"
                style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            className="mt-3 flex items-center justify-between p-3 rounded-xl"
            style={{ background: 'rgba(212,175,55,0.08)' }}
          >
            <span className="text-[13px] font-semibold" style={{ color: '#1F2937' }}>Total</span>
            <span className="text-[18px] font-bold" style={{ color: '#D4AF37' }}>
              ₹{total.toLocaleString()}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-center" style={{ color: '#64748B' }}>
            Free shipping on orders above ₹500 · Secure payments
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="px-4 mt-3">
        <Card title="Contact">
          <div className="flex items-start gap-2 mb-2">
            <MapPin className="w-4 h-4 mt-0.5" style={{ color: '#D4AF37' }} />
            <div>
              <div className="font-semibold" style={{ color: '#1F2937' }}>LEGAL ASSOCIATES</div>
              <div className="text-[12px]" style={{ color: '#64748B' }}>
                High Court Road, Cuttack – 753002, Odisha
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Phone className="w-4 h-4" style={{ color: '#D4AF37' }} />
            <a href="tel:+916712910130" className="text-[13px]" style={{ color: '#1F2937' }}>
              0671-2910130 (O) · 94370-19131 (M)
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" style={{ color: '#D4AF37' }} />
            <a href="mailto:legalassociates.ocr@gmail.com" className="text-[13px] truncate" style={{ color: '#1F2937' }}>
              legalassociates.ocr@gmail.com
            </a>
          </div>
        </Card>
      </section>

      {/* Sticky CTA */}
      <div
        className="fixed left-0 right-0 z-40 px-4 pt-3 pb-safe surface-blur"
        style={{
          bottom: 'calc(64px + env(safe-area-inset-bottom))',
          background: 'rgba(246,247,251,0.94)',
          borderTop: '1px solid rgba(15,23,42,0.08)',
        }}
      >
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] uppercase tracking-wide" style={{ color: '#64748B' }}>Total</div>
            <div className="text-[18px] font-bold" style={{ color: '#D4AF37' }}>₹{total.toLocaleString()}</div>
          </div>
          <button
            onClick={doAdd}
            className="h-11 px-4 rounded-full flex items-center gap-1.5 text-[13px] font-semibold tap-fade"
            style={{ border: '1px solid rgba(15,23,42,0.15)', color: '#1F2937', background: '#FFFFFF' }}
          >
            <ShoppingCart className="w-4 h-4" /> Add
          </button>
          <button
            onClick={checkout}
            className="h-11 px-5 rounded-full flex items-center gap-1.5 text-[13px] font-semibold tap-fade"
            style={{
              background: '#D4AF37',
              color: '#101820',
              boxShadow: '0 10px 24px rgba(212,175,55,0.35)',
            }}
          >
            <Shield className="w-4 h-4" /> Checkout
          </button>
        </div>
      </div>
    </main>
  );
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: '#FFFFFF', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 6px 20px rgba(15,23,42,0.05)' }}
    >
      <h3 className="font-serif font-bold text-[15px] mb-2" style={{ color: '#D4AF37' }}>
        {title}
      </h3>
      <div className="text-[13px] leading-relaxed" style={{ color: '#334155' }}>
        {children}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="mb-2 last:mb-0">
      <div className="text-[11px] uppercase tracking-wide" style={{ color: '#94A3B8' }}>{k}</div>
      <div className="text-[13px]" style={{ color: '#1F2937' }}>{v}</div>
    </div>
  );
}
