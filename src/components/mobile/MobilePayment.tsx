import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, CreditCard, Landmark, ShieldCheck, Lock, Loader2 } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { sendOrderEmail } from '@/lib/sendOrderEmail';

/**
 * MobilePayment — single-column payment chooser with a sticky "Pay now" CTA.
 * Does not change the flow: reads currentOrderId / orderAmount from localStorage,
 * creates a transaction, navigates to /order-success.
 */
export const MobilePayment = () => {
  const navigate = useNavigate();
  const { createTransaction } = useOrders();
  const [method, setMethod] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const id = localStorage.getItem('currentOrderId');
    const stored = localStorage.getItem('orderAmount');
    if (!id || !stored) {
      navigate('/checkout');
      return;
    }
    setAmount(parseFloat(stored));
  }, [navigate]);

  const methods = [
    { id: 'upi',        name: 'UPI',           sub: 'GPay, PhonePe, Paytm', icon: Smartphone, tint: '#3B82F6' },
    { id: 'card',       name: 'Card',          sub: 'Debit / credit cards', icon: CreditCard, tint: '#8B5CF6' },
    { id: 'netbanking', name: 'Net banking',   sub: 'All major banks',      icon: Landmark,   tint: '#10B981' },
  ];

  const pay = async () => {
    if (!method) return;
    const orderId = localStorage.getItem('currentOrderId');
    if (!orderId) { navigate('/checkout'); return; }

    setProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      const txId = `TXN${Date.now()}`;
      await createTransaction({
        order_id: orderId,
        transaction_id: txId,
        amount,
        status: 'success',
        payment_method: method,
        gateway_response: { transaction_id: txId, status: 'success', timestamp: new Date().toISOString() },
      });
      localStorage.setItem('orderData', JSON.stringify({
        orderId: txId, amount, paymentMethod: method, timestamp: new Date().toISOString(),
      }));

      // Best-effort confirmation email. Uses DB order UUID; never blocks UX.
      sendOrderEmail(orderId).catch(() => { /* swallowed */ });

      localStorage.removeItem('currentOrderId');
      localStorage.removeItem('orderAmount');
      navigate('/order-success');
    } catch (err) {
      console.error('[payment]', err);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="md:hidden pt-14 pb-40" style={{ background: '#F6F7FB', minHeight: '100vh' }}>
      {/* Amount card */}
      <section className="px-4 pt-4">
        <div
          className="rounded-3xl p-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #2D3E50 0%, #101820 100%)' }}
        >
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20 blur-3xl" style={{ background: '#D4AF37' }} />
          <div className="relative">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.65)' }}>
              <Lock className="w-3 h-3" /> Pay securely
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-bold text-white" style={{ fontSize: 36 }}>
                ₹{amount.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-[12px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Total amount payable to Legal Associates
            </p>
          </div>
        </div>
      </section>

      {/* Methods */}
      <section className="px-4 mt-4">
        <h2 className="font-serif font-bold text-[16px] mb-3" style={{ color: '#1F2937' }}>
          Choose payment method
        </h2>
        <ul className="space-y-2">
          {methods.map((m) => {
            const Ic = m.icon;
            const active = method === m.id;
            return (
              <li key={m.id}>
                <button
                  onClick={() => setMethod(m.id)}
                  className="w-full text-left p-4 rounded-2xl flex items-center gap-3 tap-fade"
                  style={{
                    background: active ? 'rgba(212,175,55,0.1)' : '#FFFFFF',
                    border: `1.5px solid ${active ? '#D4AF37' : 'rgba(15,23,42,0.08)'}`,
                    boxShadow: active ? '0 8px 22px rgba(212,175,55,0.2)' : '0 6px 20px rgba(15,23,42,0.04)',
                  }}
                >
                  <span
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${m.tint}15` }}
                  >
                    <Ic className="w-5 h-5" style={{ color: m.tint }} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold text-[14px]" style={{ color: '#1F2937' }}>{m.name}</span>
                    <span className="block text-[12px]" style={{ color: '#64748B' }}>{m.sub}</span>
                  </span>
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ border: `2px solid ${active ? '#D4AF37' : 'rgba(15,23,42,0.2)'}` }}
                  >
                    {active && <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#D4AF37' }} />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div
          className="mt-3 flex items-start gap-2 p-3 rounded-xl"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
        >
          <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#10B981' }} />
          <p className="text-[12px]" style={{ color: '#065F46' }}>
            256-bit SSL secured. Your card / UPI credentials never touch our servers.
          </p>
        </div>
      </section>

      {/* Sticky Pay CTA */}
      <div
        className="fixed left-0 right-0 z-40 px-4 pt-3 pb-safe surface-blur"
        style={{
          bottom: 'calc(64px + env(safe-area-inset-bottom))',
          background: 'rgba(246,247,251,0.94)',
          borderTop: '1px solid rgba(15,23,42,0.08)',
        }}
      >
        <button
          onClick={pay}
          disabled={!method || processing}
          className="w-full h-12 rounded-full font-semibold flex items-center justify-center gap-2 tap-fade disabled:opacity-50"
          style={{
            background: '#D4AF37',
            color: '#101820',
            boxShadow: '0 10px 24px rgba(212,175,55,0.35)',
          }}
        >
          {processing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Processing…
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" /> Pay ₹{amount.toFixed(2)}
            </>
          )}
        </button>
      </div>
    </main>
  );
};
