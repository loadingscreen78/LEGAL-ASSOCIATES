import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Home, ShoppingBag, Package, Mail, Clock } from 'lucide-react';

/**
 * MobileOrderSuccess — celebratory but calm order-placed screen.
 * Same flow: reads orderData from localStorage, offers "Home" + "Continue shopping".
 */
export const MobileOrderSuccess = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<{ orderId: string; amount: number; paymentMethod: string; timestamp: string } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('orderData');
    if (!raw) { navigate('/'); return; }
    try { setOrder(JSON.parse(raw)); } catch { navigate('/'); }
  }, [navigate]);

  if (!order) return null;

  const steps = [
    { icon: Check,   label: 'Order confirmed',         done: true },
    { icon: Package, label: 'Preparing shipment',      done: false },
    { icon: Mail,    label: 'Tracking number via email', done: false },
    { icon: Clock,   label: 'Delivered in 3–5 days',   done: false },
  ];

  return (
    <main
      className="md:hidden pt-14 pb-tabbar"
      style={{ background: '#F6F7FB', minHeight: '100vh' }}
    >
      {/* Success hero */}
      <section className="px-4 pt-6 text-center">
        <div
          className="mx-auto w-20 h-20 rounded-full flex items-center justify-center relative"
          style={{ background: '#10B981', boxShadow: '0 12px 32px rgba(16,185,129,0.35)' }}
        >
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
          <span className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(16,185,129,0.3)' }} />
        </div>
        <h1 className="mt-5 font-serif font-bold text-[24px] leading-tight" style={{ color: '#1F2937' }}>
          Order placed
        </h1>
        <p className="mt-1 text-[13px] max-w-xs mx-auto" style={{ color: '#64748B' }}>
          Thank you — your legal publications are on their way.
        </p>
      </section>

      {/* Order summary */}
      <section className="px-4 mt-6">
        <div
          className="rounded-2xl p-4"
          style={{ background: '#FFFFFF', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 6px 20px rgba(15,23,42,0.05)' }}
        >
          <div className="text-[11px] uppercase tracking-wide" style={{ color: '#94A3B8' }}>Order ID</div>
          <div className="font-mono font-semibold text-[14px] mt-0.5" style={{ color: '#1F2937' }}>{order.orderId}</div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[13px]" style={{ color: '#64748B' }}>Amount paid</span>
            <span className="font-bold text-[16px]" style={{ color: '#D4AF37' }}>₹{order.amount.toFixed(2)}</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[13px]" style={{ color: '#64748B' }}>Payment</span>
            <span className="capitalize text-[13px]" style={{ color: '#1F2937' }}>{order.paymentMethod}</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[13px]" style={{ color: '#64748B' }}>Placed on</span>
            <span className="text-[13px]" style={{ color: '#1F2937' }}>
              {new Date(order.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      </section>

      {/* Next steps */}
      <section className="px-4 mt-4">
        <h2 className="font-serif font-bold text-[15px] mb-2" style={{ color: '#1F2937' }}>What's next</h2>
        <ol
          className="rounded-2xl overflow-hidden"
          style={{ background: '#FFFFFF', border: '1px solid rgba(15,23,42,0.08)' }}
        >
          {steps.map((s, i) => {
            const Ic = s.icon;
            return (
              <li
                key={s.label}
                className="flex items-center gap-3 p-3"
                style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(15,23,42,0.05)' }}
              >
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: s.done ? 'rgba(16,185,129,0.15)' : 'rgba(15,23,42,0.05)',
                    color: s.done ? '#10B981' : '#94A3B8',
                  }}
                >
                  <Ic className="w-4 h-4" />
                </span>
                <span className="text-[13px]" style={{ color: s.done ? '#1F2937' : '#64748B' }}>{s.label}</span>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Actions */}
      <section className="px-4 mt-5 space-y-2">
        <Link
          to="/"
          className="h-12 rounded-full flex items-center justify-center gap-2 font-semibold tap-fade"
          style={{ background: '#2D3E50', color: '#FFFFFF' }}
        >
          <Home className="w-4 h-4" /> Back to home
        </Link>
        <Link
          to="/shop"
          className="h-12 rounded-full flex items-center justify-center gap-2 font-semibold tap-fade"
          style={{ background: '#D4AF37', color: '#101820' }}
        >
          <ShoppingBag className="w-4 h-4" /> Continue shopping
        </Link>
      </section>
    </main>
  );
};
