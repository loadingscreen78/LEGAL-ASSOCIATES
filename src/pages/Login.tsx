import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Scale, Home, Shield, User, ArrowRight, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { AnimatedLogo } from '@/components/AnimatedLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LoginLoader } from '@/components/LoginLoader';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
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
  const { theme } = useTheme();

  // Redirect if already logged in
  React.useEffect(() => {
    if (!authLoading && user) {
      if (isAdmin) {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {[key: string]: string} = {};

    // Basic validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp) {
      if (!fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (loginType === 'admin' && !securityCode) {
      newErrors.securityCode = 'Security code is required for admin access';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setLoaderStage('authenticating');
      
      try {
        if (isSignUp) {
          const { error } = await signUp(email, password, {
            full_name: fullName,
          });
          
          if (error) throw error;
          
          toast({
            title: "Account created successfully!",
            description: "Please check your email to verify your account.",
          });
          
          setIsSignUp(false);
          setLoading(false);
        } else {
          const { error, isAdmin } = await signIn(email, password, loginType === 'admin' ? securityCode : undefined);
          
          if (error) throw error;
          
          // Show success stage
          setLoaderStage('success');
          
          // Wait for success animation, then redirect based on user type
          setTimeout(() => {
            setLoaderStage('redirecting');
            
            setTimeout(() => {
              // Smart redirection based on admin status
              if (loginType === 'admin' || isAdmin) {
                navigate('/admin-dashboard');
              } else {
                navigate('/user-dashboard');
              }
            }, 1500);
          }, 2000);
        }
      } catch (error: any) {
        toast({
          title: "Authentication failed",
          description: error.message || "Please check your credentials and try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    }
  };

  const toggleLoginType = (type: 'user' | 'admin') => {
    setLoginType(type);
    setErrors({});
    setSecurityCode('');
  };

  // Show loading screen during authentication
  if (loading) {
    return (
      <LoginLoader 
        stage={loaderStage} 
        userType={loginType}
        userName={email ? email.split('@')[0] : undefined}
      />
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-all duration-500 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-background via-[#0F1419] to-background' 
        : 'bg-gradient-to-br from-secondary via-background to-muted'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 animate-float ${
          theme === 'dark' ? 'bg-accent' : 'bg-primary'
        }`} />
        <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 animate-float ${
          theme === 'dark' ? 'bg-primary' : 'bg-accent'
        }`} style={{ animationDelay: '2s' }} />
        
        {/* Floating Legal Icons */}
        <Scale className="absolute top-20 right-20 w-8 h-8 text-muted-foreground/20 animate-float" style={{ animationDelay: '1s' }} />
        <Scale className="absolute bottom-32 left-16 w-6 h-6 text-muted-foreground/15 animate-float" style={{ animationDelay: '3s' }} />
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      {/* Home Link */}
      <Link 
        to="/"
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
      >
        <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-md px-6 animate-scale-in">
        <Card className={`backdrop-blur-xl border shadow-2xl transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-card/50 border-border/50' 
            : 'bg-card/80 border-border/30'
        }`}>
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-6">
              <AnimatedLogo />
            </div>

            {/* User/Admin Toggle */}
            <div className="flex items-center justify-center gap-1 p-1 bg-muted rounded-lg mb-6">
              <Button
                variant={loginType === 'user' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => toggleLoginType('user')}
                className={`flex items-center gap-2 transition-all duration-300 ${
                  loginType === 'user' 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <User className="w-4 h-4" />
                User
              </Button>
              <Button
                variant={loginType === 'admin' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => toggleLoginType('admin')}
                className={`flex items-center gap-2 transition-all duration-300 ${
                  loginType === 'admin' 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Button>
            </div>

            <CardTitle className="text-2xl font-serif text-foreground mb-2 transition-all duration-300">
              {loginType === 'admin' 
                ? 'Admin Portal Access' 
                : isSignUp 
                  ? 'Create Account' 
                  : 'Welcome Back'
              }
            </CardTitle>
            <CardDescription className="text-muted-foreground transition-all duration-300">
              {loginType === 'admin' 
                ? 'Secure access to administrative dashboard' 
                : isSignUp
                  ? 'Create your legal education account'
                  : 'Sign in to your legal education account'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name Field (Sign Up Only) */}
              {isSignUp && loginType === 'user' && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`transition-all duration-300 ${
                      errors.fullName ? 'border-destructive ring-destructive' : 'focus:ring-accent'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-destructive animate-fade-in">{errors.fullName}</p>
                  )}
                </div>
              )}

              {/* Email/Username Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  {loginType === 'admin' ? 'Admin ID' : 'Email Address'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={loginType === 'admin' ? 'Enter your admin ID' : 'Enter your email address'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`transition-all duration-300 ${
                    errors.email ? 'border-destructive ring-destructive' : 'focus:ring-accent'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-destructive animate-fade-in">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pr-10 transition-all duration-300 ${
                      errors.password ? 'border-destructive ring-destructive' : 'focus:ring-accent'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive animate-fade-in">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field (Sign Up Only) */}
              {isSignUp && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`transition-all duration-300 ${
                      errors.confirmPassword ? 'border-destructive ring-destructive' : 'focus:ring-accent'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive animate-fade-in">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Security Code Field (Admin Only) */}
              {loginType === 'admin' && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="securityCode" className="text-sm font-medium text-foreground">
                    Security Code
                  </Label>
                  <Input
                    id="securityCode"
                    type="text"
                    placeholder="Enter your security code"
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value)}
                    className={`transition-all duration-300 ${
                      errors.securityCode ? 'border-destructive ring-destructive' : 'focus:ring-accent'
                    }`}
                  />
                  {errors.securityCode && (
                    <p className="text-xs text-destructive animate-fade-in">{errors.securityCode}</p>
                  )}
                </div>
              )}

              {/* Remember Me & Forgot Password */}
              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      className="border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                    />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <Link 
                    to="#" 
                    className="text-sm text-accent hover:text-accent/80 transition-colors underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-white font-semibold text-base transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin w-5 h-5 border-3 border-white border-t-transparent rounded-full"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {loginType === 'admin' ? (
                      <>
                        <Shield className="w-5 h-5" />
                        <span>Access Admin Portal</span>
                      </>
                    ) : isSignUp ? (
                      <>
                        <User className="w-5 h-5" />
                        <span>Create Account</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        <span>Sign In</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </span>
                )}
              </Button>

              {/* Additional Links */}
              <div className="text-center space-y-2">
                {loginType === 'user' && (
                  <p className="text-sm text-muted-foreground">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-accent hover:text-accent/80 transition-colors underline-offset-4 hover:underline"
                    >
                      {isSignUp ? 'Sign in here' : 'Sign up here'}
                    </button>
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-muted-foreground">
          <p>© 2024 Legal Associates. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;