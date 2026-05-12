import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, Truck, CheckCircle, Clock, MapPin, CreditCard, User, Phone,
  ShoppingBag, FileText, Loader2, AlertCircle, XCircle, Zap,
} from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { generateInvoicePDF } from '@/lib/invoiceGenerator';
import { useToast } from '@/hooks/use-toast';

/**
 * MobileOrderTracking — phone-sized order tracking.
 * - Same data + same flow as the desktop version
 * - Vertical timeline instead of the wide road animation
 * - Clean stacked cards for order / delivery info
 * - Sticky primary actions (Invoice + Continue shopping) clear the tab bar
 */

interface Props { orderId?: string }

const STEPS = [
  { key: 'pending',    label: 'Order placed',  icon: Package,     desc: 'Your order has been received.' },
  { key: 'confirmed',  label: 'Confirmed',     icon: CheckCircle, desc: 'Confirmed by seller.' },
  { key: 'processing', label: 'Processing',    icon: Zap,         desc: 'Being prepared for dispatch.' },
  { key: 'shipped',    label: 'Shipped',       icon: Truck,       desc: 'On the way to you.' },
  { key: 'delivered',  label: 'Delivered',     icon: CheckCircle, desc: 'Delivered successfully.' },
] as const;

export const MobileOrderTracking = ({ orderId }: Props) => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { orders, loading } = useOrders();
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) { navigate('/login'); return; }
    if (orders.length && orderId) {
      setOrder(orders.find((o) => o.id === orderId || o.order_number === orderId) || null);
    }
  }, [orders, orderId, user, authLoading, navigate]);

  const statusColor = (s: string) => ({
    pending: '#F59E0B',
    confirmed: '#10B981',
    processing: '#8B5CF6',
    shipped: '#3B82F6',
    delivered: '#10B981',
    cancelled: '#EF4444',
  } as Record<string, string>)[s] || '#6B7280';

  const currentIndex = (() => {
    if (!order) return -1;
    if (order.status === 'cancelled') return -1;
    const idx = STEPS.findIndex((s) => s.key === order.status);
    return idx >= 0 ? idx : 0;
  })();

  if (loading || authLoading) {
    return (
      <main className="md:hidden pt-14 pb-tabbar flex items-center justify-center" style={{ background: '#F6F7FB', minHeight: '100vh' }}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin" style={{ color: '#D4AF37' }} />
          <p className="mt-2 text-[13px]" style={{ color: '#64748B' }}>Loading order…</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="md:hidden pt-14 pb-tabbar px-5 text-center" style={{ background: '#F6F7FB', minHeight: '100vh' }}>
        <div className="mt-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
            <Package className="w-8 h-8" style={{ color: '#EF4444' }} />
          </div>
          <h1 className="font-serif font-bold text-[20px]" style={{ color: '#1F2937' }}>Order not found</h1>
          <p className="mt-1 text-[13px]" style={{ color: '#64748B' }}>We couldn't find this order.</p>
          <button
            onClick={() => navigate('/user-dashboard')}
            className="mt-5 h-11 px-5 rounded-full font-semibold text-[13px] tap-fade"
            style={{ background: '#D4AF37', color: '#101820' }}
          >
            Back to dashboard
          </button>
        </div>
      </main>
    );
  }

  const shippingAddress = typeof order.shipping_address === 'string'
    ? { full_name: '', phone: '', address: order.shipping_address, pincode: '' }
    : order.shipping_address || {};

  return (
    <main className="md:hidden pt-14 pb-40" style={{ background: '#F6F7FB', minHeight: '100vh' }}>
      {/* Header card */}
      <section className="px-4 pt-4">
        <div
          className="rounded-3xl p-4 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-3xl" style={{ background: '#D4AF37' }} />
          <div className="relative">
            <div className="text-[11px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Order
            </div>
            <div className="mt-0.5 font-mono font-bold text-[18px] text-white truncate">#{order.order_number}</div>

            <div className="mt-3 flex items-center gap-2">
              <span
                className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
                style={{ background: `${statusColor(order.status)}25`, color: statusColor(order.status), border: `1px solid ${statusColor(order.status)}50` }}
              >
                {order.status}
              </span>
              <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            <div className="mt-3 flex items-end justify-between">
              <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>Total</div>
              <div className="font-bold text-[22px]" style={{ color: '#D4AF37' }}>
                ₹{order.total_amount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vertical timeline */}
      <section className="px-4 mt-4">
        <div
          className="rounded-2xl p-4"
          style={{ background: '#FFFFFF', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 6px 20px rgba(15,23,42,0.05)' }}
        >
          <h2 className="font-serif font-bold text-[15px] mb-3" style={{ color: '#1F2937' }}>Progress</h2>

          {order.status === 'cancelled' ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-2xl mx-auto mb-2 flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
                <XCircle className="w-6 h-6" style={{ color: '#EF4444' }} />
              </div>
              <p className="font-semibold" style={{ color: '#EF4444' }}>Order cancelled</p>
            </div>
          ) : (
            <ol className="relative">
              <span
                className="absolute left-[18px] top-3 bottom-3 w-0.5"
                style={{ background: 'rgba(15,23,42,0.1)' }}
                aria-hidden
              />
              {STEPS.map((s, i) => {
                const Ic = s.icon;
                const done = i <= currentIndex;
                const current = i === currentIndex;
                return (
                  <li key={s.key} className="relative pl-10 pb-4 last:pb-0">
                    <span
                      className="absolute left-0 top-0 w-9 h-9 rounded-full flex items-center justify-center"
                      style={{
                        background: done ? 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)' : 'rgba(15,23,42,0.06)',
                        color: done ? '#FFFFFF' : '#94A3B8',
                        boxShadow: current ? '0 0 0 4px rgba(212,175,55,0.2)' : 'none',
                      }}
                    >
                      <Ic className="w-4 h-4" />
                    </span>
                    <div className="font-semibold text-[13px]" style={{ color: done ? '#1F2937' : '#94A3B8' }}>
                      {s.label}
                    </div>
                    <div className="text-[12px]" style={{ color: '#64748B' }}>{s.desc}</div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </section>

      {/* Order details */}
      <section className="px-4 mt-3">
        <div
          className="rounded-2xl p-4"
          style={{ background: '#FFFFFF', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 6px 20px rgba(15,23,42,0.05)' }}
        >
          <h2 className="font-serif font-bold text-[15px] mb-2" style={{ color: '#1F2937' }}>Order details</h2>
          <KV k="Order number" v={`#${order.order_number}`} mono />
          <KV k="Order date" v={new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
          <KV k="Payment status" v={(order.payment_status || 'pending').toUpperCase()} pill pillTint={order.payment_status === 'paid' ? '#10B981' : '#F59E0B'} />
          <KV k="Payment method" v={order.payment_method || 'pending'} icon={<CreditCard className="w-3.5 h-3.5" />} />
        </div>
      </section>

      {/* Delivery info */}
      <section className="px-4 mt-3">
        <div
          className="rounded-2xl p-4"
          style={{ background: '#FFFFFF', border: '1px solid rgba(15,23,42,0.08)', boxShadow: '0 6px 20px rgba(15,23,42,0.05)' }}
        >
          <h2 className="font-serif font-bold text-[15px] mb-2" style={{ color: '#1F2937' }}>Delivery</h2>
          {shippingAddress.full_name && (
            <KV k="Recipient" v={shippingAddress.full_name} icon={<User className="w-3.5 h-3.5" />} />
          )}
          {shippingAddress.phone && (
            <KV k="Phone" v={shippingAddress.phone} icon={<Phone className="w-3.5 h-3.5" />} />
          )}
          <KV
            k="Address"
            v={`${shippingAddress.address || 'Not provided'}${shippingAddress.pincode ? ' – ' + shippingAddress.pincode : ''}`}
            icon={<MapPin className="w-3.5 h-3.5" />}
            multiline
          />
          <KV
            k="ETA"
            v={order.status === 'delivered'
              ? 'Delivered'
              : order.estimated_delivery_date
                ? new Date(order.estimated_delivery_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
                : '3–5 business days'}
            icon={<Clock className="w-3.5 h-3.5" />}
          />
        </div>
      </section>

      {/* Sticky actions */}
      <div
        className="fixed left-0 right-0 z-40 px-4 pt-3 pb-safe surface-blur"
        style={{
          bottom: 'calc(64px + env(safe-area-inset-bottom))',
          background: 'rgba(246,247,251,0.94)',
          borderTop: '1px solid rgba(15,23,42,0.08)',
        }}
      >
        <div className="flex gap-2">
          <button
            disabled={downloadingInvoice || order.status === 'pending' || order.status === 'cancelled'}
            onClick={async () => {
              setDownloadingInvoice(true);
              try {
                await generateInvoicePDF({
                  orderNumber: order.order_number,
                  orderDate: new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                  paymentStatus: order.payment_status || 'pending',
                  paymentMethod: order.payment_method || 'Online',
                  totalAmount: order.total_amount,
                  shippingAddress,
                  items: order.items || [],
                });
                toast({ title: 'Invoice downloaded', description: `Invoice for #${order.order_number}` });
              } catch {
                toast({ title: 'Download failed', description: 'Please try again.', variant: 'destructive' });
              } finally {
                setDownloadingInvoice(false);
              }
            }}
            className="flex-1 h-12 rounded-full flex items-center justify-center gap-2 font-semibold text-[13px] tap-fade disabled:opacity-50"
            style={{ background: '#2D3E50', color: '#FFFFFF' }}
          >
            {downloadingInvoice ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating</> : <><FileText className="w-4 h-4" /> Invoice</>}
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="flex-1 h-12 rounded-full flex items-center justify-center gap-2 font-semibold text-[13px] tap-fade"
            style={{ background: '#D4AF37', color: '#101820', boxShadow: '0 10px 24px rgba(212,175,55,0.35)' }}
          >
            <ShoppingBag className="w-4 h-4" /> Continue shopping
          </button>
        </div>
      </div>
    </main>
  );
};

function KV({
  k, v, icon, mono, pill, pillTint, multiline,
}: {
  k: string; v: string; icon?: React.ReactNode; mono?: boolean; pill?: boolean; pillTint?: string; multiline?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-t border-[rgba(15,23,42,0.05)] first:border-t-0 first:pt-0">
      <span className="text-[12px] flex items-center gap-1.5" style={{ color: '#64748B' }}>
        {icon}{k}
      </span>
      {pill ? (
        <span
          className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-full"
          style={{ background: `${pillTint}20`, color: pillTint }}
        >
          {v}
        </span>
      ) : (
        <span
          className={`text-[13px] text-right ${mono ? 'font-mono' : ''} ${multiline ? '' : 'truncate'}`}
          style={{ color: '#1F2937', maxWidth: multiline ? '60%' : '55%' }}
        >
          {v}
        </span>
      )}
    </div>
  );
}
