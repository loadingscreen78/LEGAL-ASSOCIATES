import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Shield, Mail, Lock, ArrowRight, LogIn, UserPlus, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LoginLoader } from '@/components/LoginLoader';

/**
 * MobileLogin — stripped-down login/signup for phones.
 * Same flow as the desktop login component: User vs Admin segmented
 * control, sign in / sign up tabs, admin security code field, and the
 * same LoginLoader for the success transition.
 */
export const MobileLogin = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [kind, setKind] = useState<'user' | 'admin'>('user');
  const [isSignUp, setSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [fullName, setFullName] = useState('');
  const [code, setCode] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<'authenticating' | 'success' | 'redirecting'>('authenticating');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && user) navigate(isAdmin ? '/admin-dashboard' : '/');
  }, [user, isAdmin, authLoading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!email) errs.email = 'Email is required';
    else if (kind !== 'admin' && !/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'At least 6 characters';
    if (isSignUp) {
      if (!fullName.trim()) errs.fullName = 'Full name is required';
      if (password !== confirm) errs.confirm = 'Passwords do not match';
    }
    if (kind === 'admin' && !code) errs.code = 'Security code is required';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setStage('authenticating');
    try {
      if (isSignUp) {
        const { error, needsVerification } = await signUp(email, password, { full_name: fullName });
        if (error) throw error;
        if (needsVerification) { setLoading(false); navigate('/verify-email'); return; }
        toast({ title: 'Account created', description: 'Please verify your email.' });
        setSignUp(false);
        setLoading(false);
      } else {
        const { error, isAdmin: adminFlag, data } = await signIn(email, password, kind === 'admin' ? code : undefined);
        if (error) throw error;
        if (kind !== 'admin' && data?.user && !data.user.emailVerified) { setLoading(false); navigate('/verify-email'); return; }
        setStage('success');
        setTimeout(() => {
          setStage('redirecting');
          setTimeout(() => navigate(kind === 'admin' || adminFlag ? '/admin-dashboard' : '/user-dashboard'), 1200);
        }, 1500);
      }
    } catch (err: any) {
      toast({ title: 'Authentication failed', description: err.message || 'Check your credentials.', variant: 'destructive' });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="md:hidden">
        <LoginLoader stage={stage} userType={kind} userName={email ? email.split('@')[0] : undefined} />
      </div>
    );
  }

  return (
    <main
      className="md:hidden pt-safe pb-tabbar relative"
      style={{
        background: 'linear-gradient(180deg, #101820 0%, #1a2a3a 100%)',
        minHeight: '100vh',
      }}
    >
      {/* Top-left back-home pill */}
      <Link
        to="/"
        className="absolute top-safe left-4 mt-3 h-10 px-3 rounded-full flex items-center gap-1.5 text-[12px] font-medium tap-fade z-10"
        style={{ background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.15)' }}
      >
        <Home className="w-3.5 h-3.5" /> Home
      </Link>

      <section className="px-5 pt-20">
        {/* Brand mark */}
        <div className="flex items-center justify-center mb-5">
          <span
            className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #2D3E50 0%, #101820 100%)', border: '2px solid #D4AF37', boxShadow: '0 10px 30px rgba(212,175,55,0.3)' }}
          >
            <img src="/logo.png" alt="" className="w-9 h-9 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
          </span>
        </div>

        {/* User / Admin segmented */}
        <div className="mx-auto max-w-sm mb-5">
          <div
            className="grid grid-cols-2 p-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            {(['user', 'admin'] as const).map((k) => {
              const Ic = k === 'user' ? User : Shield;
              const active = kind === k;
              return (
                <button
                  key={k}
                  onClick={() => { setKind(k); setErrors({}); setCode(''); }}
                  className="h-10 rounded-full flex items-center justify-center gap-1.5 text-[13px] font-semibold capitalize tap-fade"
                  style={{
                    background: active ? '#D4AF37' : 'transparent',
                    color: active ? '#101820' : 'rgba(255,255,255,0.7)',
                  }}
                >
                  <Ic className="w-3.5 h-3.5" /> {k}
                </button>
              );
            })}
          </div>
        </div>

        <h1 className="font-serif font-bold text-white text-center text-[24px]">
          {kind === 'admin' ? 'Admin portal' : isSignUp ? 'Create account' : 'Welcome back'}
        </h1>
        <p className="mt-1 text-center text-[13px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
          {kind === 'admin' ? 'Secure administrative access' : isSignUp ? 'Join our legal community' : 'Sign in to continue'}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3 max-w-sm mx-auto">
          {isSignUp && kind === 'user' && (
            <Field
              icon={<User className="w-4 h-4" />}
              label="Full name"
              value={fullName}
              onChange={setFullName}
              placeholder="Your full name"
              error={errors.fullName}
              autoComplete="name"
            />
          )}

          <Field
            icon={<Mail className="w-4 h-4" />}
            label={kind === 'admin' ? 'Admin ID' : 'Email'}
            type={kind === 'admin' ? 'text' : 'email'}
            value={email}
            onChange={setEmail}
            placeholder={kind === 'admin' ? 'Enter admin ID' : 'you@example.com'}
            error={errors.email}
            autoComplete={kind === 'admin' ? 'username' : 'email'}
            inputMode={kind === 'admin' ? 'text' : 'email'}
          />

          <Field
            icon={<Lock className="w-4 h-4" />}
            label="Password"
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={setPassword}
            placeholder="Enter password"
            error={errors.password}
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            trailing={
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="p-1.5"
                aria-label={showPw ? 'Hide password' : 'Show password'}
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {isSignUp && (
            <Field
              icon={<Lock className="w-4 h-4" />}
              label="Confirm password"
              type="password"
              value={confirm}
              onChange={setConfirm}
              placeholder="Confirm password"
              error={errors.confirm}
              autoComplete="new-password"
            />
          )}

          {kind === 'admin' && (
            <Field
              icon={<Shield className="w-4 h-4" />}
              label="Security code"
              value={code}
              onChange={setCode}
              placeholder="Enter security code"
              error={errors.code}
            />
          )}

          <button
            type="submit"
            className="w-full h-12 rounded-full font-semibold flex items-center justify-center gap-2 tap-fade mt-2"
            style={{
              background: '#D4AF37',
              color: '#101820',
              boxShadow: '0 12px 30px rgba(212,175,55,0.35)',
            }}
          >
            {kind === 'admin' ? (
              <><Shield className="w-4 h-4" /> Access admin</>
            ) : isSignUp ? (
              <><UserPlus className="w-4 h-4" /> Create account</>
            ) : (
              <><LogIn className="w-4 h-4" /> Sign in <ArrowRight className="w-4 h-4" /></>
            )}
          </button>

          {kind === 'user' && (
            <p className="text-center text-[12px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setSignUp((v) => !v)}
                className="font-semibold"
                style={{ color: '#D4AF37' }}
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          )}
        </form>
      </section>

      <p className="mt-10 text-center text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
        © 2024 Legal Associates
      </p>
    </main>
  );
};

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
  autoComplete,
  inputMode,
  trailing,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  trailing?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
        {label}
      </span>
      <span className="relative flex items-center">
        <span className="absolute left-3.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className="w-full h-12 pl-11 pr-10 rounded-2xl outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: error ? '1.5px solid #EF4444' : '1px solid rgba(255,255,255,0.12)',
            color: '#FFFFFF',
          }}
        />
        {trailing && <span className="absolute right-2 flex items-center">{trailing}</span>}
      </span>
      {error && <span className="block mt-1 text-[11px]" style={{ color: '#F87171' }}>{error}</span>}
    </label>
  );
}
