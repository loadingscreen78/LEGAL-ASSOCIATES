import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, MapPin, User, Phone, Mail, Shield, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * MobileCheckout — single-column, thumb-zone checkout.
 * - Cart summary card on top (expandable)
 * - Progressive form below (full-name → contact → address)
 * - Sticky "Continue to Payment" CTA at the bottom, above the tab bar
 */
export const MobileCheckout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, profile, loading: authLoading } = useAuth();
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    pincode: profile?.pincode || '',
  });
  const [loading, setLoading] = useState(false);
  const [showItems, setShowItems] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    if (profile) {
      setFormData({
        fullName: profile.full_name || '',
        email: user.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        pincode: profile.pincode || '',
      });
    }
  }, [user, profile, authLoading, navigate]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const valid = Object.values(formData).every((v) => v.trim() !== '');

  const submit = async () => {
    if (!valid || !user) return;
    setLoading(true);
    try {
      const orderItems = items.map((i) => ({
        product_id: i.id,
        product_title: i.title,
        product_category: i.category,
        quantity: i.quantity,
        unit_price: i.price,
        total_price: i.price * i.quantity,
      }));
      const orderId = await createOrder({
        items: orderItems,
        total_amount: getTotalPrice(),
        shipping_address: {
          full_name: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          pincode: formData.pincode,
        },
        payment_method: 'pending',
      });
      localStorage.setItem('currentOrderId', orderId);
      localStorage.setItem('orderAmount', getTotalPrice().toString());
      clearCart();
      navigate('/payment');
    } catch (err) {
      console.error(err);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const colors = {
    bg: isDark ? '#0B1017' : '#F6F7FB',
    card: isDark ? '#151D28' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#1F2937',
    muted: isDark ? 'rgba(255,255,255,0.6)' : '#64748B',
    border: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)',
    input: isDark ? '#0F1620' : '#F8FAFC',
  };

  if (items.length === 0) {
    return (
      <main className="md:hidden pt-20 pb-tabbar px-5 text-center" style={{ background: colors.bg, minHeight: '100vh' }}>
        <div
          className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center"
          style={{ background: 'rgba(212,175,55,0.12)' }}
        >
          <ShoppingBag className="w-9 h-9" style={{ color: '#D4AF37' }} />
        </div>
        <h1 className="font-serif font-bold text-[22px] mb-2" style={{ color: colors.text }}>
          Your cart is empty
        </h1>
        <p className="text-[14px] mb-6" style={{ color: colors.muted }}>
          Add books or journals to continue checkout.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 h-12 px-6 rounded-full font-semibold tap-fade"
          style={{ background: '#D4AF37', color: '#101820' }}
        >
          Browse shop <ArrowRight className="w-4 h-4" />
        </Link>
      </main>
    );
  }

  const input = (props: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode; label: string }) => {
    const { icon, label, ...rest } = props;
    return (
      <label className="block">
        <span className="block text-[12px] font-medium mb-1.5 px-1" style={{ color: colors.muted }}>
          {label}
        </span>
        <span className="relative flex items-center">
          <span className="absolute left-3.5" style={{ color: colors.muted }}>
            {icon}
          </span>
          <input
            {...rest}
            className="w-full h-12 pl-11 pr-3 rounded-2xl outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
            style={{
              background: colors.input,
              color: colors.text,
              border: `1px solid ${colors.border}`,
            }}
          />
        </span>
      </label>
    );
  };

  return (
    <main className="md:hidden pt-14 pb-40" style={{ background: colors.bg, minHeight: '100vh' }}>
      {/* Cart summary (expandable) */}
      <section className="px-4 pt-3">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            boxShadow: isDark ? '0 8px 22px rgba(0,0,0,0.4)' : '0 8px 22px rgba(15,23,42,0.06)',
          }}
        >
          <button
            className="w-full flex items-center gap-3 p-4 tap-fade"
            onClick={() => setShowItems((s) => !s)}
            aria-expanded={showItems}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(212,175,55,0.15)' }}
            >
              <ShoppingBag className="w-5 h-5" style={{ color: '#D4AF37' }} />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-[14px]" style={{ color: colors.text }}>
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </div>
              <div className="text-[12px]" style={{ color: colors.muted }}>
                Tap to {showItems ? 'hide' : 'review'}
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-[16px]" style={{ color: '#D4AF37' }}>
                ₹{getTotalPrice().toFixed(0)}
              </div>
              <div className="text-[10px] uppercase tracking-wide" style={{ color: colors.muted }}>
                Total
              </div>
            </div>
          </button>

          {showItems && (
            <ul className="border-t" style={{ borderColor: colors.border }}>
              {items.map((i) => (
                <li
                  key={i.id}
                  className="flex items-center gap-3 p-3 border-b last:border-0"
                  style={{ borderColor: colors.border }}
                >
                  <img
                    src={i.image}
                    alt=""
                    className="w-12 h-14 rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/lovable-uploads/bd9562f0-5286-4441-82a0-f16eac646a5f.png';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[13px] line-clamp-2" style={{ color: colors.text }}>
                      {i.title}
                    </div>
                    <div className="text-[11px]" style={{ color: colors.muted }}>
                      Qty {i.quantity} · ₹{i.price.toFixed(0)}
                    </div>
                  </div>
                  <div className="font-semibold text-[13px]" style={{ color: colors.text }}>
                    ₹{(i.price * i.quantity).toFixed(0)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Shipping form */}
      <section className="px-4 pt-4">
        <h2 className="font-serif font-bold text-[18px] mb-1" style={{ color: colors.text }}>
          Shipping details
        </h2>
        <p className="text-[13px] mb-4" style={{ color: colors.muted }}>
          Where should we deliver your order?
        </p>

        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          {input({ icon: <User className="w-4 h-4" />, label: 'Full name', name: 'fullName', value: formData.fullName, onChange, placeholder: 'Your full name', autoComplete: 'name', required: true })}
          {input({ icon: <Mail className="w-4 h-4" />, label: 'Email', name: 'email', type: 'email', value: formData.email, onChange, placeholder: 'you@example.com', autoComplete: 'email', inputMode: 'email', required: true })}
          {input({ icon: <Phone className="w-4 h-4" />, label: 'Phone', name: 'phone', type: 'tel', value: formData.phone, onChange, placeholder: '+91 9XXXXXXXXX', autoComplete: 'tel', inputMode: 'tel', required: true })}
          {input({ icon: <MapPin className="w-4 h-4" />, label: 'Address', name: 'address', value: formData.address, onChange, placeholder: 'House / street / city', autoComplete: 'street-address', required: true })}
          {input({ icon: <MapPin className="w-4 h-4" />, label: 'Pincode', name: 'pincode', value: formData.pincode, onChange, placeholder: '000000', autoComplete: 'postal-code', inputMode: 'numeric', required: true })}

          <div
            className="flex items-start gap-2 p-3 rounded-xl mt-3"
            style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.2)` }}
          >
            <Shield className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#D4AF37' }} />
            <p className="text-[12px]" style={{ color: colors.muted }}>
              Your details are encrypted and never shared. Orders above ₹500 ship free.
            </p>
          </div>

          {/* hidden submit to keep the form submittable via keyboard */}
          <button type="submit" className="sr-only" aria-hidden>
            submit
          </button>
        </form>
      </section>

      {/* Sticky CTA (clears the tab bar + safe area) */}
      <div
        className="fixed left-0 right-0 z-40 px-4 pt-3 pb-safe surface-blur md:hidden"
        style={{
          bottom: 'calc(64px + env(safe-area-inset-bottom))',
          background: isDark ? 'rgba(11,16,23,0.88)' : 'rgba(246,247,251,0.92)',
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-wide" style={{ color: colors.muted }}>
              Pay now
            </div>
            <div className="font-bold text-[18px]" style={{ color: colors.text }}>
              ₹{getTotalPrice().toFixed(2)}
            </div>
          </div>
          <button
            onClick={submit}
            disabled={!valid || loading}
            className="flex-[1.3] h-12 rounded-full font-semibold flex items-center justify-center gap-2 tap-fade disabled:opacity-50"
            style={{
              background: '#D4AF37',
              color: '#101820',
              boxShadow: '0 10px 24px rgba(212,175,55,0.35)',
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Continue <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
};
