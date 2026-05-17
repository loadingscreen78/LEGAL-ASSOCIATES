
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/hooks/useOrders';
import { sendOrderEmail } from '@/lib/sendOrderEmail';
import { ArrowLeft } from 'lucide-react';
import { MobilePayment } from '@/components/mobile/MobilePayment';

const Payment = () => {
  const { getTotalPrice } = useCart();
  const { createTransaction } = useOrders();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderAmount, setOrderAmount] = useState(0);

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: '📱',
      description: 'Pay using Google Pay, PhonePe, Paytm'
    },
    {
      id: 'card',
      name: 'Debit/Credit Card',
      icon: '💳',
      description: 'Visa, Mastercard, Rupay accepted'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: '🏦',
      description: 'All major banks supported'
    }
  ];

  const handlePayNow = async () => {
    if (!selectedPayment) return;
    
    const currentOrderId = localStorage.getItem('currentOrderId');
    if (!currentOrderId) {
      navigate('/checkout');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create transaction record
      const transactionId = `TXN${Date.now()}`;
      await createTransaction({
        order_id: currentOrderId,
        transaction_id: transactionId,
        amount: orderAmount,
        status: 'success',
        payment_method: selectedPayment,
        gateway_response: {
          transaction_id: transactionId,
          status: 'success',
          timestamp: new Date().toISOString()
        }
      });
      
      const orderData = {
        orderId: transactionId,
        amount: orderAmount,
        paymentMethod: selectedPayment,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('orderData', JSON.stringify(orderData));

      // Fire the confirmation email. Uses the DB order UUID (currentOrderId),
      // not the display TXN id, so the API can look up the real order row.
      // Awaited for a few seconds max — best-effort, never blocks navigation.
      sendOrderEmail(currentOrderId).catch(() => { /* swallowed */ });

      localStorage.removeItem('currentOrderId');
      localStorage.removeItem('orderAmount');
      
      navigate('/order-success');
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const currentOrderId = localStorage.getItem('currentOrderId');
    const storedAmount = localStorage.getItem('orderAmount');
    
    if (!currentOrderId || !storedAmount) {
      navigate('/checkout');
      return;
    }
    
    // Get order amount from localStorage (cart is cleared after checkout)
    const amount = parseFloat(storedAmount);
    setOrderAmount(amount);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navigation mobileTitle="Payment" mobileShowBack hideMobileSearchIcon />

      {/* Mobile view (< md) */}
      <MobilePayment />

      {/* Desktop / tablet (≥ md) */}
      <main className="hidden md:block pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center mb-8 animate-fade-in">
            <Link to="/checkout" className="mr-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <h1 className="text-4xl font-serif font-bold text-primary">
              💳 Payment
            </h1>
          </div>

          {/* Animated Legal Icons */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex justify-center space-x-8 mb-6">
              <div className="text-6xl animate-float">⚖️</div>
              <div className="text-6xl animate-float" style={{ animationDelay: '1s' }}>📚</div>
              <div className="text-6xl animate-float" style={{ animationDelay: '2s' }}>🏛️</div>
            </div>
            <p className="text-lg text-muted-foreground">Secure payment for your legal publications</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Amount */}
            <Card className="animate-fade-in border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-primary text-center">
                  💰 Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-primary">
                    ₹{orderAmount.toFixed(2)}
                  </div>
                  <p className="text-muted-foreground">
                    Total amount to be paid
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      🔒 Your payment is secured with 256-bit SSL encryption
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="animate-fade-in border-primary/20" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-primary">
                  💳 Choose Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method, index) => (
                    <div
                      key={method.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg animate-fade-in ${
                        selectedPayment === method.id
                          ? 'border-primary bg-primary/10 shadow-lg'
                          : 'border-border hover:border-primary/50'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => setSelectedPayment(method.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{method.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{method.name}</h3>
                          <p className="text-muted-foreground text-sm">{method.description}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedPayment === method.id
                            ? 'bg-primary border-primary'
                            : 'border-muted-foreground'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handlePayNow}
                  disabled={!selectedPayment || isProcessing}
                  className="w-full h-14 mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                      <span>Processing Payment...</span>
                    </div>
                  ) : (
                    '🚀 Pay Now'
                  )}
                </Button>

                {selectedPayment && !isProcessing && (
                  <p className="text-center text-sm text-muted-foreground mt-4 animate-fade-in">
                    You will be redirected to {paymentMethods.find(m => m.id === selectedPayment)?.name} gateway
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
};

export default Payment;
