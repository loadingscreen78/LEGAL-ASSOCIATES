import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  CreditCard,
  Edit,
  Save,
  LogOut,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { useTransactions } from '@/hooks/useTransactions';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * MobileDashboard — compact, one-handed user dashboard.
 * Uses segmented control at the top (thumb-accessible) and cards below.
 */
export const MobileDashboard = () => {
  const { user, profile, signOut, updateProfile, loading: authLoading } = useAuth();
  const { orders, loading: ordersLoading } = useOrders();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [tab, setTab] = useState<'profile' | 'orders' | 'payments'>('orders');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone: '', address: '', pincode: '' });

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        pincode: profile.pincode || '',
      });
    }
  }, [profile]);

  const colors = {
    bg: isDark ? '#0B1017' : '#F6F7FB',
    card: isDark ? '#151D28' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#1F2937',
    muted: isDark ? 'rgba(255,255,255,0.6)' : '#64748B',
    border: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)',
    input: isDark ? '#0F1620' : '#F8FAFC',
  };

  const saveProfile = async () => {
    try {
      await updateProfile(form);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const doSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'pending': return '#F59E0B';
      case 'confirmed': case 'processing': return '#3B82F6';
      case 'shipped': return '#8B5CF6';
      case 'delivered': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const statusIcon = (s: string) => {
    switch (s) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': case 'processing': return <AlertCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  if (authLoading || !user) {
    return (
      <main className="md:hidden pt-14 pb-tabbar flex items-center justify-center" style={{ background: colors.bg, minHeight: '100vh' }}>
        <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '3px solid #D4AF37', borderTopColor: 'transparent' }} />
      </main>
    );
  }

  return (
    <main className="md:hidden pt-14 pb-tabbar" style={{ background: colors.bg, minHeight: '100vh' }}>
      {/* Profile header */}
      <section
        className="relative mx-4 mt-4 rounded-3xl p-5 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2D3E50 0%, #101820 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-25 blur-3xl" style={{ background: '#D4AF37' }} />
        <div className="relative flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold"
            style={{ background: '#D4AF37', color: '#101820' }}
          >
            {(profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif font-bold text-[18px] text-white truncate">
              {profile?.full_name || 'Welcome'}
            </div>
            <div className="flex items-center gap-1 text-[12px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
              <Mail className="w-3 h-3" />
              <span className="truncate">{user.email}</span>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="relative mt-4 grid grid-cols-3 gap-2">
          {[
            { v: orders.length, l: 'Orders' },
            { v: orders.filter((o) => o.status === 'delivered').length, l: 'Delivered' },
            { v: transactions.length, l: 'Payments' },
          ].map((s) => (
            <div
              key={s.l}
              className="text-center rounded-xl py-2"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="text-[16px] font-bold text-white">{s.v}</div>
              <div className="text-[10px] uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Segmented tabs */}
      <section className="mx-4 mt-4">
        <div
          className="grid grid-cols-3 p-1 rounded-full"
          style={{ background: colors.card, border: `1px solid ${colors.border}` }}
          role="tablist"
        >
          {(['orders', 'profile', 'payments'] as const).map((t) => {
            const Icon = t === 'orders' ? Package : t === 'profile' ? User : CreditCard;
            const active = tab === t;
            return (
              <button
                key={t}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t)}
                className="h-10 rounded-full flex items-center justify-center gap-1.5 text-[12px] font-semibold tap-fade capitalize"
                style={{
                  background: active ? '#2D3E50' : 'transparent',
                  color: active ? '#FFFFFF' : colors.muted,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {t}
              </button>
            );
          })}
        </div>
      </section>

      {/* Content */}
      <section className="px-4 mt-4 space-y-3">
        {tab === 'orders' && (
          <>
            {ordersLoading ? (
              <div className="text-center py-10">
                <div className="w-8 h-8 rounded-full mx-auto animate-spin" style={{ border: '3px solid #D4AF37', borderTopColor: 'transparent' }} />
              </div>
            ) : orders.length === 0 ? (
              <EmptyState
                icon={<Package className="w-7 h-7" style={{ color: '#D4AF37' }} />}
                title="No orders yet"
                subtitle="Start shopping to see your orders here."
                ctaLabel="Browse shop"
                onCta={() => navigate('/shop')}
                colors={colors}
              />
            ) : (
              orders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => navigate(`/track-order/${o.id}`)}
                  className="w-full text-left rounded-2xl p-4 tap-fade"
                  style={{
                    background: colors.card,
                    border: `1px solid ${colors.border}`,
                    borderLeft: `4px solid ${statusColor(o.status)}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${statusColor(o.status)}20`, color: statusColor(o.status) }}
                    >
                      {statusIcon(o.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-[14px] truncate" style={{ color: colors.text }}>
                          #{o.order_number}
                        </div>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                          style={{ background: `${statusColor(o.status)}20`, color: statusColor(o.status) }}
                        >
                          {o.status}
                        </span>
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: colors.muted }}>
                        {new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[14px]" style={{ color: '#D4AF37' }}>
                        ₹{o.total_amount.toFixed(0)}
                      </div>
                      <ChevronRight className="w-4 h-4 ml-auto" style={{ color: colors.muted }} />
                    </div>
                  </div>
                </button>
              ))
            )}
          </>
        )}

        {tab === 'profile' && (
          <div
            className="rounded-2xl p-4"
            style={{ background: colors.card, border: `1px solid ${colors.border}` }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif font-bold text-[16px]" style={{ color: colors.text }}>
                Profile
              </h2>
              <button
                onClick={() => (editing ? saveProfile() : setEditing(true))}
                className="h-9 px-3 rounded-full text-[12px] font-semibold flex items-center gap-1.5 tap-fade"
                style={{
                  background: editing ? '#D4AF37' : 'rgba(212,175,55,0.12)',
                  color: editing ? '#101820' : '#D4AF37',
                }}
              >
                {editing ? <><Save className="w-3.5 h-3.5" /> Save</> : <><Edit className="w-3.5 h-3.5" /> Edit</>}
              </button>
            </div>

            <Field label="Full name" icon={<User className="w-4 h-4" />} value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} disabled={!editing} colors={colors} />
            <Field label="Phone" icon={<Phone className="w-4 h-4" />} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} disabled={!editing} colors={colors} inputMode="tel" />
            <Field label="Address" icon={<MapPin className="w-4 h-4" />} value={form.address} onChange={(v) => setForm({ ...form, address: v })} disabled={!editing} colors={colors} />
            <Field label="Pincode" icon={<MapPin className="w-4 h-4" />} value={form.pincode} onChange={(v) => setForm({ ...form, pincode: v })} disabled={!editing} colors={colors} inputMode="numeric" />

            <button
              onClick={doSignOut}
              className="mt-4 w-full h-11 rounded-xl flex items-center justify-center gap-2 text-[13px] font-semibold tap-fade"
              style={{ border: `1px solid rgba(239,68,68,0.35)`, color: '#EF4444' }}
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        )}

        {tab === 'payments' && (
          <>
            {transactionsLoading ? (
              <div className="text-center py-10">
                <div className="w-8 h-8 rounded-full mx-auto animate-spin" style={{ border: '3px solid #D4AF37', borderTopColor: 'transparent' }} />
              </div>
            ) : transactions.length === 0 ? (
              <EmptyState
                icon={<CreditCard className="w-7 h-7" style={{ color: '#D4AF37' }} />}
                title="No payments yet"
                subtitle="Your payment history will appear here."
                colors={colors}
              />
            ) : (
              transactions.map((t) => {
                const sColor = t.status === 'completed' ? '#10B981' : t.status === 'pending' ? '#F59E0B' : '#EF4444';
                return (
                  <div
                    key={t.id}
                    className="rounded-2xl p-4 flex items-center gap-3"
                    style={{ background: colors.card, border: `1px solid ${colors.border}` }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${sColor}20`, color: sColor }}
                    >
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[13px] truncate" style={{ color: colors.text }}>
                        #{t.transaction_id}
                      </div>
                      <div className="text-[11px]" style={{ color: colors.muted }}>
                        {new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[14px]" style={{ color: '#D4AF37' }}>
                        ₹{t.amount.toFixed(0)}
                      </div>
                      <span
                        className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                        style={{ background: `${sColor}20`, color: sColor }}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {/* Quick shortcut to keep shopping */}
        {tab !== 'profile' && (
          <button
            onClick={() => navigate('/shop')}
            className="w-full h-12 rounded-full flex items-center justify-center gap-2 font-semibold tap-fade mt-2"
            style={{ background: '#D4AF37', color: '#101820' }}
          >
            <ShoppingBag className="w-4 h-4" /> Continue shopping
          </button>
        )}
      </section>
    </main>
  );
};

function Field({
  label,
  icon,
  value,
  onChange,
  disabled,
  colors,
  inputMode,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  colors: { text: string; muted: string; border: string; input: string };
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
}) {
  return (
    <label className="block mb-3">
      <span className="block text-[11px] mb-1 px-1 uppercase tracking-wide" style={{ color: colors.muted }}>
        {label}
      </span>
      <span className="relative flex items-center">
        <span className="absolute left-3.5" style={{ color: colors.muted }}>
          {icon}
        </span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          inputMode={inputMode}
          className="w-full h-11 pl-10 pr-3 rounded-xl outline-none disabled:opacity-90"
          style={{
            background: colors.input,
            color: colors.text,
            border: `1px solid ${colors.border}`,
          }}
        />
      </span>
    </label>
  );
}

function EmptyState({
  icon,
  title,
  subtitle,
  ctaLabel,
  onCta,
  colors,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  onCta?: () => void;
  colors: { card: string; text: string; muted: string; border: string };
}) {
  return (
    <div
      className="rounded-2xl p-6 text-center"
      style={{ background: colors.card, border: `1px solid ${colors.border}` }}
    >
      <div
        className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
        style={{ background: 'rgba(212,175,55,0.12)' }}
      >
        {icon}
      </div>
      <div className="font-serif font-bold text-[16px]" style={{ color: colors.text }}>{title}</div>
      <div className="text-[13px] mt-1" style={{ color: colors.muted }}>{subtitle}</div>
      {ctaLabel && (
        <button
          onClick={onCta}
          className="mt-4 h-11 px-5 rounded-full font-semibold text-[13px] tap-fade"
          style={{ background: '#D4AF37', color: '#101820' }}
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
