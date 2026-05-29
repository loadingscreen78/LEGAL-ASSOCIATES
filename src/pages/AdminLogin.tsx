
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Scale, Briefcase, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedLogo } from '@/components/AnimatedLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { login as loginApi } from '@/lib/authLogin';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { theme } = useTheme();

  // Anti-bot signals (server validates these silently)
  const formStartedAtRef = useRef<number>(Date.now());
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const result = await loginApi({
      email,
      password,
      asAdmin: true,
      honeypot,
      formStartedAt: formStartedAtRef.current,
    });

    if (!result.ok) {
      if (result.shouldRedirectHome) {
        navigate('/', { replace: true });
        return;
      }
      toast({
        title: 'Sign in failed',
        description: result.error,
        variant: 'destructive',
      });
      setSubmitting(false);
      return;
    }

    toast({
      title: 'Welcome back',
      description: 'Loading the admin dashboard…',
    });
    navigate('/admin-dashboard');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-br from-[#0F0F0F] via-[#1a1a1a] to-[#0F0F0F]' : 'bg-gradient-to-br from-[#F8F9FA] via-white to-[#F0F2F5]'
    }`}>
      {/* Background Legal Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Scale className={`absolute top-20 left-20 w-32 h-32 opacity-5 transform rotate-12 ${
          theme === 'dark' ? 'text-white' : 'text-gray-400'
        }`} />
        <Briefcase className={`absolute bottom-20 right-20 w-40 h-40 opacity-5 transform -rotate-12 ${
          theme === 'dark' ? 'text-white' : 'text-gray-400'
        }`} />
        <Scale className={`absolute top-1/2 right-10 w-24 h-24 opacity-5 transform rotate-45 ${
          theme === 'dark' ? 'text-white' : 'text-gray-400'
        }`} />
        <Briefcase className={`absolute bottom-1/3 left-10 w-28 h-28 opacity-5 transform -rotate-45 ${
          theme === 'dark' ? 'text-white' : 'text-gray-400'
        }`} />
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md px-6 animate-fade-in">
        <Card className={`backdrop-blur-xl border-0 shadow-2xl transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-black/20 border-white/10' 
            : 'bg-white/80 border-gray-200/50'
        }`}>
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <AnimatedLogo />
            </div>
            <CardTitle className="text-2xl font-serif text-foreground mb-2">
              Admin Portal Login
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Access your administrative dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Admin Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@legalassociates.com"
                    className="pl-10 h-12 bg-background/50 border-border/50 focus:border-accent transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-12 bg-background/50 border-border/50 focus:border-accent transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Honeypot — hidden trap for form-filling bots. Server
                  rejects submissions where this is non-empty. */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  top: 'auto',
                  width: 1,
                  height: 1,
                  overflow: 'hidden',
                }}
              >
                <Label htmlFor="la_admin_company_url">Company URL (leave empty)</Label>
                <Input
                  id="la_admin_company_url"
                  name="la_admin_company_url"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 disabled:opacity-60"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  'Login to Admin Portal'
                )}
              </Button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <Link 
                  to="#" 
                  className="text-sm text-muted-foreground hover:text-accent transition-colors underline-offset-4 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>© 2024 Legal Associates. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
