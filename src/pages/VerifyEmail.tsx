import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, CheckCircle, RefreshCw, ArrowRight, AlertTriangle, Inbox } from 'lucide-react';

const VerifyEmail = () => {
  const { user, isEmailVerified, resendVerificationEmail, checkEmailVerification, signOut } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verified, setVerified] = useState(false);

  // Check verification status periodically
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (isEmailVerified) {
      setVerified(true);
      return;
    }

    // Check every 3 seconds
    const interval = setInterval(async () => {
      const isVerified = await checkEmailVerification();
      if (isVerified) {
        setVerified(true);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [user, isEmailVerified, checkEmailVerification, navigate]);

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    setIsResending(true);
    const { error } = await resendVerificationEmail();
    setIsResending(false);
    
    if (error) {
      alert('Failed to resend verification email. Please try again later.');
    } else {
      alert('Verification email sent! Please check your inbox.');
      setResendCooldown(60); // 60 second cooldown
    }
  };

  const handleCheckVerification = async () => {
    setIsChecking(true);
    const isVerified = await checkEmailVerification();
    setIsChecking(false);
    
    if (isVerified) {
      setVerified(true);
    } else {
      alert('Email not verified yet. Please check your inbox and click the verification link.');
    }
  };

  const handleContinue = () => {
    navigate('/user-dashboard');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation mobileTitle="Verify email" mobileShowBack hideMobileSearchIcon />
      
      <main className="pt-20 md:pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="text-center">
              {verified ? (
                <>
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl font-serif text-primary">
                    Email Verified!
                  </CardTitle>
                  <CardDescription>
                    Your email has been successfully verified. You can now access all features.
                  </CardDescription>
                </>
              ) : (
                <>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Mail className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-serif text-primary">
                    Verify Your Email
                  </CardTitle>
                  <CardDescription>
                    We've sent a verification link to your email address
                  </CardDescription>
                </>
              )}
            </CardHeader>
            
            <CardContent className="space-y-6">
              {verified ? (
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground">
                    Click below to continue to your dashboard.
                  </p>
                  <Button 
                    onClick={handleContinue}
                    className="w-full bg-gradient-to-r from-primary to-primary/80"
                  >
                    Continue to Dashboard
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Verification email sent to:
                    </p>
                    <p className="font-medium text-primary">
                      {user.email}
                    </p>
                  </div>

                  {/* IMPORTANT: Spam Folder Warning */}
                  <div className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-400 dark:border-amber-600 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-800 dark:text-amber-300 mb-1">
                          Can't find the email?
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-400">
                          <strong>Please check your SPAM or JUNK folder!</strong> Verification emails often end up there. 
                          Look for an email from <span className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1 rounded">noreply@legalassociate-8d096.firebaseapp.com</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Steps to find email */}
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Inbox className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <p className="font-medium text-blue-800 dark:text-blue-300">Where to look:</p>
                    </div>
                    <ol className="text-sm text-blue-700 dark:text-blue-400 space-y-2 list-decimal list-inside">
                      <li>Check your <strong>Inbox</strong> first</li>
                      <li>Check <strong>Spam</strong> or <strong>Junk</strong> folder</li>
                      <li>Check <strong>Promotions</strong> tab (Gmail users)</li>
                      <li>Check <strong>All Mail</strong> folder</li>
                      <li>Wait 1-2 minutes and refresh your email</li>
                    </ol>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-col gap-3">
                      <Button 
                        onClick={handleCheckVerification}
                        disabled={isChecking}
                        className="w-full"
                      >
                        {isChecking ? (
                          <>
                            <RefreshCw className="mr-2 w-4 h-4 animate-spin" />
                            Checking...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 w-4 h-4" />
                            I've Verified My Email
                          </>
                        )}
                      </Button>

                      <Button 
                        variant="outline"
                        onClick={handleResendEmail}
                        disabled={isResending || resendCooldown > 0}
                        className="w-full"
                      >
                        {isResending ? (
                          'Sending...'
                        ) : resendCooldown > 0 ? (
                          `Resend in ${resendCooldown}s`
                        ) : (
                          'Resend Verification Email'
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground text-center mb-3">
                      Wrong email address?
                    </p>
                    <Button 
                      variant="ghost" 
                      onClick={handleSignOut}
                      className="w-full text-muted-foreground"
                    >
                      Sign out and try again
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VerifyEmail;
