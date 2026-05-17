import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Loader2, ShieldCheck, RotateCcw, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AnimatedLogo } from '@/components/AnimatedLogo';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { requestSignupOtp, verifySignupOtp } from '@/lib/authOtp';

/**
 * VerifyOtp — 6-digit code entry after signup.
 *
 * Pulls pending signup info out of sessionStorage (set by Login.tsx right
 * before navigating here). Pasting a 6-digit code auto-fills, auto-submits.
 * On success, signs the user in and forwards them inside the site.
 */

const PENDING_KEY = 'la_pendingSignup';

interface PendingSignup {
  email: string;
  password: string;
  fullName?: string;
  cooldownSeconds: number;
  expiresInMinutes: number;
}

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { signIn } = useAuth();
  const { toast } = useToast();

  const pending = useMemo<PendingSignup | null>(() => {
    try {
      const raw = sessionStorage.getItem(PENDING_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }, []);

  const [digits, setDigits] = useState<string[]>(() => Array(6).fill(''));
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState<number>(pending?.cooldownSeconds ?? 60);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // Bounce back to Login if the user landed here without a pending signup.
  useEffect(() => {
    if (!pending?.email || !pending?.password) {
      navigate('/login', { replace: true });
    }
  }, [pending, navigate]);

  // Cooldown countdown for the resend button.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => window.clearInterval(t);
  }, [cooldown]);

  // Autofocus the first box.
  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const colors = {
    bg: isDark
      ? 'linear-gradient(135deg, #101820 0%, #1a2a3a 50%, #101820 100%)'
      : 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 50%, #F8F9FA 100%)',
    cardBg: isDark ? '#1a2a3a' : '#FFFFFF',
    inputBg: isDark ? '#101820' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#101820',
    muted: isDark ? 'rgba(255,255,255,0.7)' : '#475569',
    dim: isDark ? 'rgba(255,255,255,0.45)' : '#94A3B8',
    border: isDark ? 'rgba(212,175,55,0.2)' : 'rgba(45,62,80,0.15)',
    inputBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(45,62,80,0.2)',
  };

  const setDigit = (i: number, v: string) => {
    setError(null);
    setDigits((arr) => {
      const next = arr.slice();
      next[i] = v;
      return next;
    });
  };

  const onChange = (i: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, '');
    if (!cleaned) {
      setDigit(i, '');
      return;
    }
    // Allow pasting many digits into a single box.
    if (cleaned.length > 1) {
      const arr = digits.slice();
      for (let j = 0; j < cleaned.length && i + j < 6; j++) {
        arr[i + j] = cleaned[j];
      }
      setDigits(arr);
      const last = Math.min(i + cleaned.length, 5);
      refs.current[last]?.focus();
      maybeAutoSubmit(arr);
      return;
    }
    setDigit(i, cleaned);
    if (i < 5) refs.current[i + 1]?.focus();
    if (i === 5) maybeAutoSubmit([...digits.slice(0, 5), cleaned]);
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && i > 0) {
      e.preventDefault(); refs.current[i - 1]?.focus();
    } else if (e.key === 'ArrowRight' && i < 5) {
      e.preventDefault(); refs.current[i + 1]?.focus();
    } else if (e.key === 'Enter') {
      maybeAutoSubmit(digits);
    }
  };

  const onPaste = (i: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text/plain').replace(/\D/g, '');
    if (!text) return;
    e.preventDefault();
    const arr = digits.slice();
    for (let j = 0; j < text.length && i + j < 6; j++) {
      arr[i + j] = text[j];
    }
    setDigits(arr);
    refs.current[Math.min(i + text.length, 5)]?.focus();
    maybeAutoSubmit(arr);
  };

  const maybeAutoSubmit = (arr: string[]) => {
    if (arr.every((d) => d) && arr.join('').length === 6) {
      handleVerify(arr.join(''));
    }
  };

  const handleVerify = async (code?: string) => {
    if (!pending) return;
    const otp = code ?? digits.join('');
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6-digit code from your email.');
      return;
    }
    setError(null);
    setVerifying(true);
    const verify = await verifySignupOtp({ email: pending.email, otp });
    if (!verify.ok) {
      setError(verify.error || 'Verification failed.');
      setVerifying(false);
      return;
    }

    // Success — sign them in with the password kept in session.
    const signin = await signIn(pending.email, pending.password);
    if (signin?.error) {
      setError(signin.error.message || 'Verified, but sign-in failed. Please sign in manually.');
      setVerifying(false);
      sessionStorage.removeItem(PENDING_KEY);
      navigate('/login', { replace: true });
      return;
    }

    // Done.
    sessionStorage.removeItem(PENDING_KEY);
    setDone(true);
    setTimeout(() => navigate('/user-dashboard', { replace: true }), 1100);
  };

  const handleResend = async () => {
    if (!pending || cooldown > 0 || resending) return;
    setResending(true);
    setError(null);
    const r = await requestSignupOtp({
      email: pending.email,
      password: pending.password,
      fullName: pending.fullName,
    });
    setResending(false);
    if (!r.ok) {
      setError(r.error || 'Could not send a new code.');
      if (r.retryAfter) setCooldown(r.retryAfter);
      return;
    }
    setCooldown(r.cooldownSeconds ?? 60);
    setDigits(Array(6).fill(''));
    refs.current[0]?.focus();
    toast({ title: 'Code sent', description: 'Check your inbox for a new 6-digit code.' });
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}>
        <div className="text-center animate-scale-in">
          <CheckCircle2 className="w-20 h-20 mx-auto" style={{ color: '#D4AF37' }} />
          <h1 className="mt-4 font-serif font-bold text-2xl" style={{ color: colors.text }}>
            Email verified
          </h1>
          <p className="mt-2 text-sm" style={{ color: colors.muted }}>
            Welcome aboard. Taking you in…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: colors.bg }}>
      {/* Background flourishes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)' }} />
        <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full opacity-20" style={{ background: isDark ? 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(45,62,80,0.2) 0%, transparent 70%)' }} />
      </div>

      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
          style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(45,62,80,0.08)', color: isDark ? '#FFFFFF' : '#2D3E50' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md px-6 animate-scale-in">
        <div
          className="rounded-3xl p-8 relative overflow-hidden"
          style={{
            background: colors.cardBg,
            boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.4)' : '0 25px 60px rgba(0,0,0,0.1)',
            border: `1px solid ${colors.border}`,
          }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, transparent 70%)' }} />

          <div className="flex justify-center mb-6">
            <AnimatedLogo />
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3" style={{ background: 'rgba(212,175,55,0.15)' }}>
              <ShieldCheck className="w-6 h-6" style={{ color: '#D4AF37' }} />
            </div>
            <h1 className="font-serif font-bold text-2xl mb-1" style={{ color: colors.text }}>
              Verify your email
            </h1>
            <p className="text-sm" style={{ color: colors.muted }}>
              We sent a 6-digit code to
            </p>
            <p className="text-sm font-semibold mt-0.5 break-all" style={{ color: '#D4AF37' }}>
              <Mail className="w-3.5 h-3.5 inline -mt-0.5 mr-1" />
              {pending?.email}
            </p>
          </div>

          {/* OTP boxes */}
          <div className="grid grid-cols-6 gap-2 mb-3">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                value={d}
                onChange={(e) => onChange(i, e.target.value)}
                onKeyDown={(e) => onKeyDown(i, e)}
                onPaste={(e) => onPaste(i, e)}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                aria-label={`Digit ${i + 1}`}
                className="h-14 text-center font-bold rounded-xl outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                style={{
                  fontSize: 22,
                  background: colors.inputBg,
                  color: colors.text,
                  border: `2px solid ${error ? '#D4AF37' : d ? '#D4AF37' : colors.inputBorder}`,
                }}
              />
            ))}
          </div>

          {error && (
            <p className="text-xs mb-3 text-center" style={{ color: '#F4D47E' }}>
              {error}
            </p>
          )}

          <button
            onClick={() => handleVerify()}
            disabled={verifying || digits.some((d) => !d)}
            className="w-full h-12 rounded-full flex items-center justify-center gap-2 font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
            style={{
              background: '#D4AF37',
              color: '#101820',
              boxShadow: '0 10px 30px rgba(212,175,55,0.3)',
            }}
          >
            {verifying ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
            ) : (
              <>Verify and continue</>
            )}
          </button>

          <div className="mt-5 pt-4 border-t flex items-center justify-between" style={{ borderColor: colors.border }}>
            <span className="text-xs" style={{ color: colors.dim }}>
              Didn't get it?
            </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || resending}
              className="text-xs font-semibold inline-flex items-center gap-1 transition-colors disabled:opacity-50"
              style={{ color: '#D4AF37' }}
            >
              {resending ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
            </button>
          </div>

          <p className="mt-4 text-[11px] text-center" style={{ color: colors.dim }}>
            Code expires in {pending?.expiresInMinutes ?? 10} minutes. Check your spam folder if it doesn't arrive.
          </p>
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: colors.dim }}>
          © {new Date().getFullYear()} Legal Associates · All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
