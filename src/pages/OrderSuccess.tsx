
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const storedOrderData = localStorage.getItem('orderData');
    if (!storedOrderData) {
      navigate('/');
      return;
    }

    setOrderData(JSON.parse(storedOrderData));
    setShowConfetti(true);

    // Clean up stored data after successful display
    setTimeout(() => {
      localStorage.removeItem('orderData');
      localStorage.removeItem('checkoutData');
    }, 5000);
  }, [navigate]);

  if (!orderData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted relative overflow-hidden">
      <Navigation mobileTitle="Order placed" hideMobileSearchIcon />
      
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['🎉', '🎊', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Success Animation */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-scale-in">
                <div className="text-6xl text-white animate-bounce">✓</div>
              </div>
              <div className="absolute inset-0 w-32 h-32 bg-green-500/30 rounded-full animate-ping"></div>
            </div>
            
            <h1 className="text-5xl font-serif font-bold text-primary mb-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              🎉 Order Placed Successfully!
            </h1>
            
            <p className="text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.7s' }}>
              Thank you for your purchase! Your legal books are on their way.
            </p>
          </div>

          {/* Order Details */}
          <Card className="animate-fade-in border-primary/20 mb-8" style={{ animationDelay: '0.9s' }}>
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-primary text-center">
                📋 Order Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2 text-primary">Order Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order ID:</span>
                        <span className="font-mono font-semibold">{orderData.orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount Paid:</span>
                        <span className="font-bold text-primary">₹{orderData.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method:</span>
                        <span className="capitalize">{orderData.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span>{new Date(orderData.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2 text-primary">What's Next?</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start space-x-3">
                        <span className="text-green-500">✓</span>
                        <span>Order confirmed and payment received</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-yellow-500">⏳</span>
                        <span>Your books are being prepared for shipping</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-blue-500">📦</span>
                        <span>You'll receive a tracking number via email</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-purple-500">🚚</span>
                        <span>Expected delivery: 3-5 business days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Themed Success Message */}
          <Card className="animate-fade-in border-primary/20 mb-8" style={{ animationDelay: '1.1s' }}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex justify-center space-x-4 mb-4">
                  <div className="text-4xl animate-float">📚</div>
                  <div className="text-4xl animate-float" style={{ animationDelay: '0.5s' }}>⚖️</div>
                  <div className="text-4xl animate-float" style={{ animationDelay: '1s' }}>🏛️</div>
                </div>
                <p className="text-lg text-muted-foreground mb-4">
                  "Justice delayed is justice denied, but knowledge delivered is wisdom gained."
                </p>
                <p className="text-sm text-muted-foreground">
                  Thank you for choosing Legal Associates for your legal education needs.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '1.3s' }}>
            <Link to="/">
              <Button className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                🏠 Back to Home
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="outline" className="h-12 px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                🛍️ Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
