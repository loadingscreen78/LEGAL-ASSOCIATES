import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Scale, Home, Shield, User, ArrowRight, LogIn, Mail, Lock, UserPlus } from 'lucide-react';
import { AnimatedLogo } from '@/components/AnimatedLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LoginLoader } from '@/components/LoginLoader';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { requestSignupOtp } from '@/lib/authOtp';
import { MobileLogin } from '@/components/mobile/MobileLogin';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [loaderStage, setLoaderStage] = useState<'authenticating' | 'success' | 'redirecting'>('authenticating');

  // Theme colors
  const colors = {
    bg: isDark ? 'linear-gradient(135deg, #101820 0%, #1a2a3a 50%, #101820 100%)' : 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 50%, #F8F9FA 100%)',
    cardBg: isDark ? '#1a2a3a' : '#FFFFFF',
    inputBg: isDark ? '#101820' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#101820',
    textMuted: isDark ? 'rgba(255,255,255,0.7)' : '#444444',
    border: isDark ? 'rgba(212, 175, 55, 0.2)' : 'rgba(45, 62, 80, 0.15)',
    inputBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(45, 62, 80, 0.2)',
    inputText: isDark ? '#FFFFFF' : '#101820',
    placeholder: isDark ? 'rgba(255,255,255,0.4)' : '#888888',
    // Brand-aligned error color: gold border + deep navy text.
    // Keeps validation visible without the jarring saturated red.
    errorBorder: '#D4AF37',
    errorText: isDark ? '#F4D47E' : '#8A6A1C',
  };

  React.useEffect(() => {
    if (!authLoading && user) {
      navigate(isAdmin ? '/admin-dashboard' : '/');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {[key: string]: string} = {};

    if (!email) newErrors.email = 'Email is required';
    else if (loginType !== 'admin' && !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (isSignUp) {
      if (!fullName.trim()) newErrors.fullName = 'Full name is required';
      if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    if (loginType === 'admin' && !securityCode) newErrors.securityCode = 'Security code is required';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setLoaderStage('authenticating');
    
    try {
      if (isSignUp) {
        // New flow: client → /api/auth/send-otp → user gets OTP email →
        // /verify-otp → /api/auth/verify-otp → sign in.
        const r = await requestSignupOtp({ email, password, fullName });
        if (!r.ok) {
          if (r.code === 'already_exists') {
            toast({
              title: 'Account already exists',
              description: 'This email is already registered. Try signing in instead.',
              variant: 'destructive',
            });
            setIsSignUp(false);
          } else {
            toast({
              title: 'Could not start verification',
              description: r.error || 'Please try again.',
              variant: 'destructive',
            });
          }
          setLoading(false);
          return;
        }

        // Park the credentials in sessionStorage so the verify page can
        // sign the user in once the OTP is confirmed. Cleared after success.
        sessionStorage.setItem(
          'la_pendingSignup',
          JSON.stringify({
            email,
            password,
            fullName,
            cooldownSeconds: r.cooldownSeconds ?? 60,
            expiresInMinutes: r.expiresInMinutes ?? 10,
          })
        );

        toast({
          title: 'Code sent',
          description: `We emailed a 6-digit code to ${email}.`,
        });
        setLoading(false);
        navigate('/verify-otp');
        return;
      } else {
        const { error, isAdmin, data } = await signIn(email, password, loginType === 'admin' ? securityCode : undefined);
        if (error) throw error;
        if (loginType !== 'admin' && data?.user && !data.user.email_confirmed_at) {
          setLoading(false);
          navigate('/verify-email');
          return;
        }
        setLoaderStage('success');
        setTimeout(() => {
          setLoaderStage('redirecting');
          setTimeout(() => navigate(loginType === 'admin' || isAdmin ? '/admin-dashboard' : '/user-dashboard'), 1500);
        }, 2000);
      }
    } catch (error: any) {
      // Supabase sends "Invalid login credentials" for wrong password AND for
      // unconfirmed email. Detect each and show a helpful message.
      const raw = (error?.message || '').toLowerCase();
      let title = "Sign in failed";
      let description = error?.message || "Please check your credentials.";

      if (error?.code === 'email_not_confirmed' || raw.includes('not confirmed')) {
        title = "Email not verified";
        description = "We sent a verification link to your email. Please confirm it and try again.";
      } else if (raw.includes('invalid login credentials') || raw.includes('invalid_credentials')) {
        title = "Incorrect email or password";
        description = "Double-check your email and password, then try again.";
      } else if (raw.includes('user already registered') || raw.includes('already been registered')) {
        title = "Account already exists";
        description = "This email is already registered. Try signing in instead.";
      }

      toast({ title, description, variant: "destructive" });
      setLoading(false);
    }
  };

  if (loading) return <LoginLoader stage={loaderStage} userType={loginType} userName={email ? email.split('@')[0] : undefined} />;

  return (
    <>
      {/* Mobile login (< md) */}
      <MobileLogin />

      {/* Desktop / tablet login (≥ md) */}
      <div className="hidden md:flex min-h-screen items-center justify-center relative overflow-hidden" style={{ background: colors.bg }}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)' }} />
        <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full opacity-20" style={{ background: isDark ? 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(45, 62, 80, 0.2) 0%, transparent 70%)' }} />
        <Scale className="absolute top-32 right-32 w-12 h-12 opacity-10 animate-float" style={{ color: '#D4AF37' }} />
        <Scale className="absolute bottom-40 left-24 w-8 h-8 opacity-10 animate-float" style={{ color: isDark ? '#D4AF37' : '#2D3E50', animationDelay: '2s' }} />
      </div>

      {/* Top Bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
        <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(45, 62, 80, 0.1)' }}>
          <Home className="w-5 h-5" style={{ color: isDark ? '#FFFFFF' : '#2D3E50' }} />
          <span className="text-sm font-medium" style={{ color: isDark ? '#FFFFFF' : '#2D3E50' }}>Back to Home</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md px-6 animate-scale-in">
        <div className="rounded-3xl p-8 relative overflow-hidden" style={{ background: colors.cardBg, boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.4)' : '0 25px 60px rgba(0,0,0,0.1)', border: `1px solid ${colors.border}` }}>
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full" style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, transparent 70%)' }} />
          
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <AnimatedLogo />
          </div>

          {/* User/Admin Toggle */}
          <div className="flex items-center justify-center gap-2 p-1.5 rounded-full mb-8" style={{ background: colors.inputBg }}>
            <button onClick={() => { setLoginType('user'); setErrors({}); setSecurityCode(''); }} className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300" style={{ background: loginType === 'user' ? '#2D3E50' : 'transparent', color: loginType === 'user' ? '#FFFFFF' : colors.textMuted }}>
              <User className="w-4 h-4" /> User
            </button>
            <button onClick={() => { setLoginType('admin'); setErrors({}); setSecurityCode(''); }} className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300" style={{ background: loginType === 'admin' ? '#2D3E50' : 'transparent', color: loginType === 'admin' ? '#FFFFFF' : colors.textMuted }}>
              <Shield className="w-4 h-4" /> Admin
            </button>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-bold mb-2" style={{ color: colors.text }}>
              {loginType === 'admin' ? 'Admin Portal' : isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-sm" style={{ color: colors.textMuted }}>
              {loginType === 'admin' ? 'Secure administrative access' : isSignUp ? 'Join our legal community' : 'Sign in to continue'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name (Sign Up) */}
            {isSignUp && loginType === 'user' && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textMuted }} />
                  <input type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full pl-12 pr-4 py-3.5 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-[#D4AF37]" style={{ background: colors.inputBg, border: errors.fullName ? `2px solid ${colors.errorBorder}` : `1px solid ${colors.inputBorder}`, color: colors.inputText, boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.08)' }} />
                </div>
                {errors.fullName && <p className="text-xs mt-1" style={{ color: colors.errorText }}>{errors.fullName}</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>{loginType === 'admin' ? 'Admin ID' : 'Email Address'}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textMuted }} />
                <input type={loginType === 'admin' ? 'text' : 'email'} placeholder={loginType === 'admin' ? 'Enter admin ID' : 'Enter your email'} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3.5 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-[#D4AF37]" style={{ background: colors.inputBg, border: errors.email ? `2px solid ${colors.errorBorder}` : `1px solid ${colors.inputBorder}`, color: colors.inputText, boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.08)' }} />
              </div>
              {errors.email && <p className="text-xs mt-1" style={{ color: colors.errorText }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textMuted }} />
                <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-12 py-3.5 rounded-xl outline-none transition-all duration-300 focus:ring-2 focus:ring-[#D4AF37]" style={{ background: colors.inputBg, border: errors.password ? `2px solid ${colors.errorBorder}` : `1px solid ${colors.inputBorder}`, color: colors.inputText, boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.08)' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: colors.textMuted }}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1" style={{ color: colors.errorText }}>{errors.password}</p>}
            </div>

            {/* Confirm Password (Sign Up) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textMuted }} />
                  <input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-12 pr-4 py-3.5 rounded-xl outline-none transition-all duration-300 focus:ring-2" style={{ background: colors.inputBg, border: errors.confirmPassword ? `1px solid ${colors.errorBorder}` : `1px solid ${colors.inputBorder}`, color: colors.text }} />
                </div>
                {errors.confirmPassword && <p className="text-xs mt-1" style={{ color: colors.errorText }}>{errors.confirmPassword}</p>}
              </div>
            )}

            {/* Security Code (Admin) */}
            {loginType === 'admin' && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Security Code</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.textMuted }} />
                  <input type="text" placeholder="Enter security code" value={securityCode} onChange={(e) => setSecurityCode(e.target.value)} className="w-full pl-12 pr-4 py-3.5 rounded-xl outline-none transition-all duration-300 focus:ring-2" style={{ background: colors.inputBg, border: errors.securityCode ? `1px solid ${colors.errorBorder}` : `1px solid ${colors.inputBorder}`, color: colors.text }} />
                </div>
                {errors.securityCode && <p className="text-xs mt-1" style={{ color: colors.errorText }}>{errors.securityCode}</p>}
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            {!isSignUp && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded" style={{ accentColor: '#D4AF37' }} />
                  <span className="text-sm" style={{ color: colors.textMuted }}>Remember me</span>
                </label>
                <Link to="#" className="text-sm font-medium transition-colors duration-300 hover:underline" style={{ color: '#D4AF37' }}>Forgot password?</Link>
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 disabled:opacity-50" style={{ background: '#D4AF37', color: '#2D3E50', boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)' }}>
              {loginType === 'admin' ? <><Shield className="w-5 h-5" /> Access Admin Portal</> : isSignUp ? <><UserPlus className="w-5 h-5" /> Create Account</> : <><LogIn className="w-5 h-5" /> Sign In <ArrowRight className="w-5 h-5" /></>}
            </button>

            {/* Toggle Sign Up/Sign In */}
            {loginType === 'user' && (
              <p className="text-center text-sm" style={{ color: colors.textMuted }}>
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
                <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="font-semibold transition-colors duration-300 hover:underline" style={{ color: '#D4AF37' }}>
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            )}
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-xs" style={{ color: colors.textMuted }}>© 2024 Legal Associates. All rights reserved.</p>
      </div>
      </div>
    </>
  );
};

export default Login;
